/**
 * DisplaySettings.tsx - Token detail "Preferences" tab.
 *
 * Edits per-token UI preferences: language, accessibility level, theme
 * (light/dark/auto override), and the custom-messages toggle that exposes
 * offline/error fallback strings.
 */

import { useState } from "react";
import type { Token } from "../types";
import { api } from "../api";
import { Card } from "./Shared";
import { Toggle } from "./Toggle";

const LANG_OPTIONS = [
  { value: "auto", label: "Auto-detect" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
  { value: "pt", label: "Português" },
  { value: "nl", label: "Nederlands" },
  { value: "ja", label: "日本語" },
  { value: "zh-Hans", label: "简体中文" },
  { value: "zh-Hant", label: "繁體中文" },
  { value: "th", label: "ไทย" },
];

const ON_OFFLINE_OPTIONS = [
  { value: "last-state", label: "Show last known state" },
  { value: "message",    label: "Show message" },
  { value: "dim",        label: "Dim card" },
  { value: "hide",       label: "Hide card" },
];

const ON_ERROR_OPTIONS = [
  { value: "message", label: "Show message" },
  { value: "dim",     label: "Dim card" },
  { value: "hide",    label: "Hide card" },
];

const DISPLAY_TEXT_MAX_LEN = 200;
const DISPLAY_TEXT_FORBIDDEN = /[<>"';\\]|--|\/\*|\*\/|\b(?:SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|UNION|EXEC)\b/i;

function validateDisplayText(val: string): string | null {
  if (val.length > DISPLAY_TEXT_MAX_LEN) return `${DISPLAY_TEXT_MAX_LEN} characters max.`;
  if (val && DISPLAY_TEXT_FORBIDDEN.test(val)) return "Contains disallowed characters.";
  return null;
}

interface DisplaySettingsProps {
  token: Token;
  readonly: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setToken: (t: Token) => void;
  setError: (e: string) => void;
}

export function DisplaySettings({ token, readonly, saving, setSaving, setToken, setError, bare }: DisplaySettingsProps & { bare?: boolean }) {
  const canEdit = !readonly && !saving;
  const [offlineText, setOfflineText] = useState(token.offline_text);
  const [errorText, setErrorText] = useState(token.error_text);
  const [offlineTextErr, setOfflineTextErr] = useState<string | null>(null);
  const [errorTextErr, setErrorTextErr] = useState<string | null>(null);

  const patchToken = async (data: Partial<Token>) => {
    setSaving(true);
    try {
      const updated = await api.tokens.update(token.token_id, data);
      setToken(updated);
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const saveLang = (val: string) => patchToken({ lang: val } as Partial<Token>);
  const saveA11y = (val: string) => patchToken({ a11y: val } as Partial<Token>);
  const saveColorScheme = (val: string) => patchToken({ color_scheme: val } as Partial<Token>);
  const saveOnOffline = (val: string) => patchToken({ on_offline: val } as Partial<Token>);
  const saveOnError = (val: string) => patchToken({ on_error: val } as Partial<Token>);

  const saveOfflineText = (val: string) => {
    const err = validateDisplayText(val);
    setOfflineTextErr(err);
    if (err) return;
    patchToken({ offline_text: val } as Partial<Token>);
  };

  const saveErrorText = (val: string) => {
    const err = validateDisplayText(val);
    setErrorTextErr(err);
    if (err) return;
    patchToken({ error_text: val } as Partial<Token>);
  };

  const toggleMessages = (checked: boolean) => {
    patchToken({ custom_messages: checked } as Partial<Token>);
  };

  const displayBody = <div className="col" style={{ gap: 14 }}>

        {/* Theme mode */}
        <div className="display-settings-row">
          <div>
            <div className="display-settings-label">Theme mode</div>
            <div className="settings-field-hint">Force light or dark theme regardless of the visitor's OS setting.</div>
          </div>
          <div className="segmented" role="group" aria-label="Theme mode" style={{ flexShrink: 0 }}>
            {(["auto", "light", "dark"] as const).map(v => (
              <button
                key={v}
                aria-pressed={token.color_scheme === v}
                onClick={() => canEdit && saveColorScheme(v)}
                disabled={!canEdit}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" />

        {/* Accessibility */}
        <div className="display-settings-row">
          <div>
            <div className="display-settings-label">Accessibility</div>
            <div className="settings-field-hint">Enhanced mode adds aria-live announcements for state changes.</div>
          </div>
          <select
            value={token.a11y}
            onChange={e => saveA11y(e.target.value)}
            disabled={!canEdit}
            className="input display-settings-select"
          >
            <option value="standard">Standard</option>
            <option value="enhanced">Enhanced</option>
          </select>
        </div>

        <div className="divider" />

        {/* Language */}
        <div className="display-settings-row">
          <div>
            <div className="display-settings-label">Language</div>
            <div className="settings-field-hint">Widget UI language for all cards using this token.</div>
          </div>
          <select
            value={token.lang}
            onChange={e => saveLang(e.target.value)}
            disabled={!canEdit}
            className="input display-settings-select"
          >
            {LANG_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="divider" />

        {/* Custom error messages - gated behind toggle */}
        <div className="display-settings-row" style={{ cursor: canEdit ? "pointer" : "default" }}>
          <div>
            <div className="display-settings-label">Custom error messages</div>
            <div className="settings-field-hint">Override the default offline and error behavior for this token.</div>
          </div>
          <Toggle checked={token.custom_messages} onChange={toggleMessages} disabled={!canEdit} />
        </div>

        {token.custom_messages && (
          <div className="display-settings-messages">
            {/* When offline */}
            <div className="display-settings-row">
              <span className="display-settings-text-label">When offline</span>
              <select
                value={token.on_offline}
                onChange={e => saveOnOffline(e.target.value)}
                disabled={!canEdit}
                className="input display-settings-select"
              >
                {ON_OFFLINE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <label className="display-settings-text-field">
              <span className="display-settings-text-label">Offline message</span>
              <input
                type="text"
                value={offlineText}
                onChange={e => { setOfflineText(e.target.value); setOfflineTextErr(validateDisplayText(e.target.value)); }}
                onBlur={() => saveOfflineText(offlineText)}
                onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                disabled={!canEdit}
                placeholder="Default: auto (i18n)"
                maxLength={DISPLAY_TEXT_MAX_LEN}
                className={`input fs-12${offlineTextErr ? " input-error" : ""}`}
              />
              {offlineTextErr && <span className="display-settings-text-error">{offlineTextErr}</span>}
              <span className="muted" style={{ fontSize: 10 }}>{offlineText.length}/{DISPLAY_TEXT_MAX_LEN}</span>
            </label>

            <div className="divider" />

            {/* When error */}
            <div className="display-settings-row">
              <span className="display-settings-text-label">When error</span>
              <select
                value={token.on_error}
                onChange={e => saveOnError(e.target.value)}
                disabled={!canEdit}
                className="input display-settings-select"
              >
                {ON_ERROR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <label className="display-settings-text-field">
              <span className="display-settings-text-label">Error message</span>
              <input
                type="text"
                value={errorText}
                onChange={e => { setErrorText(e.target.value); setErrorTextErr(validateDisplayText(e.target.value)); }}
                onBlur={() => saveErrorText(errorText)}
                onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                disabled={!canEdit}
                placeholder="Default: auto (i18n)"
                maxLength={DISPLAY_TEXT_MAX_LEN}
                className={`input fs-12${errorTextErr ? " input-error" : ""}`}
              />
              {errorTextErr && <span className="display-settings-text-error">{errorTextErr}</span>}
              <span className="muted" style={{ fontSize: 10 }}>{errorText.length}/{DISPLAY_TEXT_MAX_LEN}</span>
            </label>
          </div>
        )}
      </div>;

  if (bare) return <div className="card-body">{displayBody}</div>;
  return <Card title="Display">{displayBody}</Card>;
}
