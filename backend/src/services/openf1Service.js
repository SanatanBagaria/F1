const axios = require('axios');
const config = require('../config/config');
const cacheService = require('./cacheService');
const helpers = require('../utils/helpers');
const logger = require('../utils/logger');

// Local driver cache for OpenF1 sessions
const driverCache = {};

const openf1Service = {
  fetchSessionData: async () => {
    const cacheKey = 'openf1:session_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      let data = null;
      if (config.TEST_SESSION_KEY) {
        const response = await axios.get(
          `https://api.openf1.org/v1/sessions?session_key=${config.TEST_SESSION_KEY}`
        );
        data = response.data?.[0] || null;
      } else {
        let currentYear = new Date().getFullYear();
        let sessions = [];
        let pastOrLiveSessions = [];
        
        while (pastOrLiveSessions.length === 0 && currentYear > 2020) {
          try {
            logger.info(`Fetching OpenF1 sessions for year: ${currentYear}`);
            const response = await axios.get(
              `https://api.openf1.org/v1/sessions?year=${currentYear}`
            );
            sessions = response.data || [];
            
            const now = new Date();
            pastOrLiveSessions = sessions.filter(s => new Date(s.date_start) <= now);
            
            if (pastOrLiveSessions.length === 0) {
              currentYear--; // No past sessions in this year, check the previous year
            }
          } catch (err) {
            logger.error(`Error querying year ${currentYear}: ${err.message}`);
            currentYear--;
          }
        }

        if (pastOrLiveSessions.length > 0) {
          data = pastOrLiveSessions.sort((a, b) => 
            new Date(b.date_start) - new Date(a.date_start)
          )[0];
        } else if (sessions.length > 0) {
          // If absolutely nothing is in the past, take the earliest upcoming session
          data = sessions.sort((a, b) => 
            new Date(a.date_start) - new Date(b.date_start)
          )[0];
        }
      }
      cacheService.set(cacheKey, data, 60 * 1000); // Cache for 60 seconds
      return data;
    } catch (error) {
      logger.error('Failed to fetch session data', { error: error.message });
      return null;
    }
  },

  fetchAndCacheDrivers: async (sessionKey) => {
    try {
      const res = await axios.get(
        `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`
      );
      
      if (Array.isArray(res.data) && res.data.length > 0) {
        driverCache[sessionKey] = {};
        res.data.forEach(driver => {
          driverCache[sessionKey][driver.driver_number] = driver;
        });
        
        // Expire cache after TTL
        setTimeout(() => {
          delete driverCache[sessionKey];
        }, config.CACHE_TTL);
      }
    } catch (error) {
      logger.error('Failed to fetch drivers', { sessionKey, error: error.message });
    }
  },

  fetchLiveTimingFromLaps: async (sessionKey) => {
    try {
      if (!driverCache[sessionKey]) {
        await openf1Service.fetchAndCacheDrivers(sessionKey);
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
          const info = driverCache[sessionKey]?.[lap.driver_number] || {};
          return {
            ...lap,
            position: i + 1,
            driver_name: info.full_name || info.name_acronym || lap.driver_number,
            team_name: info.team_name || "Unknown",
            team_colour: info.team_colour || "888888",
            lap_time_formatted: helpers.formatLapTime(lap.lap_duration)
          };
        });

      // Add intervals
      if (standings.length > 0) {
        const leaderLap = standings[0].lap_duration;
        standings = standings.map((driver, idx) => {
          if (idx === 0) return { ...driver, interval: "-", gap: "-" };
          return {
            ...driver,
            interval: helpers.formatInterval(driver.lap_duration - standings[idx-1].lap_duration),
            gap: helpers.formatInterval(driver.lap_duration - leaderLap)
          };
        });
      }

      return standings;
    } catch (error) {
      logger.error('Failed to fetch lap timing', { sessionKey, error: error.message });
      return [];
    }
  },

  fetchTimingData: async (sessionKey = 'latest') => {
    try {
      const keyToUse = config.TEST_SESSION_KEY || sessionKey;
      
      const fetchOrFallback = async (url) => {
        try {
          const res = await axios.get(url);
          return res.data || [];
        } catch (err) {
          logger.warn(`Telemetry feed fetch failed or returned 404: ${url} (${err.message})`);
          return [];
        }
      };

      const [drivers, intervals, carData] = await Promise.all([
        fetchOrFallback(`https://api.openf1.org/v1/drivers?session_key=${keyToUse}&limit=1000`),
        fetchOrFallback(`https://api.openf1.org/v1/intervals?session_key=${keyToUse}&limit=1000`),
        fetchOrFallback(`https://api.openf1.org/v1/car_data?session_key=${keyToUse}&limit=1000`)
      ]);

      return { drivers, intervals, carData };
    } catch (error) {
      logger.error('Failed to fetch timing data', { sessionKey, error: error.message });
      return { drivers: [], intervals: [], carData: [] };
    }
  },

  fetchWeather: async (sessionKey = 'latest') => {
    try {
      const keyToUse = config.TEST_SESSION_KEY || sessionKey;
      const response = await axios.get(`https://api.openf1.org/v1/weather?session_key=${keyToUse}&limit=10`);
      return response.data || [];
    } catch (error) {
      logger.error('Failed to fetch weather data from OpenF1', { sessionKey, error: error.message });
      return [];
    }
  },

  fetchNextSession: async () => {
    const cacheKey = 'openf1:next_session_data';
    const cached = cacheService.get(cacheKey);
    if (cached) return cached;

    try {
      let currentYear = new Date().getFullYear();
      let response = await axios.get(
        `https://api.openf1.org/v1/sessions?year=${currentYear}`
      );
      let sessions = response.data || [];
      const now = new Date();
      
      const upcomingSessions = sessions
        .filter(s => new Date(s.date_start) > now)
        .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
        
      const data = upcomingSessions[0] || null;
      cacheService.set(cacheKey, data, 5 * 60 * 1000); // cache for 5 minutes
      return data;
    } catch (error) {
      logger.error('Failed to fetch next session data', { error: error.message });
      return null;
    }
  }
};

module.exports = openf1Service;
