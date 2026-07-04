const cron = require('node-cron');
const config = require('../config/config');
const openf1Service = require('../services/openf1Service');
const helpers = require('../utils/helpers');
const logger = require('../utils/logger');

// Local socket rate limiting state
const socketRateLimits = new Map();

function initSocketManager(io) {
  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    socket.on('join_live_timing', () => {
      const now = Date.now();
      const lastJoin = socketRateLimits.get(socket.id) || 0;
      
      if (now - lastJoin < 5000) {
        socket.emit('error', { message: 'Join requests too frequent' });
        logger.warn(`Join request throttled for client ${socket.id}`);
        return;
      }
      
      socketRateLimits.set(socket.id, now);
      socket.join('live-timing');
      sendInitialData(socket);
      logger.info(`Client ${socket.id} joined live-timing room`);
    });

    socket.on('ping', (data) => {
      socket.emit('pong', data);
    });

    socket.on('disconnect', () => {
      socketRateLimits.delete(socket.id);
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  async function sendInitialData(socket) {
    try {
      let sessionData = await openf1Service.fetchSessionData();
      let sessionKey = sessionData?.session_key || 9565;
      let timingData = await openf1Service.fetchTimingData(sessionKey);
      
      // Fallback if the telemetry feeds are completely empty (e.g. placeholder sessions)
      if (!timingData.drivers || timingData.drivers.length === 0) {
        sessionKey = 9565;
        timingData = await openf1Service.fetchTimingData(sessionKey);
        sessionData = {
          session_key: 9565,
          session_name: "Abu Dhabi Grand Prix - Race (Replay)",
          date_start: "2023-11-26T13:00:00.000Z",
          date_end: "2023-11-26T15:00:00.000Z",
          location: "Yas Marina",
          country_code: "UAE"
        };
      }

      const nextSession = await openf1Service.fetchNextSession();

      socket.emit('session_info', {
        currentSession: sessionData,
        nextSession: nextSession,
        isLive: helpers.checkIfSessionIsLive(sessionData)
      });
      
      socket.emit('live_data_update', {
        drivers: timingData.drivers,
        intervals: timingData.intervals,
        carData: timingData.carData,
        currentSession: sessionData,
        nextSession: nextSession,
        isLive: helpers.checkIfSessionIsLive(sessionData),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Failed to send initial socket data', { error: error.message });
      socket.emit('error', { message: 'Failed to fetch initial data' });
    }
  }

  // Setup live timing broadcast cron
  cron.schedule(config.POLL_INTERVAL, async () => {
    // Skip polling if no clients are connected to the live-timing room
    const clientsCount = io.sockets.adapter.rooms.get('live-timing')?.size || 0;
    if (clientsCount === 0) {
      return;
    }

    try {
      let sessionData = await openf1Service.fetchSessionData();
      let sessionKey = sessionData?.session_key || 9565;
      let sessionType = (sessionData?.session_name || "").toLowerCase();

      let drivers, intervals, carData;
      
      if (sessionType.includes('practice') || sessionType.includes('qualifying')) {
        drivers = await openf1Service.fetchLiveTimingFromLaps(sessionKey);
        intervals = [];
        carData = [];
      } else {
        const timingData = await openf1Service.fetchTimingData(sessionKey);
        drivers = timingData.drivers;
        intervals = timingData.intervals;
        carData = timingData.carData;
      }

      // Fallback if the telemetry feeds are completely empty (e.g. placeholder sessions)
      if (!drivers || drivers.length === 0) {
        sessionKey = 9565;
        const timingData = await openf1Service.fetchTimingData(sessionKey);
        drivers = timingData.drivers;
        intervals = timingData.intervals;
        carData = timingData.carData;
        sessionData = {
          session_key: 9565,
          session_name: "Abu Dhabi Grand Prix - Race (Replay)",
          date_start: "2023-11-26T13:00:00.000Z",
          date_end: "2023-11-26T15:00:00.000Z",
          location: "Yas Marina",
          country_code: "UAE"
        };
      }

      const nextSession = await openf1Service.fetchNextSession();

      const payload = {
        drivers,
        intervals,
        carData,
        currentSession: sessionData,
        nextSession: nextSession,
        isLive: helpers.checkIfSessionIsLive(sessionData),
        timestamp: new Date().toISOString()
      };

      io.to('live-timing').emit('live_data_update', payload);
      logger.info('Broadcasted live data update', { 
        session: sessionData?.session_name,
        clientsCount 
      });
    } catch (error) {
      logger.error('Background timing cron job failed', { error: error.message });
      io.to('live-timing').emit('error', { 
        message: 'Failed to update data',
        timestamp: new Date().toISOString()
      });
    }
  });
}

module.exports = { initSocketManager };
