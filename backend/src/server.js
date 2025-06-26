const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const httpServer = createServer(app);

const TEST_SESSION_KEY = null; // e.g. '9165' or null for latest

app.use(express.json());
app.options('*', cors());

const allowedOrigins = [
  "http://localhost:5173",
  "https://f1-eight-orpin.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));

const io = new Server(httpServer, {
  cors: {
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Health check endpoints
app.get('/', (req, res) => {
  res.json({ 
    status: 'F1 Live Server Running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('/socket-test', (req, res) => {
  res.json({
    socketio: 'ready',
    clients: io.engine.clientsCount || 0
  });
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('join_live_timing', () => {
     
    socket.join('live-timing');
    sendInitialData(socket);
  });

  socket.on('ping', (data) => {
    socket.emit('pong', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

async function sendInitialData(socket) {
  try {
    const sessionData = await fetchSessionData();
    const timingData = await fetchTimingData(sessionData?.session_key || 'latest');
    
    socket.emit('session_info', {
      currentSession: sessionData,
      isLive: checkIfSessionIsLive(sessionData)
    });
    
    socket.emit('live_data_update', {
      drivers: timingData.drivers || [],
      intervals: timingData.intervals || [],
      carData: timingData.carData || [],
      isLive: checkIfSessionIsLive(sessionData),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending initial data:', error);
    socket.emit('error', { message: 'Failed to fetch initial data' });
  }
}

// ====== SESSION FETCHING ======
async function fetchSessionData() {
  try {
    if (TEST_SESSION_KEY) {
      const response = await axios.get(`https://api.openf1.org/v1/sessions?session_key=${TEST_SESSION_KEY}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data[0];
      }
      return null;
    }
    const currentYear = new Date().getFullYear();
    const response = await axios.get(`https://api.openf1.org/v1/sessions?year=${currentYear}`);
    let sessions = response.data;
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return null;
    }
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.date_start) - new Date(a.date_start)
    );
    return sortedSessions[0];
  } catch (error) {
    console.error('Error fetching session data:', error.message);
    return null;
  }
}

// ====== DYNAMIC DRIVER CACHE ======
let driverCache = {};

async function fetchAndCacheDrivers(sessionKey) {
  try {
    const res = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`);
    if (Array.isArray(res.data) && res.data.length > 0) {
      driverCache[sessionKey] = {};
      res.data.forEach(driver => {
        driverCache[sessionKey][driver.driver_number] = driver;
      });
    }
  } catch (e) {
    console.error('Error fetching drivers:', e.message);
  }
}

// ====== LAP TIME FORMATTING ======
function formatLapTime(seconds) {
  if (!seconds || isNaN(seconds)) return "N/A";
  const min = Math.floor(seconds / 60);
  const sec = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${min}:${sec}`;
}

function formatInterval(seconds) {
  if (typeof seconds !== "number" || isNaN(seconds)) return "-";
  return "+" + seconds.toFixed(3);
}

// ====== PRACTICE/QUALI: LAP DATA PROCESSING ======
async function fetchLiveTimingFromLaps(sessionKey) {
  // Cache driver info if not already
  if (!driverCache[sessionKey]) {
    await fetchAndCacheDrivers(sessionKey);
  }
  const driversMap = driverCache[sessionKey] || {};

  const lapsRes = await axios.get(`https://api.openf1.org/v1/laps?session_key=${sessionKey}`);
  const laps = lapsRes.data || [];

  // Best lap per driver
  const bestLaps = {};
  for (const lap of laps) {
    const driver = lap.driver_number;
    let duration = lap.lap_duration;
    if (!duration && lap.duration_sector_1 && lap.duration_sector_2 && lap.duration_sector_3) {
      duration = lap.duration_sector_1 + lap.duration_sector_2 + lap.duration_sector_3;
    }
    if (!duration || duration === 0) continue;
    if (!bestLaps[driver] || duration < bestLaps[driver].lap_duration) {
      bestLaps[driver] = { ...lap, lap_duration: duration };
    }
  }

  // Sort by best lap
  let standings = Object.values(bestLaps).sort((a, b) => a.lap_duration - b.lap_duration);

  // Add position, driver info, formatted lap time
  standings = standings.map((lap, i) => {
    const info = driversMap[lap.driver_number] || {};
    return {
      ...lap,
      position: i + 1,
      driver_name: info.full_name || info.name_acronym || lap.driver_number,
      team_name: info.team_name || "Unknown",
      team_colour: info.team_colour || "888888",
      lap_time_formatted: formatLapTime(lap.lap_duration)
    };
  });

  // Add interval/gap
  if (standings.length > 0) {
    const leaderLap = standings[0].lap_duration;
    standings = standings.map((driver, idx) => {
      let interval = "-";
      let gap = "-";
      if (idx > 0) {
        const prev = standings[idx - 1];
        interval = formatInterval(driver.lap_duration - prev.lap_duration);
        gap = formatInterval(driver.lap_duration - leaderLap);
      }
      return { ...driver, interval, gap };
    });
  }

  return standings;
}

// ====== RACE: NORMAL TIMING DATA ======
async function fetchTimingData(sessionKey = 'latest') {
  try {
    const keyToUse = TEST_SESSION_KEY || sessionKey;
    const driversRes = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${keyToUse}&limit=1000`);
    const intervalsRes = await axios.get(`https://api.openf1.org/v1/intervals?session_key=${keyToUse}&limit=1000`);
    const carDataRes = await axios.get(`https://api.openf1.org/v1/car_data?session_key=${keyToUse}&limit=1000`);
    return { 
      drivers: driversRes.data || [], 
      intervals: intervalsRes.data || [], 
      carData: carDataRes.data || [] 
    };
  } catch (error) {
    console.error('Error fetching timing data:', error.message);
    return { drivers: [], intervals: [], carData: [] };
  }
}

// ====== CRON JOB ======
cron.schedule('*/10 * * * * *', async () => {
  try {
    const sessionData = await fetchSessionData();
    const sessionKey = sessionData?.session_key || 'latest';
    const sessionType = (sessionData?.session_name || "").toLowerCase();

    let drivers = [];
    let intervals = [];
    let carData = [];

    if (sessionType.includes('practice') || sessionType.includes('qualifying')) {
      drivers = await fetchLiveTimingFromLaps(sessionKey);
      intervals = [];
      carData = [];
    } else {
      const timingData = await fetchTimingData(sessionKey);
      drivers = timingData.drivers || [];
      intervals = timingData.intervals || [];
      carData = timingData.carData || [];
    }

    const isLive = checkIfSessionIsLive(sessionData);

    const payload = {
      drivers,
      intervals,
      carData,
      currentSession: sessionData,
      isLive,
      timestamp: new Date().toISOString()
    };

    io.to('live-timing').emit('live_data_update', payload);
    console.log(`Broadcasting session: ${sessionData?.session_name || 'None'} - Live: ${isLive}`);
  } catch (error) {
    console.error('Error in scheduled data fetch:', error);
  }
});

function checkIfSessionIsLive(session) {
  if (!session || !session.date_start || !session.date_end) return false;
  const now = new Date();
  const start = new Date(session.date_start);
  const end = new Date(session.date_end);
  return now >= start && now <= end;
}

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`F1 Live Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});
