# Plant Leaf Disease Detection System

An AI-powered plant leaf disease detection frontend for farmers, agronomists, and botanical
researchers. Upload or capture a leaf photo, get an instant disease diagnosis with confidence and
severity, check localized disease risk forecasts, chat with an expert AI assistant, and review past
analyses — all wrapped in a farmer-friendly, mobile-ready agriculture UI.

Built with **React 18 + Vite** and **Firebase Authentication**.

## Features

- **Split-screen login** with animated grass/leaf background and Firebase-backed email/password and
  Google sign-in
- **Dashboard** with a dark-green sidebar (collapses to a drawer on mobile) and a clean top header
- **Analysis** — upload an image or use the device camera (`getUserMedia`) to capture a leaf, then run
  it through the (placeholder) MobileNet V3 disease-detection pipeline
- **Forecast** — Today / Tomorrow / 7 Days disease-risk outlook cards
- **Expert Chat** — a farmer-friendly chat UI, ready to connect to a real assistant/LLM backend
- **History** — a log of past analyses, ready to sync with Firestore
- Fully responsive: desktop, laptop, tablet, and low-end mobile devices

## Getting started

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Configure Firebase

1. Create a project at the [Firebase console](https://console.firebase.google.com/).
2. Enable **Authentication → Sign-in method → Email/Password** and **Google**.
3. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

4. Fill in the values from **Project settings → General → Your apps → SDK setup and configuration**:

   ```
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

Until these are set, the app still runs and displays a clear "Firebase is not configured" notice on
the login screen instead of crashing.

## Connecting your real backend

Every page talks to a small service layer at `src/services/api.js` instead of calling a backend
directly, so swapping in real endpoints only touches one file:

| Function | Called from | Replace with |
|---|---|---|
| `analyzeLeaf(image)` | Analysis page | Your MobileNet V3 inference endpoint. Should resolve to `{ disease, confidence, severity, advice, model, inferenceMs }`. |
| `getForecast(params)` | Forecast page | Your disease-risk forecasting service. |
| `sendExpertMessage(message, history)` | Expert Chat page | Your chat/LLM backend. |
| `getHistory(userId)` | History page | A Firestore query against the signed-in user's saved analyses. |

Each function is documented in-file with the expected shape and a sample real implementation in a
comment above it.

## Project structure

```
src/
  components/     Reusable UI: Logo, Sidebar, Header, AuthForm, UploadCard,
                  CameraCapture, AnalysisResult, ForecastCard, ChatBox, HistoryItem…
  pages/          Login, Dashboard (layout), Analysis, Forecast, ExpertChat, History
  firebase/       AuthContext.jsx — React auth context wrapping the Firebase SDK
  services/       api.js — backend integration seams (see table above)
  firebase.js     Firebase app + auth initialization from environment variables
  App.jsx         Route definitions
  main.jsx        App entry point
  styles.css      Design tokens and all component/page styles
```

## Design system

- **Colors** — deep agricultural greens (`--forest-900`, `--leaf-500`), soft light-green backgrounds
  (`--sage-100`), white surfaces, and neutral grays for secondary text, defined as CSS custom
  properties in `src/styles.css`.
- **Type** — Manrope for headings/branding, DM Sans for body copy.
- **Motion** — a single deliberate animated moment (the swaying grass and drifting leaves on the
  login screen); everywhere else motion is limited to responsive hover/focus states.

## Notes

- The project brief referenced an attached project PPT for terminology; no file was received with
  this build, so terminology and structure follow the detailed written brief directly. If you'd like
  wording tightened to match the deck, share it and the copy can be adjusted quickly.
- ML inference, forecasting, chat, and history are wired to realistic demo data via
  `src/services/api.js` so the full flow is reviewable end-to-end before the real backend is ready.
