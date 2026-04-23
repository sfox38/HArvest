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
    "indicator.stale":    "Server unreachable",
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
    "state.closing":      "Schließt",
    "state.stopped":      "Gestoppt",
    "action.toggle":      "umschalten",
    "action.turn_on":     "einschalten",
    "action.turn_off":    "ausschalten",
    "action.press":       "drucken",
    "action.currently":   "aktuell",
    "action.open":        "offnen",
    "action.close":       "schließen",
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
    "indicator.stale":    "Server nicht erreichbar",
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
    "indicator.stale":    "Serveur injoignable",
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
    "indicator.stale":    "Servidor inaccesible",
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
    "indicator.stale":    "Servidor inacessivel",
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
    "indicator.stale":    "Server onbereikbaar",
    "history.unavailable":"Geen geschiedenis beschikbaar",
  },

  // Thai (included as mentioned in widget-architecture.md)
  th: {
    "state.on":           "เปิด",
    "state.off":          "ปิด",
    "state.unavailable":  "ไม่พร้อมใช้งาน",
    "state.unknown":      "ไม่ทราบ",
    "state.open":         "เปิด",
    "state.closed":       "ปิด",
    "state.locked":       "ล็อค",
    "state.unlocked":     "ปลดล็อค",
    "state.idle":         "ว่าง",
    "state.triggered":    "ทำงาน",
    "state.heating":      "ทำความร้อน",
    "state.cooling":      "ทำความเย็น",
    "state.playing":      "กำลังเล่น",
    "state.paused":       "หยุดชั่วคราว",
    "action.toggle":      "สลับ",
    "action.turn_on":     "เปิด",
    "action.turn_off":    "ปิด",
    "action.currently":   "ปัจจุบัน",
    "error.auth_failed":  "วิดเจ็ตไม่พร้อมใช้งาน",
    "error.entity_missing":"อุปกรณ์ไม่พร้อมใช้งาน",
    "error.offline":      "ออฟไลนชั่วคราว",
    "error.connecting":   "กำลังเชื่อมต่อ...",
    "indicator.stale":    "เซิร์ฟเวอร์ไม่ตอบสนอง",
    "history.unavailable":"ไม่มีประวัติ",
  },

  // Japanese
  ja: {
    "state.on":           "オン",
    "state.off":          "オフ",
    "state.unavailable":  "利用不可",
    "state.unknown":      "不明",
    "state.open":         "開",
    "state.closed":       "閉",
    "state.locked":       "ロック",
    "state.unlocked":     "アンロック",
    "state.idle":         "待機",
    "state.triggered":    "動作中",
    "state.heating":      "暖房",
    "state.cooling":      "冷房",
    "state.playing":      "再生中",
    "state.paused":       "一時停止",
    "action.toggle":      "切り替え",
    "action.turn_on":     "オン",
    "action.turn_off":    "オフ",
    "action.currently":   "現在",
    "error.auth_failed":  "ウィジェット使用不可",
    "error.entity_missing":"デバイス使用不可",
    "error.offline":      "一時オフライン",
    "error.connecting":   "接続中...",
    "indicator.stale":    "サーバーに接続できません",
    "history.unavailable":"履歴なし",
  },

  // Chinese (Simplified)
  zh: {
    "state.on":           "开",
    "state.off":          "关",
    "state.unavailable":  "不可用",
    "state.unknown":      "未知",
    "state.open":         "开启",
    "state.closed":       "关闭",
    "state.locked":       "锁定",
    "state.unlocked":     "未锁定",
    "state.idle":         "空闲",
    "state.triggered":    "已触发",
    "state.heating":      "加热",
    "state.cooling":      "制冷",
    "state.playing":      "播放中",
    "state.paused":       "已暂停",
    "action.toggle":      "切换",
    "action.turn_on":     "开启",
    "action.turn_off":    "关闭",
    "action.currently":   "当前",
    "error.auth_failed":  "组件不可用",
    "error.entity_missing":"设备不可用",
    "error.offline":      "暂时离线",
    "error.connecting":   "连接中...",
    "indicator.stale":    "服务器无法连接",
    "history.unavailable":"暂无历史记录",
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
