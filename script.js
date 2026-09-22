// Aloft — a small weather almanac
// Data: Open-Meteo (no API key required) — https://open-meteo.com

const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const locateBtn = document.getElementById('locate-btn');
const statusEl = document.getElementById('status');
const result = document.getElementById('result');

const placeName = document.getElementById('place-name');
const placeTime = document.getElementById('place-time');
const heroIcon = document.getElementById('hero-icon');
const tempValue = document.getElementById('temp-value');
const conditionText = document.getElementById('condition-text');
const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const uv = document.getElementById('uv');
const forecastRows = document.getElementById('forecast-rows');

// ---- Weather code → { label, icon } -----------------------------------

const WEATHER_CODES = {
  0: ['Clear sky', 'sun'],
  1: ['Mostly clear', 'sun'],
  2: ['Partly cloudy', 'cloud-sun'],
  3: ['Overcast', 'cloud'],
  45: ['Fog', 'fog'],
  48: ['Rime fog', 'fog'],
  51: ['Light drizzle', 'drizzle'],
  53: ['Drizzle', 'drizzle'],
  55: ['Dense drizzle', 'drizzle'],
  56: ['Freezing drizzle', 'drizzle'],
  57: ['Freezing drizzle', 'drizzle'],
  61: ['Light rain', 'rain'],
  63: ['Rain', 'rain'],
  65: ['Heavy rain', 'rain'],
  66: ['Freezing rain', 'rain'],
  67: ['Freezing rain', 'rain'],
  71: ['Light snow', 'snow'],
  73: ['Snow', 'snow'],
  75: ['Heavy snow', 'snow'],
  77: ['Snow grains', 'snow'],
  80: ['Light showers', 'rain'],
  81: ['Showers', 'rain'],
  82: ['Violent showers', 'rain'],
  85: ['Snow showers', 'snow'],
  86: ['Heavy snow showers', 'snow'],
  95: ['Thunderstorm', 'storm'],
  96: ['Thunderstorm, hail', 'storm'],
  99: ['Thunderstorm, hail', 'storm'],
};

function describeCode(code) {
  return WEATHER_CODES[code] || ['Unsettled', 'cloud'];
}

// ---- Inline SVG icon set (single stroke colour, inherits currentColor) --

const ICONS = {
  sun: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="13" fill="#C68A2E"/>
    <g stroke="#C68A2E" stroke-width="3.5" stroke-linecap="round">
      <path d="M32 6v8M32 50v8M6 32h8M50 32h8M13.5 13.5l5.6 5.6M44.9 44.9l5.6 5.6M50.5 13.5l-5.6 5.6M19.1 44.9l-5.6 5.6"/>
    </g>
  </svg>`,
  'cloud-sun': `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="10" fill="#C68A2E"/>
    <g stroke="#C68A2E" stroke-width="3" stroke-linecap="round">
      <path d="M24 6v5M9 24h-5M39 24h5M13.8 13.8l3.5 3.5M34.2 13.8l-3.5 3.5"/>
    </g>
    <path d="M18 46c-6.6 0-12-5-12-11.2 0-5.8 4.6-10.6 10.5-11.1C18.4 17.6 24.3 13 31.2 13c7.6 0 13.9 5.7 14.6 13 5.2 1 9.2 5.5 9.2 11 0 6.1-5.2 11-11.6 11H18z" fill="#F5F7F8" stroke="#48566E" stroke-width="2"/>
  </svg>`,
  cloud: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 48c-7.2 0-13-5.4-13-12.1 0-6.3 5-11.5 11.4-12C18.1 16.2 24.6 11 32.2 11c8.2 0 15 6.2 15.8 14.1 5.7 1.1 10 6 10 11.9 0 6.6-5.6 12-12.6 12H18z" fill="#DCE3E6" stroke="#48566E" stroke-width="2.2"/>
  </svg>`,
  fog: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 30c-6.2 0-11.2-4.6-11.2-10.3C8.8 14 13.6 9.5 19.6 9c1.5-4.9 6.6-8.4 12.6-8.4 7 0 12.8 4.7 13.6 10.8 4.9.9 8.6 4.9 8.6 9.7 0 5.5-4.8 10-10.8 10H20z" fill="#DCE3E6" stroke="#48566E" stroke-width="2" transform="translate(0,4) scale(0.82)"/>
    <g stroke="#48566E" stroke-width="3" stroke-linecap="round">
      <path d="M10 40h44M6 48h44M14 56h44"/>
    </g>
  </svg>`,
  drizzle: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 40c-7.2 0-13-5.4-13-12.1 0-6.3 5-11.5 11.4-12C18.1 16.2 24.6 11 32.2 11c8.2 0 15 6.2 15.8 14.1 5.7 1.1 10 6 10 11.9 0 6.6-5.6 12-12.6 12H18z" fill="#DCE3E6" stroke="#48566E" stroke-width="2.2"/>
    <g stroke="#2F6B6B" stroke-width="3" stroke-linecap="round">
      <path d="M20 50l-3 6M32 50l-3 6M44 50l-3 6"/>
    </g>
  </svg>`,
  rain: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 38c-7.2 0-13-5.4-13-12.1 0-6.3 5-11.5 11.4-12C18.1 14.2 24.6 9 32.2 9c8.2 0 15 6.2 15.8 14.1 5.7 1.1 10 6 10 11.9 0 6.6-5.6 12-12.6 12H18z" fill="#C3CFD3" stroke="#16233B" stroke-width="2.2"/>
    <g stroke="#2F6B6B" stroke-width="3.5" stroke-linecap="round">
      <path d="M18 48l-4 9M31 48l-4 9M44 48l-4 9"/>
    </g>
  </svg>`,
  snow: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 38c-7.2 0-13-5.4-13-12.1 0-6.3 5-11.5 11.4-12C18.1 14.2 24.6 9 32.2 9c8.2 0 15 6.2 15.8 14.1 5.7 1.1 10 6 10 11.9 0 6.6-5.6 12-12.6 12H18z" fill="#DCE3E6" stroke="#48566E" stroke-width="2.2"/>
    <g stroke="#2F6B6B" stroke-width="3" stroke-linecap="round">
      <path d="M18 48v10M13 53l10 0M32 48v10M27 53l10 0M46 48v10M41 53l10 0"/>
    </g>
  </svg>`,
  storm: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 34c-7.2 0-13-5.4-13-12.1 0-6.3 5-11.5 11.4-12C18.1 10.2 24.6 5 32.2 5c8.2 0 15 6.2 15.8 14.1 5.7 1.1 10 6 10 11.9 0 6.6-5.6 12-12.6 12H18z" fill="#8FA3AC" stroke="#16233B" stroke-width="2.2"/>
    <path d="M34 34l-9 14h8l-6 14 15-18h-8l6-10z" fill="#C68A2E"/>
  </svg>`,
};

function iconMarkup(kind) {
  return ICONS[kind] || ICONS.cloud;
}

// ---- Rendering -----------------------------------------------------------

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.classList.toggle('error', isError);
}

function dayLabel(dateStr, index) {
  const d = new Date(dateStr + 'T00:00:00');
  if (index === 0) return 'Today';
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}

function dateLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function renderWeather(place, data) {
  const cur = data.current;
  const [condLabel, condIcon] = describeCode(cur.weather_code);

  placeName.textContent = place.label;
  const localTime = new Date(cur.time);
  placeTime.textContent = localTime.toLocaleString(undefined, {
    weekday: 'long', hour: 'numeric', minute: '2-digit'
  });

  heroIcon.innerHTML = iconMarkup(condIcon);
  tempValue.textContent = Math.round(cur.temperature_2m);
  conditionText.textContent = condLabel;

  feelsLike.textContent = `${Math.round(cur.apparent_temperature)}\u00B0`;
  humidity.textContent = `${Math.round(cur.relative_humidity_2m)}%`;
  wind.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
  uv.textContent = data.daily.uv_index_max && data.daily.uv_index_max[0] != null
    ? data.daily.uv_index_max[0].toFixed(1)
    : '—';

  forecastRows.innerHTML = '';
  data.daily.time.forEach((dateStr, i) => {
    const [label, icon] = describeCode(data.daily.weather_code[i]);
    const row = document.createElement('div');
    row.className = 'ledger-row';
    row.innerHTML = `
      <div class="row-day">${dayLabel(dateStr, i)}<span class="row-date">${dateLabel(dateStr)}</span></div>
      <div class="row-icon">${iconMarkup(icon)}</div>
      <div class="row-condition">${label}</div>
      <div class="row-temps">
        <span class="row-high">${Math.round(data.daily.temperature_2m_max[i])}\u00B0</span>
        <span class="row-low">${Math.round(data.daily.temperature_2m_min[i])}\u00B0</span>
      </div>`;
    forecastRows.appendChild(row);
  });

  result.classList.remove('hidden');
}

// ---- Data fetching ---------------------------------------------------

async function geocode(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not reach the geocoder.');
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`No place found named "${query}".`);
  }
  const r = data.results[0];
  const region = [r.admin1, r.country].filter(Boolean).join(', ');
  return {
    label: region ? `${r.name}, ${region}` : r.name,
    latitude: r.latitude,
    longitude: r.longitude,
  };
}

async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max` +
    `&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Could not reach the forecast service.');
  return res.json();
}

async function loadPlace(place) {
  setStatus(`Reading the sky over ${place.label}…`);
  try {
    const data = await fetchWeather(place.latitude, place.longitude);
    renderWeather(place, data);
    setStatus('');
  } catch (err) {
    setStatus(err.message || 'Something went wrong fetching the forecast.', true);
  }
}

async function handleSearch(query) {
  if (!query.trim()) {
    setStatus('Type a city name first.', true);
    return;
  }
  setStatus(`Looking up ${query}…`);
  try {
    const place = await geocode(query.trim());
    await loadPlace(place);
  } catch (err) {
    setStatus(err.message || 'Something went wrong.', true);
    result.classList.add('hidden');
  }
}

function handleLocate() {
  if (!navigator.geolocation) {
    setStatus('Geolocation is not available in this browser.', true);
    return;
  }
  setStatus('Finding your location…');
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      await loadPlace({ label: 'Your location', latitude, longitude });
    },
    () => setStatus('Could not get your location. Try searching a city instead.', true)
  );
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  handleSearch(input.value);
});

locateBtn.addEventListener('click', handleLocate);

// Load a friendly default on first visit
window.addEventListener('DOMContentLoaded', () => {
  handleSearch('Agra');
});
