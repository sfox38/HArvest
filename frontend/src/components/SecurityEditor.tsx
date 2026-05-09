/**
 * SecurityEditor.tsx - Token detail "Security" tab.
 *
 * Edits origin URL allow-list (incl. trailing-slash-tolerant path matching),
 * IP allow-list, max-sessions cap, active schedule (timezone + per-day windows),
 * and HMAC token-secret enable/disable. The HMAC secret is shown once on
 * generation; acknowledgment is owned by TokenDetail to gate navigation.
 */

import { useState } from "react";
import type { Token, TokenUpdate } from "../types";
import { api } from "../api";
import { Card, ConfirmDialog, Hint } from "./Shared";
import { Toggle } from "./Toggle";
import { useCopy, CopyBtn } from "./CodeSection";
import { loadKnownOrigins, addKnownOrigin, removeKnownOrigin, validateOriginUrl, displayOriginLabel } from "./originMemory";

const ORIGIN_CUSTOM = "__custom__";

const COMMON_TIMEZONES = [
  "UTC",
  "Pacific/Auckland", "Pacific/Fiji",
  "Australia/Sydney", "Australia/Adelaide", "Australia/Perth",
  "Asia/Tokyo", "Asia/Seoul", "Asia/Shanghai", "Asia/Hong_Kong",
  "Asia/Singapore", "Asia/Bangkok", "Asia/Kolkata", "Asia/Dubai",
  "Europe/Moscow", "Europe/Istanbul", "Europe/Athens", "Europe/Helsinki",
  "Europe/Berlin", "Europe/Paris", "Europe/Amsterdam", "Europe/London",
  "Atlantic/Reykjavik",
  "America/Sao_Paulo", "America/Argentina/Buenos_Aires",
  "America/New_York", "America/Chicago", "America/Denver",
  "America/Los_Angeles", "America/Anchorage", "Pacific/Honolulu",
];

function detectTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && COMMON_TIMEZONES.includes(tz)) return tz;
    if (tz) return tz;
  } catch { /* ignore */ }
  return "UTC";
}

function tzOffsetLabel(tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "shortOffset" });
    const parts = fmt.formatToParts(new Date());
    const offset = parts.find(p => p.type === "timeZoneName")?.value ?? "";
    return offset.replace("GMT", "UTC");
  } catch { return ""; }
}

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const DAY_LABELS: Record<string, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

interface SecurityEditorProps {
  token: Token & { created_by_name?: string | null };
  readonly: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setToken: (t: Token & { created_by_name?: string | null }) => void;
  setError: (e: string) => void;
  generatedSecret: string | null;
  setGeneratedSecret: (s: string | null) => void;
  // Acknowledgment is owned by TokenDetail so it can guard navigation
  // (beforeunload + onBack) until the user confirms they have saved the
  // secret. The secret cannot be retrieved through the panel afterwards.
  secretAcked: boolean;
  setSecretAcked: (v: boolean) => void;
}

export function SecurityEditor({ token, readonly, saving, setSaving, setToken, setError, generatedSecret, setGeneratedSecret, secretAcked, setSecretAcked, bare }: SecurityEditorProps & { bare?: boolean }) {
  const canEdit = !readonly && !saving;
  const prevName = token.created_by_name;
  const patchToken = async (data: Partial<Token> | TokenUpdate) => {
    setSaving(true);
    try {
      const updated = await api.tokens.update(token.token_id, data);
      setToken({ ...updated, created_by_name: prevName });
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  // -- Origins --
  const [knownOrigins, setKnownOrigins]   = useState<string[]>(loadKnownOrigins);
  const [usingCustom,  setUsingCustom]    = useState(false);
  const [customInput,  setCustomInput]    = useState("");
  const [dropdownSel,  setDropdownSel]    = useState("");
  const [urlError,     setUrlError]       = useState<string | null>(null);
  const [pendingReplace, setPendingReplace] = useState<{ url: string; newOrigin: string; path: string | null } | null>(null);
  const [showOriginInput, setShowOriginInput] = useState(false);

  const baseOrigin = token.origins.allowed[0] ?? "";
  const paths = token.origins.allow_paths;
  const hasOrigins = !!(baseOrigin || paths.length > 0);
  const effectiveAllowAny = token.origins.allow_any || !hasOrigins;
  const displayUrls: string[] = effectiveAllowAny
    ? []
    : paths.length > 0
      ? paths.map(p => `${baseOrigin}${p}`)
      : baseOrigin ? [baseOrigin] : [];

  const saveOrigins = async (origins: Token["origins"]) => {
    await patchToken({ origins });
  };

  const removeUrl = (displayUrl: string) => {
    if (!canEdit) return;
    try {
      const u = new URL(displayUrl);
      const path = (u.pathname && u.pathname !== "/") ? u.pathname : null;
      if (path) {
        const newPaths = paths.filter(p => p !== path);
        if (newPaths.length > 0) {
          saveOrigins({ allow_any: false, allowed: [baseOrigin], allow_paths: newPaths });
        } else {
          saveOrigins({ allow_any: true, allowed: [], allow_paths: [] });
        }
      } else {
        saveOrigins({ allow_any: true, allowed: [], allow_paths: [] });
      }
    } catch { /* bad URL */ }
  };

  const applyUrl = (url: string, newOrigin: string, path: string | null) => {
    const differentHost = !!baseOrigin && baseOrigin !== newOrigin;
    if (path) {
      const newPaths = differentHost ? [path] : [...paths.filter(p => p !== path), path];
      saveOrigins({ allow_any: false, allowed: [newOrigin], allow_paths: newPaths });
    } else {
      saveOrigins({ allow_any: false, allowed: [newOrigin], allow_paths: differentHost ? [] : paths });
    }
    addKnownOrigin(url);
    setKnownOrigins(loadKnownOrigins());
    setDropdownSel("");
    setUsingCustom(false);
    setCustomInput("");
    setUrlError(null);
    setShowOriginInput(false);
    setPendingReplace(null);
  };

  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed || !canEdit) return;
    const err = validateOriginUrl(trimmed);
    if (err) { setUrlError(err); return; }
    const u = new URL(trimmed);
    const newOrigin = u.origin;
    const path = (u.pathname && u.pathname !== "/") ? u.pathname : null;
    const normalized = path ? `${newOrigin}${path}` : newOrigin;
    if (baseOrigin && baseOrigin !== newOrigin && displayUrls.length > 0) {
      setPendingReplace({ url: normalized, newOrigin, path });
      return;
    }
    applyUrl(normalized, newOrigin, path);
  };

  const handleDeleteFromDropdown = () => {
    removeKnownOrigin(dropdownSel);
    setKnownOrigins(loadKnownOrigins());
    setDropdownSel("");
  };

  const originDropdownItems = knownOrigins.filter(o => {
    if (displayUrls.includes(o)) return false;
    if (!baseOrigin) return true;
    try { return new URL(o).origin === baseOrigin; } catch { return false; }
  });
  const hasOriginDropdown = originDropdownItems.length > 0;

  // -- Expiry --
  const today = new Date().toISOString().slice(0, 10);
  const [editExpiry, setEditExpiry] = useState(token.expires ? token.expires.slice(0, 10) : "");
  const expiryInvalid = editExpiry !== "" && (
    !/^\d{4}-\d{2}-\d{2}$/.test(editExpiry) || editExpiry <= today
  );
  const saveExpiry = async (val: string) => {
    if (!canEdit) return;
    if (val === "") {
      await patchToken({ expires: null });
      return;
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(val) || val <= today) return;
    await patchToken({ expires: `${val}T23:59:59Z` });
  };

  // -- Active Schedule --
  const hasSchedule = token.active_schedule !== null;
  const [schedExpand, setSchedExpand] = useState(hasSchedule);
  const [schedTz, setSchedTz] = useState(token.active_schedule?.timezone ?? detectTimezone());
  const [schedDays, setSchedDays] = useState<string[]>(
    token.active_schedule?.windows[0]?.days ?? ["mon", "tue", "wed", "thu", "fri"],
  );
  const [schedStart, setSchedStart] = useState(token.active_schedule?.windows[0]?.start ?? "09:00");
  const [schedEnd, setSchedEnd] = useState(token.active_schedule?.windows[0]?.end ?? "18:00");
  const [schedDirty, setSchedDirty] = useState(false);

  const saveSchedule = async () => {
    if (!canEdit) return;
    await patchToken({
      active_schedule: {
        timezone: schedTz,
        windows: [{ days: schedDays, start: schedStart, end: schedEnd }],
      },
    });
    setSchedDirty(false);
  };

  const clearSchedule = async () => {
    if (!canEdit) return;
    await patchToken({ active_schedule: null });
    setSchedExpand(false);
    setSchedDirty(false);
  };

  const markSchedDirty = () => setSchedDirty(true);

  // -- Allowed IPs --
  const [ipText, setIpText] = useState(token.allowed_ips.join("\n"));
  const [ipError, setIpError] = useState<string | null>(null);

  const isValidCidr = (s: string): boolean => {
    const cidrV4 = /^(\d{1,3}\.){3}\d{1,3}(\/\d{1,2})?$/;
    const cidrV6 = /^[0-9a-fA-F:.]+(\/\d{1,3})?$/;
    if (!cidrV4.test(s) && !cidrV6.test(s)) return false;
    const parts = s.split("/");
    if (parts[0].includes(":")) return true;
    const octets = parts[0].split(".");
    if (octets.some(o => parseInt(o, 10) > 255)) return false;
    if (parts[1] !== undefined && parseInt(parts[1], 10) > 32) return false;
    return true;
  };

  const saveIps = async (raw: string) => {
    if (!canEdit) return;
    const lines = raw.split("\n").map(l => l.trim()).filter(Boolean);
    const invalid = lines.filter(l => !isValidCidr(l));
    if (invalid.length > 0) {
      setIpError(`Invalid: ${invalid.join(", ")}`);
      return;
    }
    setIpError(null);
    const current = token.allowed_ips;
    if (lines.length === current.length && lines.every((l, i) => l === current[i])) return;
    await patchToken({ allowed_ips: lines });
  };

  // -- Max Sessions --
  const [maxSess, setMaxSess] = useState(token.max_sessions !== null ? String(token.max_sessions) : "");

  const saveMaxSess = async (raw: string) => {
    if (!canEdit) return;
    const val = raw.trim() === "" ? null : parseInt(raw, 10);
    if (val !== null && (isNaN(val) || val < 1 || val > 1000)) return;
    const current = token.max_sessions;
    if (val === current) return;
    await patchToken({ max_sessions: val });
  };

  // -- HMAC --
  const [confirmDisableHmac, setConfirmDisableHmac] = useState(false);
  const secretCopy = useCopy(generatedSecret ?? "");

  const enableHmac = async () => {
    if (!canEdit) return;
    setSaving(true);
    try {
      const data = await api.tokens.update(token.token_id, { token_secret: "generate" });
      // Reset acknowledgment so the navigation guard kicks in for the new secret.
      setSecretAcked(false);
      setGeneratedSecret(data.generated_secret ?? null);
      setToken({ ...data, created_by_name: prevName });
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const disableHmac = async () => {
    setConfirmDisableHmac(false);
    await patchToken({ token_secret: null });
    setGeneratedSecret(null);
  };

  const securityBody = (
    <>
    <div className="col" style={{ gap: 16 }}>

        {/* Allow from any website */}
        <div>
          {!readonly && (
            <div className="row" style={{ gap: 8, fontSize: 13, cursor: canEdit ? "pointer" : "default", marginBottom: 10 }}>
              <Toggle
                checked={effectiveAllowAny && !showOriginInput}
                onChange={() => {
                  if (effectiveAllowAny && !showOriginInput) {
                    setShowOriginInput(true);
                  } else {
                    setShowOriginInput(false);
                    if (hasOrigins) {
                      saveOrigins({ allow_any: true, allowed: token.origins.allowed, allow_paths: token.origins.allow_paths });
                    }
                  }
                }}
                disabled={saving}
              />
              <span>Allow from any website</span>
            </div>
          )}
          {(effectiveAllowAny && !showOriginInput) ? (
            <div className="muted fs-13">
              {token.entities.some(e => e.capabilities === "read-write") && (
                <div className="badge badge-warn" style={{ marginBottom: 6, display: "inline-block" }}>
                  Write access from any website
                </div>
              )}
              {readonly && <div>Any website</div>}
            </div>
          ) : (
            <>
              {displayUrls.length === 0 && (
                <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>No origin set.</div>
              )}
              <div className="col" style={{ gap: 4, marginBottom: 8 }}>
                {displayUrls.map(url => (
                  <div key={url} className="row" style={{ gap: 6, fontSize: 13 }}>
                    <span className="flex-1 mono url-clip">{url}</span>
                    {!readonly && (
                      <button onClick={() => removeUrl(url)} disabled={saving} className="btn btn-sm btn-danger">Remove</button>
                    )}
                  </div>
                ))}
              </div>
              {!readonly && (
                <div className="col" style={{ gap: 6 }}>
                  {hasOriginDropdown && (
                    <div className="row" style={{ gap: 6 }}>
                      <select
                        value={usingCustom ? ORIGIN_CUSTOM : dropdownSel}
                        onChange={e => {
                          const v = e.target.value;
                          if (v === ORIGIN_CUSTOM) { setUsingCustom(true); setDropdownSel(""); }
                          else { setDropdownSel(v); setUsingCustom(false); }
                        }}
                        disabled={saving}
                        className="input"
                        style={{ flex: 1, fontSize: 13 }}
                      >
                        <option value="">Select a URL...</option>
                        {originDropdownItems.map(o => <option key={o} value={o}>{displayOriginLabel(o)}</option>)}
                        <option value={ORIGIN_CUSTOM}>Enter a new URL...</option>
                      </select>
                      {dropdownSel && !usingCustom && (
                        <>
                          <button onClick={() => addUrl(dropdownSel)} disabled={saving} className="btn btn-sm">Add URL</button>
                          <button onClick={handleDeleteFromDropdown} disabled={saving} className="btn btn-sm btn-danger">Delete URL</button>
                        </>
                      )}
                    </div>
                  )}
                  {(usingCustom || !hasOriginDropdown) && (
                    <div className="row" style={{ gap: 6 }}>
                      <input
                        value={customInput}
                        onChange={e => setCustomInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") addUrl(customInput); }}
                        placeholder="https://example.com/page.html"
                        disabled={saving}
                        autoFocus={hasOriginDropdown}
                        className="input"
                        style={{ flex: 1, fontSize: 13 }}
                      />
                      <button onClick={() => addUrl(customInput)} disabled={saving || !customInput.trim()} className="btn btn-sm">Add URL</button>
                    </div>
                  )}
                  {urlError && (
                    <div className="error-msg">{urlError}</div>
                  )}
                  <p className="muted fs-11">
                    Site only (https://example.com) or a specific page (https://example.com/page.html).
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        <div className="divider" />

        {/* Expiry */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Expiry date</div>
          {readonly ? (
            <div className="muted fs-13">
              {token.expires ? new Date(token.expires).toLocaleString() : "No expiry set"}
            </div>
          ) : (
            <div className="col" style={{ gap: 4 }}>
              <input
                type="date"
                value={editExpiry}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                onChange={e => { setEditExpiry(e.target.value); saveExpiry(e.target.value); }}
                disabled={saving}
                className="input"
                style={{ fontSize: 13, width: 180, borderColor: expiryInvalid ? "var(--danger)" : undefined }}
              />
              {expiryInvalid && (
                <div className="error-msg">Date must be in the future.</div>
              )}
              {!editExpiry && !expiryInvalid && (
                <div className="muted fs-12">No expiry - widget never expires</div>
              )}
            </div>
          )}
        </div>

        <div className="divider" />

        {/* HMAC */}
        <div>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div className="row" style={{ gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Enhanced security (HMAC)</span>
                <Hint text="Signs widget auth messages with a shared secret so the token cannot be reused on other sites. Both the widget and server must share the secret." />
              </div>
              <div className="muted" style={{ fontSize: 11.5 }}>
                Signs auth messages with a shared secret to prevent token reuse.
              </div>
            </div>
            {!readonly && (
              <div className="row" style={{ gap: 6 }}>
                {generatedSecret && <CopyBtn copied={secretCopy.copied} copy={secretCopy.copy} label="Copy secret" />}
                <button
                  className={`btn btn-sm ${token.token_secret ? "btn-danger" : "btn-primary"}`}
                  disabled={saving}
                  onClick={() => token.token_secret ? setConfirmDisableHmac(true) : enableHmac()}
                >
                  {token.token_secret ? "Disable" : "Enable"}
                </button>
              </div>
            )}
          </div>
          {token.token_secret && !generatedSecret && (
            <div className="badge badge-ok" style={{ fontSize: 12, marginTop: 6 }}>HMAC enabled</div>
          )}
          {generatedSecret && (
            <div style={{ marginTop: 8 }}>
              <div className="badge badge-warn" style={{ fontSize: 12, marginBottom: 6 }}>
                Copy this secret now. It cannot be retrieved through the panel again. Do not share your screen while this is visible.
              </div>
              <pre className="code code-full" onClick={secretCopy.copy} title="Click to copy">{generatedSecret}</pre>
              <label
                className="row"
                style={{
                  gap: 8,
                  fontSize: 13,
                  marginTop: 10,
                  padding: "8px 10px",
                  cursor: "pointer",
                  border: secretAcked ? "1px solid var(--border)" : "2px solid var(--color-warn, var(--accent))",
                  borderRadius: 6,
                  fontWeight: secretAcked ? 400 : 600,
                  background: secretAcked ? "transparent" : "var(--color-warn-bg, rgba(255,180,0,0.08))",
                }}
              >
                <input
                  type="checkbox"
                  checked={!!secretAcked}
                  onChange={e => setSecretAcked(e.target.checked)}
                />
                I have copied and saved this secret
              </label>
              {!secretAcked && (
                <div className="muted" style={{ fontSize: 11.5, marginTop: 6 }}>
                  Leaving this page before checking the box will warn you and may result in losing access to the secret.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="divider" />

        {/* Active Schedule */}
        <div>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Active schedule</div>
              <div className="muted" style={{ fontSize: 11.5 }}>
                Restrict this widget to specific days and times.
              </div>
            </div>
            {!readonly && !hasSchedule && !schedExpand && (
              <button className="btn btn-sm btn-ghost" disabled={saving} onClick={() => setSchedExpand(true)}>
                Configure
              </button>
            )}
          </div>
          {(hasSchedule || schedExpand) && (
            <div className="col" style={{ gap: 8, marginTop: 10 }}>
              <div className="row" style={{ gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: 500 }}>Timezone</label>
                <select
                  value={schedTz}
                  onChange={e => { setSchedTz(e.target.value); markSchedDirty(); }}
                  disabled={!canEdit}
                  className="input"
                  style={{ fontSize: 12, flex: 1, minWidth: 160 }}
                >
                  {(!COMMON_TIMEZONES.includes(schedTz)) && <option key={schedTz} value={schedTz}>{schedTz} ({tzOffsetLabel(schedTz)})</option>}
                  {COMMON_TIMEZONES.map(tz => <option key={tz} value={tz}>{tz} ({tzOffsetLabel(tz)})</option>)}
                </select>
              </div>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {DAY_KEYS.map(d => (
                  <button
                    key={d}
                    className={`btn btn-sm ${schedDays.includes(d) ? "btn-primary" : "btn-ghost"}`}
                    disabled={!canEdit}
                    onClick={() => {
                      setSchedDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
                      markSchedDirty();
                    }}
                    style={{ minWidth: 38, fontSize: 11.5, padding: "3px 6px" }}
                  >
                    {DAY_LABELS[d]}
                  </button>
                ))}
              </div>
              <div className="row" style={{ gap: 8, alignItems: "center" }}>
                <label style={{ fontSize: 12, fontWeight: 500 }}>From</label>
                <input
                  type="time" value={schedStart}
                  onChange={e => { setSchedStart(e.target.value); markSchedDirty(); }}
                  disabled={!canEdit} className="input fs-12"
                />
                <label style={{ fontSize: 12, fontWeight: 500 }}>to</label>
                <input
                  type="time" value={schedEnd}
                  onChange={e => { setSchedEnd(e.target.value); markSchedDirty(); }}
                  disabled={!canEdit} className="input fs-12"
                />
              </div>
              {!readonly && (
                <div className="row" style={{ gap: 8, marginTop: 4 }}>
                  <button className="btn btn-sm btn-primary" disabled={saving || (hasSchedule && !schedDirty) || schedDays.length === 0} onClick={saveSchedule}>
                    {hasSchedule ? "Update" : "Apply"}
                  </button>
                  {hasSchedule && (
                    <button className="btn btn-sm btn-ghost" disabled={saving} onClick={clearSchedule}>Remove</button>
                  )}
                  {!hasSchedule && (
                    <button className="btn btn-sm btn-ghost" disabled={saving} onClick={() => { setSchedExpand(false); setSchedDirty(false); }}>Cancel</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="divider" />

        {/* IP Restrictions */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>IP restrictions</div>
          <div className="muted" style={{ fontSize: 11.5, marginBottom: 6 }}>
            CIDR ranges that may connect (one per line). Empty means all IPs allowed.
          </div>
          <textarea
            value={ipText}
            placeholder={"203.0.113.0/24\n10.0.0.0/8"}
            rows={3}
            onChange={e => { setIpText(e.target.value); setIpError(null); }}
            onBlur={() => saveIps(ipText)}
            disabled={!canEdit}
            className="input"
            aria-label="IP restrictions (CIDR ranges, one per line)"
            style={{ width: "100%", fontFamily: "var(--font-mono)", fontSize: 12, resize: "vertical" }}
          />
          {ipError && <div style={{ color: "var(--danger)", fontSize: 11.5, marginTop: 4 }}>{ipError}</div>}
        </div>

        <div className="divider" />

        {/* Max Sessions */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Max concurrent sessions</div>
          <div className="muted" style={{ fontSize: 11.5, marginBottom: 6 }}>
            Limit simultaneous connections for this widget. Leave blank for unlimited.
          </div>
          <input
            type="number"
            value={maxSess}
            placeholder="unlimited"
            min={1}
            max={1000}
            onChange={e => setMaxSess(e.target.value)}
            onBlur={() => saveMaxSess(maxSess)}
            onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
            disabled={!canEdit}
            className="input"
            aria-label="Max concurrent sessions"
            style={{ width: 100, fontSize: 13 }}
          />
        </div>

      </div>

      {confirmDisableHmac && (
        <ConfirmDialog
          title="Disable HMAC?"
          message="Disabling HMAC removes the shared secret. Any pages using this token with HMAC signing will stop working."
          confirmLabel="Disable"
          confirmDestructive
          onConfirm={disableHmac}
          onCancel={() => setConfirmDisableHmac(false)}
        />
      )}
      {pendingReplace && (
        <ConfirmDialog
          title="Replace website?"
          message={`Changing to ${pendingReplace.newOrigin} will remove all existing URLs for ${baseOrigin}. Continue?`}
          confirmLabel="Replace"
          confirmDestructive
          onConfirm={() => applyUrl(pendingReplace.url, pendingReplace.newOrigin, pendingReplace.path)}
          onCancel={() => setPendingReplace(null)}
        />
      )}
    </>
  );

  if (bare) return <div className="card-body">{securityBody}</div>;
  return <Card title="Security">{securityBody}</Card>;
}
