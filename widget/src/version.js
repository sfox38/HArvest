/** Widget identity constants replaced during the bundle build. */

// eslint-disable-next-line no-undef -- placeholders defined by esbuild at build time
const _bundledWidget = typeof __HRV_WIDGET_VERSION__ !== "undefined" ? __HRV_WIDGET_VERSION__ : "0.0.0-dev";
// eslint-disable-next-line no-undef
const _bundledProtocol = typeof __HRV_PROTOCOL_VERSION__ !== "undefined" ? __HRV_PROTOCOL_VERSION__ : 1;

export const WIDGET_VERSION = _bundledWidget;
export const PROTOCOL_VERSION = _bundledProtocol;
