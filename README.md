# F1 Live Dashboard 🏎️

A production-ready web application for Formula 1 fans and analysts, delivering real-time race data, schedules, standings, and comprehensive F1 information.

## ✨ Features

- **Live Timing** - Real-time updates for practice, qualifying, and race sessions
- **Session Schedules** - Complete F1 calendar with upcoming race times
- **Race History** - Past race results, winners, and statistics
- **Live Standings** - Current driver and constructor championships
- **Driver & Team Info** - Complete directory of current F1 drivers and teams
- **Responsive Design** - Optimized for desktop and mobile devices

## 🛠 Tech Stack

**Frontend**
- React.js with WebSocket integration
- Tailwind CSS for styling
- Deployed on Vercel

**Backend**
- Node.js with Express.js
- WebSocket for real-time communication
- Deployed on Railway

## 🚀 Quick Start

### Prerequisites
- Node.js (v18.0.0+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/f1-live-dashboard.git
   cd f1-live-dashboard
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend/src
   npm install
   
   # Frontend
   cd ../../src
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` in the backend/src directory:
   ```env
   PORT=5000
   NODE_ENV=production
   ```
   
   Create `.env` in the src directory:
   ```env
   REACT_APP_API_URL=your-railway-backend-url
   REACT_APP_WEBSOCKET_URL=your-railway-websocket-url
   ```

## 📁 Project Structure

```
f1-live-dashboard/
├── backend/
│   ├── src/
│   │   ├── services/         # Business logic services
│   │   ├── socket/           # WebSocket implementation
│   │   ├── utils/            # Backend utilities
│   │   ├── server.js         # Main server file
│   │   ├── package.json
│   │   └── package-lock.json
│   ├── public/               # Static assets
│   └── shared/               # Shared utilities
├── src/
│   ├── assets/               # Images, icons, fonts
│   ├── components/           # Reusable React components
│   ├── contexts/             # React context providers
│   ├── hooks/                # Custom React hooks
│   ├── pages/                # Main page components
│   ├── services/             # API service functions
│   ├── utils/                # Frontend utilities
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── README.md
├── eslint.config.js
└── index.html
```

## 🔗 API Endpoints

### Sessions & Timing
- `GET /api/sessions` - Upcoming session schedules
- `GET /api/live` - Live timing data
- `GET /api/history` - Race history

### Standings & Data
- `GET /api/standings/drivers` - Driver championship standings
- `GET /api/standings/teams` - Constructor championship standings
- `GET /api/drivers` - All current drivers
- `GET /api/teams` - All current teams

## 🧪 Testing

```bash
# Backend tests
cd backend/src && npm test

# Frontend tests
npm test
```

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Railway)
1. Connect your repository to Railway
2. Configure environment variables
3. Deploy with automatic builds


## 🙏 Acknowledgments

- Formula 1 data providers and open-source community
- Vercel and Railway for hosting infrastructure
