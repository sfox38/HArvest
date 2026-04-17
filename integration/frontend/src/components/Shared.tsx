/**
 * Shared.tsx - Reusable UI primitives used across multiple panel screens.
 *
 * Components exported:
 *   StatusBadge      - Coloured pill for token/session status
 *   CopyButton       - Clipboard copy with transient feedback
 *   CopyablePre      - <pre> code block + copy button sharing copied state
 *   ConfirmDialog    - Modal confirmation prompt
 *   Spinner          - Loading indicator
 *   EmptyState       - Empty list placeholder
 *   ErrorBanner      - Dismissible error message strip
 */

import { useState, useCallback, useEffect, useRef } from "react";
import type { TokenStatus } from "../types";

// ---------------------------------------------------------------------------
// Theme tokens - status badge colors (dynamic, cannot move to CSS)
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<TokenStatus, { bg: string; text: string }> = {
  active:        { bg: "#e8f5e9", text: "#2e7d32" },
  inactive:      { bg: "#f5f5f5", text: "#616161" },
  expiring_soon: { bg: "#fff3e0", text: "#e65100" },
  expired:       { bg: "#fce4ec", text: "#b71c1c" },
  revoked:       { bg: "#f3e5f5", text: "#6a1b9a" },
};

// ---------------------------------------------------------------------------
// StatusBadge
// ---------------------------------------------------------------------------

interface StatusBadgeProps {
  status: TokenStatus;
  /** Override the display label. Defaults to formatted status string. */
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const { bg, text } = STATUS_COLORS[status] ?? STATUS_COLORS.inactive;
  const displayLabel = label ?? status.replace(/_/g, " ");
  return (
    <span
      className="hrv-status-badge"
      style={{ background: bg, color: text }}
    >
      {displayLabel}
    </span>
  );
}

// ---------------------------------------------------------------------------
// CopyButton
// ---------------------------------------------------------------------------

interface CopyButtonProps {
  text: string;
  /** Optional label shown before "Copied!" feedback. Default: "Copy". */
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

    // execCommand fallback - works even in HTTP (non-secure) contexts where
    // navigator.clipboard is unavailable.
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
      // navigator.clipboard is only available in secure contexts (HTTPS / localhost).
      // HA accessed via a local IP on HTTP will land here.
      fallback();
    }
  }, [text]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const pad = size === "sm" ? "4px 10px" : "6px 14px";
  const fs  = size === "sm" ? 12 : 13;

  return (
    <button
      onClick={handleCopy}
      className="hrv-copy-btn"
      style={{
        padding: pad,
        fontSize: fs,
        background: copied ? "var(--success-color, #43a047)" : "var(--primary-background-color, #fff)",
        color: copied ? "#fff" : "var(--primary-text-color, #212121)",
      }}
      aria-label={copied ? "Copied to clipboard" : `Copy ${label}`}
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// CopyablePre
// ---------------------------------------------------------------------------

interface CopyablePreProps {
  text: string;
  /** Label for the copy button. Default: "Copy". */
  label?: string;
}

/**
 * A <pre> code block paired with a copy button that share the same copied state.
 * Clicking either the pre element or the button copies the text and shows "Copied!"
 * on the button for 2 seconds.
 */
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
    <>
      <pre className="hrv-code" onClick={doCopy} title="Click to copy" style={{ cursor: "pointer" }}>
        {text}
      </pre>
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
        <button
          onClick={doCopy}
          className="hrv-copy-btn"
          style={{
            padding: "4px 10px",
            fontSize: 12,
            background: copied ? "var(--success-color, #43a047)" : "var(--primary-background-color, #fff)",
            color: copied ? "#fff" : "var(--primary-text-color, #212121)",
          }}
          aria-label={copied ? "Copied to clipboard" : `Copy ${label}`}
        >
          {copied ? "Copied!" : label}
        </button>
      </div>
    </>
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
  onConfirm: () => void;
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
  // Trap focus inside dialog on mount
  const dialogRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const first = dialogRef.current?.querySelector<HTMLElement>("button");
    first?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      className="hrv-overlay"
      onClick={onCancel}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-msg"
        className="hrv-dialog"
        onClick={e => e.stopPropagation()}
      >
        <h3
          id="confirm-title"
          style={{ marginBottom: 12, fontSize: 16, fontWeight: 600, color: "var(--primary-text-color, #212121)" }}
        >
          {title}
        </h3>
        <p
          id="confirm-msg"
          style={{ marginBottom: 24, fontSize: 14, color: "var(--secondary-text-color, #616161)", lineHeight: 1.5 }}
        >
          {message}
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
          <button onClick={onCancel} className="hrv-btn">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 20px",
              border: "none",
              borderRadius: 8,
              background: confirmDestructive ? "#c62828" : "var(--primary-color, #6200ea)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
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
  /** Accessible label */
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
      style={{ animation: "hrv-spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes hrv-spin { to { transform: rotate(360deg); transform-origin: ${cx}px ${cx}px; } }`}</style>
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="var(--divider-color, #e0e0e0)"
        strokeWidth={size * 0.08}
      />
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="var(--primary-color, #6200ea)"
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

export function EmptyState({ icon = "?", title, subtitle, action }: EmptyStateProps) {
  return (
    <div className="hrv-empty-state">
      <div style={{ fontSize: 40, lineHeight: 1 }} aria-hidden="true">{icon}</div>
      <p style={{ fontSize: 16, fontWeight: 600, color: "var(--primary-text-color, #212121)", margin: 0 }}>
        {title}
      </p>
      {subtitle && (
        <p style={{ fontSize: 14, color: "var(--secondary-text-color, #616161)", margin: 0, maxWidth: 320 }}>
          {subtitle}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="hrv-btn-primary"
          style={{ marginTop: 8 }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ErrorBanner
// ---------------------------------------------------------------------------

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div role="alert" className="hrv-error-banner">
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss error"
          style={{
            background: "none",
            border: "none",
            color: "#b71c1c",
            fontSize: 18,
            lineHeight: 1,
            cursor: "pointer",
            padding: "0 4px",
          }}
        >
          x
        </button>
      )}
    </div>
  );
}
