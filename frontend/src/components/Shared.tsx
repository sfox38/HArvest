/**
 * Shared.tsx - Reusable UI primitives for the HArvest panel.
 *
 * Exports: StatusBadge, Hint, Badge, Card, CopyButton, CopyablePre,
 *          ConfirmDialog, Spinner, EmptyState, ErrorBanner,
 *          Sparkline, ActivityGraph, EventRow, fmtRel, fmtBytes
 */

import { useState, useCallback, useEffect, useRef, useMemo, useId } from "react";
import type { TokenStatus, ActivityEvent, HAEntity, ThemeDefinition, AvailableDomain, ServiceDescription, ServiceFieldSchema } from "../types";
import { Icon } from "./Icon";
import { api, isOffline } from "../api";
import { useEntityCache, loadEntityCache } from "../entityCache";

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<TokenStatus, { kind: string; label: string }> = {
  active:        { kind: "ok",      label: "Active"        },
  expiring_soon: { kind: "warn",    label: "Expiring soon" },
  inactive:      { kind: "neutral", label: "Inactive"      },
  expired:       { kind: "neutral", label: "Ended"         },
  revoked:       { kind: "danger",  label: "Revoked"       },
};

interface StatusBadgeProps {
  status: TokenStatus;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { kind, label: defaultLabel } = STATUS_BADGE[status] ?? { kind: "neutral", label: status };
  return (
    <span className={`badge badge-${kind}`}>
      <span className="dot" aria-hidden="true" />
      {label ?? defaultLabel}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Badge (generic)
// ---------------------------------------------------------------------------

interface BadgeProps {
  kind?: "ok" | "warn" | "danger" | "neutral" | "info";
  children: React.ReactNode;
}

export function Badge({ kind = "neutral", children }: BadgeProps) {
  return (
    <span className={`badge badge-${kind}`}>
      <span className="dot" aria-hidden="true" />
      {children}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Hint (contextual tooltip)
// ---------------------------------------------------------------------------

export function Hint({ text }: { text: string }) {
  return <span className="hint-icon" data-hint={text} tabIndex={0} role="note" aria-label={text}>?</span>;
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface CardProps {
  title?: React.ReactNode;
  action?: React.ReactNode;
  pad?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, action, pad = true, children, className }: CardProps) {
  return (
    <div className={`card${className ? ` ${className}` : ""}`}>
      {title && (
        <div className="card-header">
          <h3>{title}</h3>
          <div className="spacer" />
          {action}
        </div>
      )}
      <div className={pad ? "card-body" : ""}>{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

interface CopyButtonProps {
  text: string;
  label?: string;
  size?: "sm" | "md";
}

export function CopyButton({ text, label = "Copy", size = "md" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    const markCopied = () => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    };

    // execCommand fallback for non-secure (HTTP) contexts where clipboard API is unavailable.
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
      markCopied();
    };

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(markCopied).catch(fallback);
    } else {
      fallback();
    }
  }, [text]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <>
      <button
        onClick={handleCopy}
        className={`copy-btn${size === "sm" ? " copy-btn-sm" : ""}${copied ? " copied" : ""}`}
        aria-label={copied ? "Copied to clipboard" : `Copy ${label}`}
      >
        {copied ? "Copied!" : label}
      </button>
      <span aria-live="polite" className="sr-only">{copied ? "Copied to clipboard" : ""}</span>
    </>
  );
}

// ---------------------------------------------------------------------------
// CopyablePre
// ---------------------------------------------------------------------------

interface CopyablePreProps {
  text: string;
  label?: string;
}

export function CopyablePre({ text, label = "Copy" }: CopyablePreProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doCopy = useCallback(() => {
    const markCopied = () => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    };
    const fallback = () => {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try { document.execCommand("copy"); } catch { /* ignore */ }
      document.body.removeChild(ta);
      markCopied();
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(markCopied).catch(fallback);
    } else {
      fallback();
    }
  }, [text]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="code-wrap">
      <pre className="code">{text}</pre>
      <button
        onClick={doCopy}
        className={`copy-btn${copied ? " copied" : ""}`}
        aria-label={copied ? "Copied to clipboard" : label}
      >
        {copied ? "Copied!" : label}
      </button>
      <span aria-live="polite" className="sr-only">{copied ? "Copied to clipboard" : ""}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ConfirmDialog
// ---------------------------------------------------------------------------

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  confirmDestructive?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  confirmDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const [busy, setBusy] = useState(false);
  const ids = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const sel = 'button:not([disabled]), input:not([disabled])';
    el.querySelector<HTMLElement>(sel)?.focus();
    const trap = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onCancelRef.current(); return; }
      if (e.key !== "Tab") return;
      const els = Array.from(el.querySelectorAll<HTMLElement>(sel));
      if (els.length === 0) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { last.focus(); e.preventDefault(); }
      else if (!e.shiftKey && document.activeElement === last) { first.focus(); e.preventDefault(); }
    };
    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, []);

  const handleConfirm = async () => {
    if (busy) return;
    setBusy(true);
    try { await onConfirm(); }
    finally { setBusy(false); }
  };

  return (
    <div className="overlay" onClick={busy ? undefined : onCancel} role="presentation">
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={`${ids}-title`}
        aria-describedby={`${ids}-msg`}
        className="dialog"
        onClick={e => e.stopPropagation()}
      >
        <h3 id={`${ids}-title`} className="dialog-title">{title}</h3>
        <p id={`${ids}-msg`} className="dialog-body">{message}</p>
        <div className="dialog-actions">
          <button onClick={onCancel} className="btn btn-ghost" disabled={busy}>Cancel</button>
          <button
            onClick={handleConfirm}
            disabled={busy}
            className={`btn ${confirmDestructive ? "btn-danger" : "btn-primary"}`}
          >
            {busy && <Spinner size={14} />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------

interface SpinnerProps {
  size?: number;
  label?: string;
}

export function Spinner({ size = 32, label = "Loading..." }: SpinnerProps) {
  const r = size * 0.38;
  const cx = size / 2;
  const circumference = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={label}
      role="status"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); transform-origin: ${cx}px ${cx}px; } }`}</style>
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="var(--divider)"
        strokeWidth={size * 0.08}
      />
      <circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={size * 0.08}
        strokeDasharray={`${circumference * 0.25} ${circumference * 0.75}`}
        strokeLinecap="round"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon = "grid", title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="empty">
      <Icon name={icon} size={44} />
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
      {action && (
        <button onClick={action.onClick} className="btn btn-primary" style={{ marginTop: 8 }}>
          {action.label}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ErrorBanner
// ---------------------------------------------------------------------------

function _isNetworkError(msg: string): boolean {
  if (isOffline()) return true;
  const lower = msg.toLowerCase();
  return lower.includes("networkerror") || lower.includes("failed to fetch") || lower.includes("network request failed");
}

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!onDismiss || !dialogRef.current) return;
    const el = dialogRef.current;
    previousFocus.current = document.activeElement as HTMLElement | null;
    const selector = "button:not([disabled])";
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onDismiss();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(el.querySelectorAll<HTMLElement>(selector));
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        last.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first.focus();
        event.preventDefault();
      }
    };
    document.addEventListener("keydown", trap);
    return () => {
      document.removeEventListener("keydown", trap);
      previousFocus.current?.focus();
    };
  }, [onDismiss]);
  if (_isNetworkError(message)) return null;
  if (!onDismiss) {
    return (
      <div role="alert" className="error-banner">
        <span className="flex-1">{message}</span>
        {onRetry && <button className="btn btn-sm" onClick={onRetry}>Retry</button>}
      </div>
    );
  }
  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label="Error" onClick={onDismiss}>
      <div ref={dialogRef} className="dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="dialog-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div role="alert" style={{ fontSize: 14, lineHeight: 1.5 }}>{message}</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {onRetry && <button className="btn btn-sm btn-primary" onClick={() => { onDismiss(); onRetry(); }}>Retry</button>}
            <button className="btn btn-sm" onClick={onDismiss} autoFocus>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sparkline
// ---------------------------------------------------------------------------

interface SparklineProps {
  data: number[];
  color?: string;
  w?: number;
  h?: number;
}

export function Sparkline({ data, color = "var(--accent)", w = 160, h = 28 }: SparklineProps) {
  if (!data.length) return null;
  const max = Math.max(1, ...data);
  const stepX = w / (data.length - 1 || 1);
  const pts = data.map((v, i) => [i * stepX, h - (v / max) * h * 0.85 - 2]);
  const d = "M " + pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ");
  const dFill = d + ` L ${w},${h} L 0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" aria-hidden="true">
      <path d={dFill} style={{ fill: color }} opacity="0.14" />
      <path d={d} fill="none" style={{ stroke: color }} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// ActivityGraph (24h multi-line)
// ---------------------------------------------------------------------------

interface ActivityGraphProps {
  buckets: { hour: string; commands: number; sessions: number; auth_failures: number }[];
  height?: number;
}

export function ActivityGraph({ buckets, height = 180 }: ActivityGraphProps) {
  if (buckets.length < 2) return null;
  const total = buckets.reduce((s, b) => s + b.commands + b.sessions + b.auth_failures, 0);
  if (total === 0) return null;
  const W = 800;
  const H = height;
  const PAD = { top: 12, right: 12, bottom: 24, left: 32 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const max = Math.max(1, ...buckets.flatMap(b => [b.commands, b.sessions, b.auth_failures]));
  const xStep = innerW / Math.max(1, buckets.length - 1);

  const makeLine = (series: number[], color: string, filled = true) => {
    const pts = series.map((v, i) => {
      const x = PAD.left + i * xStep;
      const y = PAD.top + innerH - (v / max) * innerH;
      return [x, y];
    });
    const d = "M " + pts.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" L ");
    const dFill = d + ` L ${PAD.left + innerW},${PAD.top + innerH} L ${PAD.left},${PAD.top + innerH} Z`;
    return (
      <g key={color}>
        {filled && <path d={dFill} style={{ fill: color }} opacity="0.08" />}
        <path d={d} fill="none" style={{ stroke: color }} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  };

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const y = PAD.top + innerH * (1 - f);
    return (
      <g key={f}>
        <line x1={PAD.left} x2={W - PAD.right} y1={y} y2={y} stroke="var(--divider)" strokeDasharray="3 4" />
        <text x={PAD.left - 6} y={y + 3} fontSize="10" textAnchor="end" fill="var(--ink-4)">
          {Math.round(max * f)}
        </text>
      </g>
    );
  });

  const xLabels = [0, 6, 12, 18, 23].filter(i => i < buckets.length).map(i => {
    const x = PAD.left + i * xStep;
    const lbl = new Date(buckets[i].hour).toLocaleTimeString(undefined, { hour: "numeric" });
    return (
      <text key={i} x={x} y={H - 6} fontSize="10" textAnchor="middle" fill="var(--ink-4)">{lbl}</text>
    );
  });

  return (
    <div className="graph-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} style={{ display: "block" }} aria-hidden="true">
        {gridLines}
        {makeLine(buckets.map(b => b.commands),     "var(--info)")}
        {makeLine(buckets.map(b => b.sessions),      "var(--accent)")}
        {makeLine(buckets.map(b => b.auth_failures), "var(--danger)", false)}
        {xLabels}
      </svg>
      <div className="graph-legend">
        <span><i style={{ background: "var(--info)" }} /> Commands</span>
        <span><i style={{ background: "var(--accent)" }} /> Sessions</span>
        <span><i style={{ background: "var(--danger)" }} /> Auth failures</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EventRow (expandable)
// ---------------------------------------------------------------------------

const EVENT_STYLE: Record<string, { icon: string; cls: string }> = {
  AUTH_OK:           { icon: "shieldCheck", cls: "ev-ok"      },
  AUTH_FAIL:         { icon: "shield",      cls: "ev-danger"  },
  COMMAND:           { icon: "bolt",        cls: "ev-info"    },
  SESSION_END:       { icon: "clock",       cls: "ev-neutral" },
  TOKEN_CREATED:     { icon: "plus",        cls: "ev-ok"      },
  TOKEN_REVOKED:     { icon: "alert",       cls: "ev-warn"    },
  TOKEN_DELETED:     { icon: "trash",       cls: "ev-danger"  },
  RENEWAL:           { icon: "refresh",     cls: "ev-ok"      },
  SUSPICIOUS_ORIGIN: { icon: "alert",       cls: "ev-warn"    },
  FLOOD_PROTECTION:  { icon: "waves",       cls: "ev-danger"  },
  RATE_LIMITED:      { icon: "alert",       cls: "ev-warn"    },
  SERVER_STARTED:    { icon: "plug",        cls: "ev-ok"      },
  SERVER_STOPPED:    { icon: "power",       cls: "ev-neutral" },
};

interface EventRowProps {
  ev: ActivityEvent;
  onSelectToken?: (tokenId: string) => void;
}

export function EventRow({ ev, onSelectToken }: EventRowProps) {
  const [open, setOpen] = useState(false);
  const st = EVENT_STYLE[ev.type] ?? { icon: "info", cls: "ev-neutral" };

  const toggle = () => setOpen(o => !o);

  const origin = ev.origin && ev.origin !== "null" ? ev.origin : null;

  const widgetLink = (ev.token_label && ev.token_id && onSelectToken)
    ? (
      <a
        href="#"
        className="widget-link"
        onClick={e => { e.preventDefault(); e.stopPropagation(); onSelectToken(ev.token_id!); }}
      >
        {ev.token_label}
      </a>
    )
    : (ev.token_label ? <span>{ev.token_label}</span> : null);

  let title: React.ReactNode = ev.type;
  let sub: React.ReactNode = null;
  switch (ev.type) {
    case "AUTH_OK":
      title = "Auth OK";
      sub = <>{widgetLink}{origin ? ` - ${origin}` : ""}</>;
      break;
    case "AUTH_FAIL":
      title = "Auth Fail";
      sub = <>{widgetLink}{origin ? ` from ${origin}` : ""}{ev.code ? ` - ${ev.code}` : ""}</>;
      break;
    case "COMMAND":
      title = <><span className="mono">{ev.action}</span> on <span className="mono">{ev.entity_id}</span></>;
      sub = <>{widgetLink}{origin ? ` - ${origin}` : ""}</>;
      break;
    case "SESSION_END":
      title = "Session ended";
      sub = <>{widgetLink}{origin ? ` - ${origin}` : ""}</>;
      break;
    case "RENEWAL":
      title = "Session renewed";
      sub = widgetLink;
      break;
    case "TOKEN_CREATED":
      title = "Widget created";
      sub = widgetLink;
      break;
    case "TOKEN_REVOKED":
      title = "Widget revoked";
      sub = widgetLink;
      break;
    case "TOKEN_DELETED":
      title = "Widget deleted";
      sub = widgetLink;
      break;
    case "SUSPICIOUS_ORIGIN":
      title = "Suspicious origin blocked";
      sub = origin ? <span className="mono">{origin}</span> : null;
      break;
    case "FLOOD_PROTECTION":
      title = "Flood protection triggered";
      sub = widgetLink;
      break;
    case "RATE_LIMITED":
      title = "Rate limited";
      sub = <>{widgetLink}{origin ? ` - ${origin}` : ""}</>;
      break;
    case "SERVER_STARTED":
      title = "Alternate port server started";
      sub = ev.code ? <span>{ev.code}</span> : null;
      break;
    case "SERVER_STOPPED":
      title = "Alternate port server stopped";
      sub = ev.code ? <span>{ev.code}</span> : null;
      break;
  }

  return (
    <div
      className={`event-row expandable${open ? " open" : ""}`}
      onClick={toggle}
      tabIndex={0}
      role="button"
      aria-expanded={open}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
    >
      <div className="event-row-top">
        <div className={`event-icon ${st.cls}`}>
          <Icon name={st.icon} size={12} />
        </div>
        <div className="event-main">
          <div className="event-title">{title}</div>
          {sub && <div className="event-sub">{sub}</div>}
        </div>
        <div className="event-time">{fmtRel(ev.timestamp)}</div>
        <div className="event-caret">
          <Icon name={open ? "chevUp" : "chevDown"} size={14} />
        </div>
      </div>
      {open && (
        <div className="event-details" onClick={e => e.stopPropagation()}>
          <dl className="kv-compact">
            <dt>Type</dt><dd className="mono">{ev.type}</dd>
            <dt>Timestamp</dt><dd className="mono">{new Date(ev.timestamp).toLocaleString()}</dd>
            {ev.token_label && <><dt>Widget</dt><dd>{widgetLink}</dd></>}
            {ev.session_id && <><dt>Session</dt><dd className="mono">{ev.session_id}</dd></>}
            {<><dt>Origin</dt><dd className="mono">{origin ?? "(no origin)"}</dd></>}
            {ev.entity_id && <><dt>Entity</dt><dd className="mono">{ev.entity_id}</dd></>}
            {ev.action && <><dt>Action</dt><dd className="mono">{ev.action}</dd></>}
            {ev.code && <><dt>Error code</dt><dd className="mono">{ev.code}</dd></>}
            {ev.message && <><dt>Message</dt><dd>{ev.message}</dd></>}
          </dl>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

export function fmtRel(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function fmtBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// useDragScroll - enable mouse click-and-drag horizontal scrolling on a
// container. Native touch swipe already works via overflow-x: auto.
// ---------------------------------------------------------------------------

export function useDragScroll<T extends HTMLElement>() {
  const cleanupRef = useRef<(() => void) | null>(null);

  const setRef = useCallback((el: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!el) return;

    let dragging = false;
    let startX = 0;
    let startScroll = 0;
    let moved = 0;
    let velocity = 0;
    let lastX = 0;
    let lastT = 0;
    let momentumFrame: number | null = null;

    const cancelMomentum = () => {
      if (momentumFrame !== null) {
        cancelAnimationFrame(momentumFrame);
        momentumFrame = null;
      }
    };

    const startMomentum = () => {
      cancelMomentum();
      const friction = 0.94;
      const minSpeed = 0.2;
      const step = () => {
        if (Math.abs(velocity) < minSpeed) {
          momentumFrame = null;
          return;
        }
        el.scrollLeft -= velocity;
        velocity *= friction;
        momentumFrame = requestAnimationFrame(step);
      };
      momentumFrame = requestAnimationFrame(step);
    };

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, select, textarea")) return;
      cancelMomentum();
      dragging = true;
      moved = 0;
      startX = e.clientX;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      startScroll = el.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 4) {
        e.preventDefault();
        el.classList.add("drag-scrolling");
        el.scrollLeft = startScroll - dx;
        const now = performance.now();
        const dt = now - lastT;
        if (dt > 0) {
          const instVel = (e.clientX - lastX) / dt * 16;
          velocity = velocity * 0.7 + instVel * 0.3;
        }
        lastX = e.clientX;
        lastT = now;
      }
    };

    const onMouseUp = () => {
      if (!dragging) return;
      const wasDrag = moved > 4;
      dragging = false;
      el.classList.remove("drag-scrolling");
      if (wasDrag) {
        const blockClick = (ev: MouseEvent) => {
          ev.stopPropagation();
          ev.preventDefault();
          el.removeEventListener("click", blockClick, true);
        };
        el.addEventListener("click", blockClick, true);
        if (Math.abs(velocity) > 0.5) startMomentum();
      }
    };

    const onWheel = () => cancelMomentum();

    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    cleanupRef.current = () => {
      cancelMomentum();
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return setRef;
}

// ---------------------------------------------------------------------------
// EntityAutocomplete
// ---------------------------------------------------------------------------

interface EntityAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  onSelect: (entityId: string) => void;
  disabled?: boolean;
  filterDomains?: Set<string>;
  excludeDomains?: Set<string>;
  placeholder?: string;
  excludeIds?: string[];
}

// Scroll the input near the top of its nearest scrollable ancestor on mobile
// so the iOS keyboard doesn't cover it and the dropdown has room to drop down.
function scrollInputToTopOnMobile(input: HTMLInputElement | null) {
  if (!input) return;
  if (!window.matchMedia("(max-width: 720px)").matches) return;
  let el: HTMLElement | null = input.parentElement;
  while (el && el !== document.body) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight) {
      const inputRect = input.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const delta = inputRect.top - (elRect.top + 8);
      el.scrollBy({ top: delta, behavior: "smooth" });
      return;
    }
    el = el.parentElement;
  }
  const inputRect = input.getBoundingClientRect();
  window.scrollBy({ top: inputRect.top - 8, behavior: "smooth" });
}

export function EntityAutocomplete({ value, onChange, onSelect, disabled, filterDomains, excludeDomains, placeholder, excludeIds }: EntityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const entityList = useEntityCache();
  const listboxId = useId();
  const prevDisabled = useRef(false);

  useEffect(() => {
    if (entityList.length === 0) loadEntityCache();
  }, []);

  useEffect(() => {
    prevDisabled.current = !!disabled;
  }, [disabled]);

  const excluded = useMemo(() => new Set(excludeIds ?? []), [excludeIds]);

  const matches = useMemo<HAEntity[]>(() => {
    if (!value.trim() || entityList.length === 0) return [];
    const query = value.toLowerCase().trim();
    const words = query.split(/\s+/).filter(Boolean);

    // Score a candidate entity for relevance. Higher = better match.
    // Rewards matches at the start of the name part (after the domain dot)
    // and at the start of the friendly name more than buried substring matches.
    const score = (e: HAEntity): number => {
      const id   = e.entity_id.toLowerCase();
      const name = e.friendly_name.toLowerCase();
      const part = id.indexOf(".") >= 0 ? id.split(".")[1] : id; // name after domain
      let s = 0;
      if (id === query || name === query) return 1000; // exact match
      for (const w of words) {
        if (id === w)                          s += 80;
        else if (part.startsWith(w))           s += 40;
        else if (name.startsWith(w))           s += 35;
        else if (part.includes(`_${w}`) || part.includes(w + "_")) s += 20;
        else if (name.includes(` ${w}`))       s += 18;
        else if (part.includes(w))             s += 12;
        else if (name.includes(w))             s += 8;
        else /* word only in domain prefix */  s += 2;
      }
      // Prefer shorter entity IDs - a closer overall match relative to its length
      s -= id.length * 0.15;
      return s;
    };

    return entityList
      .filter(e => {
        if (excluded.has(e.entity_id)) return false;
        if (filterDomains && !filterDomains.has(e.domain)) return false;
        if (excludeDomains && excludeDomains.has(e.domain)) return false;
        const hay = `${e.entity_id} ${e.friendly_name}`.toLowerCase();
        return words.every(w => hay.includes(w));
      })
      .map(e => ({ e, s: score(e) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(({ e }) => e);
  }, [value, filterDomains, excludeDomains, excluded, entityList]);

  useEffect(() => { setHighlighted(0); }, [matches.length]);

  useEffect(() => {
    if (!open || matches.length === 0 || !inputRef.current) {
      setDropdownRect(null);
      return;
    }
    const calc = () => {
      if (!inputRef.current) return;
      const r = inputRef.current.getBoundingClientRect();
      const vvH = window.visualViewport?.height ?? window.innerHeight;
      const spaceBelow = vvH - r.bottom - 8;
      if (spaceBelow >= 80) {
        const minW = Math.min(Math.max(r.width, 380), window.innerWidth - r.left - 8);
      setDropdownRect({ top: r.bottom + 2, left: r.left, width: minW, maxHeight: Math.min(280, spaceBelow) });
      } else {
        const maxH = Math.min(280, r.top - 8);
        setDropdownRect(maxH > 40
          ? { top: r.top - maxH - 2, left: r.left, width: r.width, maxHeight: maxH }
          : null);
      }
    };
    calc();
    window.visualViewport?.addEventListener("resize", calc);
    window.visualViewport?.addEventListener("scroll", calc);
    window.addEventListener("resize", calc);
    return () => {
      window.visualViewport?.removeEventListener("resize", calc);
      window.visualViewport?.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, [open, matches.length]);

  const select = (entityId: string) => {
    onSelect(entityId);
    onChange("");
    setOpen(false);
  };

  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <input
        ref={inputRef}
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => {
          setOpen(true);
          if (!isMobile) {
            setTimeout(() => scrollInputToTopOnMobile(inputRef.current), 320);
          }
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={e => {
          if (!open || matches.length === 0) {
            if (e.key === "Enter" && value.trim().includes(".")) { select(value.trim()); e.preventDefault(); }
            return;
          }
          if (e.key === "ArrowDown") { setHighlighted(h => Math.min(h + 1, matches.length - 1)); e.preventDefault(); }
          else if (e.key === "ArrowUp") { setHighlighted(h => Math.max(h - 1, 0)); e.preventDefault(); }
          else if (e.key === "Enter") { select(matches[highlighted].entity_id); e.preventDefault(); }
          else if (e.key === "Escape") { setOpen(false); }
        }}
        disabled={disabled}
        placeholder={placeholder ?? "Search entity ID or friendly name..."}
        className="input"
        style={{ width: "100%", boxSizing: "border-box" }}
        role="combobox"
        aria-label="Search entities"
        aria-autocomplete="list"
        aria-expanded={open && matches.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={open && matches.length > 0 ? `${listboxId}-${highlighted}` : undefined}
      />
      {isMobile && open && matches.length > 0 && (
        <div
          className="autocomplete-dropdown autocomplete-dropdown-inline"
          style={{ maxHeight: 220 }}
          role="listbox"
          id={listboxId}
        >
          {matches.map((e, i) => (
            <div
              key={e.entity_id}
              id={`${listboxId}-${i}`}
              onMouseDown={() => select(e.entity_id)}
              onTouchEnd={(ev) => { ev.preventDefault(); select(e.entity_id); }}
              onMouseEnter={() => setHighlighted(i)}
              className={`autocomplete-item${i === highlighted ? " highlighted" : ""}`}
              role="option"
              aria-selected={i === highlighted}
            >
              <span className="badge badge-neutral" style={{ fontSize: 10 }}>{e.domain}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.friendly_name}</div>
                {e.friendly_name !== e.entity_id && (
                  <div className="muted mono fs-11">{e.entity_id}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isMobile && dropdownRect && (
        <div
          className="autocomplete-dropdown"
          style={{ top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width, maxHeight: dropdownRect.maxHeight }}
          role="listbox"
          id={listboxId}
        >
          {matches.map((e, i) => (
            <div
              key={e.entity_id}
              id={`${listboxId}-${i}`}
              onMouseDown={() => select(e.entity_id)}
              onMouseEnter={() => setHighlighted(i)}
              className={`autocomplete-item${i === highlighted ? " highlighted" : ""}`}
              role="option"
              aria-selected={i === highlighted}
            >
              <span className="badge badge-neutral" style={{ fontSize: 10 }}>{e.domain}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{e.friendly_name}</div>
                {e.friendly_name !== e.entity_id && (
                  <div className="muted mono fs-11">{e.entity_id}</div>
                )}
              </div>
              <span className="muted fs-11">{e.state}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// ActionPicker - searchable dropdown for domain.service actions
// ---------------------------------------------------------------------------

interface ActionPickerProps {
  value: string;
  onChange: (action: string) => void;
  disabled?: boolean;
  entityDomain?: string;
}

export function ActionPicker({ value, onChange, disabled, entityDomain }: ActionPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [domains, setDomains] = useState<AvailableDomain[]>([]);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number; maxHeight: number } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  useEffect(() => {
    api.ha.availableDomains().then(setDomains).catch(() => {});
  }, []);

  const allActions = useMemo(() => {
    const ALLOWED_SERVICES: Record<string, string[]> = {
      light: ["turn_on", "turn_off", "toggle"],
      switch: ["turn_on", "turn_off", "toggle"],
      fan: ["turn_on", "turn_off", "toggle", "set_percentage", "oscillate", "set_direction", "set_preset_mode", "increase_speed", "decrease_speed"],
      cover: ["open_cover", "close_cover", "stop_cover", "set_cover_position", "set_cover_tilt_position"],
      climate: ["turn_on", "turn_off", "set_temperature", "set_hvac_mode", "set_fan_mode", "set_preset_mode", "set_swing_mode"],
      input_boolean: ["turn_on", "turn_off", "toggle"],
      input_number: ["set_value"],
      input_select: ["select_option"],
      select: ["select_option"],
      timer: ["start", "pause", "cancel", "finish"],
      media_player: ["media_play_pause", "media_next_track", "media_previous_track", "volume_up", "volume_down", "volume_set", "volume_mute", "select_source", "turn_on", "turn_off"],
      remote: ["turn_on", "turn_off", "send_command"],
      lock: ["lock", "unlock", "open"],
      button: ["press"],
      input_button: ["press"],
      number: ["set_value"],
      script: ["turn_on"],
      automation: ["trigger", "turn_on", "turn_off"],
    };

    const actions: { action: string; domain: string; service: string }[] = [];

    for (const [domain, services] of Object.entries(ALLOWED_SERVICES)) {
      for (const svc of services) {
        actions.push({ action: `${domain}.${svc}`, domain, service: svc });
      }
    }

    for (const d of domains) {
      if (ALLOWED_SERVICES[d.domain]) continue;
      for (const svc of d.services) {
        actions.push({ action: `${d.domain}.${svc}`, domain: d.domain, service: svc });
      }
    }

    return actions;
  }, [domains]);

  const matches = useMemo(() => {
    const q = (query || value).toLowerCase().trim();
    if (!q) {
      if (entityDomain) {
        return allActions.filter(a => a.domain === entityDomain).slice(0, 12);
      }
      return allActions.slice(0, 12);
    }
    const words = q.split(/[\s.]+/).filter(Boolean);
    return allActions
      .filter(a => {
        const hay = a.action.toLowerCase();
        return words.every(w => hay.includes(w));
      })
      .sort((a, b) => {
        if (entityDomain) {
          const aDomain = a.domain === entityDomain ? 1 : 0;
          const bDomain = b.domain === entityDomain ? 1 : 0;
          if (aDomain !== bDomain) return bDomain - aDomain;
        }
        return a.action.length - b.action.length;
      })
      .slice(0, 12);
  }, [query, value, allActions, entityDomain]);

  useEffect(() => { setHighlighted(0); }, [matches.length]);

  useEffect(() => {
    if (!open || matches.length === 0 || !inputRef.current) {
      setDropdownRect(null);
      return;
    }
    const calc = () => {
      if (!inputRef.current) return;
      const r = inputRef.current.getBoundingClientRect();
      const vvH = window.visualViewport?.height ?? window.innerHeight;
      const spaceBelow = vvH - r.bottom - 8;
      const minW = Math.min(Math.max(r.width, 300), window.innerWidth - r.left - 8);
      if (spaceBelow >= 80) {
        setDropdownRect({ top: r.bottom + 2, left: r.left, width: minW, maxHeight: Math.min(280, spaceBelow) });
      } else {
        const maxH = Math.min(280, r.top - 8);
        setDropdownRect(maxH > 40 ? { top: r.top - maxH - 2, left: r.left, width: minW, maxHeight: maxH } : null);
      }
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, [open, matches.length]);

  const select = (action: string) => {
    onChange(action);
    setQuery("");
    setOpen(false);
  };

  const displayValue = open ? query : value;

  return (
    <div style={{ flex: 1, position: "relative" }}>
      <input
        ref={inputRef}
        value={displayValue}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => { setQuery(value ? "" : ""); setOpen(true); }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={e => {
          if (!open || matches.length === 0) return;
          if (e.key === "ArrowDown") { setHighlighted(h => Math.min(h + 1, matches.length - 1)); e.preventDefault(); }
          else if (e.key === "ArrowUp") { setHighlighted(h => Math.max(h - 1, 0)); e.preventDefault(); }
          else if (e.key === "Enter") { select(matches[highlighted].action); e.preventDefault(); }
          else if (e.key === "Escape") { setOpen(false); }
        }}
        disabled={disabled}
        placeholder="Search actions..."
        className="input"
        style={{ width: "100%", boxSizing: "border-box", fontSize: 12 }}
        role="combobox"
        aria-label="Search actions"
        aria-autocomplete="list"
        aria-expanded={open && matches.length > 0}
        aria-controls={listboxId}
        aria-activedescendant={open && matches.length > 0 ? `${listboxId}-${highlighted}` : undefined}
      />
      {open && dropdownRect && matches.length > 0 && (
        <div
          className="autocomplete-dropdown"
          style={{ top: dropdownRect.top, left: dropdownRect.left, width: dropdownRect.width, maxHeight: dropdownRect.maxHeight }}
          role="listbox"
          id={listboxId}
        >
          {matches.map((m, i) => (
            <div
              key={m.action}
              id={`${listboxId}-${i}`}
              onMouseDown={() => select(m.action)}
              onMouseEnter={() => setHighlighted(i)}
              className={`autocomplete-item${i === highlighted ? " highlighted" : ""}`}
              role="option"
              aria-selected={i === highlighted}
            >
              <span className="badge badge-neutral" style={{ fontSize: 10 }}>{m.domain}</span>
              <span className="mono" style={{ fontSize: 12 }}>{m.service}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// ServiceDataFields - renders dynamic form inputs from HA field schemas
// ---------------------------------------------------------------------------

interface ServiceDataFieldsProps {
  domain: string;
  service: string;
  data: Record<string, unknown>;
  onChange: (data: Record<string, unknown>) => void;
  disabled?: boolean;
  preloadedFields?: Record<string, ServiceFieldSchema> | null;
}

export function ServiceDataFields({ domain, service, data, onChange, disabled, preloadedFields }: ServiceDataFieldsProps) {
  const [schema, setSchema] = useState<ServiceDescription | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [registries, setRegistries] = useState<import("../types").HARegistries | null>(null);

  useEffect(() => {
    if (preloadedFields !== undefined) return;
    if (!domain || !service) { setSchema(null); return; }
    setLoading(true);
    setError("");
    api.services.getFields(domain, service)
      .then(s => { setSchema(s); setLoading(false); })
      .catch(e => { setError(String(e)); setLoading(false); setSchema(null); });
  }, [domain, service, preloadedFields]);

  const fields = preloadedFields !== undefined
    ? (preloadedFields ?? {})
    : (schema?.fields ?? {});

  const needsRegistries = Object.values(fields).some(f => {
    const s = f.selector;
    return s && (s.area !== undefined || s.floor !== undefined || s.device !== undefined || s.label !== undefined || s.entity !== undefined || s.target !== undefined);
  });

  useEffect(() => {
    if (!needsRegistries || registries) return;
    api.registries.getAll().then(setRegistries).catch(() => {});
  }, [needsRegistries, registries]);

  const entityList = useEntityCache();
  const TIER3 = useMemo(() => new Set(["alarm_control_panel", "device_tracker", "camera", "scene", "update"]), []);

  // Pre-fill defaults for fields that have a default and no current value.
  // This effect must stay above the early returns below so the hook order is
  // stable across renders (loading -> loaded), otherwise React error #310.
  const fieldsJson = JSON.stringify(fields);
  useEffect(() => {
    const defaults: Record<string, unknown> = {};
    let any = false;
    for (const [key, field] of Object.entries(fields)) {
      if (field.default != null && data[key] == null) {
        defaults[key] = field.default;
        any = true;
      }
    }
    if (any) onChange({ ...data, ...defaults });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldsJson]);

  if (preloadedFields === undefined) {
    if (!domain || !service) return null;
    if (loading) return <div className="muted fs-11" style={{ paddingTop: 4 }}>Loading fields...</div>;
    if (error) return <div className="muted fs-11" style={{ paddingTop: 4 }}>Could not load field schema. Use JSON below.</div>;
  }
  if (Object.keys(fields).length === 0) return null;

  const setField = (key: string, val: unknown) => {
    const next = { ...data };
    if (val === undefined || val === null || val === "") {
      delete next[key];
    } else {
      next[key] = val;
    }
    onChange(next);
  };

  const renderField = (key: string, field: ServiceFieldSchema) => {
    const sel = field.selector;

    // No selector: infer type from example value.
    if (!sel) {
      const ex = field.example;
      const isNumeric = ex != null && !isNaN(Number(ex)) && String(ex).trim() !== "";
      return (
        <input
          key={key}
          type={isNumeric ? "number" : "text"}
          className="input"
          placeholder={ex != null ? String(ex) : key}
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => {
            const v = e.target.value;
            setField(key, v === "" ? undefined : isNumeric ? Number(v) : v);
          }}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    if (sel.number) {
      const n = sel.number;
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type={n.mode === "slider" ? "range" : "number"}
            className="input"
            min={n.min}
            max={n.max}
            step={n.step ?? 1}
            placeholder={field.example != null ? String(field.example) : undefined}
            value={data[key] != null ? String(data[key]) : ""}
            onChange={e => {
              const v = e.target.value;
              setField(key, v === "" ? undefined : Number(v));
            }}
            disabled={disabled}
            style={{ fontSize: 12, flex: 1 }}
          />
          {n.mode === "slider" && data[key] != null && (
            <span className="mono fs-11">{String(data[key])}</span>
          )}
          {n.unit_of_measurement && (
            <span className="muted fs-11">{n.unit_of_measurement}</span>
          )}
        </div>
      );
    }

    if (sel.boolean !== undefined) {
      return (
        <label key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <input
            type="checkbox"
            checked={!!data[key]}
            onChange={e => setField(key, e.target.checked || undefined)}
            disabled={disabled}
          />
          {key.replace(/_/g, " ")}
        </label>
      );
    }

    if (sel.select) {
      const options = sel.select.options ?? [];
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {options.map(o => {
            const val = typeof o === "string" ? o : o.value;
            const label = typeof o === "string" ? o.replace(/_/g, " ") : (o.label || o.value);
            return <option key={val} value={val}>{label}</option>;
          })}
        </select>
      );
    }

    // text selector: respect multiline and type hints.
    if (sel.text !== undefined) {
      const t = sel.text;
      const suffix = t?.suffix;
      const prefix = t?.prefix;
      if (t?.multiline) {
        return (
          <div key={key} style={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
            {prefix && <span className="muted fs-11" style={{ paddingTop: 4 }}>{prefix}</span>}
            <textarea
              className="input"
              placeholder={field.example != null ? String(field.example) : key}
              value={data[key] != null ? String(data[key]) : ""}
              onChange={e => setField(key, e.target.value || undefined)}
              disabled={disabled}
              rows={3}
              style={{ fontSize: 12, fontFamily: "var(--mono)", resize: "vertical", flex: 1 }}
            />
            {suffix && <span className="muted fs-11" style={{ paddingTop: 4 }}>{suffix}</span>}
          </div>
        );
      }
      const inputType = t?.type === "password" ? "password"
        : t?.type === "email" ? "email"
        : t?.type === "url" ? "url"
        : "text";
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {prefix && <span className="muted fs-11">{prefix}</span>}
          <input
            key={key}
            type={inputType}
            className="input"
            placeholder={field.example != null ? String(field.example) : key}
            value={data[key] != null ? String(data[key]) : ""}
            onChange={e => setField(key, e.target.value || undefined)}
            disabled={disabled}
            style={{ fontSize: 12, flex: 1 }}
          />
          {suffix && <span className="muted fs-11">{suffix}</span>}
        </div>
      );
    }

    if (sel.entity !== undefined) {
      const ent = sel.entity;
      const domainFilter = ent?.domain
        ? new Set(Array.isArray(ent.domain) ? ent.domain : [ent.domain])
        : null;
      const filtered = entityList.filter(e => {
        if (TIER3.has(e.domain)) return false;
        return domainFilter ? domainFilter.has(e.domain) : true;
      });
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {filtered.map(e => (
            <option key={e.entity_id} value={e.entity_id}>
              {e.friendly_name ? `${e.friendly_name} (${e.entity_id})` : e.entity_id}
            </option>
          ))}
        </select>
      );
    }

    if (sel.target !== undefined) {
      const domainFilter = sel.target?.entity?.domain
        ? new Set(Array.isArray(sel.target.entity.domain) ? sel.target.entity.domain : [sel.target.entity.domain])
        : null;
      const filtered = entityList.filter(e => {
        if (TIER3.has(e.domain)) return false;
        return domainFilter ? domainFilter.has(e.domain) : true;
      });
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {filtered.map(e => (
            <option key={e.entity_id} value={e.entity_id}>
              {e.friendly_name ? `${e.friendly_name} (${e.entity_id})` : e.entity_id}
            </option>
          ))}
        </select>
      );
    }

    if (sel.area !== undefined) {
      const areas = registries?.areas ?? [];
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      );
    }

    if (sel.device !== undefined) {
      const devices = registries?.devices ?? [];
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {devices.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      );
    }

    if (sel.floor !== undefined) {
      const floors = (registries?.floors ?? []).slice().sort((a, b) => (a.level ?? 0) - (b.level ?? 0));
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {floors.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
        </select>
      );
    }

    if (sel.label !== undefined) {
      const labels = registries?.labels ?? [];
      return (
        <select
          key={key}
          className="input entity-graph-select"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        >
          <option value="">--</option>
          {labels.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </select>
      );
    }

    if (sel.location !== undefined) {
      return (
        <input
          key={key}
          type="text"
          className="input"
          placeholder={field.example != null ? String(field.example) : "latitude, longitude"}
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    if (sel.attribute !== undefined) {
      return (
        <input
          key={key}
          type="text"
          className="input"
          placeholder={field.example != null ? String(field.example) : "attribute name"}
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    if (sel.time !== undefined) {
      return (
        <input
          key={key}
          type="time"
          className="input"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    if (sel.date !== undefined) {
      return (
        <input
          key={key}
          type="date"
          className="input"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    if (sel.datetime !== undefined) {
      return (
        <input
          key={key}
          type="datetime-local"
          className="input"
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    if (sel.duration !== undefined) {
      const dur = sel.duration;
      const showDay = dur?.enable_day === true;
      const showMs = dur?.enable_millisecond === true;
      const raw = (data[key] ?? {}) as Record<string, unknown>;
      const sign = raw._negative ? "-" : "+";
      const val = raw as Record<string, number>;
      const setDur = (unit: string, v: string) => {
        const next = { ...val };
        if (v === "" || v === undefined) { delete next[unit]; } else { next[unit] = Number(v); }
        const hasValues = Object.keys(next).some(k => k !== "_negative" && next[k]);
        setField(key, hasValues || next._negative ? next : undefined);
      };
      const setSign = (neg: boolean) => {
        const next = { ...val };
        if (neg) { next._negative = 1 as never; } else { delete (next as Record<string, unknown>)._negative; }
        setField(key, Object.keys(next).length > 0 ? next : undefined);
      };
      const units: [string, string][] = [];
      if (showDay) units.push(["days", "d"]);
      units.push(["hours", "h"], ["minutes", "m"], ["seconds", "s"]);
      if (showMs) units.push(["milliseconds", "ms"]);
      return (
        <div key={key} className="svc-duration-row">
          <div className="svc-duration-unit svc-duration-sign">
            <select
              className="input"
              value={sign}
              onChange={e => setSign(e.target.value === "-")}
              disabled={disabled}
            >
              <option value="+">+</option>
              <option value="-">-</option>
            </select>
          </div>
          {units.map(([unit, label]) => (
            <div key={unit} className="svc-duration-unit">
              <input
                type="number"
                className="input"
                min={0}
                max={99}
                value={val[unit] != null ? String(val[unit]) : ""}
                placeholder="0"
                onChange={e => setDur(unit, e.target.value)}
                disabled={disabled}
              />
              <span className="svc-duration-label">{label}</span>
            </div>
          ))}
        </div>
      );
    }

    // template selector: multiline monospace textarea.
    if (sel.template !== undefined) {
      return (
        <textarea
          key={key}
          className="input"
          placeholder={field.example != null ? String(field.example) : "{{ value }}"}
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          rows={3}
          style={{ fontSize: 12, fontFamily: "var(--mono)", resize: "vertical" }}
        />
      );
    }

    // object selector: JSON textarea.
    if (sel.object !== undefined) {
      const raw = data[key];
      const strVal = raw != null ? (typeof raw === "string" ? raw : JSON.stringify(raw, null, 2)) : "";
      return (
        <textarea
          key={key}
          className="input"
          placeholder={field.example != null ? JSON.stringify(field.example, null, 2) : "{}"}
          value={strVal}
          onChange={e => {
            const v = e.target.value.trim();
            if (!v) { setField(key, undefined); return; }
            try { setField(key, JSON.parse(v)); } catch { setField(key, v); }
          }}
          disabled={disabled}
          rows={3}
          style={{ fontSize: 12, fontFamily: "var(--mono)", resize: "vertical" }}
        />
      );
    }

    if (sel.color_rgb) {
      const rgb = data[key] as number[] | undefined;
      const hex = rgb && rgb.length >= 3
        ? `#${rgb.slice(0, 3).map(c => Math.max(0, Math.min(255, c)).toString(16).padStart(2, "0")).join("")}`
        : "#ffffff";
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="color"
            value={hex}
            onChange={e => {
              const h = e.target.value;
              const r = parseInt(h.slice(1, 3), 16);
              const g = parseInt(h.slice(3, 5), 16);
              const b = parseInt(h.slice(5, 7), 16);
              setField(key, [r, g, b]);
            }}
            disabled={disabled}
            style={{ width: 32, height: 24, padding: 0, border: "1px solid var(--divider)", borderRadius: 4 }}
          />
          <span className="muted mono fs-11">{rgb ? `[${rgb.join(", ")}]` : ""}</span>
        </div>
      );
    }

    if (sel.color_temp) {
      const ct = sel.color_temp;
      return (
        <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="number"
            className="input"
            min={ct.min}
            max={ct.max}
            placeholder={`${ct.min ?? 2000}-${ct.max ?? 6500}`}
            value={data[key] != null ? String(data[key]) : ""}
            onChange={e => {
              const v = e.target.value;
              setField(key, v === "" ? undefined : Number(v));
            }}
            disabled={disabled}
            style={{ fontSize: 12, flex: 1 }}
          />
          <span className="muted fs-11">{ct.unit ?? "K"}</span>
        </div>
      );
    }

    if (sel.constant) {
      return (
        <label key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <input
            type="checkbox"
            checked={data[key] != null}
            onChange={e => setField(key, e.target.checked ? sel.constant!.value : undefined)}
            disabled={disabled}
          />
          {sel.constant.label ?? key.replace(/_/g, " ")}
        </label>
      );
    }

    // state selector: plain text fallback.
    if (sel.state !== undefined) {
      return (
        <input
          key={key}
          type="text"
          className="input"
          placeholder={field.example != null ? String(field.example) : key}
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      );
    }

    // Unknown selector type: show the type name and a text fallback.
    const selectorType = Object.keys(sel).find(k => sel[k as keyof typeof sel] !== undefined) ?? "unknown";
    return (
      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span className="muted fs-11">"{selectorType}" selector not supported visually; enter a value manually</span>
        <input
          type="text"
          className="input"
          placeholder={field.example != null ? String(field.example) : key}
          value={data[key] != null ? String(data[key]) : ""}
          onChange={e => setField(key, e.target.value || undefined)}
          disabled={disabled}
          style={{ fontSize: 12 }}
        />
      </div>
    );
  };

  const mainFields: [string, ServiceFieldSchema][] = [];
  const advancedFields: [string, ServiceFieldSchema][] = [];

  for (const [key, field] of Object.entries(fields)) {
    if (key === "advanced_fields" && field.fields) {
      for (const [k, f] of Object.entries(field.fields)) {
        advancedFields.push([k, f]);
      }
    } else if (field.advanced) {
      advancedFields.push([key, field]);
    } else {
      mainFields.push([key, field]);
    }
  }

  const renderFieldRow = (key: string, field: ServiceFieldSchema) => {
    const label = field.name || key.replace(/_/g, " ");
    return (
      <div key={key} className="svc-data-field-row">
        <label className="svc-data-field-label">
          {label}
          {field.required && <span style={{ color: "var(--danger)", cursor: "help" }} title="Required by this script"> *</span>}
        </label>
        <div className="svc-data-field-input">
          {renderField(key, field)}
        </div>
      </div>
    );
  };

  return (
    <div className="svc-data-fields">
      {mainFields.map(([key, field]) => renderFieldRow(key, field))}
      {advancedFields.length > 0 && (
        <>
          <button
            type="button"
            className="btn-link fs-11"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ padding: "2px 0", alignSelf: "flex-start" }}
          >
            {showAdvanced ? "Hide" : "Show"} advanced fields ({advancedFields.length})
          </button>
          {showAdvanced && advancedFields.map(([key, field]) => renderFieldRow(key, field))}
        </>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Theme thumbnail hook
// ---------------------------------------------------------------------------

export function useThemeThumbs(themes: ThemeDefinition[], refreshKey = 0): Record<string, string> {
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;
    const objectUrls: string[] = [];

    Promise.all(themes.map(async (t) => {
      try {
        const blob = await api.themes.fetchThumbnail(t.theme_id);
        const url = URL.createObjectURL(blob);
        objectUrls.push(url);
        return [t.theme_id, url] as const;
      } catch {
        return null;
      }
    })).then((results) => {
      if (cancelled) return;
      const map: Record<string, string> = {};
      for (const r of results) {
        if (r) map[r[0]] = r[1];
      }
      setUrls(map);
    });

    return () => {
      cancelled = true;
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [themes, refreshKey]);

  return urls;
}

// ---------------------------------------------------------------------------
// Theme URL helpers
// ---------------------------------------------------------------------------

export function themeIdToUrl(id: string): string {
  if (id === "default") return "";
  if (id.startsWith("hth_")) return `user:${id}`;
  return `bundled:${id}`;
}

export function themeUrlToId(url: string): string {
  if (!url) return "default";
  if (url.startsWith("bundled:")) return url.slice(8);
  if (url.startsWith("user:")) return url.slice(5);
  return url;
}

// ---------------------------------------------------------------------------
// SearchInput - shared search/filter box (icon + text input)
// ---------------------------------------------------------------------------

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  style?: React.CSSProperties;
}

export function SearchInput({ value, onChange, placeholder, ariaLabel, style }: SearchInputProps) {
  return (
    <div className="search" style={style}>
      <Icon name="search" size={15} />
      <input
        className="input"
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ThemeStrip - shared horizontal theme selector
// ---------------------------------------------------------------------------

interface ThemeStripProps {
  themes: ThemeDefinition[];
  selectedId: string;
  onSelect: (themeId: string) => void;
  thumbRefreshKey?: number;
  renderMeta?: (theme: ThemeDefinition) => React.ReactNode;
  ariaLabel?: string;
}

export function ThemeStrip({ themes, selectedId, onSelect, thumbRefreshKey, renderMeta, ariaLabel }: ThemeStripProps) {
  const thumbUrls = useThemeThumbs(themes, thumbRefreshKey);
  const dragRef = useDragScroll<HTMLDivElement>();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !selectedId) return;
    const selected = el.querySelector(".theme-strip-item.selected") as HTMLElement | null;
    if (selected) {
      // Scroll only within the strip (horizontal). Avoid scrollIntoView which
      // also scrolls vertical ancestors and jumps the page.
      const itemLeft = selected.offsetLeft;
      const itemRight = itemLeft + selected.offsetWidth;
      const visLeft = el.scrollLeft;
      const visRight = visLeft + el.clientWidth;
      if (itemLeft < visLeft) {
        el.scrollLeft = itemLeft;
      } else if (itemRight > visRight) {
        el.scrollLeft = itemRight - el.clientWidth;
      }
    }
  }, [selectedId, themes.length]);

  const setRefs = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    dragRef(el);
  }, [dragRef]);

  if (themes.length === 0) return null;

  return (
    <div
      ref={setRefs}
      className="theme-strip"
      {...(ariaLabel ? { role: "radiogroup", "aria-label": ariaLabel } : {})}
    >
      {themes.map(t => (
        <button
          key={t.theme_id}
          className={`theme-strip-item${selectedId === t.theme_id ? " selected" : ""}`}
          onClick={() => onSelect(t.theme_id)}
          type="button"
          {...(ariaLabel ? { role: "radio", "aria-checked": selectedId === t.theme_id, "aria-label": t.name } : {})}
        >
          <div className="theme-thumb-wrap">
            {thumbUrls[t.theme_id] ? (
              <img className="theme-strip-thumb" src={thumbUrls[t.theme_id]} alt={t.name} draggable={false} />
            ) : (
              <div className="theme-strip-thumb" />
            )}
            {t.has_renderer && (
              <span
                className={`theme-renderer-star${t.has_renderer_file === false ? " renderer-missing" : ""}`}
                title={t.has_renderer_file === false ? "Renderer JS file is missing" : "Theme includes custom renderers"}
              >
                {t.has_renderer_file === false ? "⚠" : "★"}
              </span>
            )}
            {t.custom_fonts?.length > 0 && (
              <span className="theme-font-badge" title={`Custom font: ${t.custom_fonts.map(f => f.family).join(", ")}`}>
                F
              </span>
            )}
          </div>
          <span className="theme-strip-name">{t.name}</span>
          {renderMeta && renderMeta(t)}
        </button>
      ))}
    </div>
  );
}
