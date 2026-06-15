/**
 * UrlReachabilityIndicator.tsx - Live URL reachability check.
 *
 * Probes a URL via the integration's /api/harvest/check_url endpoint
 * (which runs the actual HEAD request server-side because the browser
 * cannot fetch arbitrary cross-origin URLs). Renders a small status
 * glyph (✓ / ⚠ / ⓘ / ✗ / ⏳) next to the field plus an inline prose
 * message for non-OK states. SPEC.md Section 12.
 *
 * The indicator is ADVISORY only - never blocks save. A "not
 * reachable" result may simply mean the URL is on a network HA can't
 * see but visitors can. The prose explains this so admins are not
 * spooked into changing a URL that actually works.
 *
 * Debounced 500 ms after the last url change; also re-checks
 * immediately on a manual `triggerKey` bump (used by the parent when
 * the user blurs the underlying field).
 */

import { useEffect, useRef, useState } from "react";
import type { UrlCheckResult } from "../types";
import { api } from "../api";

interface Props {
  url: string;
  // When this value changes, the check fires immediately (no debounce).
  // Useful for re-checking on field blur or radio change.
  triggerKey?: string | number;
}

type IndicatorState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "ok"; message: string }
  | { kind: "warn"; message: string; glyph: "⚠" | "ⓘ" }
  | { kind: "error"; message: string };

export function UrlReachabilityIndicator({ url, triggerKey }: Props) {
  const [state, setState] = useState<IndicatorState>({ kind: "idle" });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Each in-flight request gets a sequence number so a slow earlier
  // probe can't overwrite a faster later one.
  const seqRef = useRef(0);

  const runCheck = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      setState({ kind: "idle" });
      return;
    }
    const mySeq = ++seqRef.current;
    setState({ kind: "checking" });
    api.urlCheck.check(trimmed)
      .then((result: UrlCheckResult) => {
        if (mySeq !== seqRef.current) return; // a newer probe started
        if (result.reason === "reachable") {
          setState({ kind: "ok", message: result.message });
        } else if (result.reason === "relative") {
          setState({ kind: "warn", message: result.message, glyph: "ⓘ" });
        } else if (result.reason === "unreachable") {
          setState({ kind: "warn", message: result.message, glyph: "⚠" });
        } else {
          setState({ kind: "error", message: result.message });
        }
      })
      .catch((e) => {
        if (mySeq !== seqRef.current) return;
        setState({
          kind: "error",
          message: `Couldn't probe this URL from the panel (${String(e)}).`,
        });
      });
  };

  // Debounced reaction to URL changes.
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => runCheck(url), 500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  // Immediate trigger when the parent bumps the key (blur, radio change, etc).
  useEffect(() => {
    if (triggerKey === undefined) return;
    runCheck(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  if (state.kind === "idle") return null;

  return (
    <div className="hrv-url-indicator" data-status={state.kind}>
      <span className="hrv-url-indicator-glyph" aria-hidden="true">
        {state.kind === "checking" && "⏳"}
        {state.kind === "ok" && "✓"}
        {state.kind === "warn" && state.glyph}
        {state.kind === "error" && "✗"}
      </span>
      {state.kind !== "ok" && state.kind !== "checking" && (
        <span className="hrv-url-indicator-msg">{state.message}</span>
      )}
    </div>
  );
}
