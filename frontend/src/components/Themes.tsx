/**
 * Themes.tsx - Theme management screen.
 *
 * Horizontal theme strip at top, info card, preview card with mock widgets,
 * and JSON code editor. Supports CRUD for custom themes and read-only
 * viewing of bundled system themes.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { ThemeDefinition, Token, PacksResponse } from "../types";
import { api } from "../api";
import { Card, ConfirmDialog, Spinner, ErrorBanner, useThemeThumbs } from "./Shared";
import { Icon } from "./Icon";
import { WidgetPreview } from "./WidgetPreview";

// ---------------------------------------------------------------------------
// Theme URL mapping helpers
// ---------------------------------------------------------------------------

function themeUrlToId(themeUrl: string): string {
  if (!themeUrl) return "default";
  if (themeUrl.startsWith("bundled:")) return themeUrl.slice(8);
  if (themeUrl.startsWith("custom:")) return themeUrl.slice(7);
  return themeUrl;
}

// ---------------------------------------------------------------------------
// Clipboard hook
// ---------------------------------------------------------------------------

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    try { navigator.clipboard.writeText(text); } catch { /* textarea fallback omitted for panel */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);
  return { copied, copy };
}

// ---------------------------------------------------------------------------
// Main Themes component
// ---------------------------------------------------------------------------

interface ThemesProps {
  onSelectToken: (tokenId: string) => void;
}

export function Themes({ onSelectToken }: ThemesProps) {
  const [themes, setThemes] = useState<ThemeDefinition[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  // Code editor state
  const [editedJson, setEditedJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsedVars, setParsedVars] = useState<Record<string, string> | null>(null);
  const [parsedDarkVars, setParsedDarkVars] = useState<Record<string, string> | null>(null);

  // Renderer pack state
  const [packsData, setPacksData] = useState<PacksResponse | null>(null);
  const [packCode, setPackCode] = useState<string | null>(null);
  const [packCodeDirty, setPackCodeDirty] = useState(false);
  const [packCodeSaving, setPackCodeSaving] = useState(false);
  const [showAgree, setShowAgree] = useState(false);
  const [agreeText, setAgreeText] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Thumbnail state
  const [thumbKey, setThumbKey] = useState(0);
  const thumbUrls = useThemeThumbs(themes, thumbKey);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    try {
      const [t, tk] = await Promise.all([api.themes.list(), api.tokens.list()]);
      setThemes(t);
      setTokens(tk);
      return t;
    } catch (e) {
      setError(String(e));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => { api.packs.list().then(setPacksData).catch(() => {}); }, []);

  const selectedTheme = themes.find(t => t.theme_id === selected) ?? null;
  const selectedPack = selectedTheme?.renderer_pack
    ? packsData?.packs.find(p => p.pack_id === selectedTheme.renderer_pack) ?? null
    : null;

  useEffect(() => {
    if (!selectedTheme?.renderer_pack) { setPackCode(null); setPackCodeDirty(false); return; }
    api.packs.getCode(selectedTheme.renderer_pack).then(r => setPackCode(r.code)).catch(() => setPackCode(null));
    setPackCodeDirty(false);
  }, [selectedTheme?.renderer_pack]);

  const requireConsent = (action: () => Promise<void>) => {
    if (packsData?.agreed) { action(); return; }
    setPendingAction(() => action);
    setShowAgree(true);
  };

  const confirmAgree = async () => {
    try {
      await api.packs.agree(true);
      setPacksData(prev => prev ? { ...prev, agreed: true } : prev);
      setShowAgree(false);
      setAgreeText("");
      if (pendingAction) { await pendingAction(); setPendingAction(null); }
    } catch (e) { setError(String(e)); }
  };

  // When selection changes, sync the code editor
  useEffect(() => {
    if (!selectedTheme) { setEditedJson(""); setDirty(false); setJsonError(null); setParsedVars(null); setParsedDarkVars(null); return; }
    const obj: Record<string, unknown> = {
      name: selectedTheme.name,
      author: selectedTheme.author,
      version: selectedTheme.version,
      harvest_version: selectedTheme.harvest_version,
      variables: selectedTheme.variables,
    };
    if (Object.keys(selectedTheme.dark_variables).length > 0) {
      obj.dark_variables = selectedTheme.dark_variables;
    }
    if (selectedTheme.renderer_pack) {
      obj.renderer_pack = selectedTheme.renderer_pack;
    }
    setEditedJson(JSON.stringify(obj, null, 2));
    setDirty(false);
    setJsonError(null);
    setParsedVars(null);
    setParsedDarkVars(null);
  }, [selected, selectedTheme?.name]);

  // Usage count helper
  const usageForTheme = (themeId: string) => tokens.filter(t => themeUrlToId(t.theme_url) === themeId).length;
  const widgetsUsingTheme = (themeId: string) => tokens.filter(t => themeUrlToId(t.theme_url) === themeId);

  // JSON edit handler with debounced parse
  const handleJsonChange = (value: string) => {
    setEditedJson(value);
    setDirty(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        const parsed = JSON.parse(value);
        if (!parsed.variables || typeof parsed.variables !== "object") {
          setJsonError("Missing or invalid 'variables' object.");
          return;
        }
        setJsonError(null);
        setParsedVars(parsed.variables);
        setParsedDarkVars(parsed.dark_variables ?? null);
      } catch (e) {
        setJsonError(String(e).replace("SyntaxError: ", ""));
      }
    }, 300);
  };

  // CRUD handlers
  const handleCreate = async () => {
    try {
      const theme = await api.themes.create({
        name: "New Theme",
        variables: themes.find(t => t.theme_id === "default")?.variables ?? {},
        dark_variables: themes.find(t => t.theme_id === "default")?.dark_variables ?? {},
      });
      const updated = await reload();
      if (updated) setSelected(theme.theme_id);
    } catch (e) { setError(String(e)); }
  };

  const handleDuplicate = () => {
    if (!selectedTheme) return;
    const doDuplicate = async () => {
      try {
        const theme = await api.themes.create({
          name: `Copy of ${selectedTheme.name}`,
          variables: selectedTheme.variables,
          dark_variables: selectedTheme.dark_variables,
          author: selectedTheme.author,
          version: selectedTheme.version,
          renderer_pack: selectedTheme.renderer_pack,
        });
        const updated = await reload();
        if (updated) setSelected(theme.theme_id);
      } catch (e) { setError(String(e)); }
    };
    if (selectedTheme.renderer_pack) { requireConsent(doDuplicate); }
    else { doDuplicate(); }
  };

  const handleDelete = async () => {
    if (!selectedTheme || selectedTheme.is_bundled) return;
    try {
      await api.themes.delete(selectedTheme.theme_id);
      setSelected(null);
      setConfirmDelete(false);
      await reload();
    } catch (e) { setError(String(e)); setConfirmDelete(false); }
  };

  const handleExport = () => {
    if (!selectedTheme) return;
    const obj: Record<string, unknown> = {
      name: selectedTheme.name,
      author: selectedTheme.author,
      version: selectedTheme.version,
      harvest_version: selectedTheme.harvest_version,
      variables: selectedTheme.variables,
    };
    if (Object.keys(selectedTheme.dark_variables).length > 0) {
      obj.dark_variables = selectedTheme.dark_variables;
    }
    if (selectedTheme.renderer_pack) {
      obj.renderer_pack = selectedTheme.renderer_pack;
    }
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selectedTheme.name.toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [reloading, setReloading] = useState(false);

  const handleReload = async () => {
    setReloading(true);
    const t0 = Date.now();
    try {
      await api.themes.reload();
      await reload();
    } catch (e) { setError(String(e)); }
    const elapsed = Date.now() - t0;
    if (elapsed < 500) await new Promise(r => setTimeout(r, 500 - elapsed));
    setReloading(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed.name || !parsed.variables || typeof parsed.variables !== "object") {
        setError("Invalid theme file: must contain 'name' and 'variables'.");
        return;
      }
      const doImport = async () => {
        const theme = await api.themes.create({
          name: parsed.name,
          variables: parsed.variables,
          dark_variables: parsed.dark_variables,
          author: parsed.author ?? "",
          version: parsed.version ?? "1.0",
          renderer_pack: parsed.renderer_pack ?? "",
        });
        const updated = await reload();
        if (updated) setSelected(theme.theme_id);
        if (parsed.renderer_pack && !packsData?.packs.some(p => p.pack_id === parsed.renderer_pack)) {
          setError(`Theme imported. Referenced renderer pack "${parsed.renderer_pack}" is not installed - upload the pack JS via the Renderer Pack card.`);
        }
      };
      if (parsed.renderer_pack) { requireConsent(doImport); }
      else { await doImport(); }
    } catch (err) {
      setError(String(err));
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSave = async () => {
    if (!selectedTheme || selectedTheme.is_bundled || !dirty || jsonError) return;
    const doSave = async () => {
      setSaving(true);
      try {
        const parsed = JSON.parse(editedJson);
        await api.themes.update(selectedTheme.theme_id, {
          name: parsed.name ?? selectedTheme.name,
          author: parsed.author ?? selectedTheme.author,
          version: parsed.version ?? selectedTheme.version,
          variables: parsed.variables,
          dark_variables: parsed.dark_variables ?? {},
          renderer_pack: parsed.renderer_pack ?? "",
        });
        setDirty(false);
        setParsedVars(null);
        setParsedDarkVars(null);
        await reload();
      } catch (e) { setError(String(e)); }
      setSaving(false);
    };
    try {
      const parsed = JSON.parse(editedJson);
      if (parsed.renderer_pack && !selectedTheme.renderer_pack) {
        requireConsent(doSave);
      } else {
        await doSave();
      }
    } catch { await doSave(); }
  };

  const handleCancel = () => {
    if (!selectedTheme) return;
    const obj: Record<string, unknown> = {
      name: selectedTheme.name,
      author: selectedTheme.author,
      version: selectedTheme.version,
      harvest_version: selectedTheme.harvest_version,
      variables: selectedTheme.variables,
    };
    if (Object.keys(selectedTheme.dark_variables).length > 0) {
      obj.dark_variables = selectedTheme.dark_variables;
    }
    if (selectedTheme.renderer_pack) {
      obj.renderer_pack = selectedTheme.renderer_pack;
    }
    setEditedJson(JSON.stringify(obj, null, 2));
    setDirty(false);
    setJsonError(null);
    setParsedVars(null);
    setParsedDarkVars(null);
  };

  const handleNameBlur = async (newName: string) => {
    if (!selectedTheme || selectedTheme.is_bundled) return;
    const trimmed = newName.trim();
    if (!trimmed || trimmed === selectedTheme.name) return;
    try {
      await api.themes.update(selectedTheme.theme_id, { name: trimmed });
      await reload();
    } catch (e) { setError(String(e)); }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTheme || selectedTheme.is_bundled) return;
    try {
      await api.themes.uploadThumbnail(selectedTheme.theme_id, file);
      setThumbKey(k => k + 1);
      await reload();
    } catch (err) { setError(String(err)); }
    if (thumbRef.current) thumbRef.current.value = "";
  };

  const handleThumbnailDelete = async () => {
    if (!selectedTheme || selectedTheme.is_bundled) return;
    try {
      await api.themes.deleteThumbnail(selectedTheme.theme_id);
      setThumbKey(k => k + 1);
      await reload();
    } catch (err) { setError(String(err)); }
  };

  // Preview vars: use edited JSON if dirty, otherwise theme data
  const previewVars = parsedVars ?? selectedTheme?.variables ?? {};
  const previewDarkVars = parsedDarkVars ?? selectedTheme?.dark_variables ?? {};

  const jsonCopy = useCopy(editedJson);

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 64 }}>
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="content-narrow col" style={{ gap: 18 }}>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Horizontal theme strip */}
      <Card>
        <div className="theme-strip">
          {themes.map(t => (
            <button
              key={t.theme_id}
              className={`theme-strip-item${selected === t.theme_id ? " selected" : ""}`}
              onClick={() => setSelected(t.theme_id)}
            >
              {thumbUrls[t.theme_id] && (
                <img
                  className="theme-strip-thumb"
                  src={thumbUrls[t.theme_id]}
                  alt={t.name}
                  draggable={false}
                />
              )}
              <span className="theme-strip-name">{t.name}</span>
              <div className="theme-strip-meta">
                {t.is_bundled && <span className="badge badge-muted">System</span>}
                {t.renderer_pack && <span className="badge badge-accent">Pack</span>}
                <span className="muted" style={{ fontSize: 11 }}>{usageForTheme(t.theme_id)} widget{usageForTheme(t.theme_id) !== 1 ? "s" : ""}</span>
              </div>
            </button>
          ))}
          <button className="theme-strip-item theme-strip-add" onClick={handleCreate}>
            <Icon name="plus" size={18} />
            <span style={{ fontSize: 12 }}>New Theme</span>
          </button>
          <button className="theme-strip-item theme-strip-add" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={18} />
            <span style={{ fontSize: 12 }}>Import</span>
          </button>
          <button className="theme-strip-item theme-strip-add" onClick={handleReload} disabled={reloading}>
            {reloading ? <Spinner size={18} /> : <Icon name="refresh" size={18} />}
            <span style={{ fontSize: 12 }}>{reloading ? "Reloading..." : "Reload"}</span>
          </button>
          <input ref={fileRef} type="file" accept=".json" style={{ display: "none" }} onChange={handleImport} />
          <input ref={thumbRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: "none" }} onChange={handleThumbnailUpload} />
        </div>
      </Card>

      {selectedTheme && (
        <>
          {/* Info card */}
          <Card
            title="Theme Info"
            action={
              <div className="row" style={{ gap: 6 }}>
                <button className="btn btn-sm" onClick={handleDuplicate}>
                  <Icon name="copy" size={13} /> Duplicate
                </button>
                <button className="btn btn-sm" onClick={handleExport}>
                  <Icon name="download" size={13} /> Export
                </button>
                {!selectedTheme.is_bundled && (
                  <button className="btn btn-sm btn-danger" onClick={() => setConfirmDelete(true)}>
                    <Icon name="trash" size={13} /> Delete
                  </button>
                )}
              </div>
            }
          >
            <div className="col" style={{ gap: 12 }}>
              <div className="row" style={{ gap: 8, alignItems: "center" }}>
                {selectedTheme.is_bundled ? (
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{selectedTheme.name}</span>
                ) : (
                  <input
                    className="input"
                    defaultValue={selectedTheme.name}
                    style={{ fontSize: 16, fontWeight: 600, flex: 1 }}
                    onBlur={e => handleNameBlur(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                  />
                )}
              </div>

              {selectedTheme.author && (
                <div className="muted" style={{ fontSize: 12 }}>Author: {selectedTheme.author}</div>
              )}
              {selectedTheme.version && (
                <div className="muted" style={{ fontSize: 12 }}>Version: {selectedTheme.version}</div>
              )}

              {!selectedTheme.is_bundled && (
                <div className="row" style={{ gap: 6, alignItems: "center" }}>
                  <button className="btn btn-sm" onClick={() => thumbRef.current?.click()}>
                    <Icon name="upload" size={13} /> {selectedTheme.has_thumbnail ? "Replace Thumbnail" : "Upload Thumbnail"}
                  </button>
                  {selectedTheme.has_thumbnail && (
                    <button className="btn btn-sm" onClick={handleThumbnailDelete}>
                      <Icon name="trash" size={13} /> Remove
                    </button>
                  )}
                </div>
              )}

              {widgetsUsingTheme(selectedTheme.theme_id).length > 0 && (
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Used by</div>
                  <div className="col" style={{ gap: 2 }}>
                    {widgetsUsingTheme(selectedTheme.theme_id).map(tk => (
                      <button key={tk.token_id} className="btn btn-ghost btn-sm" style={{ justifyContent: "flex-start" }} onClick={() => onSelectToken(tk.token_id)}>
                        {tk.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Preview card */}
          <Card title="Preview">
            <WidgetPreview variables={previewVars} darkVariables={previewDarkVars} packId={selectedTheme?.renderer_pack || undefined} />
          </Card>

          {/* Code card */}
          <Card
            title="Theme JSON"
            action={
              <button className={`btn btn-ghost btn-sm${jsonCopy.copied ? " btn-success" : ""}`} onClick={jsonCopy.copy}>
                <Icon name="copy" size={13} /> {jsonCopy.copied ? "Copied" : "Copy"}
              </button>
            }
          >
            <div className="col" style={{ gap: 8 }}>
              <textarea
                className={`theme-code-textarea${jsonError ? " error" : ""}`}
                value={editedJson}
                onChange={e => handleJsonChange(e.target.value)}
                readOnly={selectedTheme.is_bundled}
                spellCheck={false}
              />
              {jsonError && <div className="theme-code-error">{jsonError}</div>}
              {!selectedTheme.is_bundled && (
                <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
                  <button className="btn btn-sm" onClick={handleCancel} disabled={!dirty}>Cancel</button>
                  <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={!dirty || !!jsonError || saving}>
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Renderer Pack card */}
          {selectedTheme.renderer_pack && selectedPack && (
            <Card title="Renderer Pack">
              <div className="col" style={{ gap: 10 }}>
                <div className="row" style={{ gap: 8, alignItems: "center" }}>
                  <strong>{selectedPack.name}</strong>
                  {selectedPack.is_bundled && <span className="badge badge-muted">Bundled</span>}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  v{selectedPack.version} by {selectedPack.author}
                </div>
                {selectedPack.description && (
                  <div className="muted" style={{ fontSize: 12 }}>{selectedPack.description}</div>
                )}
                {packCode !== null && (
                  <div className="col" style={{ gap: 8, marginTop: 4 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Pack Source</div>
                    <textarea
                      className="theme-code-textarea"
                      value={packCode}
                      onChange={e => { setPackCode(e.target.value); setPackCodeDirty(true); }}
                      readOnly={selectedPack.is_bundled}
                      spellCheck={false}
                      style={{ minHeight: 200 }}
                    />
                    {!selectedPack.is_bundled && (
                      <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
                        <button className="btn btn-sm" onClick={() => {
                          api.packs.getCode(selectedPack.pack_id).then(r => { setPackCode(r.code); setPackCodeDirty(false); }).catch(() => {});
                        }} disabled={!packCodeDirty}>Cancel</button>
                        <button className="btn btn-sm btn-primary" disabled={!packCodeDirty || packCodeSaving} onClick={async () => {
                          setPackCodeSaving(true);
                          try {
                            await api.packs.updateCode(selectedPack.pack_id, packCode);
                            setPackCodeDirty(false);
                          } catch (e) { setError(String(e)); }
                          setPackCodeSaving(false);
                        }}>
                          {packCodeSaving ? "Saving..." : "Save"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {selectedTheme.renderer_pack && !selectedPack && (
            <Card title="Renderer Pack">
              <div className="col" style={{ gap: 8 }}>
                <div className="muted" style={{ fontSize: 13 }}>
                  This theme references renderer pack "{selectedTheme.renderer_pack}" which is not installed.
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {!selectedTheme && !loading && (
        <div className="muted" style={{ textAlign: "center", padding: 32, fontSize: 14 }}>
          Select a theme above to view and edit it.
        </div>
      )}

      {confirmDelete && selectedTheme && (
        <ConfirmDialog
          title="Delete theme"
          message={
            usageForTheme(selectedTheme.theme_id) > 0
              ? `"${selectedTheme.name}" is used by ${usageForTheme(selectedTheme.theme_id)} widget${usageForTheme(selectedTheme.theme_id) !== 1 ? "s" : ""}. They will fall back to the Default theme. Delete anyway?`
              : `Delete "${selectedTheme.name}" permanently?`
          }
          confirmLabel="Delete"
          confirmDestructive
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {showAgree && (
        <div className="overlay" onClick={() => { setShowAgree(false); setAgreeText(""); setPendingAction(null); }}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3 className="dialog-title">Renderer Pack Warning</h3>
            <div className="dialog-body">
              <p>
                This theme includes a renderer pack that executes JavaScript from your HA instance
                inside the widget on the embedding page. Only enable themes with packs you trust.
              </p>
              <p style={{ marginTop: 12 }}>
                Type <strong>AGREE</strong> below to confirm.
              </p>
              <input
                type="text"
                className="input"
                value={agreeText}
                onChange={e => setAgreeText(e.target.value)}
                placeholder="Type AGREE"
                autoFocus
                style={{ marginTop: 8 }}
              />
            </div>
            <div className="dialog-actions">
              <button className="btn btn-ghost" onClick={() => { setShowAgree(false); setAgreeText(""); setPendingAction(null); }}>
                Cancel
              </button>
              <button className="btn btn-primary" disabled={agreeText !== "AGREE"} onClick={confirmAgree}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
