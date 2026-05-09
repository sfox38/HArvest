/**
 * ConfigTabCard.tsx - Tabbed container for the per-token editor surfaces.
 *
 * Wraps EntitiesEditor / CodeSection (Embed) / DisplaySettings (Preferences) /
 * SecurityEditor / Widget Info into a single card with tab navigation.
 * Read-only tokens see a reduced tab set (Entities + Security + Widget Info).
 */

import { useState } from "react";
import type { Token } from "../types";
import { Card } from "./Shared";
import { CodeSection } from "./CodeSection";
import { SessionsPanel } from "./SessionsPanel";
import { ActivityPanel } from "./ActivityPanel";
import { DisplaySettings } from "./DisplaySettings";
import { EntitiesEditor } from "./EntitiesEditor";
import { SecurityEditor } from "./SecurityEditor";

type ConfigTab = "entities" | "embed" | "preferences" | "security" | "widget-info";

interface ConfigTabCardProps {
  token: Token & { created_by_name?: string | null };
  tokenId: string;
  readonly: boolean;
  saving: boolean;
  setSaving: (v: boolean) => void;
  setToken: (t: Token & { created_by_name?: string | null }) => void;
  setError: (e: string | null) => void;
  hmacSecret: string | null;
  setHmacSecret: (s: string | null) => void;
  hmacSecretAcked: boolean;
  setHmacSecretAcked: (v: boolean) => void;
  setSavedMsg: (msg: string) => void;
}

export function ConfigTabCard({ token, tokenId, readonly, saving, setSaving, setToken, setError, hmacSecret, setHmacSecret, hmacSecretAcked, setHmacSecretAcked, setSavedMsg }: ConfigTabCardProps) {
  const primaryCount = token.entities.filter(e => !e.companion_of).length;
  const [activeTab, setActiveTab] = useState<ConfigTab>(() => primaryCount === 0 ? "entities" : "entities");

  const visibleTabs: { id: ConfigTab; label: string }[] = readonly
    ? [
        { id: "entities",    label: "Entities" },
        { id: "security",    label: "Security" },
        { id: "widget-info", label: "Widget Info" },
      ]
    : [
        { id: "entities",    label: "Entities" },
        { id: "embed",       label: "Embed" },
        { id: "preferences", label: "Preferences" },
        { id: "security",    label: "Security" },
        { id: "widget-info", label: "Widget Info" },
      ];

  const effectiveTab = visibleTabs.some(t => t.id === activeTab) ? activeTab : "entities";
  const wrap = (t: Token) => setToken({ ...t, created_by_name: token.created_by_name });

  return (
    <div className="card">
      <div className="config-tabs-nav">
        {visibleTabs.map(t => (
          <button key={t.id} aria-selected={effectiveTab === t.id} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {effectiveTab === "entities" && (
        <EntitiesEditor bare token={token} readonly={readonly} saving={saving} setSaving={setSaving} setToken={wrap} setError={setError} setSavedMsg={setSavedMsg} />
      )}
      {effectiveTab === "embed" && !readonly && (
        <CodeSection bare token={token} setToken={wrap} setError={setError} hmacSecret={hmacSecret} />
      )}
      {effectiveTab === "preferences" && !readonly && (
        <DisplaySettings bare token={token} readonly={readonly} saving={saving} setSaving={setSaving} setToken={wrap} setError={setError} />
      )}
      {effectiveTab === "security" && (
        <SecurityEditor bare token={token} readonly={readonly} saving={saving} setSaving={setSaving} setToken={wrap} setError={setError} generatedSecret={hmacSecret} setGeneratedSecret={setHmacSecret} secretAcked={hmacSecretAcked} setSecretAcked={setHmacSecretAcked} />
      )}
      {effectiveTab === "widget-info" && (
        <div className="card-body col" style={{ gap: 18 }}>
          <Card title="Usage" className="card-info">
            <dl className="kv">
              <dt>Live sessions</dt><dd>{token.active_sessions}</dd>
              {(() => {
                const p = token.entities.filter(e => !e.companion_of).length;
                const c = token.entities.length - p;
                return <><dt>Entities</dt><dd>{p} primary{c > 0 ? `, ${c} companion` : ""}</dd></>;
              })()}
              <dt>Token ID</dt><dd className="mono fs-11">{token.token_id}</dd>
              <dt>Version</dt><dd>{token.token_version}</dd>
            </dl>
          </Card>
          <SessionsPanel tokenId={tokenId} />
          <ActivityPanel tokenId={tokenId} />
        </div>
      )}
    </div>
  );
}
