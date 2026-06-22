import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite configuration for the HArvest panel frontend.
//
// Output: a single IIFE bundle at ../custom_components/harvest/panel/panel.js.
// This file is served directly by panel.py via HA's static file registration
// and loaded by the HA frontend as a custom panel script.
//
// The bundle defines the <ha-panel-harvest> custom element that HA instantiates
// when the user navigates to the HArvest sidebar item.
//
// HACS users do not need Node.js or Vite - the compiled panel.js is
// committed to the repository. Contributors developing the panel run:
//   npm install && npm run build

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
  },
  build: {
    outDir: "../custom_components/harvest/panel",
    lib: {
      entry: "src/main.tsx",
      name: "HarvestPanel",
      fileName: () => "panel.js",
      formats: ["iife"],
    },
    rollupOptions: {
      // React is bundled into the output - the HA panel environment does not
      // provide it globally and we must not rely on window.React.
      external: [],
    },
    // Single chunk, no code splitting - HA expects a single file.
    cssCodeSplit: false,
    minify: true,
    sourcemap: false,
  },
  // Development server proxies API calls to a running HA instance.
  // Set VITE_HA_URL in .env.local to your HA URL for local development.
  server: {
    proxy: {
      "/api/harvest": {
        target: process.env.VITE_HA_URL ?? "http://homeassistant.local:8123",
        changeOrigin: true,
      },
    },
  },
});
