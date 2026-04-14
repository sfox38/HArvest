# HArvest Security

**Status:** Draft
**Applies to:** HArvest Integration v1.6.0+

---

## Executive Summary

HArvest lets you embed live Home Assistant controls on a public webpage. Doing this means some part of your home automation system is reachable from the internet, and it is important to understand what that means before you deploy.

The short version: HArvest is designed so that a visitor to your webpage can only ever see or control the specific devices you explicitly choose to share, using a token you create and can revoke at any time. Your Home Assistant password, your full device list, and your HA account are never exposed. If something goes wrong - a token is stolen, a website is compromised, or you change your mind - you can revoke access instantly from inside HA.

**What HArvest protects:**

- Your HA long-lived access token never leaves your server. It is never in your webpage's source code.
- Visitors can only interact with the specific entities you put in a token, nothing else.
- Write access (control) is separate from read access (view). You choose which applies.
- You can restrict which websites are allowed to use a token, and revoke any token instantly.
- All activity is logged so you can see who connected and what commands were sent.

**What HArvest does not protect against:**

- Someone copying your widget token from your webpage's source code and using it from a script or command-line tool, bypassing browser origin restrictions. They can only access what the token allows, but they can access it.
- A visitor on an allowed website using browser developer tools to send commands the UI does not normally offer, within the bounds of what the token permits.
- Availability attacks - someone who knows your HA URL can attempt to flood it with connection requests, though rate limiting reduces this risk significantly.
- The security of your HA instance itself. If your HA is misconfigured, unpatched, or has weak credentials, HArvest does not make that worse but it also cannot compensate for it.

**The bottom line:** if you are comfortable with your HA being accessible from the internet at all (which is required for any remote access including the official HA app), HArvest adds a carefully scoped and revocable layer on top of that. If you are not comfortable with your HA being internet-facing under any circumstances, HArvest is not the right tool for your setup.

---

## Table of Contents

1. [Threat Model](#threat-model)
2. [Deployment and Reverse Proxy Configuration](#deployment-and-reverse-proxy-configuration)
3. [Hardening Guide](#hardening-guide)

---

## 1. Threat Model

### 1.1 Architecture Overview

HArvest sits between the public internet and HA's internal API. Understanding this boundary is essential to understanding what can and cannot go wrong.

```
Public internet
      |
      | HTTPS/WSS (public, authenticated with widget token)
      |
HArvest Integration (inside HA Core)
      |
      | Internal HA API (private, authenticated with HA long-lived token)
      |
Home Assistant Core
      |
Physical devices
```

The HArvest integration is the only component that crosses this boundary. The widget JS running in a visitor's browser communicates exclusively with the integration, never with HA Core directly. The integration validates every request before forwarding anything to HA.

### 1.2 Entity Compatibility Tiers

Not every HA entity type can be embedded in a public widget. HArvest enforces a three-tier compatibility model that is a deliberate security boundary, not just a feature limitation.

**Tier 1 - Fully supported.** Entities where embedding is considered safe and where a dedicated renderer exists: lights, switches, fans, sensors, covers, climate, media players, and others. These are the entities you can put in a token.

**Tier 2 - Generic support.** Entity domains HArvest does not have a dedicated renderer for. They can be included in a token but display with a basic generic card. The same security rules apply as Tier 1.

**Tier 3 - Permanently blocked.** Entity domains that HArvest will never allow in a token, regardless of configuration. These are blocked at token creation time and rejected at the protocol level:

| Domain | Reason blocked |
|--------|---------------|
| `alarm_control_panel` | A publicly embeddable alarm control is unacceptable regardless of any other safeguard |
| `lock` | Physical security risk; a public lock toggle is not appropriate under any circumstances |
| `person`, `device_tracker` | Exposes real-time location data of named individuals |
| `camera` | Video streaming is a different and much larger security problem |
| `script`, `automation`, `button` | Arbitrary or wide-effect actions; use `harvest_action` instead for safe, scoped alternatives |
| `scene`, `update` | Could trigger wide device effects or firmware changes from a public page |

This blocklist is hardcoded and cannot be overridden by token configuration. It exists because some entity types carry risks that no token-level permission model can adequately contain. A lock that can be toggled from a public webpage is dangerous regardless of how the token is scoped.

The `harvest_action` virtual domain provides a safe alternative for button-like interactions. Instead of exposing a `script` or `button` entity directly, you define a named action server-side that maps to specific HA service calls. The widget sees only a named trigger with no knowledge of what it does.

### 1.3 Assets and What We Protect

| Asset | Where it lives | How HArvest protects it |
|-------|---------------|------------------------|
| HA long-lived access token | HA Core only, never leaves the server | Never transmitted, never referenced in widget code |
| HA user credentials | HA Core only | HArvest has its own auth model; HA credentials play no role |
| Full entity list | HA Core only | Only explicitly listed entities are accessible per token |
| Entity state and attributes | Transmitted to permitted clients | Attribute denylist strips sensitive keys; per-entity exclusions available |
| Widget token ID | Embedded in public HTML | Treated as a public identifier, not a secret; all validation is server-side |
| Session token | Widget JS memory only | Never written to disk or localStorage; expires on session end |

### 1.4 Threat Actors

**Passive observer:** someone who views the source of your webpage. They can see the widget token ID and the HA URL. They cannot do anything with the token that the token does not already permit, and they cannot access HA beyond that scope.

**Active attacker (browser):** someone who opens your webpage and uses browser developer tools to send crafted WebSocket messages. They are constrained to the same token scope as a normal visitor. They can attempt to send commands outside the ALLOWED_SERVICES map, but those are rejected server-side before reaching HA.

**Active attacker (non-browser tool):** someone who copies the token ID and HA URL from source and uses curl, Python, or another tool to connect directly, sending an arbitrary Origin header. This is the most capable threat actor. Browser origin restrictions do not apply to non-browser clients. They are still constrained to the token's entity list and capability, but path restrictions and origin checks provide no protection against them. Rate limiting and activity logging are the primary mitigations.

**Compromised website:** your webpage is defaced or a malicious script is injected. The attacker now has the token ID and HA URL. This gives them the same capability as a non-browser tool attacker above. Revocation is the response.

**Compromised HA instance:** if HA itself is compromised, HArvest is the least of your concerns. HArvest does not widen the attack surface of a compromised HA instance.

**Denial of service:** an attacker attempts to exhaust HA's resources by flooding the WebSocket endpoint with connection requests, auth attempts, or commands. Rate limiting at the IP level, token level, and connection level provides graduated defence, but a determined attacker with many IPs cannot be fully stopped at the application layer.

### 1.5 Attack Scenarios and Mitigations

#### Scenario 1: Token ID copied from page source

**Attack:** an attacker copies `token_id` and `ha-url` from the HTML source of a page embedding a HArvest widget. They write a Python script that connects to the WebSocket endpoint with a forged `Origin` header matching the allowed origin, then sends commands.

**What they can do:**
- Read state for any entity in the token's entity list
- Send commands for any entity in the token's entity list, if the token grants write capability
- Do all of the above as often as the rate limits allow

**What they cannot do:**
- Access entities not in the token
- Elevate to read-write if the token is read-only
- Access any other HA functionality
- Remain undetected (all commands are logged with source IP)

**Mitigations applied:**
- Token scope is minimal by design - only the entities you explicitly listed
- Rate limiting constrains command throughput
- Activity logging surfaces the attack
- Revocation is instant

**Residual risk:** this attack is possible and cannot be fully prevented. The severity is bounded by the token's scope. A read-only token showing a temperature sensor is not a meaningful attack target. A read-write token controlling a lock or alarm (which HArvest's Tier 3 blocks) would be. The ALLOWED_SERVICES map ensures only specific, known-safe service calls can be made even on write-capable tokens.

**Recommendation:** keep token scope minimal. Grant write capability only when the use case requires it. Enable activity log alerts for unusual command patterns.

---

#### Scenario 2: Session token intercepted in transit

**Attack:** an attacker performs a man-in-the-middle attack on the TLS connection and intercepts the session token transmitted after auth.

**What they can do:**
- Use the session token to send commands and receive state updates for the remainder of the session lifetime

**Mitigations applied:**
- Session tokens are short-lived (default 60 minutes)
- TLS is required; HArvest does not support plain HTTP connections
- Session tokens are never stored in localStorage or any persistent client-side storage

**Residual risk:** a successful TLS MITM attack gives the attacker a time-limited session token. If the attacker can break or intercept TLS, HArvest's security model is broken along with every other system on that connection. This is not a HArvest-specific risk.

---

#### Scenario 3: Origin header forgery

**Attack:** an attacker sends a WebSocket connection with an Origin header matching the allowed list, but from a non-browser tool.

**What they can do:**
- Bypass the origin check entirely, since Origin validation depends on browser enforcement and non-browser clients can set any Origin header they choose

**Mitigations applied:**
- The specification is explicit that Origin validation is browser-only and non-browsers can bypass it
- The practical capability gained is identical to Scenario 1 above
- IP restrictions (`allowed_ips`) can prevent connections from unexpected source IPs for deployments where the expected access pattern is predictable
- HMAC signing (`token_secret`) requires the attacker to also possess the token secret, not just the token ID

**Residual risk:** this is a fundamental property of HTTP Origin headers and cannot be fully mitigated at the application layer. The design acknowledges this explicitly and ensures that bypassing origin validation provides no additional capability beyond what the token already permits.

---

#### Scenario 4: Referer header suppression bypassing path restrictions

> **Key distinction:** the `Origin` header, which is the authoritative security control, contains only the scheme, host, and port - never the URL path. Path restrictions in `allow_paths` work by checking the separate `Referer` header. These are two completely different headers with different browser behaviour. Origin validation is reliable; path validation via Referer is not.

**Attack:** a browser suppresses the Referer header (due to privacy settings, a `referrerpolicy` meta tag, or a browser extension), causing `allow_paths` checks to be skipped even for a request from an unexpected path.

**What they can do:**
- Connect from any path on an allowed origin, not just the specific page listed in `allow_paths`

**Mitigations applied:**
- The specification documents this explicitly: when Referer is absent, path restrictions are passed and a warning is logged
- This is intentional - penalising legitimate users whose browsers suppress Referer would be worse

**Residual risk:** path restrictions are advisory, not a hard security boundary. They reduce the blast radius of a compromised page on an allowed origin, but cannot fully enforce page-level access when Referer is absent. Do not treat `allow_paths` as a security control.

---

#### Scenario 5: Token secret exposed alongside token ID

**Attack:** an attacker who has obtained both the token ID and the token secret (both are visible in the HTML of a page using enhanced security mode) uses them to forge a valid HMAC signature and authenticate.

**What they can do:**
- Authenticate successfully and operate within the token's scope, same as Scenarios 1 and 3

**What they cannot do:**
- Gain any capability beyond the token's scope

**Mitigations applied:**
- HMAC timestamp validation rejects signatures older than 60 seconds, preventing simple replay attacks
- A unique nonce prevents replay within the timestamp window

**Residual risk:** enhanced security mode (HMAC) protects against an attacker who has only the token ID but not the secret. It does not protect against an attacker who has both, since both must be embedded in the page to be usable. The value of HMAC is in narrowing the window of a stolen token - an attacker with only a token ID copied from source cannot authenticate at all if HMAC is required.

---

#### Scenario 6: Flood attack

**Attack:** an attacker opens many concurrent WebSocket connections or sends many auth attempts to exhaust HA's resources.

**Mitigations applied:**
- Per-IP connection rate limiting (default 20 per minute) triggers HTTP 429 before WebSocket upgrade
- Global connection rate limiting (default 100 per minute) caps total new connections
- Per-token auth rate limiting blocks repeated failed auths against a specific token
- Failed auth does not reveal whether the token ID is valid or invalid (both return HRV_TOKEN_INVALID)

**Residual risk:** a distributed flood from many IPs can exceed IP-level rate limits. Application-layer rate limiting alone is not sufficient against a determined DDoS. For high-value deployments, infrastructure-level protection (Cloudflare, fail2ban on the reverse proxy) should be added in front of HA. HArvest's rate limiting provides meaningful protection against casual abuse and scripted attacks from a small number of IPs.

---

#### Scenario 7: Attribute data leakage

**Attack:** an entity's attributes contain sensitive data (API keys, passwords, internal URLs, auth tokens) that gets transmitted to the widget client.

**Mitigations applied:**
- Global attribute denylist strips any attribute key containing the substrings: `access_token`, `api_key`, `password`, `token`, `secret`, `credentials`, `private_key` (case-insensitive)
- Per-entity `exclude_attributes` on the token allows the owner to strip additional keys
- Extended attributes (device-specific) are separated from standard attributes in the message format

**Residual risk:** the denylist matches on substrings but cannot catch all possible sensitive attribute names. A device integration that stores a credential under an unusual key name (e.g. `auth_header`, `bearer`) would not be caught by the denylist. Token owners should review the attributes of any entity they expose and use `exclude_attributes` for anything sensitive. The attribute inspection is visible in the token detail screen in the panel UI.

---

### 1.6 What HArvest Explicitly Does Not Protect

These are known limitations, not implementation gaps. They are not planned to be addressed in future versions because doing so would require fundamentally changing the architecture.

**HA must be internet-accessible.** HArvest requires the HA instance to be reachable from the public internet. If your threat model requires HA to be on a private network only, HArvest is incompatible with that requirement. There is no tunnelling, relay, or cloud proxy component.

**Non-browser clients can bypass Origin checks.** This is a property of HTTP, not a HArvest bug. It is documented, acknowledged, and mitigated by keeping token scope minimal and enabling logging.

**Token IDs are public.** A token ID embedded in a webpage is visible to anyone who views source. This is intentional - the token ID is a public identifier, not a secret. All security enforcement is server-side.

**HArvest cannot compensate for a compromised HA instance.** If HA itself is running malicious integrations, has weak credentials, or is otherwise compromised, HArvest cannot provide meaningful protection.

---

## 2. Deployment and Reverse Proxy Configuration

HA can be exposed to the internet directly or via a reverse proxy. This section documents how to configure the most common proxy setups to work correctly with HArvest's WebSocket connections, and covers SSL/TLS requirements that apply regardless of deployment approach.

### 2.1 Why WebSocket Configuration Matters

HArvest uses a persistent WebSocket connection between the widget and the integration. WebSocket connections begin as HTTP and are then upgraded using the `Upgrade: websocket` header. Many reverse proxies handle standard HTTP transparently but require explicit configuration to forward WebSocket upgrade requests.

If the proxy does not forward the upgrade correctly, the widget will fail to connect and enter `HRV_OFFLINE` state. The browser console will show a 400 or 501 error on the WebSocket endpoint.

### 2.2 nginx

Add the following directives inside the `location` block that proxies to HA:

```nginx
location / {
    proxy_pass http://homeassistant:8123;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 3600s;
    proxy_send_timeout 3600s;
}
```

The `proxy_read_timeout` and `proxy_send_timeout` values are important. The default nginx timeout is 60 seconds. WebSocket connections are long-lived and will be terminated by nginx after 60 seconds of inactivity if this is not extended. Setting both to 3600s (1 hour) gives the session renewal mechanism time to operate without fighting the proxy timeout.

If you are using IP restrictions (`allowed_ips`) on any tokens, add your nginx server's IP to `trusted_proxies` in HArvest's integration settings so the integration reads the real client IP from `X-Forwarded-For`:

```json
"trusted_proxies": ["127.0.0.1/32", "::1/128"]
```

### 2.3 Caddy

Caddy handles WebSocket upgrades automatically with no special configuration. A standard reverse proxy block works:

```caddy
myhome.example.com {
    reverse_proxy localhost:8123
}
```

Caddy sets `X-Forwarded-For` automatically. Add `127.0.0.1/32` to `trusted_proxies` in HArvest settings when using IP restrictions.

### 2.4 Traefik

Traefik handles WebSocket upgrades automatically. A standard IngressRoute or label configuration works without modification.

If using Traefik with `X-Forwarded-For`, configure your HArvest `trusted_proxies` with the Traefik container's IP range. For Docker deployments this is typically the Docker bridge network range (e.g. `172.16.0.0/12`).

### 2.5 Cloudflare Tunnel

Cloudflare Tunnel (formerly Argo Tunnel) routes traffic through Cloudflare's edge to your HA instance without requiring an open inbound port. HArvest works correctly behind Cloudflare Tunnel.

Cloudflare proxies WebSocket connections by default. No special configuration is required on the Cloudflare side.

The real client IP is available in the `CF-Connecting-IP` header rather than `X-Forwarded-For`. The HArvest integration reads `X-Forwarded-For` in the current implementation. For Cloudflare deployments, configure your Cloudflare tunnel's `ingress` to set `X-Forwarded-For` from `CF-Connecting-IP`, or use a Cloudflare Worker to rewrite the header. Add the Cloudflare IP range to `trusted_proxies`.

Cloudflare imposes a default WebSocket connection timeout of 100 seconds of inactivity. HArvest's server-side keepalive (default 30-second ping interval) prevents this timeout from triggering under normal conditions.

### 2.6 Managed WordPress Hosting

Some managed WordPress hosts (WP Engine, Kinsta, Pressable) route traffic through their own reverse proxies and may buffer or terminate long-lived connections. HArvest's reconnection logic handles most of these cases transparently.

If widgets frequently show a stale state after roughly 60 seconds, the host's proxy timeout is likely the cause. Options:

- Contact the host to request an increased WebSocket timeout for your domain
- Reduce HArvest's keepalive interval (Settings > Connection > Keepalive interval) to below the host's timeout threshold

### 2.7 SSL/TLS Requirements

HArvest requires HTTPS for WebSocket connections (WSS). Plain HTTP is not supported. This is enforced by the integration, which only accepts connections on the WSS path.

For HA instances not yet running HTTPS, Let's Encrypt via the HA Add-on Store (the NGINX Home Assistant SSL proxy add-on, or Caddy add-on) is the recommended path. Self-signed certificates are supported but will produce browser warnings and require the user to trust the certificate manually.

### 2.8 Content Security Policy for Embedded Pages

Pages embedding HArvest widgets must permit WebSocket connections to the HA host in their Content Security Policy. The required directive is:

```
Content-Security-Policy: connect-src 'self' wss://myhome.example.com
```

For pages serving over HTTPS, only `wss://` connections are permitted by browsers. The `ws://` (unencrypted) variant will be blocked regardless of CSP.

WordPress users: the HArvest WordPress plugin adds this directive automatically via the `wp_headers` filter. See `docs/wordpress.md` for details.

---

## 3. Hardening Guide

This section documents specific configuration choices that reduce the attack surface beyond the defaults. Each measure is optional. The right combination depends on your use case and risk tolerance.

### 3.1 Token Scope Minimisation

The single most effective hardening measure is keeping token scope as small as possible.

**Entities:** only include entities that the specific widget actually needs. A bedroom light widget does not need access to your front door sensor. Create separate tokens for separate widgets rather than one large token for everything.

**Capabilities:** grant `"read-write"` only when the widget needs to send commands. A dashboard showing sensor readings should use `"read"` only. Read-only tokens cannot cause state changes regardless of what the client sends.

**Expiry:** set an expiry date on tokens used for temporary or time-limited purposes (a holiday rental page, a conference demo, a one-time event). Tokens without expiry remain valid indefinitely.

### 3.2 Origin Restrictions

Configure `allowed_ips` to the narrowest sensible set of origins. Avoid `allow_any: true` unless you have a specific reason. Remember that origin restrictions are browser-enforced only and provide no protection against non-browser clients.

If your widget will only ever appear on a single specific page, set `allow_paths` to that path as an additional advisory control. Note that path restrictions are skipped when the Referer header is absent (see Section 1.4, Scenario 4).

Path entries in `allow_paths` must be path-only - no query string or fragment. Before matching, the integration strips the query string and fragment from the Referer header automatically, so a page at `/smarthome/` with any query string (UTM parameters, session identifiers, etc.) will match the entry `/smarthome/` correctly. Matching is exact in v1 - a future version may add prefix and wildcard support.

### 3.3 IP Restrictions

`allowed_ips` restricts connections by source IP. This is most useful when the expected access pattern is predictable - for example, an internal dashboard on a corporate network with a known IP range, or a personal blog accessed from a small number of locations.

IP restrictions are less useful for public-facing widgets with geographically distributed visitors, since the range of valid IPs is unpredictable.

When using IP restrictions behind a reverse proxy, ensure `trusted_proxies` is configured correctly. Without it, the integration sees the proxy IP for every connection and either blocks all connections (if the proxy IP is not in `allowed_ips`) or allows all connections from that proxy regardless of the real client IP.

Example configuration for a corporate deployment:

```json
{
  "allowed_ips": ["203.0.113.0/24"],
  "trusted_proxies": ["10.0.0.1/32"]
}
```

### 3.4 HMAC Enhanced Security

Enable `token_secret` (enhanced security mode) when you want to prevent authentication by anyone who has only the token ID, without also having the secret. This narrows the window of a token ID leak - an attacker who copies only the token ID from HTML source cannot authenticate.

The tradeoff is that both the token ID and the token secret must be embedded in the page HTML for the widget to authenticate. An attacker with access to the full page source can still authenticate. HMAC does not defend against a full page compromise.

HMAC is most valuable when the token ID might be leaked through a channel that does not expose the full page source - for example, in a URL parameter, a server log, or a referrer header. In practice, for standard web widget use, the additional protection is modest.

The token secret is a 32-byte random value generated by the integration. It is displayed once at token creation time. The integration stores only a hash of the secret - the plaintext is never retained after the creation screen is closed and cannot be recovered by anyone. Store it in a password manager or similar immediately.

### 3.5 Session Lifetime Tuning

HArvest has three distinct session lifetime settings that work at different levels:

- **`lifetime_minutes` (default 60):** how long a single session lasts before the widget must renew it. The widget renews silently in the background.
- **`max_lifetime_minutes` (default 1440, 24 hours):** the ceiling any single session can reach through renewals. A session cannot be renewed past this point.
- **`absolute_lifetime_hours` (default 72 hours, global cap):** the total cumulative time a visitor can remain authenticated before a full re-auth with the token ID is required. This is the outer boundary regardless of renewals.

These are independent controls. A visitor on a 60-minute session with `max_lifetime_minutes: 1440` can renew up to 24 hours continuously. The `absolute_lifetime_hours: 72` then hard-caps the total before they must re-authenticate from scratch.

Shorter `lifetime_minutes` values reduce the window of a stolen session token but cause more frequent (invisible) renewals. For public-facing widgets on high-traffic pages, the defaults are reasonable. For sensitive or infrequently-visited pages, consider shorter lifetimes (15-30 minutes) so abandoned sessions expire sooner.

Set `max_sessions` on tokens where you want to bound concurrent access. A widget on a personal blog with expected low traffic might set `max_sessions: 10` to surface unexpected concurrent usage in the activity log.

### 3.6 Active Schedule

`active_schedule` restricts a token to specific days and hours in a named IANA timezone. Outside the schedule window, the token behaves as expired.

This is useful for business-context widgets (office hours only), widgets used for live events (active only during the event window), or any scenario where you want automatic time-gated access without manual revocation.

Example: a widget on a holiday rental listing page active only during check-in periods:

```json
"active_schedule": {
  "timezone": "Asia/Bangkok",
  "windows": [
    {
      "days": ["fri", "sat"],
      "start": "14:00",
      "end": "20:00"
    }
  ]
}
```

### 3.7 Activity Monitoring and Alerting

HArvest publishes events to HA's event bus for integration with HA automations. The security-critical events (`harvest_suspicious_origin`, `harvest_token_revoked`, `harvest_session_limit_reached`, `harvest_flood_protection`) are enabled by default. High-volume events (`harvest_session_connected`, `harvest_auth_failure`) are off by default to avoid logbook noise on busy installs but can be enabled for detailed monitoring.

Example HA automation: send a mobile notification when a suspicious origin is detected on any token:

```yaml
automation:
  - alias: "HArvest suspicious origin alert"
    trigger:
      - platform: event
        event_type: harvest_suspicious_origin
    action:
      - service: notify.mobile_app_your_phone
        data:
          title: "HArvest security alert"
          message: >
            Suspicious origin detected on token {{ trigger.event.data.token_id }}
            from origin {{ trigger.event.data.origin }}
            (IP: {{ trigger.event.data.source_ip }})
```

The activity log in the HArvest panel provides full historical visibility. For automated analysis, use the CSV export feature to extract activity data for external tools.

### 3.8 Infrastructure-Level Hardening

For deployments where HArvest tokens grant write access to consequential devices, consider infrastructure-level measures that complement HArvest's application-layer security.

**fail2ban on the reverse proxy:** ban IPs that trigger repeated 429 responses from the HArvest endpoint. This adds an IP-level block that persists beyond the application-layer rate limit window.

**Cloudflare or similar CDN:** Cloudflare's DDoS protection, bot management, and rate limiting operate at the edge before traffic reaches your HA instance. This significantly reduces the effectiveness of flood attacks.

**HA network security:** ensure HA's own security is in order. Use a strong HA password, enable two-factor authentication for HA user accounts, keep HA and all integrations updated, and review the HA security checklist in the official HA documentation.

**Separate HA account for HArvest:** the integration uses HA's own long-lived access token for internal API calls. Create a dedicated HA user account for HArvest with minimal permissions rather than using an admin account. This limits the blast radius if the integration itself were compromised.

### 3.9 Subdomain or Port Isolation via Reverse Proxy

HA's built-in HTTP server binds to a single port and has no virtual host support. It cannot natively serve different content on different subdomains or ports. A reverse proxy is required for any subdomain or port-splitting arrangement.

This limitation is the same for all HA integrations, not specific to HArvest. The reverse proxy is the correct layer at which to implement this kind of isolation.

**Why this matters:** if HArvest's WebSocket endpoint (`/api/harvest/ws`) and the main HA interface share the same public-facing address and port, firewall rules cannot distinguish between traffic destined for HArvest and traffic destined for HA's UI or API. Isolating HArvest traffic to its own subdomain or port allows you to apply targeted firewall rules and access controls that do not affect the main HA interface.

**Recommended approach - subdomain isolation:**

Configure two subdomains in your reverse proxy: one for the main HA interface and one for HArvest only. The proxy routes each subdomain to the same internal HA instance but restricts which paths are accessible on each.

Example nginx configuration:

```nginx
# Main HA interface - accessible only from trusted networks or with additional auth
server {
    listen 443 ssl;
    server_name myhome.example.com;

    location / {
        proxy_pass http://homeassistant:8123;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}

# HArvest-only subdomain - publicly accessible, restricted to HArvest paths only
server {
    listen 443 ssl;
    server_name harvest.myhome.example.com;

    # Allow only the HArvest WebSocket and HTTP API paths
    location /api/harvest/ {
        proxy_pass http://homeassistant:8123;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }

    # Block all other HA paths at the proxy level
    location / {
        return 404;
    }
}
```

The widget's `ha-url` attribute points to `https://harvest.myhome.example.com` rather than the main HA address. The main HA interface at `myhome.example.com` can be protected by additional authentication (see Section 3.10) or firewall rules without affecting widget functionality at all.

Each subdomain gets its own TLS certificate via Let's Encrypt naturally. DNS control is required for this approach - you need to be able to create a CNAME or A record for `harvest.myhome.example.com`.

**Alternative - port isolation:**

If subdomain DNS control is not available, the same isolation can be achieved by listening on a separate port:

```nginx
# HArvest on a non-standard port
server {
    listen 8765 ssl;
    server_name myhome.example.com;

    location /api/harvest/ {
        proxy_pass http://homeassistant:8123;
        # ... same proxy headers as above
    }

    location / {
        return 404;
    }
}
```

Firewall rules then allow public access on port 8765 while restricting port 443 to trusted networks. The subdomain approach is cleaner since it keeps standard HTTPS ports and does not require users or visitors to specify a non-standard port in URLs.

### 3.10 Entity Alias for Privacy

By default, the entity ID appears directly in the page's HTML source:

```html
<hrv-card entity="light.bedroom_main"></hrv-card>
```

Anyone who views your page source can see `light.bedroom_main` and infer that you have a smart light in what is probably your bedroom. This reveals information about your home's layout and device naming to casual observers.

The wizard's "Obscure entity names" option replaces entity IDs with short random aliases:

```html
<hrv-card alias="dJ5x3Apd"></hrv-card>
```

The real entity ID is stored on your HA server and never appears in the HTML. A visitor viewing source sees only an opaque 8-character string with no information about what device it represents.

**What this protects:** the entity ID and any naming information it contains (room names, device types) are not visible in the page's HTML source.

**What this does not protect:** once a visitor's browser connects to the integration, the `entity_definition` message includes the entity's `friendly_name`. If your light's friendly name is "Bedroom Main Light", that name is still transmitted to the browser and appears on the card. Alias obscures the HTML source only, not the data sent over the WebSocket connection.

**Recommendation:** use aliases when you want to avoid revealing your home's device naming and layout to casual observers of the page source. It is a meaningful privacy improvement with no impact on functionality. The default is unchecked because most users do not need it, and the readable entity ID makes debugging easier.

### 3.11 Securing the Widget Host Page

HArvest protects the connection between the widget and HA. It does not protect access to the webpage that embeds the widget. Adding authentication to the host page is an independent and complementary layer of security.

If the page embedding your widget is password-protected, a visitor must authenticate to the page before they can even load the widget code, let alone connect to HA. This is particularly valuable for internal dashboards, home network pages, or any scenario where you want to limit who can see the widget at all.

**HTTP Basic Authentication via nginx:**

The simplest approach. The browser prompts for a username and password before serving the page. No application code required.

```nginx
server {
    listen 443 ssl;
    server_name dashboard.myhome.example.com;

    location / {
        auth_basic "Private Dashboard";
        auth_basic_user_file /etc/nginx/.htpasswd;
        root /var/www/dashboard;
    }
}
```

Generate the `.htpasswd` file with `htpasswd -c /etc/nginx/.htpasswd yourusername`.

HTTP Basic Auth sends credentials in base64 encoding. Over HTTPS this is acceptable - the transport layer provides confidentiality. Over plain HTTP it is not. Always use HTTPS.

**CMS-level authentication:**

If the widget is embedded in WordPress or another CMS, that platform's own user authentication system can protect the page. A WordPress page set to "Private" or restricted by a membership plugin requires the visitor to log in before the page is served. The widget loads normally for authenticated visitors and is invisible to others.

**What page-level auth does and does not add:**

It does add: a requirement for visitors to authenticate to the host page before they can load and use the widget. This meaningfully raises the bar for casual access.

It does not add: protection against someone who already has the widget token ID (e.g. copied from source before auth was added, or obtained through another channel). Token-level security and page-level security are independent layers that complement each other.

### 3.12 What to Do If a Token Is Compromised

If you believe a token has been exposed or misused:

1. **Revoke it immediately** from the HArvest panel. Active sessions are terminated within seconds.
2. **Review the activity log** for that token to understand what was accessed and when.
3. **Check the source IP** of suspicious sessions in the activity log. If you recognise the IP, it may be a false alarm.
4. **Create a new token** with a tighter scope if the widget still needs to exist.
5. **Consider HMAC** on the replacement token if you believe the token ID is being actively probed.

Revocation is permanent. A revoked token cannot be un-revoked. The token remains visible in the panel's archived section for audit purposes.

### 3.13 Security Checklist

A concise checklist for reviewing a HArvest deployment before going public:

**Token configuration:**
- [ ] Token scope contains only the entities this specific widget needs
- [ ] Write capability is only granted where the widget actually needs to send commands
- [ ] Token expiry is set for temporary or time-limited use cases
- [ ] `allowed_ips` is configured if the expected access pattern allows it
- [ ] `allow_any: true` is not set on write-capable tokens without deliberate intent

**Infrastructure:**
- [ ] HA is accessible over HTTPS only (no plain HTTP)
- [ ] Reverse proxy WebSocket upgrade headers are configured if using a proxy
- [ ] `trusted_proxies` is set if using IP restrictions behind a proxy
- [ ] HA instance is running the latest stable version
- [ ] HA user account used by HArvest is not an admin account
- [ ] Consider subdomain or port isolation if the main HA interface should not be publicly accessible

**Host page:**
- [ ] If the widget is intended for restricted audiences, the host page requires authentication
- [ ] The host page is served over HTTPS

**Monitoring:**
- [ ] `harvest_suspicious_origin` event bus notification is enabled (on by default)
- [ ] `harvest_token_revoked`, `harvest_session_limit_reached`, and `harvest_flood_protection` are enabled (all on by default)
- [ ] At least one HA automation fires when a suspicious event is detected
- [ ] Activity log retention is set to a duration suitable for post-incident review (default 30 days)
- [ ] Consider enabling `harvest_auth_failure` if you want detailed visibility into failed connection attempts (off by default due to log volume)

**Response preparedness:**
- [ ] You know how to revoke a token quickly from the panel
- [ ] You have tested token revocation at least once
- [ ] You know where to find the activity log for a specific token
