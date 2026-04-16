/**
 * vitest.config.js - Vitest configuration for the HArvest widget test suite.
 *
 * Uses jsdom environment so browser globals (localStorage, navigator, WebSocket)
 * are available without a real browser. Tests live in widget/tests/.
 */

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
  },
});
