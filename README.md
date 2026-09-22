# Aloft — Weather Almanac

A small weather app built with plain HTML, CSS, and JavaScript. No build step, no API key — it uses the free [Open-Meteo](https://open-meteo.com) API for geocoding and forecasts.

## Features
- Search any city worldwide, or use your current location
- Current temperature, feels-like, humidity, wind, and UV index
- 7-day outlook
- No API key, no tracking, no dependencies

## Run it locally
Just open `index.html` in a browser — that's it.

(If your browser blocks `fetch` on local files, run a tiny local server instead: `python3 -m http.server`, then visit `http://localhost:8000`.)

## Deploy on GitHub Pages
1. Create a new repository on GitHub, e.g. `weather-app`.
2. Upload `index.html`, `style.css`, and `script.js` to it (or push with git, see below).
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save — GitHub will give you a live link like `https://ydvtanya1602-debug.github.io/weather-app/` after a minute or two.

## Push with git
```bash
cd weather-app
git init
git add .
git commit -m "Add Aloft weather app"
git branch -M main
git remote add origin https://github.com/ydvtanya1602-debug/weather-app.git
git push -u origin main
```
