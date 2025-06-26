const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configuration
const config = {
  PORT: process.env.PORT || 3001,
  TEST_SESSION_KEY: null, // e.g. '9165' or null for latest
  POLL_INTERVAL: '*/10 * * * * *',
  CACHE_TTL: 30000, // 30 seconds
  MAX_CLIENTS: 1000,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: 100,
  ALLOWED_ORIGINS: [
    "http://localhost:5173",
    "https://f1-eight-orpin.vercel.app"
  ]
};

// Initialize app
const app = express();
const httpServer = createServer(app);

// Security middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW,
  max: config.RATE_LIMIT_MAX,
  message: 'Too many requests from this IP'
});

app.use(apiLimiter);

// CORS configuration
app.use(cors({
  origin: function(origin, callback) {
    if (config.ALLOWED_ORIGINS.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"]
}));

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: config.ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000 // 2 minutes
  }
});

// State management
const state = {
  driverCache: {},
  apiCache: new Map(),
  socketRateLimits: new Map(),
  activeSessions: new Set()
};

// Utility functions
const utils = {
  formatLapTime: (seconds) => {
    if (!seconds || isNaN(seconds)) return "N/A";
    const min = Math.floor(seconds / 60);
    const sec = (seconds % 60).toFixed(3).padStart(6, "0");
    return `${min}:${sec}`;
  },

  formatInterval: (seconds) => {
    if (typeof seconds !== "number" || isNaN(seconds)) return "-";
    return "+" + seconds.toFixed(3);
  },

  logEvent: (type, message, metadata = {}) => {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      type,
      message,
      ...metadata
    }));
  },

  checkIfSessionIsLive: (session) => {
    if (!session || !session.date_start || !session.date_end) return false;
    const now = new Date();
    const start = new Date(session.date_start);
    const end = new Date(session.date_end);
    return now >= start && now <= end;
  }
};

// Jolpica API Service for historical data
const jolpicaService = {
  rateLimit: {
    requests: 0,
    resetTime: Date.now() + 3600000 // 1 hour
  },

  checkRateLimit: function() {
    if (Date.now() > this.rateLimit.resetTime) {
      this.rateLimit.requests = 0;
      this.rateLimit.resetTime = Date.now() + 3600000;
    }
    
    if (this.rateLimit.requests >= 200) {
      throw new Error('Jolpica rate limit exceeded');
    }
    
    this.rateLimit.requests++;
  },

  fetchCurrentSeason: async function() {
    this.checkRateLimit();
    try {
      const response = await axios.get('https://api.jolpi.ca/ergast/f1/current.json');
      return response.data.MRData.RaceTable.Races;
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch current season from Jolpica', { error: error.message });
      throw error;
    }
  },

  // ADD THIS MISSING METHOD
  fetchSeasonSchedule: async function(season) {
    this.checkRateLimit();
    try {
      console.log(`Fetching Jolpica data for season: ${season}`);
      
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}.json`);
      
      if (response.status === 404) {
        console.log(`No data available for season ${season}`);
        return [];
      }
      
      const races = response.data.MRData?.RaceTable?.Races || [];
      console.log(`Jolpica returned ${races.length} races for ${season}`);
      return races;
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`No data available for season ${season}`);
        return [];
      }
      
      utils.logEvent('ERROR', 'Failed to fetch season schedule from Jolpica', { 
        error: error.message, 
        season,
        status: error.response?.status 
      });
      throw error;
    }
  },

  fetchDriverStandings: async function(season = 'current') {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`);
      return response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch driver standings from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchConstructorStandings: async function(season = 'current') {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`);
      return response.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch constructor standings from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchRaceResults: async function(season, round) {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`);
      return response.data.MRData.RaceTable.Races[0]?.Results || [];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch race results from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchQualifyingResults: async function(season, round) {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/${round}/qualifying.json`);
      return response.data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch qualifying results from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchDriverInfo: async function(driverId) {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/drivers/${driverId}.json`);
      return response.data.MRData.DriverTable.Drivers[0];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch driver info from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchConstructorInfo: async function(constructorId) {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/constructors/${constructorId}.json`);
      return response.data.MRData.ConstructorTable.Constructors[0];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch constructor info from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchAllDrivers: async function(season = 'current') {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/drivers.json`);
      return response.data.MRData.DriverTable.Drivers;
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch all drivers from Jolpica', { error: error.message });
      throw error;
    }
  },

  fetchAllConstructors: async function(season = 'current') {
    this.checkRateLimit();
    try {
      const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructors.json`);
      return response.data.MRData.ConstructorTable.Constructors;
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch all constructors from Jolpica', { error: error.message });
      throw error;
    }
  }
};

// API Services (your existing OpenF1 service)
const apiService = {
  fetchSessionData: async () => {
    try {
      if (config.TEST_SESSION_KEY) {
        const response = await axios.get(
          `https://api.openf1.org/v1/sessions?session_key=${config.TEST_SESSION_KEY}`
        );
        return response.data?.[0] || null;
      }
      
      const currentYear = new Date().getFullYear();
      const response = await axios.get(
        `https://api.openf1.org/v1/sessions?year=${currentYear}`
      );
      
      const sessions = response.data || [];
      if (sessions.length === 0) return null;
      
      return sessions.sort((a, b) => 
        new Date(b.date_start) - new Date(a.date_start)
      )[0];
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch session data', { error: error.message });
      return null;
    }
  },

  fetchAndCacheDrivers: async (sessionKey) => {
    try {
      const res = await axios.get(
        `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`
      );
      
      if (Array.isArray(res.data) && res.data.length > 0) {
        state.driverCache[sessionKey] = {};
        res.data.forEach(driver => {
          state.driverCache[sessionKey][driver.driver_number] = driver;
        });
        
        // Set cache expiration
        setTimeout(() => {
          delete state.driverCache[sessionKey];
        }, config.CACHE_TTL);
      }
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch drivers', { sessionKey, error: error.message });
    }
  },

  fetchLiveTimingFromLaps: async (sessionKey) => {
    try {
      if (!state.driverCache[sessionKey]) {
        await apiService.fetchAndCacheDrivers(sessionKey);
      }

      const lapsRes = await axios.get(
        `https://api.openf1.org/v1/laps?session_key=${sessionKey}`
      );
      const laps = lapsRes.data || [];

      // Process best laps
      const bestLaps = {};
      for (const lap of laps) {
        const driver = lap.driver_number;
        let duration = lap.lap_duration || 
          (lap.duration_sector_1 + lap.duration_sector_2 + lap.duration_sector_3);
        
        if (!duration || duration === 0) continue;
        if (!bestLaps[driver] || duration < bestLaps[driver].lap_duration) {
          bestLaps[driver] = { ...lap, lap_duration: duration };
        }
      }

      // Create standings
      let standings = Object.values(bestLaps)
        .sort((a, b) => a.lap_duration - b.lap_duration)
        .map((lap, i) => {
          const info = state.driverCache[sessionKey]?.[lap.driver_number] || {};
          return {
            ...lap,
            position: i + 1,
            driver_name: info.full_name || info.name_acronym || lap.driver_number,
            team_name: info.team_name || "Unknown",
            team_colour: info.team_colour || "888888",
            lap_time_formatted: utils.formatLapTime(lap.lap_duration)
          };
        });

      // Add intervals
      if (standings.length > 0) {
        const leaderLap = standings[0].lap_duration;
        standings = standings.map((driver, idx) => {
          if (idx === 0) return { ...driver, interval: "-", gap: "-" };
          return {
            ...driver,
            interval: utils.formatInterval(driver.lap_duration - standings[idx-1].lap_duration),
            gap: utils.formatInterval(driver.lap_duration - leaderLap)
          };
        });
      }

      return standings;
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch lap timing', { sessionKey, error: error.message });
      return [];
    }
  },

  fetchTimingData: async (sessionKey = 'latest') => {
    try {
      const keyToUse = config.TEST_SESSION_KEY || sessionKey;
      const [driversRes, intervalsRes, carDataRes] = await Promise.all([
        axios.get(`https://api.openf1.org/v1/drivers?session_key=${keyToUse}&limit=1000`),
        axios.get(`https://api.openf1.org/v1/intervals?session_key=${keyToUse}&limit=1000`),
        axios.get(`https://api.openf1.org/v1/car_data?session_key=${keyToUse}&limit=1000`)
      ]);

      return {
        drivers: driversRes.data || [],
        intervals: intervalsRes.data || [],
        carData: carDataRes.data || []
      };
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to fetch timing data', { sessionKey, error: error.message });
      return { drivers: [], intervals: [], carData: [] };
    }
  }
};

// Socket.IO Handlers (your existing handlers)
const socketHandlers = {
  handleConnection: (socket) => {
    utils.logEvent('CONNECTION', `New client connected`, { socketId: socket.id });
    
    socket.on('join_live_timing', () => {
      const now = Date.now();
      const lastJoin = state.socketRateLimits.get(socket.id) || 0;
      
      if (now - lastJoin < 5000) {
        socket.emit('error', { message: 'Join requests too frequent' });
        return utils.logEvent('RATE_LIMIT', 'Join request throttled', { socketId: socket.id });
      }
      
      state.socketRateLimits.set(socket.id, now);
      socket.join('live-timing');
      socketHandlers.sendInitialData(socket);
      utils.logEvent('JOIN', 'Client joined live-timing', { socketId: socket.id });
    });

    socket.on('ping', (data) => {
      socket.emit('pong', data);
    });

    socket.on('disconnect', () => {
      utils.logEvent('DISCONNECT', 'Client disconnected', { socketId: socket.id });
    });
  },

  sendInitialData: async (socket) => {
    try {
      const sessionData = await apiService.fetchSessionData();
      const sessionKey = sessionData?.session_key || 'latest';
      const timingData = await apiService.fetchTimingData(sessionKey);
      
      socket.emit('session_info', {
        currentSession: sessionData,
        isLive: utils.checkIfSessionIsLive(sessionData)
      });
      
      socket.emit('live_data_update', {
        drivers: timingData.drivers,
        intervals: timingData.intervals,
        carData: timingData.carData,
        isLive: utils.checkIfSessionIsLive(sessionData),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      utils.logEvent('ERROR', 'Failed to send initial data', { error: error.message });
      socket.emit('error', { message: 'Failed to fetch initial data' });
    }
  }
};

// Cron job for data updates (your existing cron job)
cron.schedule(config.POLL_INTERVAL, async () => {
  try {
    const sessionData = await apiService.fetchSessionData();
    const sessionKey = sessionData?.session_key || 'latest';
    const sessionType = (sessionData?.session_name || "").toLowerCase();

    let drivers, intervals, carData;
    
    if (sessionType.includes('practice') || sessionType.includes('qualifying')) {
      drivers = await apiService.fetchLiveTimingFromLaps(sessionKey);
      intervals = [];
      carData = [];
    } else {
      const timingData = await apiService.fetchTimingData(sessionKey);
      drivers = timingData.drivers;
      intervals = timingData.intervals;
      carData = timingData.carData;
    }

    const payload = {
      drivers,
      intervals,
      carData,
      currentSession: sessionData,
      isLive: utils.checkIfSessionIsLive(sessionData),
      timestamp: new Date().toISOString()
    };

    io.to('live-timing').emit('live_data_update', payload);
    utils.logEvent('CRON', 'Broadcasted live data update', { 
      session: sessionData?.session_name,
      clients: io.engine.clientsCount
    });
  } catch (error) {
    utils.logEvent('ERROR', 'Cron job failed', { error: error.message });
    io.to('live-timing').emit('error', { 
      message: 'Failed to update data',
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'F1 Live Server Running', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    clients: io.engine.clientsCount
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', (req, res) => {
  res.json({
    clients: io.engine.clientsCount,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cacheSizes: {
      drivers: Object.keys(state.driverCache).length,
      api: state.apiCache.size
    },
    jolpica: {
      requests: jolpicaService.rateLimit.requests,
      resetTime: new Date(jolpicaService.rateLimit.resetTime).toISOString()
    }
  });
});

// FIXED: Season-specific sessions route (this should come BEFORE the general route)
app.get('/api/sessions/:season', async (req, res) => {
  try {
    const season = req.params.season;
    console.log(`Fetching sessions for season: ${season}`);
    
    // Validate season parameter
    const currentYear = new Date().getFullYear();
    const seasonYear = parseInt(season);
    
    if (isNaN(seasonYear) || seasonYear < 1950 || seasonYear > currentYear + 5) {
      return res.status(400).json({ 
        error: `Invalid season: ${season}. Must be between 1950 and ${currentYear + 5}` 
      });
    }
    
    const races = await jolpicaService.fetchSeasonSchedule(season);
    res.json(races);
  } catch (error) {
    console.error(`Error fetching sessions for season ${req.params.season}:`, error);
    res.status(500).json({ 
      error: `Failed to fetch session data for ${req.params.season}`,
      details: error.message 
    });
  }
});

// General sessions route (current season)
app.get('/api/sessions', async (req, res) => {
  try {
    const season = req.query.season || 'current';
    const races = await jolpicaService.fetchSeasonSchedule(season);
    res.json(races);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session data' });
  }
});

app.get('/api/standings/drivers/:season?', async (req, res) => {
  try {
    const season = req.params.season || 'current';
    const standings = await jolpicaService.fetchDriverStandings(season);
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver standings' });
  }
});

app.get('/api/standings/teams/:season?', async (req, res) => {
  try {
    const season = req.params.season || 'current';
    const standings = await jolpicaService.fetchConstructorStandings(season);
    res.json(standings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch constructor standings' });
  }
});

app.get('/api/results/:season/:round', async (req, res) => {
  try {
    const { season, round } = req.params;
    const results = await jolpicaService.fetchRaceResults(season, round);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch race results' });
  }
});

app.get('/api/qualifying/:season/:round', async (req, res) => {
  try {
    const { season, round } = req.params;
    const results = await jolpicaService.fetchQualifyingResults(season, round);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch qualifying results' });
  }
});

app.get('/api/drivers/:driverId?', async (req, res) => {
  try {
    if (req.params.driverId) {
      const driver = await jolpicaService.fetchDriverInfo(req.params.driverId);
      res.json(driver);
    } else {
      const season = req.query.season || 'current';
      const drivers = await jolpicaService.fetchAllDrivers(season);
      res.json(drivers);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch driver data' });
  }
});

// Add this to your server.js
// Add this to your server.js
app.get('/api/driver-podiums/:season', async (req, res) => {
  try {
    const season = req.params.season;
    
    // Get all race results for the season
    const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/results.json?limit=1000`);
    const races = response.data.MRData.RaceTable.Races;
    
    const driverPodiums = {};
    
    races.forEach(race => {
      race.Results.forEach(result => {
        const driverId = result.Driver.driverId;
        const position = parseInt(result.position);
        
        if (!driverPodiums[driverId]) {
          driverPodiums[driverId] = 0;
        }
        
        // Count podiums (positions 1, 2, 3)
        if (position <= 3) {
          driverPodiums[driverId]++;
        }
      });
    });
    
    res.json(driverPodiums);
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate podiums' });
  }
});



app.get('/api/teams/:constructorId?', async (req, res) => {
  try {
    if (req.params.constructorId) {
      const constructor = await jolpicaService.fetchConstructorInfo(req.params.constructorId);
      res.json(constructor);
    } else {
      const season = req.query.season || 'current';
      const constructors = await jolpicaService.fetchAllConstructors(season);
      res.json(constructors);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch constructor data' });
  }
});

// Enhanced endpoint that combines OpenF1 live data with Jolpica historical data
app.get('/api/enhanced/standings/drivers/:season?', async (req, res) => {
  try {
    const season = req.params.season || 'current';
    const standings = await jolpicaService.fetchDriverStandings(season);
    
    // If current season, try to enhance with live data
    if (season === 'current') {
      try {
        const sessionData = await apiService.fetchSessionData();
        if (sessionData && utils.checkIfSessionIsLive(sessionData)) {
          const sessionKey = sessionData.session_key;
          await apiService.fetchAndCacheDrivers(sessionKey);
          // Add live session info to response
          res.json({
            standings,
            liveSession: sessionData,
            isLive: true,
            timestamp: new Date().toISOString()
          });
          return;
        }
      } catch (liveError) {
        utils.logEvent('WARNING', 'Failed to fetch live data for enhanced standings', { error: liveError.message });
      }
    }
    
    res.json({
      standings,
      isLive: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch enhanced driver standings' });
  }
});

// Initialize Socket.IO
io.on('connection', socketHandlers.handleConnection);

// Start server
httpServer.listen(config.PORT, () => {
  utils.logEvent('STARTUP', `Server running on port ${config.PORT}`);
  console.log(`
  F1 Live Timing Server
  ---------------------
  Port: ${config.PORT}
  Health: http://localhost:${config.PORT}/health
  Metrics: http://localhost:${config.PORT}/metrics
  
  API Endpoints:
  - GET /api/sessions (current season schedule)
  - GET /api/sessions/:season (specific season schedule)
  - GET /api/standings/drivers/:season? (driver standings)
  - GET /api/standings/teams/:season? (constructor standings)
  - GET /api/results/:season/:round (race results)
  - GET /api/qualifying/:season/:round (qualifying results)
  - GET /api/drivers/:driverId? (driver info)
  - GET /api/teams/:constructorId? (team info)
  - GET /api/enhanced/standings/drivers/:season? (enhanced with live data)
  `);
});

// Cleanup on exit
process.on('SIGTERM', () => {
  utils.logEvent('SHUTDOWN', 'Server shutting down');
  httpServer.close(() => process.exit(0));
});
