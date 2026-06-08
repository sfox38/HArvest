/**
 * Themes.tsx - Theme management screen.
 *
 * Horizontal theme strip at top, info card, preview card with mock widgets,
 * and JSON code editor. Supports CRUD for custom themes and read-only
 * viewing of bundled system themes.
 */

import { useState, useEffect, useRef, useCallback } from "react";
import type { ThemeDefinition, Token, RenderersResponse } from "../types";
import { api } from "../api";
import { Card, ConfirmDialog, Spinner, ErrorBanner, useThemeThumbs, useDragScroll } from "./Shared";
import { Icon } from "./Icon";
import { WidgetPreview, clearRendererCache } from "./WidgetPreview";

// ---------------------------------------------------------------------------
// Theme URL mapping helpers
// ---------------------------------------------------------------------------

function themeUrlToId(themeUrl: string): string {
  if (!themeUrl) return "default";
  if (themeUrl.startsWith("bundled:")) return themeUrl.slice(8);
  if (themeUrl.startsWith("user:")) return themeUrl.slice(5);
  return themeUrl;
}

function useDialogFocus(open: boolean, onClose: () => void) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  const previousFocus = useRef<HTMLElement | null>(null);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open || !dialogRef.current) return;
    const dialog = dialogRef.current;
    const selector = 'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    previousFocus.current = document.activeElement as HTMLElement | null;
    dialog.querySelector<HTMLElement>(selector)?.focus();
    const trap = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(selector));
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
  }, [open]);
  return dialogRef;
}

// ---------------------------------------------------------------------------
// Clipboard hook
// ---------------------------------------------------------------------------

function useCopy(text: string) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(() => {
    const fallback = () => {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
      document.body.appendChild(el);
      el.select();
      try { document.execCommand("copy"); } catch { /* */ }
      document.body.removeChild(el);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(fallback);
    } else {
      fallback();
    }
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
  const themeStripRef = useDragScroll<HTMLDivElement>();

  // Code editor state
  const [editedJson, setEditedJson] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsedVars, setParsedVars] = useState<Record<string, string> | null>(null);
  const [parsedDarkVars, setParsedDarkVars] = useState<Record<string, string> | null>(null);

  // Code editor visibility (hidden by default, auto-shown for new themes)
  const [showCodeEditors, setShowCodeEditors] = useState(false);

  // Renderer state
  const [renderersData, setRenderersData] = useState<RenderersResponse | null>(null);
  const [rendererCode, setRendererCode] = useState<string | null>(null);
  const [rendererCodeDirty, setRendererCodeDirty] = useState(false);
  const [rendererCodeSaving, setRendererCodeSaving] = useState(false);
  const [showAgree, setShowAgree] = useState(false);
  const [agreeText, setAgreeText] = useState("");
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);


  // Renderer upload reminder (shown after importing a theme with has_renderer)
  const [showRendererReminder, setShowRendererReminder] = useState(false);

  // Incremented after a renderer JS is uploaded to force the widget preview to remount
  const [previewKey, setPreviewKey] = useState(0);

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Overwrite confirm (when importing a zip whose name already exists)
  const [overwriteConflict, setOverwriteConflict] = useState<{ name: string; theme_id: string } | null>(null);
  const [pendingOverwriteFile, setPendingOverwriteFile] = useState<File | null>(null);

  // Thumbnail state
  const [thumbKey, setThumbKey] = useState(0);
  const thumbUrls = useThemeThumbs(themes, thumbKey);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const rendererJsRef = useRef<HTMLInputElement>(null);
  const closeRendererReminder = () => setShowRendererReminder(false);
  const closeAgree = () => {
    setShowAgree(false);
    setAgreeText("");
    setPendingAction(null);
  };
  const rendererReminderDialogRef = useDialogFocus(showRendererReminder, closeRendererReminder);
  const agreeDialogRef = useDialogFocus(showAgree, closeAgree);

  const reload = useCallback(async () => {
    // allSettled: themes is the primary content; tokens is only used for
    // "in use" badge counts. A tokens-list failure should not blank the page.
    const [t, tk] = await Promise.allSettled([api.themes.list(), api.tokens.list()]);
    if (t.status === "fulfilled") setThemes(t.value);
    if (tk.status === "fulfilled") setTokens(tk.value);

    setLoading(false);

    if (t.status === "rejected") {
      // Without themes there is nothing useful to show.
      setError(String(t.reason));
      return null;
    }
    if (tk.status === "rejected") {
      // Themes loaded but tokens did not. Page renders without in-use badges.
      console.warn("[HArvest panel] themes reload: tokens list failed:", tk.reason);
    }
    return t.value;
  }, []);

  useEffect(() => { reload(); }, [reload]);
  useEffect(() => { api.renderers.list().then(setRenderersData).catch(() => {}); }, []);

  const selectedTheme = themes.find(t => t.theme_id === selected) ?? null;
  const rendererId = selectedTheme?.has_renderer ? selectedTheme.theme_id : null;
  const selectedRenderer = rendererId
    ? renderersData?.renderers.find(r => r.renderer_id === rendererId) ?? null
    : null;

  useEffect(() => {
    if (!rendererId) { setRendererCode(null); setRendererCodeDirty(false); return; }
    api.renderers.getCode(rendererId).then(r => setRendererCode(r.code)).catch(() => setRendererCode(null));
    setRendererCodeDirty(false);
  }, [rendererId]);

  const requireConsent = (action: () => Promise<void>) => {
    // The AGREE dialog (rendered later in this file as role="dialog"
    // aria-modal="true" with a backdrop) blocks UI interaction while shown,
    // so the captured `action` closure cannot race against changes to
    // `selectedTheme` or `editedJson` during the consent window. If a future
    // change adds a periodic refresh or other background mutation of the
    // Themes screen, this assumption breaks and `action` should be replaced
    // with an intent (themeId + action type) re-resolved inside confirmAgree.
    if (renderersData?.agreed) { action(); return; }
    setPendingAction(() => action);
    setShowAgree(true);
  };

  const confirmAgree = async () => {
    try {
      await api.renderers.agree(true);
      setRenderersData(prev => prev ? { ...prev, agreed: true } : prev);
      setShowAgree(false);
      setAgreeText("");
      if (pendingAction) { await pendingAction(); setPendingAction(null); }
    } catch (e) {
      setError(String(e));
      // Drop the pending action if the AGREE call itself failed; the user
      // must re-trigger to start a fresh consent flow.
      setPendingAction(null);
    }
  };

  // When selection changes, sync the code editor and hide editors by default
  useEffect(() => {
    setShowCodeEditors(false);
    if (!selectedTheme) { setEditedJson(""); setDirty(false); setJsonError(null); setParsedVars(null); setParsedDarkVars(null); return; }
    const obj: Record<string, unknown> = {
      name: selectedTheme.name,
      author: selectedTheme.author,
      version: selectedTheme.version,
      harvest_version: selectedTheme.harvest_version,
    };
    if (selectedTheme.has_renderer) {
      obj.has_renderer = true;
    }
    if (selectedTheme.capabilities) {
      obj.capabilities = selectedTheme.capabilities;
    }
    if (selectedTheme.renderer_settings?.length) {
      obj.renderer_settings = selectedTheme.renderer_settings;
    }
    obj.variables = selectedTheme.variables;
    if (Object.keys(selectedTheme.dark_variables).length > 0) {
      obj.dark_variables = selectedTheme.dark_variables;
    }
    setEditedJson(JSON.stringify(obj, null, 2));
    setDirty(false);
    setJsonError(null);
    setParsedVars(null);
    setParsedDarkVars(null);
  }, [selected, selectedTheme?.name, selectedTheme?.author, selectedTheme?.version]);

  // Validate a theme name: 1-64 chars, only letters/digits/spaces/hyphens/underscores/parens/apostrophes/periods
  const _NAME_RE = /^[a-zA-Z0-9 \-_'().]+$/;
  const validateThemeName = (name: string): string | null => {
    const t = name.trim();
    if (!t) return "Theme name cannot be empty.";
    if (t.length > 64) return "Theme name must be 64 characters or fewer.";
    if (!_NAME_RE.test(t)) return "Theme name may only contain letters, numbers, spaces, hyphens, underscores, apostrophes, parentheses, and periods.";
    return null;
  };

  // Returns a name that doesn't conflict with any existing theme name
  const uniqueThemeName = (base: string): string => {
    const stripped = base.replace(/\(\d+\)$/, "").trimEnd();
    if (!themes.some(t => t.name.toLowerCase() === stripped.toLowerCase())) return stripped;
    let i = 1;
    while (themes.some(t => t.name.toLowerCase() === `${stripped}(${i})`.toLowerCase())) i++;
    return `${stripped}(${i})`;
  };

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
        name: uniqueThemeName("New Theme"),
        author: "",
        version: "1.0",
        variables: themes.find(t => t.theme_id === "default")?.variables ?? {},
        dark_variables: themes.find(t => t.theme_id === "default")?.dark_variables ?? {},
      });
      const updated = await reload();
      if (updated) {
        setSelected(theme.theme_id);
        setShowCodeEditors(true);
      }
    } catch (e) { setError(String(e)); }
  };

  const handleDuplicate = () => {
    if (!selectedTheme) return;
    const doDuplicate = async () => {
      try {
        const theme = await api.themes.create({
          name: uniqueThemeName(selectedTheme.name),
          variables: selectedTheme.variables,
          dark_variables: selectedTheme.dark_variables,
          author: "",
          version: "1.0",
          has_renderer: selectedTheme.has_renderer,
          capabilities: selectedTheme.capabilities ?? undefined,
          renderer_settings: selectedTheme.renderer_settings?.length ? selectedTheme.renderer_settings : undefined,
        });
        if (selectedTheme.has_renderer && selectedTheme.has_renderer_file) {
          try {
            const src = await api.renderers.getCode(selectedTheme.theme_id);
            if (src?.code) await api.renderers.updateCode(theme.theme_id, src.code);
          } catch (_e) { /* renderer copy is best-effort */ }
        }
        const updated = await reload();
        if (updated) {
          setSelected(theme.theme_id);
          const obj: Record<string, unknown> = {
            name: theme.name,
            author: theme.author,
            version: theme.version,
            harvest_version: theme.harvest_version,
          };
          if (theme.has_renderer) obj.has_renderer = true;
          if (theme.capabilities) obj.capabilities = theme.capabilities;
          if (theme.renderer_settings?.length) obj.renderer_settings = theme.renderer_settings;
          obj.variables = theme.variables;
          if (Object.keys(theme.dark_variables ?? {}).length > 0) obj.dark_variables = theme.dark_variables;
          setEditedJson(JSON.stringify(obj, null, 2));
          setDirty(false);
          setJsonError(null);
          setParsedVars(null);
          setParsedDarkVars(null);
        }
      } catch (e) { setError(String(e)); }
    };
    if (selectedTheme.has_renderer) { requireConsent(doDuplicate); }
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

  const handleExport = async () => {
    if (!selectedTheme) return;
    try {
      await api.themes.exportZip(selectedTheme.theme_id);
    } catch (e) {
      setError(String(e));
    }
  };

  const [reloading, setReloading] = useState(false);

  const handleReload = async () => {
    setReloading(true);
    const t0 = Date.now();
    try {
      if (selected) {
        await api.themes.reloadById(selected);
      } else {
        const result = await api.themes.reload();
        if (result?.errors && Object.keys(result.errors).length > 0) {
          const msgs = Object.entries(result.errors).map(([id, err]) => `${id}: ${err}`).join("; ");
          setError(`Theme reload failed for: ${msgs}`);
        }
      }
      if (rendererId) clearRendererCache(rendererId);
      await reload();
      setPreviewKey(k => k + 1);
    } catch (e) { setError(String(e)); }
    const elapsed = Date.now() - t0;
    if (elapsed < 500) await new Promise(r => setTimeout(r, 500 - elapsed));
    setReloading(false);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const doImport = async () => {
      try {
        const result = await api.themes.importZip(file);
        if ("error" in result && result.error === "renderer_consent_required") {
          requireConsent(doImport);
          return;
        }
        if ("error" in result && result.error === "theme_already_exists") {
          setPendingOverwriteFile(file);
          setOverwriteConflict({ name: result.name, theme_id: result.theme_id });
          return;
        }
        const updated = await reload();
        if (updated) setSelected(result.theme_id);
      } catch (err) {
        setError(String(err));
      }
    };
    await doImport();
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleOverwriteConfirm = async () => {
    const file = pendingOverwriteFile;
    const conflict = overwriteConflict;
    if (!file || !conflict) return;
    setOverwriteConflict(null);
    setPendingOverwriteFile(null);
    const doOverwrite = async () => {
      try {
        const result = await api.themes.importZip(file, true);
        if ("error" in result && result.error === "renderer_consent_required") {
          requireConsent(doOverwrite);
          return;
        }
        if ("error" in result) return;
        await reload();
        setSelected(result.theme_id ?? conflict.theme_id);
        setPreviewKey(k => k + 1);
      } catch (err) {
        setError(String(err));
      }
    };
    await doOverwrite();
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
          has_renderer: !!parsed.has_renderer,
          capabilities: parsed.capabilities ?? null,
          renderer_settings: parsed.renderer_settings ?? [],
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
      if (parsed.has_renderer && !selectedTheme.has_renderer) {
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
    };
    if (selectedTheme.has_renderer) {
      obj.has_renderer = true;
    }
    if (selectedTheme.capabilities) {
      obj.capabilities = selectedTheme.capabilities;
    }
    if (selectedTheme.renderer_settings?.length) {
      obj.renderer_settings = selectedTheme.renderer_settings;
    }
    obj.variables = selectedTheme.variables;
    if (Object.keys(selectedTheme.dark_variables).length > 0) {
      obj.dark_variables = selectedTheme.dark_variables;
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
    const nameErr = validateThemeName(trimmed);
    if (nameErr) { setError(nameErr); return; }
    if (themes.some(t => t.theme_id !== selectedTheme.theme_id && t.name.toLowerCase() === trimmed.toLowerCase())) {
      setError(`A theme named "${trimmed}" already exists.`);
      return;
    }
    try {
      await api.themes.update(selectedTheme.theme_id, { name: trimmed });
      await reload();
    } catch (e) { setError(String(e)); }
  };

  const handleAuthorBlur = async (newAuthor: string) => {
    if (!selectedTheme || selectedTheme.is_bundled) return;
    const trimmed = newAuthor.trim();
    if (trimmed === selectedTheme.author) return;
    try {
      await api.themes.update(selectedTheme.theme_id, { author: trimmed });
      await reload();
    } catch (e) { setError(String(e)); }
  };

  const handleVersionBlur = async (newVersion: string) => {
    if (!selectedTheme || selectedTheme.is_bundled) return;
    const trimmed = newVersion.trim();
    if (!trimmed || trimmed === selectedTheme.version) return;
    try {
      await api.themes.update(selectedTheme.theme_id, { version: trimmed });
      await reload();
    } catch (e) { setError(String(e)); }
  };

  const handleDescriptionBlur = async (newDescription: string) => {
    if (!selectedTheme || selectedTheme.is_bundled) return;
    const trimmed = newDescription.trim();
    if (trimmed === selectedTheme.description) return;
    try {
      await api.themes.update(selectedTheme.theme_id, { description: trimmed });
      await reload();
    } catch (e) { setError(String(e)); }
  };

  const handleRendererJsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTheme?.has_renderer) return;
    const expectedName = `${selectedTheme.name.toLowerCase()}.js`;
    if (file.name.toLowerCase() !== expectedName) {
      setError(`Expected file "${expectedName}" but got "${file.name}". The renderer JS file must match the theme name.`);
      if (rendererJsRef.current) rendererJsRef.current.value = "";
      return;
    }
    try {
      const code = await file.text();
      const rid = selectedTheme.theme_id;
      await api.renderers.updateCode(rid, code);
      const [updated, codeResult] = await Promise.all([
        api.renderers.list(),
        api.renderers.getCode(rid),
      ]);
      setRenderersData(updated);
      setRendererCode(codeResult.code);
      setRendererCodeDirty(false);
      clearRendererCache(rid);
      setPreviewKey(k => k + 1);
      await reload();
    } catch (err) { setError(String(err)); }
    if (rendererJsRef.current) rendererJsRef.current.value = "";
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
  const rendererCodeCopy = useCopy(rendererCode ?? "");

  if (loading) {
    return (
      <div className="center-spinner">
        <Spinner size={40} />
      </div>
    );
  }

  return (
    <div className="content-narrow col" style={{ gap: 18 }}>
      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Theme tray: fixed actions on left, scrollable strip on right */}
      <Card>
        <div className="theme-tray">
          <div className="theme-tray-actions">
            <button className="theme-tray-action" onClick={handleCreate}>
              <Icon name="plus" size={14} /> New Theme
            </button>
            <button className="theme-tray-action" onClick={() => fileRef.current?.click()}>
              <Icon name="upload" size={14} /> Import .zip
            </button>
            <button className="theme-tray-action" onClick={handleReload} disabled={reloading}>
              {reloading ? <Spinner size={14} /> : <Icon name="refresh" size={14} />}
              {reloading ? "Reloading..." : "Reload"}
            </button>
          </div>
          <div ref={themeStripRef} className="theme-strip">
            {themes.map(t => (
              <button
                key={t.theme_id}
                className={`theme-strip-item${selected === t.theme_id ? " selected" : ""}`}
                onClick={() => setSelected(t.theme_id)}
              >
                <div className="theme-thumb-wrap">
                  {thumbUrls[t.theme_id] ? (
                    <img
                      className="theme-strip-thumb"
                      src={thumbUrls[t.theme_id]}
                      alt={t.name}
                      draggable={false}
                    />
                  ) : (
                    <div className="theme-strip-thumb" />
                  )}
                  {t.has_renderer && (
                    <span
                      className={`theme-renderer-star${!t.has_renderer_file ? " renderer-missing" : ""}`}
                      title={t.has_renderer_file ? "Theme includes custom renderers" : "Renderer JS file is missing"}
                    >
                      {t.has_renderer_file ? "★" : "⚠"}
                    </span>
                  )}
                  {t.custom_fonts?.length > 0 && (
                    <span className="theme-font-badge" title={`Custom font: ${t.custom_fonts.map(f => f.family).join(", ")}`}>
                      F
                    </span>
                  )}
                </div>
                <span className="theme-strip-name">{t.name}</span>
                <div className="theme-strip-meta">
                  {t.is_bundled && <span className="badge badge-muted">System</span>}
                  <span className="muted fs-11">{usageForTheme(t.theme_id)} widget{usageForTheme(t.theme_id) !== 1 ? "s" : ""}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".zip" style={{ display: "none" }} onChange={handleImport} />
        <input ref={thumbRef} type="file" accept=".png,.jpg,.jpeg" style={{ display: "none" }} onChange={handleThumbnailUpload} />
        <input ref={rendererJsRef} type="file" accept=".js" style={{ display: "none" }} onChange={handleRendererJsUpload} />
      </Card>

      {selectedTheme && (
        <>
          {/* Info card */}
          <Card
            title="Theme Info"
            action={
              <div className="row" style={{ gap: 6 }}>
                {!selectedTheme.is_bundled && (
                  <button className="btn btn-sm btn-ghost" onClick={() => setShowCodeEditors(v => !v)}>
                    <Icon name={showCodeEditors ? "eye-off" : "code"} size={13} /> {showCodeEditors ? "Hide editor" : "Show editor"}
                  </button>
                )}
                <button className="btn btn-sm" onClick={handleDuplicate}>
                  <Icon name="copy" size={13} /> Duplicate
                </button>
                <button className="btn btn-sm" onClick={handleExport}>
                  <Icon name="download" size={13} /> Export .zip
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

              {selectedTheme.is_bundled ? (
                <>
                  {selectedTheme.author && (
                    <div className="muted fs-12">Author: {selectedTheme.author}</div>
                  )}
                  {selectedTheme.version && (
                    <div className="muted fs-12">Version: {selectedTheme.version}</div>
                  )}
                  {selectedTheme.description && (
                    <div className="muted fs-12" style={{ fontStyle: "italic" }}>{selectedTheme.description}</div>
                  )}
                </>
              ) : (
                <>
                  <div className="row gap-8">
                    <input
                      className="input"
                      defaultValue={selectedTheme.author}
                      key={`author-${selectedTheme.theme_id}`}
                      placeholder="Author"
                      style={{ flex: 1, fontSize: 12 }}
                      onBlur={e => handleAuthorBlur(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                    />
                    <input
                      className="input"
                      defaultValue={selectedTheme.version}
                      key={`version-${selectedTheme.theme_id}`}
                      placeholder="Version"
                      style={{ width: 80, fontSize: 12 }}
                      onBlur={e => handleVersionBlur(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                    />
                  </div>
                  <input
                    className="input"
                    defaultValue={selectedTheme.description}
                    key={`desc-${selectedTheme.theme_id}`}
                    placeholder="Description (optional)"
                    style={{ fontSize: 12 }}
                    onBlur={e => handleDescriptionBlur(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                  />
                </>
              )}

              {selectedTheme.custom_fonts?.length > 0 && (
                <div className="row" style={{ gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                  <span className="badge badge-accent">Bundled Font</span>
                  <span className="muted fs-12">{selectedTheme.custom_fonts.map(f => f.family).join(", ")}</span>
                </div>
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
            <WidgetPreview key={`preview-${selected}-${previewKey}`} variables={previewVars} darkVariables={previewDarkVars} rendererId={rendererId || undefined} />
          </Card>

          {showCodeEditors && (
            <>
              {/* Theme JSON editor */}
              <Card
                title="Theme JSON"
                action={
                  <button className={`btn btn-ghost btn-sm${jsonCopy.copied ? " btn-success" : ""}`} onClick={jsonCopy.copy}>
                    <Icon name="copy" size={13} /> {jsonCopy.copied ? "Copied" : "Copy"}
                  </button>
                }
              >
                <div className="col gap-8">
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

              {/* Renderer card - bundled renderer */}
              {rendererId && selectedRenderer && (
                <Card title="Renderer">
                  <div className="col" style={{ gap: 10 }}>
                    <div className="row" style={{ gap: 8, alignItems: "center" }}>
                      <strong>{selectedRenderer.name}</strong>
                      {selectedRenderer.is_bundled && <span className="badge badge-muted">Bundled</span>}
                    </div>
                    {selectedRenderer.description && (
                      <div className="muted fs-12">{selectedRenderer.description}</div>
                    )}
                    {rendererCode !== null && (
                      <div className="col" style={{ gap: 8, marginTop: 4 }}>
                        <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                          <div className="label-strong">Renderer Source</div>
                          <button className={`btn btn-ghost btn-sm${rendererCodeCopy.copied ? " btn-success" : ""}`} onClick={rendererCodeCopy.copy}>
                            <Icon name="copy" size={13} /> {rendererCodeCopy.copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <textarea
                          className="theme-code-textarea"
                          value={rendererCode}
                          readOnly
                          spellCheck={false}
                          style={{ minHeight: 200 }}
                        />
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Renderer card - user renderer with code loaded */}
              {rendererId && !selectedRenderer && rendererCode !== null && (
                <Card title="Renderer">
                  <div className="col" style={{ gap: 10 }}>
                    <div className="col gap-8">
                      <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                        <div className="label-strong">Renderer Source</div>
                        <button className={`btn btn-ghost btn-sm${rendererCodeCopy.copied ? " btn-success" : ""}`} onClick={rendererCodeCopy.copy}>
                          <Icon name="copy" size={13} /> {rendererCodeCopy.copied ? "Copied" : "Copy"}
                        </button>
                      </div>
                      <textarea
                        className="theme-code-textarea"
                        value={rendererCode}
                        onChange={e => { setRendererCode(e.target.value); setRendererCodeDirty(true); }}
                        readOnly={selectedTheme.is_bundled}
                        spellCheck={false}
                        style={{ minHeight: 200 }}
                      />
                      {!selectedTheme.is_bundled && (
                        <div className="row" style={{ gap: 8, justifyContent: "flex-end" }}>
                          <button className="btn btn-sm" onClick={() => {
                            if (rendererId) api.renderers.getCode(rendererId).then(r => { setRendererCode(r.code); setRendererCodeDirty(false); }).catch(() => {});
                          }} disabled={!rendererCodeDirty}>Cancel</button>
                          <button className="btn btn-sm btn-primary" disabled={!rendererCodeDirty || rendererCodeSaving} onClick={async () => {
                            if (!rendererId) return;
                            setRendererCodeSaving(true);
                            try {
                              await api.renderers.updateCode(rendererId, rendererCode);
                              setRendererCodeDirty(false);
                            } catch (e) { setError(String(e)); }
                            setRendererCodeSaving(false);
                          }}>
                            {rendererCodeSaving ? "Saving..." : "Save"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

              {/* Renderer card - renderer JS not yet uploaded */}
              {rendererId && !selectedRenderer && rendererCode === null && (
                <Card title="Renderer">
                  <div className="col" style={{ gap: 10 }}>
                    <div className="muted fs-13">
                      This theme includes a custom renderer but the JS file is not installed yet.
                    </div>
                    <div className="fs-12">Upload <code>{selectedTheme.name.toLowerCase()}.js</code> to enable it.</div>
                    <button className="btn btn-sm btn-primary" style={{ alignSelf: "flex-start" }} onClick={() => rendererJsRef.current?.click()}>
                      <Icon name="upload" size={13} /> Upload Renderer JS
                    </button>
                  </div>
                </Card>
              )}
            </>
          )}
        </>
      )}

      {!selectedTheme && !loading && (
        <div className="muted" style={{ textAlign: "center", padding: 32, fontSize: 14 }}>
          Select a theme above to view and edit it.
        </div>
      )}

      {overwriteConflict && (
        <ConfirmDialog
          title="Theme already exists"
          message={`A theme named "${overwriteConflict.name}" already exists. Overwrite it with the imported version?`}
          confirmLabel="Overwrite"
          onConfirm={handleOverwriteConfirm}
          onCancel={() => { setOverwriteConflict(null); setPendingOverwriteFile(null); }}
        />
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


      {showRendererReminder && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="renderer-remind-title" onClick={closeRendererReminder}>
          <div ref={rendererReminderDialogRef} className="dialog" onClick={e => e.stopPropagation()}>
            <h3 id="renderer-remind-title" className="dialog-title">Upload Renderer</h3>
            <div className="dialog-body">
              <p>
                This theme includes custom renderers. Select the matching <code>.js</code> file to enable them.
              </p>
            </div>
            <div className="dialog-actions">
              <button className="btn" onClick={() => setShowRendererReminder(false)}>
                Skip
              </button>
              <button className="btn btn-primary" autoFocus onClick={() => { setShowRendererReminder(false); setTimeout(() => rendererJsRef.current?.click(), 100); }}>
                Upload JS
              </button>
            </div>
          </div>
        </div>
      )}

      {showAgree && (
        <div className="overlay" role="dialog" aria-modal="true" aria-labelledby="renderer-agree-title" onClick={closeAgree}>
          <div ref={agreeDialogRef} className="dialog" onClick={e => e.stopPropagation()}>
            <h3 id="renderer-agree-title" className="dialog-title">Renderer Warning</h3>
            <div className="dialog-body">
              <p>
                This theme includes custom renderer JavaScript that executes with the embedding
                page's privileges. It can access the page DOM, browser storage, non-HttpOnly
                cookies, and widget credentials. Only enable renderers you fully trust.
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
              <button className="btn btn-ghost" onClick={closeAgree}>
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
