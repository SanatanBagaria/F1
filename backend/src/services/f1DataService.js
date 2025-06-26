const fetch = require('node-fetch');
const DataCache = require('../utils/dataCache');
const logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/socketEvents');

// ==== Helpers ====
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

class F1DataService {
  constructor() {
    this.baseUrl = 'https://api.openf1.org/v1';
    this.cache = new DataCache();
    this.currentSessionKey = null;
    this.isLive = false;
    this.manualSessionKey = null; // For testing historical sessions
  }

  // Set a manual session key for testing
  setSessionKey(sessionKey) {
    this.manualSessionKey = sessionKey;
    this.isLive = false;
    logger.info(`Manual sessionKey set for testing: ${sessionKey}`);
  }

  async getCurrentSession() {
    try {
      if (this.manualSessionKey) {
        const resp = await fetch(`${this.baseUrl}/sessions?session_key=${this.manualSessionKey}`);
        const sessions = resp.ok ? await resp.json() : [];
        if (sessions.length === 0) return null;
        const currentSession = sessions[0];
        this.currentSessionKey = currentSession.session_key;
        this.isLive = false;
        return currentSession;
      }
      const currentYear = new Date().getFullYear();
      const response = await fetch(`${this.baseUrl}/sessions?year=${currentYear}&limit=10`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const sessions = await response.json();
      if (sessions.length === 0) {
        return null;
      }
      const sortedSessions = sessions.sort((a, b) =>
        new Date(b.date_start) - new Date(a.date_start)
      );
      const currentSession = sortedSessions[0];
      this.currentSessionKey = currentSession.session_key;
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

  // Practice/Quali: /laps based timing with interval/gap
  async fetchPracticeQualiTiming(sessionKey) {
    // Fetch drivers for name/team join (if available)
    let driversMap = {};
    try {
      const drRes = await fetch(`${this.baseUrl}/drivers?session_key=${sessionKey}`);
      if (drRes.ok) {
        const drArr = await drRes.json();
        if (Array.isArray(drArr)) {
          drArr.forEach(d => { driversMap[d.driver_number] = d; });
        }
      }
    } catch {}

    // Fetch all laps (NO LIMIT param!)
    let laps = [];
    try {
      const lapsRes = await fetch(`${this.baseUrl}/laps?session_key=${sessionKey}`);
      laps = lapsRes.ok ? await lapsRes.json() : [];
    } catch {}

    // Find best lap per driver
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

    // Sort and add position, driver info, formatted lap time
    let standings = Object.values(bestLaps).sort((a, b) => a.lap_duration - b.lap_duration);
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

  // Race: normal timing data
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

  // Main broadcast logic
  async fetchAndBroadcastLiveData(io) {
    try {
      let sessionKeyToUse = this.manualSessionKey || null;
      let currentSession = null;
      if (sessionKeyToUse) {
        const resp = await fetch(`${this.baseUrl}/sessions?session_key=${sessionKeyToUse}`);
        currentSession = resp.ok ? (await resp.json())[0] : null;
        this.currentSessionKey = sessionKeyToUse;
        this.isLive = false;
      } else {
        currentSession = await this.getCurrentSession();
        if (!currentSession) return;
        sessionKeyToUse = this.currentSessionKey;
      }

      // Decide session type
      const sessionType = (currentSession?.session_name || "").toLowerCase();

      let drivers = [];
      let intervals = [];
      let carData = [];

      if (sessionType.includes('practice') || sessionType.includes('qualifying')) {
        drivers = await this.fetchPracticeQualiTiming(sessionKeyToUse);
        intervals = [];
        carData = [];
      } else {
        const liveData = await this.fetchLiveTimingData(sessionKeyToUse);
        drivers = liveData.drivers || [];
        intervals = liveData.intervals || [];
        carData = liveData.carData || [];
      }

      // Check if data has changed
      const dataKey = `live_data_${sessionKeyToUse}`;
      const dataString = JSON.stringify({ drivers, intervals, carData });
      const cachedData = this.cache.get(dataKey);

      if (cachedData !== dataString) {
        const payload = {
          drivers,
          intervals,
          carData,
          currentSession,
          isLive: this.isLive,
          sessionKey: sessionKeyToUse,
          timestamp: new Date().toISOString()
        };

        io.to('live-timing').emit(SOCKET_EVENTS.LIVE_DATA_UPDATE, payload);
        this.cache.set(dataKey, dataString);
        logger.info(`Broadcasted live data update to ${io.sockets.adapter.rooms.get('live-timing')?.size || 0} clients`);
      }
    } catch (error) {
      logger.error('Error in fetchAndBroadcastLiveData:', error);
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
