/**
 * TokenDetail.tsx - Widget (token) detail view.
 *
 * detail-grid split: embed code + entities (left), health/usage + sessions
 * + activity (right). Code blocks use step-pill labels.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import type { Token } from "../types";
import { validateLabel } from "../types";
import { api } from "../api";
import { StatusBadge, ConfirmDialog, Spinner, ErrorBanner } from "./Shared";
import { Icon } from "./Icon";
import { ConfigTabCard } from "./ConfigTabCard";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TokenDetailProps {
  tokenId: string;
  onBack: () => void;
  onOpenWizard: () => void;
  onDeleted: () => void;
}

function fmtDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}


// ---------------------------------------------------------------------------
// TokenDetail
// ---------------------------------------------------------------------------

export function TokenDetail({ tokenId, onBack, onDeleted }: TokenDetailProps) {
  const [token,         setToken]         = useState<Token | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState<string | null>(null);
  const [editLabel,     setEditLabel]     = useState("");
  const [labelError,    setLabelError]    = useState<string | null>(null);
  const [allLabels,     setAllLabels]     = useState<string[]>([]);
  const [saving,        setSaving]        = useState(false);
  const [savedMsg,      setSavedMsg]      = useState("");
  const prevSaving = useRef(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showSavedMsg = useCallback((msg: string) => {
    setSavedMsg(msg);
    if (savedTimer.current) clearTimeout(savedTimer.current);
    savedTimer.current = setTimeout(() => setSavedMsg(""), 2200);
  }, []);
  useEffect(() => {
    if (prevSaving.current && !saving && !error) {
      showSavedMsg("Changes saved");
    }
    if (saving) { setSavedMsg(""); setError(null); }
    prevSaving.current = saving;
  }, [saving, error]);
  useEffect(() => () => { if (savedTimer.current) clearTimeout(savedTimer.current); }, []);
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmPause,  setConfirmPause]  = useState(false);
  const [hmacSecret,    setHmacSecret]    = useState<string | null>(null);
  // Acknowledgment that the user has saved the just-generated HMAC secret.
  // Lifted out of SecurityEditor so this component can guard navigation
  // (beforeunload listener and onBack confirmation) until the user confirms.
  // The secret is shown once via api.tokens.update() and is not retrievable
  // through the panel API afterwards.
  const [hmacSecretAcked, setHmacSecretAcked] = useState(false);
  const [confirmBackUnacked, setConfirmBackUnacked] = useState(false);

  // Browser-level guard: when an unacknowledged secret is on screen, ask the
  // browser to confirm tab close / refresh / window close. Setting the event
  // returnValue is the only way to trigger the native prompt; the message
  // text itself is ignored by all modern browsers.
  const secretGuardActive = !!hmacSecret && !hmacSecretAcked;
  useEffect(() => {
    if (!secretGuardActive) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [secretGuardActive]);

  // In-app guard: clicking the back arrow triggers a confirmation dialog
  // when an unacknowledged secret is still on screen. Sidebar nav (clicking
  // Widgets / Settings / etc. in the App-level nav) is not intercepted; that
  // would require plumbing through App.tsx and is out of scope for this pass.
  const guardedOnBack = () => {
    if (secretGuardActive) {
      setConfirmBackUnacked(true);
      return;
    }
    onBack();
  };
  const confirmDiscardSecret = () => {
    setConfirmBackUnacked(false);
    onBack();
  };

  const load = useCallback(() => {
    api.tokens.get(tokenId)
      .then(t => {
        setToken(t);
        setEditLabel(t.label);
      })
      .catch(e => setError(String(e)))
      .finally(() => setLoading(false));
  }, [tokenId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.tokens.list().then(ts => {
      setAllLabels(ts.filter(t => t.token_id !== tokenId).map(t => t.label));
    }).catch(() => {});
  }, [tokenId]);

  const saveEdit = async (currentLabel: string) => {
    if (!token) return;
    const trimmed = currentLabel.trim();
    if (!trimmed) {
      setEditLabel(token.label);
      setLabelError(null);
      return;
    }
    const err = validateLabel(trimmed, allLabels);
    if (err) { setLabelError(err); return; }
    setLabelError(null);
    if (trimmed === token.label) return;
    setSaving(true);
    const prevCreatedByName = token.created_by_name;
    try {
      const updated = await api.tokens.update(token.token_id, { label: trimmed });
      setToken({ ...updated, created_by_name: prevCreatedByName });
    } catch (e) { setError(String(e)); }
    finally { setSaving(false); }
  };

  const doRevoke = async () => {
    if (!token) return;
    try {
      await api.tokens.revoke(token.token_id);
      setConfirmRevoke(false);
      load();
    } catch (e) { setError(String(e)); }
  };

  const doDelete = async () => {
    if (!token) return;
    try {
      await api.tokens.delete(token.token_id);
      setConfirmDelete(false);
      onDeleted();
    } catch (e) { setError(String(e)); }
  };

  const doPause = async () => {
    if (!token) return;
    try {
      const updated = await api.tokens.update(token.token_id, { paused: !token.paused } as Partial<Token>);
      setToken({ ...updated, created_by_name: token.created_by_name });
      setConfirmPause(false);
    } catch (e) { setError(String(e)); }
  };

  if (loading) {
    return (
      <div className="center-spinner">
        <Spinner size={40} />
      </div>
    );
  }

  if (!token) {
    return (
      <div style={{ padding: 32 }}>
        {error && <ErrorBanner message={error} />}
      </div>
    );
  }

  const readonly = token.status === "revoked" || token.status === "expired";
  return (
    <div className="content-narrow col" style={{ gap: 18 }}>
      <span aria-live="polite" className="sr-only">{savedMsg}</span>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      <div className="card card-pad">
        <div className="detail-header">
          {/* Nav: back button + status badge */}
          <div className="detail-header-nav">
            <button className="btn btn-ghost btn-sm" onClick={guardedOnBack} style={{ padding: "2px 6px" }}>
              <Icon name="chevLeft" size={14} />
            </button>
            <StatusBadge status={token.paused ? "inactive" : token.status} label={token.paused ? "Paused" : undefined} />
          </div>

          {/* Name input */}
          <div className="detail-header-name">
            <input
              value={editLabel}
              maxLength={100}
              onChange={e => {
                setEditLabel(e.target.value);
                if (labelError !== null) setLabelError(validateLabel(e.target.value.trim(), allLabels));
              }}
              onBlur={e => saveEdit(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
              disabled={saving || readonly}
              className="input"
              style={{ fontSize: 20, fontWeight: 650, border: "none", padding: "0", background: "transparent", width: "100%" }}
              aria-label="Widget name"
            />
            {labelError && (
              <div className="error-msg" style={{ marginTop: 3 }}>{labelError}</div>
            )}
          </div>

          {/* Action buttons */}
          <div className="detail-header-actions">
            {!readonly && (
              <>
                <button
                  className={`btn btn-sm ${token.paused ? "btn-primary" : ""}`}
                  onClick={() => token.paused ? doPause() : setConfirmPause(true)}
                >
                  <Icon name={token.paused ? "play" : "pause"} size={13} />
                  {token.paused ? "Resume" : "Pause"}
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => setConfirmRevoke(true)}>
                  <Icon name="trash" size={13} /> Revoke
                </button>
              </>
            )}
            {readonly && (
              <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(true)}>
                <Icon name="trash" size={13} /> Delete
              </button>
            )}
          </div>

          {/* Meta */}
          <div className="detail-header-meta muted fs-13">
            Created {fmtDateLong(token.created_at)} by {token.created_by_name ?? token.created_by}
            {" - "}{token.entities.length} {token.entities.length === 1 ? "entity" : "entities"}
          </div>
          {savedMsg && <span className={`detail-header-saved save-indicator ${savedMsg ? "visible" : ""}`} key={savedMsg + Date.now()}>&#10003; {savedMsg}</span>}
        </div>
      </div>

      <ConfigTabCard
        token={token}
        tokenId={tokenId}
        readonly={readonly}
        saving={saving}
        setSaving={setSaving}
        setToken={t => setToken({ ...t, created_by_name: token.created_by_name })}
        setError={setError}
        hmacSecret={hmacSecret}
        setHmacSecret={setHmacSecret}
        hmacSecretAcked={hmacSecretAcked}
        setHmacSecretAcked={setHmacSecretAcked}
        setSavedMsg={showSavedMsg}
      />

      {confirmPause && (
        <ConfirmDialog
          title="Pause widget"
          message={`Pausing "${token.label}" will immediately close all active sessions and block new connections until you resume it.`}
          confirmLabel="Pause"
          confirmDestructive
          onConfirm={doPause}
          onCancel={() => setConfirmPause(false)}
        />
      )}
      {confirmRevoke && (
        <ConfirmDialog
          title="Revoke widget"
          message={`Revoking "${token.label}" will immediately terminate all active sessions.`}
          confirmLabel="Revoke"
          confirmDestructive
          onConfirm={doRevoke}
          onCancel={() => setConfirmRevoke(false)}
        />
      )}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete widget"
          message={`Delete "${token.label}" and all associated activity log entries permanently?`}
          confirmLabel="Delete"
          confirmDestructive
          onConfirm={doDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
      {confirmBackUnacked && (
        <ConfirmDialog
          title="Leave without saving the secret?"
          message="You haven't confirmed that you've copied the HMAC secret. The secret cannot be retrieved through the panel afterwards. Leave anyway?"
          confirmLabel="Leave anyway"
          confirmDestructive
          onConfirm={confirmDiscardSecret}
          onCancel={() => setConfirmBackUnacked(false)}
        />
      )}
    </div>
  );
}
