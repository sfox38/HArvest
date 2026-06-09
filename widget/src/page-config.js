/**
 * page-config.js - Page-level defaults set by HArvest.config().
 *
 * Stored in its own module so that harvest-client.js can read the page
 * config without creating a circular import with hrv-card.js (hrv-card
 * imports getOrCreateClient from harvest-client).
 *
 * Public exports:
 *   config(options)           - Merge options into the page-level config.
 *   getPageConfig()           - Return the shared page-config object.
 *   onPageConfigChange(fn)    - Subscribe to page-config changes.
 */

const _pageConfig = {};
const _listeners = new Set();

export function config(options) {
  Object.assign(_pageConfig, options);
  for (const listener of [..._listeners]) listener(_pageConfig);
}

export function getPageConfig() {
  return _pageConfig;
}

export function onPageConfigChange(listener) {
  _listeners.add(listener);
  return () => _listeners.delete(listener);
}
