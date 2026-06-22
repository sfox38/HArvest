/**
 * types.ts - Shared TypeScript types for the HArvest panel frontend.
 * Mirrors the data models defined in api-internal.md and SPEC.md.
 */

// ---------------------------------------------------------------------------
// Token
// ---------------------------------------------------------------------------

export interface OriginConfig {
  allow_any: boolean;
  allowed: string[];
  allow_paths: string[];
}

export interface RateLimitConfig {
  override_defaults: boolean;
  max_push_per_second: number | null;
  max_commands_per_minute: number | null;
}

export interface SessionConfig {
  lifetime_minutes: number;
  max_lifetime_minutes: number;
  max_renewals: number | null;
  absolute_lifetime_hours: number | null;
}

export interface ActiveScheduleWindow {
  days: string[]; // "mon", "tue", "wed", "thu", "fri", "sat", "sun"
  start: string;  // "HH:MM"
  end: string;    // "HH:MM"
}

export interface ActiveSchedule {
  timezone: string;
  windows: ActiveScheduleWindow[];
}

export interface GestureAction {
  action: string;
  entity_id?: string;
  data?: Record<string, unknown>;
}

export interface GestureConfig {
  tap?: GestureAction | null;
  hold?: GestureAction | null;
  double_tap?: GestureAction | null;
}

export interface EntityAccess {
  entity_id: string;
  alias: string | null;
  capabilities: "badge" | "read" | "read-write";
  exclude_attributes: string[];
  companion_of: string | null;
  gesture_config: GestureConfig;
  name_override: string | null;
  icon_override: string | null;
  color_scheme: "auto" | "light" | "dark";
  display_hints: Record<string, unknown>;
  service_data?: Record<string, unknown>;
}

export type TokenStatus = "active" | "inactive" | "expiring_soon" | "expired" | "revoked";

export interface Token {
  token_id: string;
  token_version: number;
  created_at: string;
  created_by: string;
  created_by_name?: string | null;
  label: string;
  expires: string | null;
  token_secret: boolean; // true when HMAC is enabled; plaintext never returned
  origins: OriginConfig;
  entities: EntityAccess[];
  rate_limits: RateLimitConfig;
  session: SessionConfig;
  max_sessions: number | null;
  active_schedule: ActiveSchedule | null;
  allowed_ips: string[];
  status: TokenStatus;
  active_sessions: number;
  paused: boolean;
  embed_mode: "single" | "group" | "page";
  entities_block: boolean;
  block_label: string | null;
  block_icon: string | null;
  block_show_label: boolean;
  block_highlight_rows: boolean;
  block_show_icons: boolean;
  block_widget_border: string | null;
  block_access_mode: "override" | "per_entity";
  block_color_mode: "override" | "per_entity";
  theme_url: string;
  renderer_pack: string;
  lang: string;
  a11y: "standard" | "enhanced";
  /** Brief vibration on control tap (Android touch devices only). */
  haptics: boolean;
  color_scheme: "auto" | "light" | "dark";
  /** Global icon set ("fa", "ph-duotone", ...); null follows the theme's icon_set. */
  icon_set: string | null;
  custom_messages: boolean;
  on_offline: "dim" | "hide" | "message" | "last-state";
  on_error: "dim" | "hide" | "message";
  offline_text: string;
  error_text: string;
}

// ---------------------------------------------------------------------------
// Session
// ---------------------------------------------------------------------------

export interface Session {
  session_id: string;
  widget_token_id: string;
  issued_at: string;
  expires_at: string;
  absolute_expires_at: string | null;
  origin: string;
  referer: string | null;
  ip_address: string | null;
  renewal_count: number;
  subscribed_entity_ids: string[];
  // Compatibility-handshake fields (SPEC.md Section 12). Optional in the
  // type so old serializer responses don't break tsc; the panel's drift
  // banner ignores sessions that lack these fields (treats as "ok").
  client?: {
    protocol: number;
    widget: string | null;
    source: "wp" | "html" | "panel" | "unknown";
    source_version: string | null;
  };
  compatibility?: "ok" | "client_outdated" | "server_outdated";
}

// ---------------------------------------------------------------------------
// Warnings (drift-banner dismissal state) - SPEC.md Section 12
// ---------------------------------------------------------------------------

export interface WarningsState {
  current_version: string;
  dismissed_at_version: string | null;
  dismissed: boolean;
}

// ---------------------------------------------------------------------------
// URL reachability probe (mirror of WP plugin's AJAX check)
// ---------------------------------------------------------------------------

export type UrlCheckReason = "reachable" | "unreachable" | "relative" | "invalid";

export interface UrlCheckResult {
  ok: boolean;
  status: number;
  reason: UrlCheckReason;
  message: string;
}

// ---------------------------------------------------------------------------
// Activity log
// ---------------------------------------------------------------------------

export type ActivityEventType =
  | "AUTH_OK"
  | "AUTH_FAIL"
  | "COMMAND"
  | "SESSION_END"
  | "TOKEN_CREATED"
  | "TOKEN_REVOKED"
  | "TOKEN_DELETED"
  | "RENEWAL"
  | "SUSPICIOUS_ORIGIN"
  | "FLOOD_PROTECTION"
  | "RATE_LIMITED"
  | "ERROR"
  | "SERVER_STARTED"
  | "SERVER_STOPPED";

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  timestamp: string;
  token_id: string | null;
  token_label: string | null;
  session_id: string | null;
  origin: string | null;
  referer: string | null;
  entity_id: string | null;
  action: string | null;
  code: string | null;
  message: string | null;
}

export interface ActivityPage {
  total: number;
  offset: number;
  limit: number;
  events: ActivityEvent[];
}

// ---------------------------------------------------------------------------
// Theme
// ---------------------------------------------------------------------------

export interface ThemeCapabilities {
  fan?: { display_modes?: string[] };
  input_number?: { display_modes?: string[] };
  input_select?: { display_modes?: string[] };
  select?: { display_modes?: string[] };
  light?: { features?: string[] };
  climate?: { features?: string[] };
  cover?: { features?: string[] };
  media_player?: { features?: string[] };
}

export interface ThemeDefinition {
  theme_id: string;
  name: string;
  author: string;
  version: string;
  description: string;
  harvest_version: number;
  variables: Record<string, string>;
  dark_variables: Record<string, string>;
  has_renderer: boolean;
  has_renderer_file: boolean;
  is_bundled: boolean;
  has_thumbnail: boolean;
  custom_fonts: { family: string; url: string; weight?: string; style?: string }[];
  usage_count: number;
  created_by: string;
  created_at: string;
  capabilities: ThemeCapabilities | null;
  renderer_settings: string[];
  /** Theme-level icon set ("fa", "ph-thin", ...); null means MDI. */
  icon_set: string | null;
}

/** A theme .zip published in the HArvest GitHub "User Contributed Themes" dir. */
export interface GithubTheme {
  name: string;
  size: number;
  download_url: string;
}

// ---------------------------------------------------------------------------
// Renderers
// ---------------------------------------------------------------------------

export interface RendererDefinition {
  renderer_id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  is_bundled: boolean;
}

export interface RenderersResponse {
  agreed: boolean;
  renderers: RendererDefinition[];
}

// ---------------------------------------------------------------------------
// Integration config (Settings)
// ---------------------------------------------------------------------------

export interface HaEventBusConfig {
  harvest_token_revoked: boolean;
  harvest_suspicious_origin: boolean;
  harvest_session_limit_reached: boolean;
  harvest_flood_protection: boolean;
  harvest_session_connected: boolean;
  harvest_auth_failure: boolean;
}

export interface CustomDomainEntry {
  domain: string;
  allowed_services: string[];
}

export interface DomainServicesResponse {
  domain: string;
  services: { service: string }[];
}

export interface AvailableDomain {
  domain: string;
  has_services: boolean;
  services: string[];
}

export interface ServiceFieldSelector {
  number?: { min?: number; max?: number; step?: number; unit_of_measurement?: string; mode?: string };
  boolean?: Record<string, unknown>;
  text?: { multiline?: boolean; type?: string; suffix?: string; prefix?: string } | null;
  select?: { options?: (string | { value: string; label: string })[]; translation_key?: string };
  color_rgb?: Record<string, unknown>;
  color_temp?: { unit?: string; min?: number; max?: number };
  object?: Record<string, unknown>;
  constant?: { value: unknown; label?: string };
  state?: Record<string, unknown>;
  entity?: { domain?: string | string[]; integration?: string; device_class?: string | string[] } | null;
  target?: { entity?: { domain?: string | string[] }; device?: Record<string, unknown> } | null;
  time?: Record<string, unknown> | null;
  date?: Record<string, unknown> | null;
  datetime?: Record<string, unknown> | null;
  template?: Record<string, unknown> | null;
  area?: Record<string, unknown> | null;
  floor?: Record<string, unknown> | null;
  device?: Record<string, unknown> | null;
  label?: Record<string, unknown> | null;
  attribute?: { entity_id?: string } | null;
  location?: Record<string, unknown> | null;
  duration?: { enable_day?: boolean; enable_millisecond?: boolean } | null;
}

export interface ServiceFieldSchema {
  name?: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  example?: unknown;
  selector?: ServiceFieldSelector;
  advanced?: boolean;
  filter?: Record<string, unknown>;
  fields?: Record<string, ServiceFieldSchema>;
  collapsed?: boolean;
}

export interface ServiceDescription {
  domain: string;
  service: string;
  name: string;
  description: string;
  fields: Record<string, ServiceFieldSchema>;
}

export interface IntegrationConfig {
  auth_timeout_seconds: number;
  entity_hard_cap: number;
  keepalive_interval_seconds: number;
  keepalive_timeout_seconds: number;
  heartbeat_timeout_seconds: number;
  activity_log_retention_days: number;
  absolute_session_lifetime_hours: number;
  max_auth_attempts_per_token_per_minute: number;
  max_auth_attempts_per_ip_per_minute: number;
  override_host: string;
  widget_script_url: string;
  external_port: number;
  trusted_proxies: string[];
  kill_switch: boolean;
  default_lang: string;
  default_a11y: "standard" | "enhanced";
  default_on_offline: "dim" | "hide" | "message" | "last-state";
  default_on_error: "dim" | "hide" | "message";
  default_offline_text: string;
  default_error_text: string;
  default_session: {
    lifetime_minutes: number;
    max_lifetime_minutes: number;
  };
  ha_event_bus: HaEventBusConfig;
  custom_domains: CustomDomainEntry[];
  available_domains?: AvailableDomain[];
  sensitive_domains: Record<string, boolean>;
  platform_version?: string;
}

// ---------------------------------------------------------------------------
// Diagnostic stats
// ---------------------------------------------------------------------------

export interface PanelStats {
  active_sessions: number;
  active_tokens: number;
  commands_today: number;
  errors_today: number;
  db_size_bytes: number;
  is_running: boolean;
}

// ---------------------------------------------------------------------------
// Activity aggregates (for graphs)
// ---------------------------------------------------------------------------

export interface HourlyBucket {
  hour: string; // ISO datetime, truncated to hour
  commands: number;
  sessions: number;
  auth_failures: number;
}

// ---------------------------------------------------------------------------
// HA entity (entity picker cache)
// ---------------------------------------------------------------------------

export interface HAEntity {
  entity_id: string;
  friendly_name: string;
  domain: string;
  state: string;
  /** MDI icon the widget card shows by default (resolved server-side).
      Absent on entries built from raw HA states (api.ha.statesByDomain). */
  icon?: string;
}

export interface HAEntityDetail {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface HARegistries {
  areas: { id: string; name: string; floor_id: string | null }[];
  floors: { id: string; name: string; level: number | null }[];
  devices: { id: string; name: string; area_id: string | null }[];
  labels: { id: string; name: string }[];
}

// ---------------------------------------------------------------------------
// Panel navigation
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Shared constants
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Shared validation
// ---------------------------------------------------------------------------

export const LABEL_ILLEGAL = /[\x00-\x1f<>"&]/;

export function validateLabel(label: string, otherLabels: string[]): string | null {
  const t = label.trim();
  if (!t) return "Name is required.";
  if (t.length > 100) return "Name must be 100 characters or fewer.";
  if (LABEL_ILLEGAL.test(t)) return "Name contains invalid characters.";
  if (otherLabels.some(l => l.trim().toLowerCase() === t.toLowerCase())) {
    return "A widget with this name already exists.";
  }
  return null;
}

// ---------------------------------------------------------------------------
// API mutation types (token_secret accepts sentinel values, not just boolean)
// ---------------------------------------------------------------------------

export type TokenUpdate = Omit<Partial<Token>, "token_secret"> & {
  token_secret?: "generate" | null;
};

export interface TokenUpdateResponse extends Token {
  generated_secret?: string;
}

// ---------------------------------------------------------------------------
// Panel navigation
// ---------------------------------------------------------------------------

export type Screen = "dashboard" | "widgets" | "themes" | "activity" | "sessions" | "settings";
