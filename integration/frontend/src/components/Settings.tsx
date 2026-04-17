/**
 * Settings.tsx - Integration configuration screen.
 *
 * Exposes all IntegrationConfig fields with auto-save on blur (300ms debounce).
 * Fields show a saving spinner, brief green flash on save, and red error on
 * failure. Toggle fields use inline on/off buttons.
 *
 * Allowed origins and themes registries are listed as read-only stubs in v1
 * (those registries are managed via the HTTP config endpoint).
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { IntegrationConfig, HaEventBusConfig } from "../types";
import { api } from "../api";
import { Spinner, ErrorBanner } from "./Shared";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SaveState = "idle" | "saving" | "error";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 4 }}>
      <button
        onClick={() => setOpen(v => !v)}
        className="hrv-settings-section-btn"
        style={{ marginBottom: open ? 16 : 0 }}
        aria-expanded={open}
      >
        <span style={{ fontSize: 12, color: "var(--secondary-text-color,#9e9e9e)" }}>{open ? "v" : ">"}</span>
        {title}
      </button>
      {open && <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 4 }}>{children}</div>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NumberField - single field with auto-save
// ---------------------------------------------------------------------------

interface NumberFieldProps {
  label: string;
  value: number;
  suffix?: string;
  min?: number;
  max?: number;
  onChange: (v: number) => Promise<void>;
  hint?: string;
}

function NumberField({ label, value: initial, suffix, min, max, onChange, hint }: NumberFieldProps) {
  const [localVal,  setLocalVal]  = useState(String(initial));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [errMsg,    setErrMsg]    = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setLocalVal(String(initial)); }, [initial]);

  const commit = useCallback(async (raw: string) => {
    const n = Number(raw);
    if (!raw || isNaN(n)) { setSaveState("error"); setErrMsg("Must be a number"); return; }
    if (min !== undefined && n < min) { setSaveState("error"); setErrMsg(`Minimum ${min}`); return; }
    if (max !== undefined && n > max) { setSaveState("error"); setErrMsg(`Maximum ${max}`); return; }
    setSaveState("saving");
    setErrMsg("");
    try {
      await onChange(n);
      setSaveState("idle");
    } catch (e) {
      setSaveState("error");
      setErrMsg(String(e));
    }
  }, [onChange, min, max]);

  const handleChange = (v: string) => {
    setLocalVal(v);
    setSaveState("idle");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => commit(v), 300);
  };

  const borderColor = saveState === "error" ? "#c62828" : "var(--divider-color,#e0e0e0)";

  return (
    <div className="hrv-settings-field-row">
      <label className="hrv-settings-field-label">
        {label}
        {hint && <div style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", marginTop: 2 }}>{hint}</div>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <input
            type="number"
            value={localVal}
            min={min}
            max={max}
            onChange={e => handleChange(e.target.value)}
            onBlur={() => commit(localVal)}
            style={{
              width: 90,
              padding: "6px 10px",
              border: `1px solid ${borderColor}`,
              borderRadius: 6,
              fontSize: 14,
              background: "var(--primary-background-color,#fff)",
              color: "var(--primary-text-color,#212121)",
              transition: "border-color 300ms",
            }}
          />
          {saveState === "saving" && (
            <span style={{ position: "absolute", right: 6 }}><Spinner size={14} /></span>
          )}
        </div>
        {suffix && <span style={{ fontSize: 13, color: "var(--secondary-text-color,#616161)" }}>{suffix}</span>}
      </div>
      {saveState === "error" && errMsg && (
        <span style={{ fontSize: 12, color: "#c62828", paddingTop: 8 }}>{errMsg}</span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ToggleField
// ---------------------------------------------------------------------------

interface ToggleFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => Promise<void>;
  hint?: string;
}

function ToggleField({ label, value, onChange, hint }: ToggleFieldProps) {
  const [saving, setSaving] = useState(false);
  const [err,    setErr]    = useState("");

  const toggle = async () => {
    setSaving(true);
    setErr("");
    try { await onChange(!value); }
    catch (e) { setErr(String(e)); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ flex: "0 0 260px", fontSize: 14, color: "var(--primary-text-color,#212121)" }}>
        {label}
        {hint && <div style={{ fontSize: 11, color: "var(--secondary-text-color,#9e9e9e)", marginTop: 2 }}>{hint}</div>}
      </div>
      <button
        onClick={toggle}
        disabled={saving}
        aria-pressed={value}
        style={{
          width: 64,
          padding: "5px 0",
          border: "none",
          borderRadius: 16,
          background: value ? "var(--primary-color,#6200ea)" : "var(--divider-color,#bdbdbd)",
          color: "#fff",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          transition: "background 200ms",
        }}
      >
        {saving ? "..." : value ? "ON" : "OFF"}
      </button>
      {err && <span style={{ fontSize: 12, color: "#c62828" }}>{err}</span>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export function Settings() {
  const [config,  setConfig]  = useState<IntegrationConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    api.config.get().then(setConfig).catch(e => setError(String(e))).finally(() => setLoading(false));
  }, []);

  // Partial update helper
  const patch = useCallback(async (data: Partial<IntegrationConfig>) => {
    const updated = await api.config.update(data);
    setConfig(updated);
  }, []);

  const patchNum = (field: keyof IntegrationConfig) => async (v: number) => {
    await patch({ [field]: v } as Partial<IntegrationConfig>);
  };

  const patchEventBus = (field: keyof HaEventBusConfig) => async (v: boolean) => {
    if (!config) return;
    await patch({
      ha_event_bus: { ...config.ha_event_bus, [field]: v },
    });
  };

  const patchDefaultSession = (field: "lifetime_minutes" | "max_lifetime_minutes") => async (v: number) => {
    if (!config) return;
    await patch({
      default_session: { ...config.default_session, [field]: v },
    });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 32 }}>
        <Spinner size={40} />
      </div>
    );
  }

  if (!config) {
    return (
      <div style={{ padding: 32 }}>
        {error && <ErrorBanner message={error} />}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800, display: "flex", flexDirection: "column", gap: 8 }}>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--primary-text-color,#212121)", marginBottom: 16 }}>
        Settings
      </h2>

      {/* Connection */}
      <Section title="Connection">
        <NumberField label="Auth timeout" value={config.auth_timeout_seconds} suffix="seconds" min={1} max={60}
          onChange={patchNum("auth_timeout_seconds")} />
        <NumberField label="Keepalive interval" value={config.keepalive_interval_seconds} suffix="seconds" min={5} max={300}
          onChange={patchNum("keepalive_interval_seconds")} />
        <NumberField label="Keepalive timeout" value={config.keepalive_timeout_seconds} suffix="seconds" min={1} max={60}
          onChange={patchNum("keepalive_timeout_seconds")} />
        <NumberField label="Client heartbeat timeout" value={config.heartbeat_timeout_seconds} suffix="seconds" min={5} max={600}
          onChange={patchNum("heartbeat_timeout_seconds")} />
      </Section>

      {/* Tokens */}
      <Section title="Tokens">
        <NumberField label="Max entities per token" value={config.max_entities_per_token} min={1} max={250}
          onChange={patchNum("max_entities_per_token")} />
      </Section>

      {/* Rate Limiting */}
      <Section title="Rate Limiting">
        <NumberField label="Max auth attempts per token" value={config.max_auth_attempts_per_token_per_minute} suffix="/ min" min={1}
          onChange={patchNum("max_auth_attempts_per_token_per_minute")} />
        <NumberField label="Max auth attempts per IP" value={config.max_auth_attempts_per_ip_per_minute} suffix="/ min" min={1}
          onChange={patchNum("max_auth_attempts_per_ip_per_minute")} />
      </Section>

      {/* Sessions */}
      <Section title="Sessions">
        <NumberField label="Default session lifetime" value={config.default_session.lifetime_minutes} suffix="minutes" min={1}
          onChange={patchDefaultSession("lifetime_minutes")} />
        <NumberField label="Max session lifetime" value={config.default_session.max_lifetime_minutes} suffix="minutes" min={1}
          onChange={patchDefaultSession("max_lifetime_minutes")} />
        <NumberField label="Absolute session lifetime cap" value={config.absolute_session_lifetime_hours} suffix="hours" min={1}
          hint="Hard cap across all tokens. Sessions cannot exceed this regardless of token settings."
          onChange={patchNum("absolute_session_lifetime_hours")} />
      </Section>

      {/* Activity Log */}
      <Section title="Activity Log">
        <NumberField label="Retention" value={config.activity_log_retention_days} suffix="days" min={1} max={365}
          onChange={patchNum("activity_log_retention_days")} />
        <div className="hrv-alert-warn-plain">
          The activity database is not included in Home Assistant's default backup. Back it up manually if needed.
        </div>
      </Section>

      {/* HA Event Bus */}
      <Section title="HA Event Bus">
        {(Object.keys(config.ha_event_bus) as (keyof HaEventBusConfig)[]).map(key => (
          <ToggleField
            key={key}
            label={key.replace(/^harvest_/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
            value={config.ha_event_bus[key]}
            onChange={patchEventBus(key)}
          />
        ))}
      </Section>
    </div>
  );
}
