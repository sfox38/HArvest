/**
 * SessionsPanel.tsx - Token detail panel: live session list with terminate.
 *
 * Polls /api/harvest/sessions every 15 seconds. Renders a per-session row
 * with an expand toggle showing origin, renewals, and subscribed entities.
 */

import { useState, useEffect, useCallback } from "react";
import type { Session } from "../types";
import { api } from "../api";
import { ConfirmDialog, Spinner, Card, fmtRel } from "./Shared";
import { Icon } from "./Icon";

export function SessionsPanel({ tokenId }: { tokenId: string }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [termAll,  setTermAll]  = useState(false);

  const load = useCallback(() => {
    let cancelled = false;
    api.sessions.list(tokenId)
      .then(s => { if (!cancelled) { setSessions(s); setError(null); } })
      .catch(e => { if (!cancelled) setError(String(e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tokenId]);

  useEffect(() => {
    const cancel = load();
    const id = setInterval(load, 15_000);
    return () => { cancel(); clearInterval(id); };
  }, [load]);

  const terminate = async (sid: string) => {
    await api.sessions.terminate(sid).catch(() => {});
    load();
  };

  const terminateAll = async () => {
    await api.sessions.terminateAll(tokenId).catch(() => {});
    setTermAll(false);
    load();
  };

  if (error && loading) return <p className="muted fs-13">Failed to load sessions.</p>;
  if (loading) return <Spinner size={24} />;

  return (
    <Card
      title={`Sessions (${sessions.length})`}
      pad={sessions.length === 0}
      className="card-info"
      action={sessions.length > 0 ? (
        <button className="btn btn-sm btn-danger" onClick={() => setTermAll(true)}>
          Terminate all
        </button>
      ) : undefined}
    >
      {sessions.length === 0 ? (
        <p className="muted fs-13">
          No active sessions. Sessions appear when someone opens a page with this widget embedded.
        </p>
      ) : (
        <div>
          {sessions.map(s => (
            <div
              key={s.session_id}
              className={`session-row${expanded === s.session_id ? " open" : ""}`}
              onClick={() => setExpanded(expanded === s.session_id ? null : s.session_id)}
              tabIndex={0}
              role="button"
              aria-expanded={expanded === s.session_id}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpanded(expanded === s.session_id ? null : s.session_id); } }}
            >
              <div className="session-compact-top">
                <code className="mono fs-11">
                  {s.session_id.slice(0, 20)}...
                </code>
                <span className="muted fs-12">
                  {fmtRel(s.issued_at)}
                </span>
                <Icon name={expanded === s.session_id ? "chevUp" : "chevDown"} size={14} />
              </div>
              {expanded === s.session_id && (
                <div className="event-details" onClick={e => e.stopPropagation()}>
                  <dl className="kv-compact">
                    <dt>Session ID</dt><dd className="mono">{s.session_id}</dd>
                    <dt>Origin</dt><dd className="mono">{s.origin ?? "unknown"}</dd>
                    <dt>Connected</dt><dd>{fmtRel(s.issued_at)}</dd>
                    <dt>Renewals</dt><dd>{s.renewal_count}</dd>
                    <dt>Entities</dt><dd className="mono">{s.subscribed_entity_ids.join(", ") || "none"}</dd>
                  </dl>
                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => terminate(s.session_id)}
                    >
                      Terminate session
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {termAll && (
        <ConfirmDialog
          title="Terminate all sessions"
          message="All active sessions for this widget will be closed immediately."
          confirmLabel="Terminate all"
          confirmDestructive
          onConfirm={terminateAll}
          onCancel={() => setTermAll(false)}
        />
      )}
    </Card>
  );
}
