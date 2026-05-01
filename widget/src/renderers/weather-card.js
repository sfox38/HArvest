/**
 * renderers/weather-card.js - Renderer for weather entities.
 *
 * Displays current conditions: condition icon, temperature, condition label,
 * and detail stats (humidity, wind speed, pressure). A dormant forecast strip
 * renders when forecast data is present in state attributes.
 */

import { BaseCard } from "./base-card.js";
import { renderIconSVG } from "../icons.js";

const CONDITION_ICONS = {
  "sunny":            "mdi:weather-sunny",
  "clear-night":      "mdi:weather-night",
  "partlycloudy":     "mdi:weather-partly-cloudy",
  "cloudy":           "mdi:weather-cloudy",
  "fog":              "mdi:weather-fog",
  "rainy":            "mdi:weather-rainy",
  "pouring":          "mdi:weather-pouring",
  "snowy":            "mdi:weather-snowy",
  "snowy-rainy":      "mdi:weather-snowy-heavy",
  "hail":             "mdi:weather-hail",
  "lightning":        "mdi:weather-lightning",
  "lightning-rainy":  "mdi:weather-lightning-rainy",
  "windy":            "mdi:weather-windy",
  "windy-variant":    "mdi:weather-windy-variant",
  "exceptional":      "mdi:alert-circle-outline",
};

const WEATHER_STYLES = /* css */`
  [part=card-body] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--hrv-spacing-xs);
    padding: var(--hrv-spacing-xs) 0;
  }

  [part=weather-main] {
    display: flex;
    align-items: center;
    gap: var(--hrv-spacing-m);
  }

  [part=weather-icon] {
    width: 48px;
    height: 48px;
    color: var(--hrv-color-state-on);
    flex-shrink: 0;
  }

  [part=weather-icon] svg {
    width: 100%;
    height: 100%;
  }

  [part=weather-temp] {
    font-size: 2.25rem;
    font-weight: var(--hrv-font-weight-bold);
    color: var(--hrv-color-text);
    line-height: 1;
  }

  [part=weather-temp-unit] {
    font-size: var(--hrv-font-size-l);
    font-weight: var(--hrv-font-weight-normal);
    color: var(--hrv-color-text-secondary);
  }

  [part=weather-condition] {
    font-size: var(--hrv-font-size-m);
    color: var(--hrv-color-text-secondary);
    text-transform: capitalize;
  }

  [part=weather-details] {
    display: flex;
    justify-content: center;
    gap: var(--hrv-spacing-l);
    width: 100%;
    padding-top: var(--hrv-spacing-xs);
    border-top: 1px solid var(--hrv-color-border);
  }

  [part=weather-stat] {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: var(--hrv-font-size-s);
    color: var(--hrv-color-text-secondary);
  }

  [part=weather-stat] svg {
    width: 16px;
    height: 16px;
    color: var(--hrv-color-icon);
    flex-shrink: 0;
  }

  [part=forecast-strip] {
    display: flex;
    justify-content: space-between;
    gap: var(--hrv-spacing-xs);
    width: 100%;
    padding-top: var(--hrv-spacing-xs);
    border-top: 1px solid var(--hrv-color-border);
  }

  [part=forecast-strip]:empty {
    display: none;
  }

  [part=forecast-day] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    flex: 1;
    min-width: 0;
  }

  [part=forecast-day-name] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text-secondary);
    font-weight: var(--hrv-font-weight-medium);
  }

  [part=forecast-day] svg {
    width: 20px;
    height: 20px;
    color: var(--hrv-color-icon);
  }

  [part=forecast-temps] {
    font-size: var(--hrv-font-size-xs);
    color: var(--hrv-color-text);
    white-space: nowrap;
  }

  [part=forecast-temp-low] {
    color: var(--hrv-color-text-secondary);
  }

  @media (prefers-reduced-motion: reduce) {
    [part=card] * { transition: none !important; }
  }
`;

function _esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function _conditionIcon(condition) {
  return CONDITION_ICONS[condition] ?? "mdi:weather-cloudy";
}

const _SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export class WeatherCard extends BaseCard {
  /** @type {HTMLElement|null} */ #iconEl     = null;
  /** @type {HTMLElement|null} */ #tempEl     = null;
  /** @type {HTMLElement|null} */ #condEl     = null;
  /** @type {HTMLElement|null} */ #humidityEl = null;
  /** @type {HTMLElement|null} */ #windEl     = null;
  /** @type {HTMLElement|null} */ #pressureEl = null;
  /** @type {HTMLElement|null} */ #forecastEl = null;

  render() {
    this.root.innerHTML = /* html */`
      <style>${this.getSharedStyles()}${WEATHER_STYLES}</style>
      <div part="card">
        <div part="card-header">
          <span part="card-icon" aria-hidden="true"></span>
          <span part="card-name">${_esc(this.def.friendly_name)}</span>
        </div>
        <div part="card-body">
          <div part="weather-main">
            <span part="weather-icon" aria-hidden="true"></span>
            <span part="weather-temp">
              --<span part="weather-temp-unit"></span>
            </span>
          </div>
          <span part="weather-condition" aria-live="polite">--</span>
          <div part="weather-details">
            <span part="weather-stat" data-stat="humidity">
              ${renderIconSVG("mdi:water-percent", "stat-icon")}
              <span data-value>--</span>
            </span>
            <span part="weather-stat" data-stat="wind">
              ${renderIconSVG("mdi:weather-windy", "stat-icon")}
              <span data-value>--</span>
            </span>
            <span part="weather-stat" data-stat="pressure">
              ${renderIconSVG("mdi:gauge", "stat-icon")}
              <span data-value>--</span>
            </span>
          </div>
          <div part="forecast-strip" role="list" aria-label="${this.i18n.t("weather.forecast")}"></div>
        </div>
        ${this.renderHistoryZoneHTML()}
        ${this.renderAriaLiveHTML()}
        ${this.renderCompanionZoneHTML()}
        <div part="stale-indicator" aria-hidden="true"></div>
      </div>
    `;

    this.#iconEl     = this.root.querySelector("[part=weather-icon]");
    this.#tempEl     = this.root.querySelector("[part=weather-temp]");
    this.#condEl     = this.root.querySelector("[part=weather-condition]");
    this.#humidityEl = this.root.querySelector("[part=weather-stat][data-stat=humidity] [data-value]");
    this.#windEl     = this.root.querySelector("[part=weather-stat][data-stat=wind] [data-value]");
    this.#pressureEl = this.root.querySelector("[part=weather-stat][data-stat=pressure] [data-value]");
    this.#forecastEl = this.root.querySelector("[part=forecast-strip]");

    this.renderIcon(
      this.def.icon ?? "mdi:weather-cloudy",
      "card-icon",
    );
    this.renderCompanions();
    this._attachGestureHandlers(this.root.querySelector("[part=card]"));
  }

  applyState(state, attributes) {
    const condition = state || "cloudy";
    const iconName = _conditionIcon(condition);

    if (this.#iconEl) {
      this.#iconEl.innerHTML = renderIconSVG(iconName, "weather-icon-svg");
    }

    const condLabel = this.i18n.t(`weather.${condition}`) !== `weather.${condition}`
      ? this.i18n.t(`weather.${condition}`)
      : condition.replace(/-/g, " ");
    if (this.#condEl) this.#condEl.textContent = condLabel;

    const temp = attributes.temperature;
    const tempUnit = attributes.temperature_unit ?? "";
    if (this.#tempEl) {
      const unitEl = this.#tempEl.querySelector("[part=weather-temp-unit]");
      this.#tempEl.firstChild.textContent = temp != null ? Math.round(Number(temp)) : "--";
      if (unitEl) unitEl.textContent = tempUnit ? ` ${tempUnit}` : "";
    }

    const headerIcon = this.def.icon_state_map?.[state] ?? this.def.icon ?? iconName;
    this.renderIcon(headerIcon, "card-icon");

    if (this.#humidityEl) {
      const h = attributes.humidity;
      this.#humidityEl.textContent = h != null ? `${h}%` : "--";
    }

    if (this.#windEl) {
      const w = attributes.wind_speed;
      const wu = attributes.wind_speed_unit ?? "";
      this.#windEl.textContent = w != null ? `${w} ${wu}`.trim() : "--";
    }

    if (this.#pressureEl) {
      const p = attributes.pressure;
      const pu = attributes.pressure_unit ?? "";
      this.#pressureEl.textContent = p != null ? `${p} ${pu}`.trim() : "--";
    }

    this.#renderForecast(attributes.forecast);

    this.announceState(
      `${this.def.friendly_name}, ${condLabel}, ${temp != null ? temp : "--"} ${tempUnit}`,
    );
  }

  #renderForecast(forecast) {
    if (!this.#forecastEl) return;

    if (!Array.isArray(forecast) || forecast.length === 0) {
      this.#forecastEl.innerHTML = "";
      return;
    }

    const days = forecast.slice(0, 5);
    this.#forecastEl.innerHTML = days.map(day => {
      const dt = new Date(day.datetime);
      const dayName = _SHORT_DAYS[dt.getDay()] ?? "";
      const icon = _conditionIcon(day.condition);
      const hi = day.temperature != null ? Math.round(day.temperature) : "--";
      const lo = day.templow != null ? Math.round(day.templow) : null;
      const tempStr = lo != null
        ? `${hi}/${lo}`
        : `${hi}`;

      return /* html */`
        <div part="forecast-day" role="listitem">
          <span part="forecast-day-name">${_esc(dayName)}</span>
          ${renderIconSVG(icon, "forecast-icon")}
          <span part="forecast-temps">
            ${_esc(String(hi))}${lo != null ? `/<span part="forecast-temp-low">${_esc(String(lo))}</span>` : ""}
          </span>
        </div>`;
    }).join("");
  }
}
