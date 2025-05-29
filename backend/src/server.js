const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
const httpServer = createServer(app);

// ✅ Add Express middleware
app.use(express.json());

app.options('*', cors());

const allowedOrigins = [
  "http://localhost:5173",
  "https://f1-eight-orpin.vercel.app"
];

app.use(cors({
  origin: function(origin, callback) {
    console.log('CORS check, incoming origin:', origin);
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
      console.log('Socket.IO CORS check, incoming origin:', origin);
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


// ✅ Add health check endpoints for Railway
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

// ✅ Add Socket.IO endpoint test
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
    console.log(`Client ${socket.id} joined live-timing room`);
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
    const timingData = await fetchTimingData();
    
    socket.emit('session_info', {
      currentSession: sessionData,
      isLive: false
    });
    
    socket.emit('live_data_update', {
      drivers: timingData.drivers || [],
      intervals: timingData.intervals || [],
      carData: timingData.carData || [],
      isLive: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error sending initial data:', error);
    socket.emit('error', { message: 'Failed to fetch initial data' });
  }
}

async function fetchSessionData() {
  try {
    const currentYear = new Date().getFullYear()
    console.log(`Fetching sessions for year: ${currentYear}`)
    
    const response = await axios.get(`https://api.openf1.org/v1/sessions?year=${currentYear}`)
    console.log(`Response status: ${response.status}`)
    
    let sessions = response.data
    
    if (!Array.isArray(sessions) || sessions.length === 0) {
      console.log('No valid sessions array')
      return null
    }
    
    const sortedSessions = sessions.sort((a, b) => 
      new Date(b.date_start) - new Date(a.date_start)
    )
    
    const currentSession = sortedSessions[0]
    console.log(`Selected session: ${currentSession.session_name} (${currentSession.session_key})`)
    
    return currentSession
  } catch (error) {
    console.error('Error fetching session data:', error.message)
    return null
  }
}

async function fetchTimingData(sessionKey = 'latest') {
  try {
    console.log(`Trying session key: ${sessionKey}`)
    
    const response = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
    console.log(`Data for ${sessionKey}:`, response.data.length, 'drivers')
    
    return { 
      drivers: response.data || [], 
      intervals: [], 
      carData: [] 
    }
  } catch (error) {
    console.error('Error fetching timing data:', error.message)
    return { drivers: [], intervals: [], carData: [] }
  }
}

cron.schedule('*/10 * * * * *', async () => {
  try {
    const sessionData = await fetchSessionData()
    const timingData = await fetchTimingData(sessionData?.session_key || 'latest')
    
    const isLive = sessionData ? checkIfSessionIsLive(sessionData) : false
    
    const payload = {
      ...timingData,
      currentSession: sessionData,
      isLive: isLive,
      timestamp: new Date().toISOString()
    }
    
    io.to('live-timing').emit('live_data_update', payload)
    
    console.log(`Broadcasting session: ${sessionData?.session_name || 'None'} - Live: ${isLive}`)
  } catch (error) {
    console.error('Error in scheduled data fetch:', error)
  }
})

function checkIfSessionIsLive(session) {
  if (!session || !session.date_start || !session.date_end) return false
  
  const now = new Date()
  const start = new Date(session.date_start)
  const end = new Date(session.date_end)
  
  return now >= start && now <= end
}

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`F1 Live Server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});
