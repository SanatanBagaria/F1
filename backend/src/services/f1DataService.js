const fetch = require('node-fetch');
const DataCache = require('../utils/dataCache');
const logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/socketEvents');

class F1DataService {
  constructor() {
    this.baseUrl = 'https://api.openf1.org/v1';
    this.cache = new DataCache();
    this.currentSessionKey = null;
    this.isLive = false;
  }

  async getCurrentSession() {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(`${this.baseUrl}/sessions?year=${currentYear}&limit=10`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const sessions = await response.json();
      
      if (sessions.length === 0) {
        return null;
      }

      // Sort by date and get most recent
      const sortedSessions = sessions.sort((a, b) => 
        new Date(b.date_start) - new Date(a.date_start)
      );
      
      const currentSession = sortedSessions[0];
      this.currentSessionKey = currentSession.session_key;
      
      // Check if session is live
      const now = new Date();
      const sessionStart = new Date(currentSession.date_start);
      const sessionEnd = new Date(currentSession.date_end);
      
      this.isLive = now >= sessionStart && now <= sessionEnd;
      
      return currentSession;
    } catch (error) {
      logger.error('Error fetching current session:', error);
      return null;
    }
  }

  async fetchLiveTimingData(sessionKey) {
    try {
      const [driversRes, intervalsRes, carDataRes] = await Promise.allSettled([
        fetch(`${this.baseUrl}/drivers?session_key=${sessionKey}`),
        fetch(`${this.baseUrl}/intervals?session_key=${sessionKey}&limit=20`),
        fetch(`${this.baseUrl}/car_data?session_key=${sessionKey}&limit=20`)
      ]);

      const data = {
        drivers: driversRes.status === 'fulfilled' && driversRes.value.ok 
          ? await driversRes.value.json() : [],
        intervals: intervalsRes.status === 'fulfilled' && intervalsRes.value.ok 
          ? await intervalsRes.value.json() : [],
        carData: carDataRes.status === 'fulfilled' && carDataRes.value.ok 
          ? await carDataRes.value.json() : [],
        timestamp: new Date().toISOString()
      };

      return data;
    } catch (error) {
      logger.error('Error fetching live timing data:', error);
      return { drivers: [], intervals: [], carData: [], timestamp: new Date().toISOString() };
    }
  }

  async fetchAndBroadcastLiveData(io) {
    try {
      // Get current session
      const currentSession = await this.getCurrentSession();
      
      if (!currentSession) {
        return;
      }

      // Fetch live data
      const liveData = await this.fetchLiveTimingData(this.currentSessionKey);
      
      // Check if data has changed
      const dataKey = `live_data_${this.currentSessionKey}`;
      const cachedData = this.cache.get(dataKey);
      const dataString = JSON.stringify(liveData);
      
      if (cachedData !== dataString) {
        // Data has changed, broadcast update
        const payload = {
          ...liveData,
          currentSession,
          isLive: this.isLive,
          sessionKey: this.currentSessionKey
        };

        // Broadcast to all clients in live room
        io.to('live-timing').emit(SOCKET_EVENTS.LIVE_DATA_UPDATE, payload);
        
        // Cache the new data
        this.cache.set(dataKey, dataString);
        
        logger.info(`Broadcasted live data update to ${io.sockets.adapter.rooms.get('live-timing')?.size || 0} clients`);
      }
    } catch (error) {
      logger.error('Error in fetchAndBroadcastLiveData:', error);
      
      // Broadcast error to clients
      io.to('live-timing').emit(SOCKET_EVENTS.ERROR, {
        message: 'Failed to fetch live data',
        timestamp: new Date().toISOString()
      });
    }
  }

  async getSessionHistory(limit = 10) {
    try {
      const currentYear = new Date().getFullYear();
      const response = await fetch(`${this.baseUrl}/sessions?year=${currentYear}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      logger.error('Error fetching session history:', error);
      return [];
    }
  }
}

module.exports = F1DataService;
