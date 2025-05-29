const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const cron = require('node-cron');
//const fetch = require('node-fetch');
const axios = require('axios');

const app = express();
const httpServer = createServer(app);

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('join_live_timing', () => {
    socket.join('live-timing');
    console.log(`Client ${socket.id} joined live-timing room`);
    
    // Send initial data immediately when client joins
    sendInitialData(socket);
  });

  socket.on('ping', (data) => {
    socket.emit('pong', data);
  });

  socket.on('disconnect', () => {
    console.log(`Client ${socket.id} disconnected`);
  });
});

// Function to send initial data to new clients
async function sendInitialData(socket) {
  try {
    const sessionData = await fetchSessionData();
    const timingData = await fetchTimingData();
    
    socket.emit('session_info', {
      currentSession: sessionData,
      isLive: false // Set to true if you detect a live session
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

// In your backend server.js, add detailed logging:
async function fetchSessionData() {
  try {
    const currentYear = new Date().getFullYear()
    console.log(`Fetching sessions for year: ${currentYear}`)
    
    const response = await axios.get(`https://api.openf1.org/v1/sessions?year=${currentYear}`)
    console.log(`Response status: ${response.status}`)
    
    // Get the raw data
    let sessions = response.data
    
    // Log everything about the response
    console.log(`Raw response type:`, typeof sessions)
    console.log(`Raw response is array:`, Array.isArray(sessions))
    console.log(`Raw response length:`, sessions?.length || 'undefined')
    console.log(`Raw response sample:`, sessions?.slice(0, 2))
    
    // Ensure we have an array
    if (!Array.isArray(sessions)) {
      console.log('Response is not an array, checking for nested data...')
      // Check common nesting patterns
      if (sessions.data) sessions = sessions.data
      if (sessions.sessions) sessions = sessions.sessions
      if (sessions.results) sessions = sessions.results
    }
    
    if (!Array.isArray(sessions) || sessions.length === 0) {
      console.log('Still no valid sessions array after checks')
      return null
    }
    
    console.log(`Successfully parsed ${sessions.length} sessions`)
    
    // Sort by date and get most recent
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

// Also update fetchTimingData:
async function fetchTimingData(sessionKey = 'latest') {
  try {
    console.log('Fetching timing data...')
    console.log(`Trying session key: ${sessionKey}`)
    
    const response = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`)
    console.log(`Response for ${sessionKey}: ${response.status}`)
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

// Broadcast data every 10 seconds
// In your cron job, make sure you're sending the session data correctly:
cron.schedule('*/10 * * * * *', async () => {
  try {
    const sessionData = await fetchSessionData()
    const timingData = await fetchTimingData(sessionData?.session_key || 'latest')
    
    // Properly calculate live status
    const isLive = sessionData ? checkIfSessionIsLive(sessionData) : false
    
    const payload = {
      ...timingData,
      currentSession: sessionData,
      isLive: isLive, // ✅ Now properly calculated
      timestamp: new Date().toISOString()
    }
    
    io.to('live-timing').emit('live_data_update', payload)
    
    console.log(`Broadcasting session: ${sessionData?.session_name || 'None'} - Live: ${isLive}`)
  } catch (error) {
    console.error('Error in scheduled data fetch:', error)
  }
})

// Helper function to check if session is live
function checkIfSessionIsLive(session) {
  if (!session || !session.date_start || !session.date_end) return false
  
  const now = new Date()
  const start = new Date(session.date_start)
  const end = new Date(session.date_end)
  
  return now >= start && now <= end
}


const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`F1 Live Server running on port ${PORT}`);
});
