/**
 * panelTheme.ts - context exposing the panel's effective light/dark theme.
 *
 * App.tsx computes the effective theme from the HArvest Theme setting
 * (Settings tab: Auto/Light/Dark) with "auto" following HA's dark mode,
 * and provides it here. Preview components consume it so widget previews
 * always match the panel chrome they sit in, regardless of the HA theme
 * or the OS prefers-color-scheme.
 */

import { createContext, useContext } from "react";

export const PanelThemeContext = createContext<"light" | "dark">("light");

export function usePanelDark(): boolean {
  return useContext(PanelThemeContext) === "dark";
}
