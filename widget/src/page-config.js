/**
 * page-config.js - Page-level defaults set by HArvest.config().
 *
 * Stored in its own module so that harvest-client.js can read the page
 * config without creating a circular import with hrv-card.js (hrv-card
 * imports getOrCreateClient from harvest-client).
 *
 * Public exports:
 *   config(options)   - Merge options into the page-level config.
 *   getPageConfig()   - Return the shared page-config object.
 */

const _pageConfig = {};

export function config(options) {
  Object.assign(_pageConfig, options);
}

export function getPageConfig() {
  return _pageConfig;
}
