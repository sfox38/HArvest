#!/usr/bin/env python3
"""Convert a Home Assistant Lovelace dashboard into an HTML page with HArvest widgets.

No external dependencies - standard library only.
Usage: python lovelace_convert.py [--dry-run]
"""
from __future__ import annotations

import argparse
import base64
import getpass
import hashlib
import json
import os
import re
import socket
import ssl
import struct
import sys
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from collections import Counter


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

TIER3_DOMAINS = {
    "alarm_control_panel", "lock", "person", "device_tracker",
    "camera", "script", "automation", "scene", "update", "button",
}

READ_ONLY_DOMAINS = {"sensor", "binary_sensor", "weather"}

MAX_ENTITIES_PER_TOKEN = 50

SINGLE_ENTITY_CARD_TYPES = {
    "light", "thermostat", "weather-forecast", "media-control",
    "sensor", "gauge", "tile", "humidifier", "fan", "area",
}

MULTI_ENTITY_CARD_TYPES = {"entities", "glance"}

STACK_CARD_TYPES = {"horizontal-stack", "vertical-stack", "grid"}


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------

@dataclass
class ExtractedEntity:
    entity_id: str
    domain: str
    source_card_type: str
    display_hints: dict = field(default_factory=dict)


@dataclass
class ExtractedCard:
    card_type: str
    entities: list[ExtractedEntity] = field(default_factory=list)
    children: list["ExtractedCard"] = field(default_factory=list)
    is_supported: bool = True
    raw_config: dict = field(default_factory=dict)
    grid_columns: int = 0


@dataclass
class SectionData:
    title: str
    cards: list[ExtractedCard] = field(default_factory=list)


@dataclass
class ViewData:
    title: str
    path: str
    sections: list[SectionData] = field(default_factory=list)
    badges: list[ExtractedCard] = field(default_factory=list)

    @property
    def all_entities(self) -> list[ExtractedEntity]:
        entities = []
        for badge in self.badges:
            entities.extend(badge.entities)
        for section in self.sections:
            self._collect_entities(section.cards, entities)
        return entities

    def _collect_entities(self, cards: list[ExtractedCard], out: list[ExtractedEntity]) -> None:
        for card in cards:
            out.extend(card.entities)
            self._collect_entities(card.children, out)


@dataclass
class TokenSpec:
    label: str
    entities: list[dict]


# ---------------------------------------------------------------------------
# CLI prompt helpers
# ---------------------------------------------------------------------------

def prompt(msg: str, default: str | None = None, hidden: bool = False) -> str:
    suffix = f" [{default}]" if default else ""
    full_msg = f"  {msg}{suffix}: "
    while True:
        if hidden:
            value = getpass.getpass(full_msg)
        else:
            value = input(full_msg)
        value = value.strip()
        if value:
            return value
        if default is not None:
            return default


def prompt_choice(msg: str, options: list[str], default: int = 1) -> int:
    print(f"\n  {msg}")
    for i, opt in enumerate(options, 1):
        marker = " (default)" if i == default else ""
        print(f"    {i}. {opt}{marker}")
    while True:
        raw = input(f"  Choice [{default}]: ").strip()
        if not raw:
            return default
        try:
            choice = int(raw)
            if 1 <= choice <= len(options):
                return choice
        except ValueError:
            pass
        print(f"    Please enter a number between 1 and {len(options)}")


def confirm(msg: str, default: bool = True) -> bool:
    hint = "Y/n" if default else "y/N"
    raw = input(f"  {msg} [{hint}]: ").strip().lower()
    if not raw:
        return default
    return raw in ("y", "yes")


# ---------------------------------------------------------------------------
# HA API
# ---------------------------------------------------------------------------

def _request(method: str, endpoint: str, llat: str,
             body: dict | None = None, timeout: int = 10) -> tuple[int, bytes]:
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(
        endpoint,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {llat}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def validate_connection(url: str, llat: str) -> tuple[bool, str]:
    try:
        status, _ = _request("GET", f"{url}/api/", llat)
    except urllib.error.URLError as e:
        reason = str(e.reason)
        if "refused" in reason.lower():
            return False, "Connection refused. Check the URL and ensure HA is running."
        return False, f"Connection failed: {reason}"
    except OSError as e:
        if "timed out" in str(e).lower():
            return False, "Connection timed out."
        return False, str(e)

    if status == 401:
        return False, "Invalid access token (401 Unauthorized)."
    if status == 403:
        return False, "Access forbidden (403). Token may lack admin privileges."
    if status != 200:
        return False, f"Unexpected status {status}."
    return True, "OK"


def check_harvest(url: str, llat: str) -> tuple[bool, list[str]]:
    try:
        status, body = _request("GET", f"{url}/api/harvest/entities", llat)
    except Exception:
        return False, []
    if status != 200:
        return False, []
    entities = json.loads(body)
    return True, [e["entity_id"] for e in entities]


# ---------------------------------------------------------------------------
# Minimal WebSocket client (stdlib only) for HA WebSocket API
# ---------------------------------------------------------------------------

class HAWebSocket:
    """Minimal HA WebSocket client for fetching dashboard configs."""

    def __init__(self, ha_url: str, llat: str, timeout: int = 15):
        parsed = urllib.parse.urlparse(ha_url)
        use_ssl = parsed.scheme == "https"
        host = parsed.hostname or "localhost"
        port = parsed.port or (443 if use_ssl else 8123)

        raw_sock = socket.create_connection((host, port), timeout=timeout)
        if use_ssl:
            ctx = ssl.create_default_context()
            self._sock = ctx.wrap_socket(raw_sock, server_hostname=host)
        else:
            self._sock = raw_sock

        self._buf = b""
        self._msg_id = 0

        ws_key = base64.b64encode(os.urandom(16)).decode()
        request_lines = [
            f"GET /api/websocket HTTP/1.1",
            f"Host: {host}:{port}",
            "Upgrade: websocket",
            "Connection: Upgrade",
            f"Sec-WebSocket-Key: {ws_key}",
            "Sec-WebSocket-Version: 13",
            "",
            "",
        ]
        self._sock.sendall("\r\n".join(request_lines).encode())

        response = b""
        while b"\r\n\r\n" not in response:
            chunk = self._sock.recv(4096)
            if not chunk:
                raise ConnectionError("Connection closed during handshake")
            response += chunk

        if b"101" not in response.split(b"\r\n")[0]:
            raise ConnectionError(f"WebSocket upgrade failed: {response[:200].decode(errors='replace')}")

        header_end = response.index(b"\r\n\r\n") + 4
        self._buf = response[header_end:]

        msg = self._recv_json()
        if msg.get("type") != "auth_required":
            raise ConnectionError(f"Expected auth_required, got: {msg.get('type')}")

        self._send_json({"type": "auth", "access_token": llat})
        msg = self._recv_json()
        if msg.get("type") != "auth_ok":
            raise ConnectionError(f"Auth failed: {msg.get('message', 'unknown error')}")

    def _read(self, n: int) -> bytes:
        while len(self._buf) < n:
            chunk = self._sock.recv(8192)
            if not chunk:
                raise ConnectionError("WebSocket connection closed")
            self._buf += chunk
        result = self._buf[:n]
        self._buf = self._buf[n:]
        return result

    def _send_frame(self, payload: bytes, opcode: int = 0x1) -> None:
        header = bytearray([0x80 | opcode])
        length = len(payload)
        if length < 126:
            header.append(0x80 | length)
        elif length < 65536:
            header.append(0x80 | 126)
            header.extend(struct.pack(">H", length))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack(">Q", length))
        mask = os.urandom(4)
        header.extend(mask)
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        self._sock.sendall(bytes(header) + masked)

    def _recv_frame(self) -> tuple[int, bytes]:
        hdr = self._read(2)
        opcode = hdr[0] & 0x0F
        masked = (hdr[1] & 0x80) != 0
        length = hdr[1] & 0x7F
        if length == 126:
            length = struct.unpack(">H", self._read(2))[0]
        elif length == 127:
            length = struct.unpack(">Q", self._read(8))[0]
        if masked:
            mask_key = self._read(4)
            raw = self._read(length)
            payload = bytes(b ^ mask_key[i % 4] for i, b in enumerate(raw))
        else:
            payload = self._read(length)
        return opcode, payload

    def _recv_message(self) -> bytes:
        while True:
            opcode, payload = self._recv_frame()
            if opcode == 0x8:
                raise ConnectionError("WebSocket closed by server")
            if opcode == 0x9:
                self._send_frame(payload, opcode=0xA)
                continue
            if opcode == 0xA:
                continue
            return payload

    def _send_json(self, data: dict) -> None:
        self._send_frame(json.dumps(data).encode())

    def _recv_json(self) -> dict:
        return json.loads(self._recv_message())

    def call(self, msg_type: str, **kwargs) -> dict:
        self._msg_id += 1
        msg = {"id": self._msg_id, "type": msg_type, **kwargs}
        self._send_json(msg)
        while True:
            resp = self._recv_json()
            if resp.get("id") == self._msg_id:
                return resp

    def close(self) -> None:
        try:
            self._send_frame(b"", opcode=0x8)
            self._sock.close()
        except Exception:
            pass


def fetch_dashboards_ws(ws: HAWebSocket) -> list[dict]:
    resp = ws.call("lovelace/dashboards/list")
    if resp.get("success"):
        return resp.get("result", [])
    return []


def fetch_dashboard_config_ws(ws: HAWebSocket, url_path: str | None) -> tuple[dict | None, str]:
    kwargs: dict = {}
    if url_path:
        kwargs["url_path"] = url_path
    resp = ws.call("lovelace/config", **kwargs)
    if resp.get("success"):
        return resp.get("result", {}), ""
    error = resp.get("error", {})
    return None, error.get("message", "Unknown error")


def fetch_themes(url: str, llat: str) -> list[dict]:
    try:
        status, body = _request("GET", f"{url}/api/harvest/themes", llat)
        if status == 200:
            return json.loads(body)
    except Exception:
        pass
    return []


def fetch_packs(url: str, llat: str) -> list[dict]:
    try:
        status, body = _request("GET", f"{url}/api/harvest/packs", llat)
        if status == 200:
            data = json.loads(body)
            if data.get("agreed"):
                return data.get("packs", [])
    except Exception:
        pass
    return []


TOKEN_LABEL_PREFIX = "Converted: "


def cleanup_converted_tokens(url: str, llat: str) -> int:
    """Find and delete all tokens with the converted prefix. Returns count deleted."""
    try:
        status, body = _request("GET", f"{url}/api/harvest/tokens", llat)
    except Exception:
        return 0
    if status != 200:
        return 0

    tokens = json.loads(body)
    converted = [t for t in tokens if t.get("label", "").startswith(TOKEN_LABEL_PREFIX)]
    if not converted:
        return 0

    deleted = 0
    for t in converted:
        tid = t.get("token_id", "")
        if not tid:
            continue
        try:
            # Must revoke before deleting
            if not t.get("revoked_at"):
                _request("DELETE", f"{url}/api/harvest/tokens/{tid}?action=revoke", llat)
            s, _ = _request("DELETE", f"{url}/api/harvest/tokens/{tid}", llat)
            if s in (200, 204):
                deleted += 1
        except Exception:
            pass
    return deleted


def generate_aliases(url: str, llat: str, specs: list[TokenSpec]) -> None:
    """Request an alias from HA for each entity in every spec."""
    for spec in specs:
        for entity_dict in spec.entities:
            eid = entity_dict.get("entity_id", "")
            try:
                status, body = _request(
                    "POST", f"{url}/api/harvest/alias", llat,
                    body={"entity_id": eid},
                )
                if status == 200:
                    alias = json.loads(body).get("alias", "")
                    if alias:
                        entity_dict["alias"] = alias
            except Exception:
                pass


def create_token(url: str, llat: str, spec: TokenSpec, theme_url: str,
                 origin: str | None, dry_run: bool) -> str | None:
    if dry_run:
        return None

    label = TOKEN_LABEL_PREFIX + spec.label

    payload: dict = {
        "label": label,
        "entities": spec.entities,
        "embed_mode": "page",
    }
    if theme_url:
        payload["theme_url"] = theme_url
    if origin:
        payload["origins"] = {"allow_any": False, "allowed": [origin]}
    else:
        payload["origins"] = {"allow_any": True}

    try:
        status, body = _request("POST", f"{url}/api/harvest/tokens", llat, body=payload, timeout=15)
    except Exception as e:
        print(f"    ERROR creating token '{label}': {e}")
        return None

    if status != 201:
        print(f"    ERROR creating token '{label}': {status} - {body[:200].decode(errors='replace')}")
        return None

    token_id = json.loads(body).get("token_id", "")

    if theme_url and token_id:
        try:
            _request("PATCH", f"{url}/api/harvest/tokens/{token_id}", llat,
                     body={"theme_url": theme_url})
        except Exception:
            pass

    return token_id


# ---------------------------------------------------------------------------
# Config parsing
# ---------------------------------------------------------------------------

def _extract_entity_id(item) -> str | None:
    if isinstance(item, str):
        if "." in item:
            return item
        return None
    if isinstance(item, dict):
        return item.get("entity")
    return None


def _extract_all_entity_ids(card: dict) -> list[str]:
    """Recursively extract all entity IDs from a card config, regardless of structure."""
    found = []
    if isinstance(card, dict):
        for key, val in card.items():
            if key == "entity" and isinstance(val, str) and "." in val:
                found.append(val)
            elif key == "entities" and isinstance(val, list):
                for item in val:
                    eid = _extract_entity_id(item)
                    if eid:
                        found.append(eid)
            elif isinstance(val, (dict, list)):
                if isinstance(val, dict):
                    found.extend(_extract_all_entity_ids(val))
                elif isinstance(val, list):
                    for item in val:
                        if isinstance(item, dict):
                            found.extend(_extract_all_entity_ids(item))
    return found


def _summarize_unsupported(card: dict) -> str:
    """Extract useful info from an unsupported card for the placeholder."""
    hints = []
    eid = card.get("entity")
    if eid:
        hints.append(f"entity: {eid}")
    action = card.get("tap_action", {})
    if isinstance(action, dict):
        service = action.get("action") or action.get("service")
        if service:
            hints.append(f"action: {service}")
        target = action.get("target", {})
        if isinstance(target, dict) and target.get("entity_id"):
            hints.append(f"target: {target['entity_id']}")
    name = card.get("name")
    if name and not eid:
        hints.append(f"name: {name}")
    # Check for entities found via deep scan
    if not eid:
        deep = _extract_all_entity_ids(card)
        if deep:
            hints.append(f"entities: {', '.join(deep[:4])}")
            if len(deep) > 4:
                hints.append(f"...and {len(deep) - 4} more")
    return "; ".join(hints)


TEXT_ONLY_CARD_TYPES = {
    "custom:mushroom-title-card",
    "custom:bubble-separator",
    "markdown",
}


def extract_card(card: dict) -> ExtractedCard:
    card_type = card.get("type", "")

    # Heading cards: extract entities as inline badges, preserve heading text
    if card_type == "heading":
        entities = []
        # Build per-entity config lookup
        ent_configs = {}
        for item in card.get("entities", []):
            if isinstance(item, dict) and item.get("entity"):
                ent_configs[item["entity"]] = item
        for eid in _extract_all_entity_ids(card):
            domain = eid.split(".")[0]
            ecfg = ent_configs.get(eid, {})
            hints = _badge_display_hints(ecfg, is_heading=True)
            entities.append(ExtractedEntity(
                entity_id=eid, domain=domain,
                source_card_type="badge", display_hints=hints,
            ))
        return ExtractedCard(
            card_type="heading",
            entities=entities,
            is_supported=True,
            raw_config=card,
        )

    # Text-only cards: preserve as text placeholders
    if card_type in TEXT_ONLY_CARD_TYPES:
        return ExtractedCard(
            card_type=card_type,
            is_supported=False,
            raw_config=card,
        )

    if card_type.startswith("custom:"):
        entities = []
        for eid in _extract_all_entity_ids(card):
            domain = eid.split(".")[0]
            entities.append(ExtractedEntity(entity_id=eid, domain=domain, source_card_type=card_type))
        return ExtractedCard(
            card_type=card_type,
            entities=entities,
            is_supported=bool(entities),
            raw_config=card,
        )

    if card_type in STACK_CARD_TYPES:
        children = [extract_card(c) for c in card.get("cards", [])]
        columns = card.get("columns", 3) if card_type == "grid" else 0
        return ExtractedCard(
            card_type=card_type,
            children=children,
            grid_columns=columns,
        )

    if card_type == "conditional":
        inner = card.get("card")
        if inner:
            return extract_card(inner)
        return ExtractedCard(card_type=card_type, is_supported=False, raw_config=card)

    if card_type in MULTI_ENTITY_CARD_TYPES:
        entities = []
        for item in card.get("entities", []):
            eid = _extract_entity_id(item)
            if eid:
                domain = eid.split(".")[0]
                entities.append(ExtractedEntity(entity_id=eid, domain=domain, source_card_type=card_type))
        return ExtractedCard(card_type=card_type, entities=entities)

    if card_type in SINGLE_ENTITY_CARD_TYPES or "entity" in card:
        eid = card.get("entity")
        if eid and "." in eid:
            domain = eid.split(".")[0]
            return ExtractedCard(
                card_type=card_type,
                entities=[ExtractedEntity(entity_id=eid, domain=domain, source_card_type=card_type)],
            )

    return ExtractedCard(card_type=card_type, is_supported=False, raw_config=card)


def _badge_display_hints(config: dict, is_heading: bool = False) -> dict:
    """Build display_hints for a badge entity from HA config."""
    hints = {}
    if is_heading:
        hints["badge_show_name"] = False
        if config.get("show_state") is False:
            hints["badge_show_state"] = False
        if config.get("show_icon") is False:
            hints["badge_show_icon"] = False
    else:
        if config.get("show_name") is False:
            hints["badge_show_name"] = False
        if config.get("show_name") is True:
            hints["badge_show_name"] = True
        if config.get("show_state") is False:
            hints["badge_show_state"] = False
        if config.get("show_icon") is False:
            hints["badge_show_icon"] = False
    color = config.get("color")
    if color:
        hints["badge_icon_color"] = color
    return hints


def _extract_badges(badge_list: list) -> list[ExtractedCard]:
    """Extract badges from a list. Preserves show_name/show_state/show_icon as display_hints."""
    badges = []
    for badge in badge_list:
        if isinstance(badge, str) and "." in badge:
            domain = badge.split(".")[0]
            badges.append(ExtractedCard(
                card_type="badge",
                entities=[ExtractedEntity(entity_id=badge, domain=domain, source_card_type="badge")],
                raw_config={},
            ))
        elif isinstance(badge, dict):
            eid = badge.get("entity")
            if eid and "." in eid:
                domain = eid.split(".")[0]
                hints = _badge_display_hints(badge)
                badges.append(ExtractedCard(
                    card_type="badge",
                    entities=[ExtractedEntity(
                        entity_id=eid, domain=domain,
                        source_card_type="badge", display_hints=hints,
                    )],
                    raw_config=badge,
                ))
    return badges


def extract_view(view: dict) -> ViewData:
    title = view.get("title", view.get("path", "Untitled"))
    path = view.get("path", "")
    sections = []
    all_badges: list[ExtractedCard] = []

    # Extract view-level badges
    all_badges.extend(_extract_badges(view.get("badges", [])))

    # HA 2024+ sections layout
    raw_sections = view.get("sections", [])
    if raw_sections:
        for sec in raw_sections:
            sec_title = sec.get("title", "")
            cards = [extract_card(c) for c in sec.get("cards", [])]
            all_badges.extend(_extract_badges(sec.get("badges", [])))
            sections.append(SectionData(title=sec_title, cards=cards))
    else:
        # Traditional layout: all cards in one section
        cards = [extract_card(c) for c in view.get("cards", [])]
        if cards:
            sections.append(SectionData(title="", cards=cards))

    return ViewData(title=title, path=path, sections=sections, badges=all_badges)


# ---------------------------------------------------------------------------
# Token building
# ---------------------------------------------------------------------------

def _capability_for(entity: ExtractedEntity, mode: str) -> str:
    if entity.source_card_type == "badge":
        return "badge"
    if mode == "smart":
        if entity.domain in READ_ONLY_DOMAINS:
            return "read"
        return "read-write"
    return mode


def build_token_specs(views: list[ViewData], cap_mode: str) -> list[TokenSpec]:
    specs = []
    for view in views:
        all_ents = view.all_entities
        seen: dict[str, ExtractedEntity] = {}
        for e in all_ents:
            if e.domain in TIER3_DOMAINS:
                continue
            if e.entity_id not in seen:
                seen[e.entity_id] = e
            elif seen[e.entity_id].source_card_type == "badge" and e.source_card_type != "badge":
                seen[e.entity_id] = e

        unique_entities = list(seen.values())
        if not unique_entities:
            continue

        entity_dicts = []
        for e in unique_entities:
            d = {"entity_id": e.entity_id, "capabilities": _capability_for(e, cap_mode)}
            if e.display_hints:
                d["display_hints"] = e.display_hints
            entity_dicts.append(d)

        if len(entity_dicts) <= MAX_ENTITIES_PER_TOKEN:
            specs.append(TokenSpec(label=view.title, entities=entity_dicts))
        else:
            chunks = [entity_dicts[i:i+MAX_ENTITIES_PER_TOKEN]
                      for i in range(0, len(entity_dicts), MAX_ENTITIES_PER_TOKEN)]
            for idx, chunk in enumerate(chunks, 1):
                specs.append(TokenSpec(
                    label=f"{view.title} ({idx}/{len(chunks)})",
                    entities=chunk,
                ))
    return specs


# ---------------------------------------------------------------------------
# HTML generation
# ---------------------------------------------------------------------------

def _indent(level: int) -> str:
    return "  " * level




def render_card_html(card: ExtractedCard, indent_level: int) -> str:
    ind = _indent(indent_level)
    lines = []

    if not card.is_supported:
        # Text-only cards: show title/subtitle as styled text
        if card.card_type in TEXT_ONLY_CARD_TYPES:
            title = card.raw_config.get("title") or card.raw_config.get("heading") or ""
            subtitle = card.raw_config.get("subtitle") or card.raw_config.get("content") or ""
            text = title or subtitle
            if text:
                lines.append(f'{ind}<div class="hrv-text-card">{text}</div>')
                return "\n".join(lines)
        summary = _summarize_unsupported(card.raw_config) if card.raw_config else ""
        detail = f"\n{ind}  <br>{summary}" if summary else ""
        lines.append(f'{ind}<!-- Unsupported: {card.card_type} -->')
        lines.append(f'{ind}<div class="hrv-placeholder">')
        lines.append(f'{ind}  Unsupported card: {card.card_type}{detail}')
        lines.append(f'{ind}</div>')
        return "\n".join(lines)

    if card.card_type == "horizontal-stack":
        lines.append(f'{ind}<div class="hrv-row">')
        for child in card.children:
            lines.append(render_card_html(child, indent_level + 1))
        lines.append(f'{ind}</div>')
        return "\n".join(lines)

    if card.card_type == "vertical-stack":
        lines.append(f'{ind}<div class="hrv-col">')
        for child in card.children:
            lines.append(render_card_html(child, indent_level + 1))
        lines.append(f'{ind}</div>')
        return "\n".join(lines)

    if card.card_type == "grid":
        cols = card.grid_columns or 3
        lines.append(f'{ind}<div class="hrv-grid" style="grid-template-columns: repeat({cols}, 1fr)">')
        for child in card.children:
            lines.append(render_card_html(child, indent_level + 1))
        lines.append(f'{ind}</div>')
        return "\n".join(lines)

    for entity in card.entities:
        if entity.domain in TIER3_DOMAINS:
            lines.append(f'{ind}<!-- Skipped (Tier 3): {entity.entity_id} -->')
        else:
            lines.append(f'{ind}<hrv-card entity="{entity.entity_id}"></hrv-card>')

    return "\n".join(lines)


def _render_section_html(section: SectionData, indent_level: int,
                         rendered_entities: set[str] | None = None) -> str:
    """Render a single section (column) within a view.

    Groups cards under heading boundaries - a heading and all cards below it
    until the next heading form a visual group with a border.
    """
    if rendered_entities is None:
        rendered_entities = set()
    ind = _indent(indent_level)
    lines = []
    lines.append(f'{ind}<div class="hrv-section">')
    if section.title:
        lines.append(f'{ind}  <h3 class="hrv-section-title">{section.title}</h3>')

    # Split cards into groups: each group starts with a heading (or is ungrouped)
    groups: list[tuple[ExtractedCard | None, list[ExtractedCard]]] = []
    current_heading: ExtractedCard | None = None
    current_cards: list[ExtractedCard] = []

    for card in section.cards:
        if card.card_type == "heading":
            if current_heading is not None or current_cards:
                groups.append((current_heading, current_cards))
            current_heading = card
            current_cards = []
        else:
            current_cards.append(card)

    if current_heading is not None or current_cards:
        groups.append((current_heading, current_cards))

    for heading, cards in groups:
        has_heading = heading is not None
        if has_heading:
            lines.append(f'{ind}  <div class="hrv-card-group">')
            lines.append(f'{ind}    <div class="hrv-card-group-header">')
            heading_text = heading.raw_config.get("heading") or ""
            if heading_text:
                lines.append(f'{ind}      <span class="hrv-heading">{heading_text}</span>')
            # Heading entities as inline badges (no name, just state+icon)
            new_ents = [e for e in heading.entities
                        if e.entity_id not in rendered_entities and e.domain not in TIER3_DOMAINS]
            if new_ents:
                # Build per-entity config lookup from heading's entity list
                ent_configs = {}
                for item in heading.raw_config.get("entities", []):
                    if isinstance(item, dict) and item.get("entity"):
                        ent_configs[item["entity"]] = item
                lines.append(f'{ind}      <div class="hrv-heading-badges">')
                for e in new_ents:
                    rendered_entities.add(e.entity_id)
                    lines.append(f'{ind}        <hrv-card entity="{e.entity_id}"></hrv-card>')
                lines.append(f'{ind}      </div>')
            lines.append(f'{ind}    </div>')
            if cards:
                lines.append(f'{ind}    <div class="hrv-card-group-body">')
                for card in cards:
                    html = _render_card_deduped(card, indent_level + 3, rendered_entities)
                    if html:
                        lines.append(html)
                lines.append(f'{ind}    </div>')
            lines.append(f'{ind}  </div>')
        else:
            for card in cards:
                html = _render_card_deduped(card, indent_level + 1, rendered_entities)
                if html:
                    lines.append(html)

    lines.append(f'{ind}</div>')
    return "\n".join(lines)


def _render_card_deduped(card: ExtractedCard, indent_level: int,
                         rendered: set[str]) -> str:
    """Render a card, skipping entities already rendered in this view."""
    # Unsupported cards without entities: always render
    if not card.is_supported and not card.entities:
        return render_card_html(card, indent_level)

    # Headings are handled by _render_section_html grouping logic
    if card.card_type == "heading":
        return ""

    if card.children:
        ind = _indent(indent_level)
        child_lines = []
        for child in card.children:
            html = _render_card_deduped(child, indent_level + 1, rendered)
            if html:
                child_lines.append(html)
        if not child_lines:
            return ""
        tag = "hrv-row" if card.card_type == "horizontal-stack" else (
            "hrv-col" if card.card_type == "vertical-stack" else "hrv-grid")
        style = ""
        if card.card_type == "grid" and card.grid_columns:
            style = f' style="grid-template-columns: repeat({card.grid_columns}, 1fr)"'
        parts = [f'{ind}<div class="{tag}"{style}>']
        parts.extend(child_lines)
        parts.append(f'{ind}</div>')
        return "\n".join(parts)

    # Deduplicate: skip if all entities in this card are already rendered
    new_entities = [e for e in card.entities if e.entity_id not in rendered]
    if not new_entities:
        return ""

    ind = _indent(indent_level)
    out = []
    for entity in new_entities:
        if entity.domain in TIER3_DOMAINS:
            out.append(f'{ind}<!-- Skipped (Tier 3): {entity.entity_id} -->')
        else:
            rendered.add(entity.entity_id)
            out.append(f'{ind}<hrv-card entity="{entity.entity_id}"></hrv-card>')
    return "\n".join(out)


def _filter_sections_for_chunk(sections: list[SectionData], chunk_ids: set[str]) -> list[SectionData]:
    """For multi-chunk views, filter sections to only cards with entities in this chunk."""
    filtered_sections = []
    for section in sections:
        filtered_cards = _filter_cards_for_chunk(section.cards, chunk_ids)
        if filtered_cards:
            filtered_sections.append(SectionData(title=section.title, cards=filtered_cards))
    return filtered_sections


def _filter_cards_for_chunk(cards: list[ExtractedCard], chunk_ids: set[str]) -> list[ExtractedCard]:
    """For multi-chunk views, filter cards to only those with entities in this chunk."""
    filtered = []
    for card in cards:
        if not card.is_supported:
            filtered.append(card)
            continue
        if card.children:
            child_filtered = _filter_cards_for_chunk(card.children, chunk_ids)
            if child_filtered:
                new_card = ExtractedCard(
                    card_type=card.card_type,
                    children=child_filtered,
                    grid_columns=card.grid_columns,
                )
                filtered.append(new_card)
            continue
        card_ents = [e for e in card.entities if e.entity_id in chunk_ids]
        if card_ents:
            new_card = ExtractedCard(
                card_type=card.card_type,
                entities=card_ents,
                is_supported=card.is_supported,
            )
            filtered.append(new_card)
    return filtered


def render_view_html(view: ViewData, token_ids: list[str], ha_url: str,
                     indent_level: int = 2) -> str:
    """Render a single view's content (badges + sections inside hrv-group)."""
    ind = _indent(indent_level)
    lines = []

    for i, token_id in enumerate(token_ids):
        lines.append(f'{ind}<hrv-group token="{token_id}" ha-url="{ha_url}">')

        # Badges: full-width row above sections (only in first chunk)
        if i == 0 and view.badges:
            lines.append(f'{ind}  <div class="hrv-badges">')
            bind = _indent(indent_level + 2)
            for badge in view.badges:
                for entity in badge.entities:
                    if entity.domain not in TIER3_DOMAINS:
                        lines.append(f'{bind}<hrv-card entity="{entity.entity_id}"></hrv-card>')
            lines.append(f'{ind}  </div>')

        if len(token_ids) == 1:
            sections_to_render = view.sections
        else:
            all_ents = view.all_entities
            seen = set()
            unique = []
            for e in all_ents:
                if e.entity_id not in seen and e.domain not in TIER3_DOMAINS:
                    seen.add(e.entity_id)
                    unique.append(e)
            start = i * MAX_ENTITIES_PER_TOKEN
            end = start + MAX_ENTITIES_PER_TOKEN
            chunk_ids = {e.entity_id for e in unique[start:end]}
            sections_to_render = _filter_sections_for_chunk(view.sections, chunk_ids)

        rendered: set[str] = set()
        if len(sections_to_render) > 1:
            lines.append(f'{ind}  <div class="hrv-sections">')
            for section in sections_to_render:
                lines.append(_render_section_html(section, indent_level + 2, rendered))
            lines.append(f'{ind}  </div>')
        elif sections_to_render:
            section = sections_to_render[0]
            if section.title:
                lines.append(f'{ind}  <h3 class="hrv-section-title">{section.title}</h3>')
            lines.append(f'{ind}  <div class="hrv-cards">')
            for card in section.cards:
                html = _render_card_deduped(card, indent_level + 2, rendered)
                if html:
                    lines.append(html)
            lines.append(f'{ind}  </div>')

        lines.append(f'{ind}</hrv-group>')

    return "\n".join(lines)


def render_page(views: list[ViewData], token_map: dict[str, list[str]],
                ha_url: str, script_url: str, dry_run: bool) -> str:
    use_tabs = len(views) > 1
    parts = []
    parts.append(f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Dashboard - HArvest</title>
  <script src="{script_url}"></script>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
           padding: 24px; background: #f5f5f5; }}
    .hrv-tabs {{ display: flex; gap: 4px; border-bottom: 2px solid #e0e0e0;
                margin-bottom: 24px; padding: 0; }}
    .hrv-tab {{ padding: 10px 20px; border: none; background: none; cursor: pointer;
               font-size: 0.95rem; font-weight: 500; color: #666;
               border-bottom: 3px solid transparent; margin-bottom: -2px;
               transition: color 0.2s, border-color 0.2s; }}
    .hrv-tab:hover {{ color: #333; }}
    .hrv-tab.active {{ color: #1976d2; border-bottom-color: #1976d2; }}
    .hrv-tab-panel {{ display: none; }}
    .hrv-tab-panel.active {{ display: block; }}
    .hrv-sections {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px; align-items: start; }}
    .hrv-section {{ display: flex; flex-direction: column; gap: 12px; }}
    .hrv-section-title {{ font-size: 1rem; font-weight: 600; color: #555;
                         padding-bottom: 6px; border-bottom: 1px solid #e8e8e8; }}
    .hrv-badges {{ display: flex; flex-wrap: wrap; gap: 8px; justify-content: center;
                  padding-bottom: 20px; }}
    .hrv-card-group {{ border: 1px solid #e0e0e0; border-radius: 10px;
                      background: #fafafa; overflow: hidden; }}
    .hrv-card-group-header {{ display: flex; align-items: center; gap: 12px;
                             padding: 10px 14px; background: #f0f0f0;
                             border-bottom: 1px solid #e0e0e0; flex-wrap: wrap; }}
    .hrv-card-group-header .hrv-heading {{ font-size: 0.9rem; font-weight: 600;
                                          color: #333; }}
    .hrv-card-group-body {{ display: flex; flex-direction: column; gap: 10px;
                           padding: 12px; }}
    .hrv-heading-badges {{ display: flex; flex-wrap: wrap; gap: 6px;
                          align-items: center; }}
    .hrv-text-card {{ background: #f0f0f0; border-radius: 8px; padding: 12px 16px;
                     font-size: 0.875rem; color: #555; }}
    .hrv-cards {{ display: flex; flex-direction: column; gap: 12px; }}
    .hrv-row {{ display: flex; gap: 16px; flex-wrap: wrap; }}
    .hrv-col {{ display: flex; flex-direction: column; gap: 16px; }}
    .hrv-grid {{ display: grid; gap: 16px; }}
    .hrv-placeholder {{ background: #fff3cd; border: 1px dashed #ffc107;
                       border-radius: 8px; padding: 16px; color: #856404;
                       font-size: 0.875rem; }}
  </style>
</head>
<body>''')

    if dry_run:
        parts.append("  <!-- DRY RUN: Replace placeholder tokens with real token IDs -->")

    parts.append("")

    if use_tabs:
        # Tab bar
        tab_lines = ['  <nav class="hrv-tabs">']
        for i, view in enumerate(views):
            active = ' class="hrv-tab active"' if i == 0 else ' class="hrv-tab"'
            tab_lines.append(f'    <button{active} data-tab="tab-{i}">{view.title}</button>')
        tab_lines.append('  </nav>')
        parts.append("\n".join(tab_lines))
        parts.append("")

        # Tab panels
        for i, view in enumerate(views):
            token_ids = token_map.get(view.title, [])
            if not token_ids:
                continue
            active = " active" if i == 0 else ""
            parts.append(f'  <div class="hrv-tab-panel{active}" id="tab-{i}">')
            parts.append(render_view_html(view, token_ids, ha_url))
            parts.append("  </div>")
            parts.append("")
    else:
        for view in views:
            token_ids = token_map.get(view.title, [])
            if token_ids:
                parts.append(render_view_html(view, token_ids, ha_url, indent_level=1))
                parts.append("")

    if use_tabs:
        parts.append("""  <script>
    document.querySelectorAll('.hrv-tab').forEach(function(btn) {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.hrv-tab').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.hrv-tab-panel').forEach(function(p) { p.classList.remove('active'); });
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
      });
    });
  </script>""")

    parts.append("</body>")
    parts.append("</html>")
    return "\n".join(parts)


# ---------------------------------------------------------------------------
# Main flow
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(description="Convert a HA Lovelace dashboard to HArvest HTML.")
    parser.add_argument("--dry-run", action="store_true",
                        help="Preview without creating tokens")
    args = parser.parse_args()
    dry_run = args.dry_run

    print("\n=== HArvest Dashboard Converter v1.0 ===")
    if dry_run:
        print("  (dry-run mode: no tokens will be created)\n")
    else:
        print()

    # Step 1: HA Connection
    print("Step 1: Home Assistant Connection")
    while True:
        ha_url = prompt("HA URL (e.g. http://192.168.1.100:8123)")
        ha_url = ha_url.rstrip("/")
        llat = prompt("Long-lived access token", hidden=True)

        print("  Connecting...", end=" ", flush=True)
        ok, msg = validate_connection(ha_url, llat)
        if not ok:
            print(f"FAILED\n    {msg}")
            continue
        print("OK")

        print("  Checking HArvest...", end=" ", flush=True)
        harvest_ok, ha_entities = check_harvest(ha_url, llat)
        if not harvest_ok:
            print("NOT FOUND")
            print("    HArvest integration is not installed or not responding.")
            print("    Install HArvest in Home Assistant before running this tool.")
            sys.exit(1)
        print(f"OK ({len(ha_entities)} entities available)")
        break

    ha_entity_set = set(ha_entities)

    # Step 2: Dashboard Selection
    print("\nStep 2: Dashboard Selection")
    print("  Connecting to HA WebSocket...", end=" ", flush=True)
    try:
        ws = HAWebSocket(ha_url, llat)
    except Exception as e:
        print(f"FAILED\n    {e}")
        sys.exit(1)
    print("OK")

    dashboards = fetch_dashboards_ws(ws)

    while True:
        print("  Available dashboards:")
        print("    1. Default dashboard (overview)")
        for i, db in enumerate(dashboards, 2):
            title = db.get("title", db.get("url_path", "Untitled"))
            print(f"    {i}. {title}")

        while True:
            raw = input(f"  Select dashboard [1]: ").strip()
            if not raw:
                choice = 1
            else:
                try:
                    choice = int(raw)
                except ValueError:
                    continue
            if 1 <= choice <= len(dashboards) + 1:
                break

        if choice == 1:
            url_path = None
        else:
            url_path = dashboards[choice - 2].get("url_path")

        print("  Fetching dashboard config...", end=" ", flush=True)
        config, err = fetch_dashboard_config_ws(ws, url_path)
        if config:
            print("OK")
            break
        print(f"FAILED\n    {err}")
        if not confirm("  Try a different dashboard?"):
            ws.close()
            sys.exit(1)
        print()

    ws.close()

    views_raw = config.get("views", [])
    if not views_raw:
        print("    Dashboard has no views/tabs.")
        sys.exit(1)

    # Step 3: Tab Selection
    print(f"\nStep 3: Tab Selection")
    all_views = [extract_view(v) for v in views_raw]

    print("  Tabs found:")
    for i, view in enumerate(all_views, 1):
        ent_count = len(view.all_entities)
        print(f"    {i}. {view.title} ({ent_count} entities)")

    print()
    raw = input("  Select tabs to convert (comma-separated numbers, or 'all') [all]: ").strip()
    if not raw or raw.lower() == "all":
        selected_views = all_views
    else:
        indices = []
        for part in raw.split(","):
            part = part.strip()
            try:
                idx = int(part)
                if 1 <= idx <= len(all_views):
                    indices.append(idx - 1)
            except ValueError:
                pass
        if not indices:
            print("    No valid selections. Using all tabs.")
            selected_views = all_views
        else:
            selected_views = [all_views[i] for i in indices]

    # Step 4: Summary
    print(f"\nStep 4: Summary")
    total_entities = []
    total_unsupported = 0
    tier3_found = []
    missing_found = []

    for view in selected_views:
        for entity in view.all_entities:
            total_entities.append(entity)
            if entity.domain in TIER3_DOMAINS:
                tier3_found.append(entity.entity_id)
            elif entity.entity_id not in ha_entity_set:
                missing_found.append(entity.entity_id)

    def _count_unsupported(cards: list[ExtractedCard]) -> int:
        count = 0
        for card in cards:
            if not card.is_supported:
                count += 1
            count += _count_unsupported(card.children)
        return count

    for view in selected_views:
        for section in view.sections:
            total_unsupported += _count_unsupported(section.cards)

    domain_counts = Counter(e.domain for e in total_entities if e.domain not in TIER3_DOMAINS)

    print(f"  Selected: {len(selected_views)} tabs, {len(total_entities)} entities")
    print(f"  Domains: {', '.join(f'{d} ({c})' for d, c in domain_counts.most_common())}")

    if total_unsupported:
        print(f"  Unsupported cards: {total_unsupported} (will be placeholders)")
    if tier3_found:
        unique_tier3 = sorted(set(tier3_found))
        print(f"  Blocked (Tier 3): {len(unique_tier3)} entities will be excluded")
        for eid in unique_tier3[:5]:
            print(f"    - {eid}")
        if len(unique_tier3) > 5:
            print(f"    ... and {len(unique_tier3) - 5} more")
    if missing_found:
        unique_missing = sorted(set(missing_found))
        print(f"  Missing from HA: {len(unique_missing)} entities will be excluded")
        for eid in unique_missing[:5]:
            print(f"    - {eid}")
        if len(unique_missing) > 5:
            print(f"    ... and {len(unique_missing) - 5} more")

    if not confirm("\n  Continue?"):
        print("  Aborted.")
        sys.exit(0)

    # Remove missing entities from views
    missing_set = set(missing_found)
    if missing_set:
        for view in selected_views:
            for section in view.sections:
                _remove_missing_entities(section.cards, missing_set)

    # Step 5: Capabilities
    print("\nStep 5: Capabilities")
    cap_choice = prompt_choice(
        "Default capability for entities:",
        [
            "Badge - compact pill indicator (icon + state only)",
            "Read - full card, state display only",
            "Read-write - full card with interactive controls",
            "Smart defaults - read for sensors, read-write for controllable entities",
        ],
        default=4,
    )
    cap_map = {1: "badge", 2: "read", 3: "read-write", 4: "smart"}
    cap_mode = cap_map[cap_choice]

    # Step 6: Theme/Pack
    print("\nStep 6: Theme / Renderer Pack")
    themes = fetch_themes(ha_url, llat)
    packs = fetch_packs(ha_url, llat)

    theme_url = ""
    if themes:
        print("  Installed themes:")
        print("    0. None (default appearance)")
        for i, t in enumerate(themes, 1):
            name = t.get("name", t.get("theme_id", "Unknown"))
            pack_tag = " [has renderer pack]" if t.get("renderer_pack") else ""
            print(f"    {i}. {name}{pack_tag}")

        raw = input("  Select theme [0]: ").strip()
        if raw and raw != "0":
            try:
                idx = int(raw)
                if 1 <= idx <= len(themes):
                    selected_theme = themes[idx - 1]
                    tid = selected_theme.get("theme_id", "")
                    if selected_theme.get("is_bundled"):
                        theme_url = f"bundled:{tid}"
                    else:
                        theme_url = f"user:{tid}"
            except ValueError:
                pass
    else:
        print("  No themes installed. Using default appearance.")

    # Step 7: Security
    print("\nStep 7: Security")
    origin = prompt("Origin URL where this HTML will be hosted (or press Enter to skip)", default="")
    if not origin:
        origin = None

    # Step 8: Widget script URL
    print("\nStep 8: Widget Script")
    script_url = prompt("URL or path to harvest.min.js", default="harvest.min.js")

    # Step 9: Token Creation
    print("\nStep 9: Token Creation")
    token_specs = build_token_specs(selected_views, cap_mode)

    if not token_specs:
        print("  No entities to create tokens for.")
        sys.exit(1)

    # Clean up old converted tokens before creating new ones
    if not dry_run:
        try:
            status, body = _request("GET", f"{ha_url}/api/harvest/tokens", llat)
            if status == 200:
                tokens = json.loads(body)
                converted = [t for t in tokens if t.get("label", "").startswith(TOKEN_LABEL_PREFIX)]
                if converted:
                    print(f"  Found {len(converted)} existing 'Converted:' widget(s).")
                    if confirm("  Delete them before creating new ones?"):
                        deleted = cleanup_converted_tokens(ha_url, llat)
                        print(f"  Deleted {deleted} widget(s).")
                    else:
                        print("  Keeping (new ones will fail if names collide).")
        except Exception:
            pass

    if not dry_run:
        entity_count = sum(len(s.entities) for s in token_specs)
        print(f"  Generating aliases for {entity_count} entities... (be patient)", end=" ", flush=True)
        generate_aliases(ha_url, llat, token_specs)
        print("OK")

    print(f"  Creating {len(token_specs)} token(s)...")

    token_map: dict[str, list[str]] = {}
    placeholder_counter = 0

    for spec in token_specs:
        view_title = spec.label.split(" (")[0]
        if view_title not in token_map:
            token_map[view_title] = []

        if dry_run:
            placeholder_counter += 1
            token_id = f"hwt_PLACEHOLDER_{placeholder_counter}"
            print(f"    [DRY RUN] Would create: '{spec.label}' ({len(spec.entities)} entities)")
            token_map[view_title].append(token_id)
        else:
            print(f"    Creating '{spec.label}' ({len(spec.entities)} entities)...", end=" ", flush=True)
            token_id = create_token(ha_url, llat, spec, theme_url, origin, dry_run)
            if token_id:
                print(token_id)
                token_map[view_title].append(token_id)
            else:
                placeholder_counter += 1
                fallback = f"hwt_FAILED_{placeholder_counter}"
                print(f"FAILED (using placeholder)")
                token_map[view_title].append(fallback)

    # Step 10: HTML Generation
    print("\nStep 10: HTML Generation")
    output_path = prompt("Output file path", default="dashboard.html")

    if os.path.exists(output_path):
        if not confirm(f"  '{output_path}' already exists. Overwrite?", default=False):
            print("  Aborted.")
            sys.exit(0)

    html = render_page(selected_views, token_map, ha_url, script_url, dry_run)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    size_kb = len(html.encode("utf-8")) / 1024
    print(f"  Written: {output_path} ({size_kb:.1f} KB)")

    # Step 11: Summary
    print("\n=== Summary ===")
    print(f"  Tabs converted: {len(selected_views)}")
    total_embedded = sum(len(e) for e in token_map.values() for _ in [None])
    entity_count = sum(len(s.entities) for s in token_specs)
    print(f"  Entities embedded: {entity_count}")
    print(f"  Tokens created: {len(token_specs)}")
    if total_unsupported:
        print(f"  Unsupported cards (placeholders): {total_unsupported}")
    if tier3_found:
        print(f"  Excluded (Tier 3): {len(set(tier3_found))}")
    if missing_found:
        print(f"  Excluded (missing): {len(set(missing_found))}")
    print(f"  Output: {output_path}")
    if dry_run:
        print("\n  This was a dry run. No tokens were created.")
        print("  Run without --dry-run to create tokens and generate a working page.")
    print()


def _remove_missing_entities(cards: list[ExtractedCard], missing: set[str]) -> None:
    for card in cards:
        card.entities = [e for e in card.entities if e.entity_id not in missing]
        _remove_missing_entities(card.children, missing)


if __name__ == "__main__":
    main()
