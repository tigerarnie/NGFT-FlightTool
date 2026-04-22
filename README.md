# NGFT Flight Tool — V1.5

Integrated offline-first PWA for flight planning, briefing, inflight note capture, debriefing, and client reporting.

**Tech:** Pure HTML/CSS/JS single-page app. Airtable as system of record. No build step.

---

## Deployment (15 minutes)

### 1. Create a GitHub repo

1. Go to https://github.com/new
2. Repository name: **`NGFT-FlightTool`** (exactly this, to match the app's default scope)
3. Set to **Public** (required for free GitHub Pages)
4. Don't initialize with anything — leave empty
5. Create repository

### 2. Upload the 5 files

Either:
- **Drag-and-drop** all 5 files into the new repo on GitHub.com ("uploading an existing file"), OR
- **Git push** them from your local machine:
  ```bash
  git clone https://github.com/tigerarnie/NGFT-FlightTool.git
  cd NGFT-FlightTool
  # copy the 5 files here
  git add .
  git commit -m "V1.5 initial commit"
  git push
  ```

Files to upload:
- `index.html`
- `manifest.json`
- `sw.js`
- `icon-192.png`
- `icon-512.png`

### 3. Enable GitHub Pages

1. In the repo, go to **Settings → Pages**
2. Under "Build and deployment" → **Source: Deploy from a branch**
3. **Branch: `main`**, folder: **`/ (root)`**
4. Save. Wait ~30–60 seconds for the first deploy.

Your app will be at:
**`https://tigerarnie.github.io/NGFT-FlightTool/`**

### 4. Install on iPad

1. On the iPad, open **Safari** (not Chrome — Safari is required for PWA install on iOS)
2. Navigate to `https://tigerarnie.github.io/NGFT-FlightTool/`
3. Tap the **Share button** (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. The NGFT Flight Tool icon will appear on your home screen

Tap the icon to open it full-screen like a native app.

### 5. Connect to Airtable

On first launch:
1. Tap **⚙ Setup** in the top right
2. Paste your **Personal Access Token** (from airtable.com/create/tokens, scoped to `data.records:read` + `data.records:write`)
3. Paste your **Base ID** (starts with `app...`)
4. Tap **Save & Test Connection**
5. Tap **Pull Students & Courses** to populate your dropdowns

You're now ready to fly.

---

## Architecture notes

- **Offline-first:** Everything saves to localStorage instantly. Airtable sync happens in the background when online.
- **Sync indicator:** Top-right dot shows 🟢 Synced / 🟡 Pending / 🔴 Offline. Tap to force sync.
- **Multi-device:** Install on iPad, iPhone, and laptop — all sync through the same base.
- **Cache busting:** If you update the app and need to force a refresh, bump the `CACHE_VERSION` in `sw.js`.

## V1.5 scope

- ✅ Plan & Brief (FRAME 5-section + FRAT 12-factor + auto-threat mapping)
- ✅ Inflight (phase-grouped notes, critical flag, voice dictation via Web Speech API)
- ✅ Debrief (CLEAR framework with carry-over from Plan and critical events)
- ✅ Client Report (auto-generated, editable preamble, DOCX export, print/PDF, plain-text copy)
- ✅ Students & Courses (nested: Student → Courses → Flights)
- ✅ Offline PWA with Airtable sync
- ⏳ Gradebook — deferred pending custom NGFT rubric
- ⏳ Full-flight audio recording — deferred

## Files

| File | Purpose |
|---|---|
| `index.html` | Full application (HTML + CSS + JS inlined) — 95KB |
| `manifest.json` | PWA metadata |
| `sw.js` | Service worker for offline caching |
| `icon-192.png` | App icon (home screen, small) |
| `icon-512.png` | App icon (home screen, large) |

---

**Arne Haeussler · President, NGFT · ATP 2681397 · CE-525 / CE-510 / CE-500 · CFI**
