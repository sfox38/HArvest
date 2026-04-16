/**
 * i18n.js - Internationalisation string lookup with language fallback.
 *
 * Usage:
 *   const i18n = new I18n("auto");  // resolves from navigator.language
 *   const i18n = new I18n("de");    // explicit language code
 *   i18n.t("state.on");             // "An"
 *
 * Fallback chain: requested language -> English -> raw key string.
 *
 * Language codes follow BCP 47 primary subtags (two-letter ISO 639-1).
 * When lang="auto", the primary subtag of navigator.language is used
 * (e.g. "en-US" -> "en", "zh-TW" -> "zh").
 *
 * String keys are dot-separated namespaces:
 *   state.*        - entity state labels
 *   action.*       - user-facing action labels
 *   error.*        - error overlay messages
 *   indicator.*    - status indicator labels
 *   history.*      - history graph labels
 *   unit.*         - measurement unit labels
 *   climate.*      - climate mode labels
 *   cover.*        - cover position labels
 *   media.*        - media player labels
 */

// ---------------------------------------------------------------------------
// String tables
// ---------------------------------------------------------------------------

/**
 * All bundled translations.
 * @type {Record<string, Record<string, string>>}
 */
const STRINGS = {

  // English (canonical / fallback)
  en: {
    "state.on":           "On",
    "state.off":          "Off",
    "state.unavailable":  "Unavailable",
    "state.unknown":      "Unknown",
    "state.open":         "Open",
    "state.closed":       "Closed",
    "state.locked":       "Locked",
    "state.unlocked":     "Unlocked",
    "state.idle":         "Idle",
    "state.triggered":    "Triggered",
    "state.heating":      "Heating",
    "state.cooling":      "Cooling",
    "state.fan_only":     "Fan only",
    "state.dry":          "Dry",
    "state.heat_cool":    "Heat / cool",
    "state.auto":         "Auto",
    "state.playing":      "Playing",
    "state.paused":       "Paused",
    "state.standby":      "Standby",
    "state.buffering":    "Buffering",
    "state.opening":      "Opening",
    "state.closing":      "Closing",
    "state.stopped":      "Stopped",
    "state.home":         "Home",
    "state.not_home":     "Away",
    "action.toggle":      "toggle",
    "action.turn_on":     "turn on",
    "action.turn_off":    "turn off",
    "action.press":       "press",
    "action.currently":   "currently",
    "action.open":        "open",
    "action.close":       "close",
    "action.stop":        "stop",
    "action.play":        "play",
    "action.pause":       "pause",
    "action.next":        "next track",
    "action.previous":    "previous track",
    "action.mute":        "mute",
    "action.unmute":      "unmute",
    "action.increase":    "increase",
    "action.decrease":    "decrease",
    "error.auth_failed":  "Widget unavailable",
    "error.entity_missing": "Device unavailable",
    "error.offline":      "Temporarily offline",
    "error.connecting":   "Connecting...",
    "indicator.stale":    "Last known state",
    "history.unavailable":"No history available",
    "history.hours":      "h",
    "unit.percent":       "%",
    "climate.heat":       "Heat",
    "climate.cool":       "Cool",
    "climate.auto":       "Auto",
    "climate.off":        "Off",
    "climate.fan_only":   "Fan only",
    "climate.dry":        "Dry",
    "climate.heat_cool":  "Heat / cool",
    "cover.open":         "Open",
    "cover.close":        "Close",
    "cover.stop":         "Stop",
    "cover.position":     "Position",
    "media.volume":       "Volume",
    "media.source":       "Source",
  },

  // German
  de: {
    "state.on":           "An",
    "state.off":          "Aus",
    "state.unavailable":  "Nicht verfugbar",
    "state.unknown":      "Unbekannt",
    "state.open":         "Offen",
    "state.closed":       "Geschlossen",
    "state.locked":       "Gesperrt",
    "state.unlocked":     "Entsperrt",
    "state.idle":         "Bereit",
    "state.triggered":    "Ausgelost",
    "state.heating":      "Heizen",
    "state.cooling":      "Kuhlen",
    "state.playing":      "Wiedergabe",
    "state.paused":       "Pausiert",
    "state.standby":      "Bereitschaft",
    "state.opening":      "Offnet",
    "state.closing":      "Schlie\xdft",
    "state.stopped":      "Gestoppt",
    "action.toggle":      "umschalten",
    "action.turn_on":     "einschalten",
    "action.turn_off":    "ausschalten",
    "action.press":       "drucken",
    "action.currently":   "aktuell",
    "action.open":        "offnen",
    "action.close":       "schlie\xdfen",
    "action.stop":        "stoppen",
    "action.play":        "abspielen",
    "action.pause":       "pausieren",
    "action.next":        "nachster Titel",
    "action.previous":    "vorheriger Titel",
    "action.mute":        "stummschalten",
    "action.unmute":      "Ton einschalten",
    "error.auth_failed":  "Widget nicht verfugbar",
    "error.entity_missing": "Gerat nicht verfugbar",
    "error.offline":      "Vorubergehend offline",
    "error.connecting":   "Verbinden...",
    "indicator.stale":    "Letzter bekannter Status",
    "history.unavailable":"Kein Verlauf verfugbar",
  },

  // French
  fr: {
    "state.on":           "Allume",
    "state.off":          "Eteint",
    "state.unavailable":  "Indisponible",
    "state.unknown":      "Inconnu",
    "state.open":         "Ouvert",
    "state.closed":       "Ferme",
    "state.locked":       "Verrouille",
    "state.unlocked":     "Deverrouille",
    "state.idle":         "Inactif",
    "state.triggered":    "Declenche",
    "state.heating":      "Chauffage",
    "state.cooling":      "Refroidissement",
    "state.playing":      "Lecture",
    "state.paused":       "En pause",
    "state.standby":      "Veille",
    "state.opening":      "Ouverture",
    "state.closing":      "Fermeture",
    "state.stopped":      "Arrete",
    "action.toggle":      "basculer",
    "action.turn_on":     "allumer",
    "action.turn_off":    "eteindre",
    "action.press":       "appuyer",
    "action.currently":   "actuellement",
    "action.open":        "ouvrir",
    "action.close":       "fermer",
    "action.stop":        "arreter",
    "action.play":        "lire",
    "action.pause":       "pause",
    "action.next":        "piste suivante",
    "action.previous":    "piste precedente",
    "action.mute":        "couper le son",
    "action.unmute":      "activer le son",
    "error.auth_failed":  "Widget indisponible",
    "error.entity_missing": "Appareil indisponible",
    "error.offline":      "Temporairement hors ligne",
    "error.connecting":   "Connexion...",
    "indicator.stale":    "Dernier etat connu",
    "history.unavailable":"Aucun historique disponible",
  },

  // Spanish
  es: {
    "state.on":           "Encendido",
    "state.off":          "Apagado",
    "state.unavailable":  "No disponible",
    "state.unknown":      "Desconocido",
    "state.open":         "Abierto",
    "state.closed":       "Cerrado",
    "state.locked":       "Bloqueado",
    "state.unlocked":     "Desbloqueado",
    "state.idle":         "En espera",
    "state.triggered":    "Activado",
    "state.heating":      "Calentando",
    "state.cooling":      "Enfriando",
    "state.playing":      "Reproduciendo",
    "state.paused":       "En pausa",
    "state.standby":      "En espera",
    "state.opening":      "Abriendo",
    "state.closing":      "Cerrando",
    "state.stopped":      "Detenido",
    "action.toggle":      "alternar",
    "action.turn_on":     "encender",
    "action.turn_off":    "apagar",
    "action.press":       "presionar",
    "action.currently":   "actualmente",
    "action.open":        "abrir",
    "action.close":       "cerrar",
    "action.stop":        "detener",
    "action.play":        "reproducir",
    "action.pause":       "pausar",
    "action.next":        "pista siguiente",
    "action.previous":    "pista anterior",
    "action.mute":        "silenciar",
    "action.unmute":      "activar sonido",
    "error.auth_failed":  "Widget no disponible",
    "error.entity_missing": "Dispositivo no disponible",
    "error.offline":      "Temporalmente sin conexion",
    "error.connecting":   "Conectando...",
    "indicator.stale":    "Ultimo estado conocido",
    "history.unavailable":"No hay historial disponible",
  },

  // Portuguese
  pt: {
    "state.on":           "Ligado",
    "state.off":          "Desligado",
    "state.unavailable":  "Indisponivel",
    "state.unknown":      "Desconhecido",
    "state.open":         "Aberto",
    "state.closed":       "Fechado",
    "state.locked":       "Bloqueado",
    "state.unlocked":     "Desbloqueado",
    "state.idle":         "Em espera",
    "state.triggered":    "Acionado",
    "state.heating":      "Aquecendo",
    "state.cooling":      "Resfriando",
    "state.playing":      "Reproduzindo",
    "state.paused":       "Pausado",
    "state.standby":      "Em espera",
    "action.toggle":      "alternar",
    "action.turn_on":     "ligar",
    "action.turn_off":    "desligar",
    "action.press":       "pressionar",
    "action.currently":   "atualmente",
    "action.open":        "abrir",
    "action.close":       "fechar",
    "action.stop":        "parar",
    "action.play":        "reproduzir",
    "action.pause":       "pausar",
    "action.mute":        "silenciar",
    "action.unmute":      "ativar som",
    "error.auth_failed":  "Widget indisponivel",
    "error.entity_missing": "Dispositivo indisponivel",
    "error.offline":      "Temporariamente offline",
    "error.connecting":   "Conectando...",
    "indicator.stale":    "Ultimo estado conhecido",
    "history.unavailable":"Sem historico disponivel",
  },

  // Dutch
  nl: {
    "state.on":           "Aan",
    "state.off":          "Uit",
    "state.unavailable":  "Niet beschikbaar",
    "state.unknown":      "Onbekend",
    "state.open":         "Open",
    "state.closed":       "Gesloten",
    "state.locked":       "Vergrendeld",
    "state.unlocked":     "Ontgrendeld",
    "state.idle":         "Inactief",
    "state.triggered":    "Geactiveerd",
    "state.heating":      "Verwarmen",
    "state.cooling":      "Koelen",
    "state.playing":      "Afspelen",
    "state.paused":       "Gepauzeerd",
    "state.standby":      "Stand-by",
    "action.toggle":      "omschakelen",
    "action.turn_on":     "aanzetten",
    "action.turn_off":    "uitzetten",
    "action.press":       "drukken",
    "action.currently":   "momenteel",
    "action.open":        "openen",
    "action.close":       "sluiten",
    "action.stop":        "stoppen",
    "action.play":        "afspelen",
    "action.pause":       "pauzeren",
    "action.mute":        "dempen",
    "action.unmute":      "dempen opheffen",
    "error.auth_failed":  "Widget niet beschikbaar",
    "error.entity_missing": "Apparaat niet beschikbaar",
    "error.offline":      "Tijdelijk offline",
    "error.connecting":   "Verbinden...",
    "indicator.stale":    "Laatste bekende status",
    "history.unavailable":"Geen geschiedenis beschikbaar",
  },

  // Thai (included as mentioned in widget-architecture.md)
  th: {
    "state.on":           "\u0e40\u0e1b\u0e34\u0e14",
    "state.off":          "\u0e1b\u0e34\u0e14",
    "state.unavailable":  "\u0e44\u0e21\u0e48\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19",
    "state.unknown":      "\u0e44\u0e21\u0e48\u0e17\u0e23\u0e32\u0e1a",
    "state.open":         "\u0e40\u0e1b\u0e34\u0e14",
    "state.closed":       "\u0e1b\u0e34\u0e14",
    "state.locked":       "\u0e25\u0e47\u0e2d\u0e04",
    "state.unlocked":     "\u0e1b\u0e25\u0e14\u0e25\u0e47\u0e2d\u0e04",
    "state.idle":         "\u0e27\u0e48\u0e32\u0e07",
    "state.triggered":    "\u0e17\u0e33\u0e07\u0e32\u0e19",
    "state.heating":      "\u0e17\u0e33\u0e04\u0e27\u0e32\u0e21\u0e23\u0e49\u0e2d\u0e19",
    "state.cooling":      "\u0e17\u0e33\u0e04\u0e27\u0e32\u0e21\u0e40\u0e22\u0e47\u0e19",
    "state.playing":      "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e25\u0e48\u0e19",
    "state.paused":       "\u0e2b\u0e22\u0e38\u0e14\u0e0a\u0e31\u0e48\u0e27\u0e04\u0e23\u0e32\u0e27",
    "action.toggle":      "\u0e2a\u0e25\u0e31\u0e1a",
    "action.turn_on":     "\u0e40\u0e1b\u0e34\u0e14",
    "action.turn_off":    "\u0e1b\u0e34\u0e14",
    "action.currently":   "\u0e1b\u0e31\u0e08\u0e08\u0e38\u0e1a\u0e31\u0e19",
    "error.auth_failed":  "\u0e27\u0e34\u0e14\u0e40\u0e08\u0e47\u0e15\u0e44\u0e21\u0e48\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19",
    "error.entity_missing":"\u0e2d\u0e38\u0e1b\u0e01\u0e23\u0e13\u0e4c\u0e44\u0e21\u0e48\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19",
    "error.offline":      "\u0e2d\u0e2d\u0e1f\u0e44\u0e25\u0e19\u0e0a\u0e31\u0e48\u0e27\u0e04\u0e23\u0e32\u0e27",
    "error.connecting":   "\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e15\u0e48\u0e2d...",
    "indicator.stale":    "\u0e2a\u0e16\u0e32\u0e19\u0e30\u0e25\u0e48\u0e32\u0e2a\u0e38\u0e14\u0e17\u0e35\u0e48\u0e17\u0e23\u0e32\u0e1a",
    "history.unavailable":"\u0e44\u0e21\u0e48\u0e21\u0e35\u0e1b\u0e23\u0e30\u0e27\u0e31\u0e15\u0e34",
  },

  // Japanese
  ja: {
    "state.on":           "\u30aa\u30f3",
    "state.off":          "\u30aa\u30d5",
    "state.unavailable":  "\u5229\u7528\u4e0d\u53ef",
    "state.unknown":      "\u4e0d\u660e",
    "state.open":         "\u958b",
    "state.closed":       "\u9589",
    "state.locked":       "\u30ed\u30c3\u30af",
    "state.unlocked":     "\u30a2\u30f3\u30ed\u30c3\u30af",
    "state.idle":         "\u5f85\u6a5f",
    "state.triggered":    "\u52d5\u4f5c\u4e2d",
    "state.heating":      "\u6696\u623f",
    "state.cooling":      "\u51b7\u623f",
    "state.playing":      "\u518d\u751f\u4e2d",
    "state.paused":       "\u4e00\u6642\u505c\u6b62",
    "action.toggle":      "\u5207\u308a\u66ff\u3048",
    "action.turn_on":     "\u30aa\u30f3",
    "action.turn_off":    "\u30aa\u30d5",
    "action.currently":   "\u73fe\u5728",
    "error.auth_failed":  "\u30a6\u30a3\u30b8\u30a7\u30c3\u30c8\u4f7f\u7528\u4e0d\u53ef",
    "error.entity_missing":"\u30c7\u30d0\u30a4\u30b9\u4f7f\u7528\u4e0d\u53ef",
    "error.offline":      "\u4e00\u6642\u30aa\u30d5\u30e9\u30a4\u30f3",
    "error.connecting":   "\u63a5\u7d9a\u4e2d...",
    "indicator.stale":    "\u6700\u7d42\u78ba\u8a8d\u72b6\u614b",
    "history.unavailable":"\u5c65\u6b74\u306a\u3057",
  },

  // Chinese (Simplified)
  zh: {
    "state.on":           "\u5f00",
    "state.off":          "\u5173",
    "state.unavailable":  "\u4e0d\u53ef\u7528",
    "state.unknown":      "\u672a\u77e5",
    "state.open":         "\u5f00\u542f",
    "state.closed":       "\u5173\u95ed",
    "state.locked":       "\u9501\u5b9a",
    "state.unlocked":     "\u672a\u9501\u5b9a",
    "state.idle":         "\u7a7a\u95f2",
    "state.triggered":    "\u5df2\u89e6\u53d1",
    "state.heating":      "\u52a0\u70ed",
    "state.cooling":      "\u5236\u51b7",
    "state.playing":      "\u64ad\u653e\u4e2d",
    "state.paused":       "\u5df2\u6682\u505c",
    "action.toggle":      "\u5207\u6362",
    "action.turn_on":     "\u5f00\u542f",
    "action.turn_off":    "\u5173\u95ed",
    "action.currently":   "\u5f53\u524d",
    "error.auth_failed":  "\u7ec4\u4ef6\u4e0d\u53ef\u7528",
    "error.entity_missing":"\u8bbe\u5907\u4e0d\u53ef\u7528",
    "error.offline":      "\u6682\u65f6\u79bb\u7ebf",
    "error.connecting":   "\u8fde\u63a5\u4e2d...",
    "indicator.stale":    "\u6700\u540e\u5df2\u77e5\u72b6\u6001",
    "history.unavailable":"\u6682\u65e0\u5386\u53f2\u8bb0\u5f55",
  },
};

// ---------------------------------------------------------------------------
// I18n class
// ---------------------------------------------------------------------------

/**
 * Per-card i18n instance. Created once in HrvCard.connectedCallback() and
 * passed to the renderer. Resolves string lookups at call time so language
 * switching (if ever needed) only requires creating a new I18n instance.
 */
export class I18n {
  /** @type {Record<string, string>} */
  #strings;

  /**
   * @param {string} lang - BCP 47 primary subtag ("en", "de", ...) or "auto".
   *   "auto" resolves from navigator.language at construction time.
   */
  constructor(lang) {
    const code = lang === "auto"
      ? (navigator.language ?? "en").split("-")[0].toLowerCase()
      : lang.toLowerCase();

    this.#strings = STRINGS[code] ?? STRINGS["en"];
  }

  /**
   * Look up a translation string. Falls back through:
   *   1. Requested language strings
   *   2. English strings
   *   3. The raw key itself (visible only during development)
   *
   * @param {string} key - Dot-separated key, e.g. "state.on"
   * @returns {string}
   */
  t(key) {
    return this.#strings[key] ?? STRINGS["en"][key] ?? key;
  }
}
