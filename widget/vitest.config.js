/**
 * vitest.config.js - widget test configuration.
 *
 * Tests need a DOM environment because the widget exercises localStorage,
 * MutationObserver, custom elements, document, and window. jsdom is in
 * devDependencies so this only needs to opt-in via the "environment" key.
 */
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
  },
});
