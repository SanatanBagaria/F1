# F1 Live Dashboard 🏎️

A production-grade, highly responsive web dashboard for Formula 1 fans and analysts. This project aggregates real-time session telemetry, news, standings, schedules, and circuit layouts into a unified, premium user interface.

---

## ✨ Features

- **⏱️ Live Timing & Replays:** Stream live telemetry, sector intervals, speeds, gears, and braking/throttle stats via Socket.IO. When off-season or between races, the backend automatically serves self-healing Abu Dhabi GP replays instead of empty placeholders.
- **📅 Auto-Anchoring timeline:** An interactive vertical timeline of sessions. The view automatically scrolls and centers on the **next upcoming/active session** without shifting the global page scroll context. Scroll up for completed races, and scroll down for upcoming ones.
- **🗺️ Authentic Track Maps:** Sleek specifications detailing track lengths, corners, DRS zones, and lap records, backed by official vector track maps that automatically invert colors (`dark:invert-[0.85]`) to stay readable in dark mode.
- **🏆 Live Standings & Dynamic Mappings:** Dynamic driver standings synced from current points, mapping constructors and driver profiles accurately (solving the "Unknown" constructor bug). Parallelized API queries load 11+ years of historical data concurrently.
- **🏎️ Dynamic Team Profiles:** Expanded card profiles showing active driver specs, current season standing telemetry, and official team logos.
- **📰 Cached RSS News Feed:** Curated breaking F1 stories aggregated and cached on the backend directly from BBC RSS feeds.
- **📊 Interactive Polls & Trivia:** Integrated voting state percentages and a built-in F1 Trivia Quiz game.

---

## 🛠 Tech Stack

**Frontend Client:**
- **React.js (Vite)** with WebSocket client integration.
- **Vanilla CSS & Tailwind CSS** for rich aesthetics, glassmorphism, transitions, and dark mode toggles.
- Deployed on Vercel.

**Backend Server:**
- **Node.js (Express)** with Socket.IO support.
- **In-Memory Cache Map** minimizing rate limits on third-party F1 telemetry APIs.
- Deployed on Railway.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0+)
- npm or yarn

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SanatanBagaria/F1.git
   cd F1
   ```

2. **Run Backend Server:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   The backend will launch on `http://localhost:3001` and establish the WebSocket handshake.

3. **Run Frontend Client:**
   Open a new terminal window in the project root:
   ```bash
   npm install
   npm run dev
   ```
   The frontend will open on `http://localhost:5173`.

---

## 📁 Project Structure

```
F1/
├── backend/
│   ├── src/
│   │   ├── config/           # Port and session variables
│   │   ├── middleware/       # Express error handlers
│   │   ├── routes/           # REST endpoints (standings, weather, news)
│   │   ├── services/         # News caching, Jolpica, and OpenF1 APIs
│   │   ├── socket/           # WebSocket socketManager.js broadcasts
│   │   ├── utils/            # Helper utilities and logger
│   │   └── server.js         # Entrypoint
│   ├── package.json
│   └── package-lock.json
├── src/
│   ├── assets/               # Branding assets
│   ├── components/           # Reusable UI widgets (Navbar, LiveTiming, Timeline)
│   ├── contexts/             # Global ThemeContext dark mode states
│   ├── hooks/                # Custom React query hooks (useLiveData, useDriverStandings)
│   ├── pages/                # LandingPage, History, current standings, TrackMaps, Polls
│   ├── services/             # Client REST fetches
│   ├── utils/                # Acronym lists and socket event keys
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
└── vite.config.js
```

---

## 🔗 REST API Endpoints

### Timing & Telemetry
- `GET /api/weather/latest` - Returns the latest track weather readings.
- `GET /api/weather/:sessionKey` - Telemetry weather for a specific session.
- `GET /api/news` - Server-cached breaking news articles from BBC F1.

### Standings & Results
- `GET /api/standings/drivers/current` - Live driver championship standing list.
- `GET /api/standings/teams/current` - Live constructor championship standing list.
- `GET /api/driver-podiums/:season` - Retrieves podium counts per driver for a given season.

---

## 🙏 Credits & Acknowledgments
- **Jolpica F1 API:** Providing detailed Ergast championship histories and standings.
- **OpenF1 API:** Providing high-frequency real-time timing, car telemetry, and track weather.
