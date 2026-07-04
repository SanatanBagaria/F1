const axios = require('axios');
const cacheService = require('./cacheService');
const logger = require('../utils/logger');

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

  getSeasonTTL: function(season) {
    const currentYear = new Date().getFullYear();
    if (season === 'current' || season === String(currentYear)) {
      return 10 * 60 * 1000; // 10 minutes for current season
    }
    return 24 * 60 * 60 * 1000; // 24 hours for historical data
  },

  fetchWithCache: async function(cacheKey, ttl, apiCall) {
    const cached = cacheService.get(cacheKey);
    if (cached) {
      return cached;
    }
    this.checkRateLimit();
    const data = await apiCall();
    cacheService.set(cacheKey, data, ttl);
    return data;
  },

  fetchCurrentSeason: async function() {
    return this.fetchWithCache('jolpica:current_season', 10 * 60 * 1000, async () => {
      try {
        const response = await axios.get('https://api.jolpi.ca/ergast/f1/current.json');
        return response.data.MRData.RaceTable.Races;
      } catch (error) {
        logger.error('Failed to fetch current season from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchSeasonSchedule: async function(season) {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:schedule:${season}`, ttl, async () => {
      try {
        logger.info(`Fetching Jolpica data for season: ${season}`);
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}.json`);
        const races = response.data.MRData?.RaceTable?.Races || [];
        logger.info(`Jolpica returned ${races.length} races for ${season}`);
        return races;
      } catch (error) {
        if (error.response?.status === 404) {
          logger.info(`No data available for season ${season}`);
          return [];
        }
        logger.error('Failed to fetch season schedule from Jolpica', { 
          error: error.message, 
          season,
          status: error.response?.status 
        });
        throw error;
      }
    });
  },

  fetchDriverStandings: async function(season = 'current') {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:driver_standings:${season}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/driverStandings.json`);
        return response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
      } catch (error) {
        logger.error('Failed to fetch driver standings from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchConstructorStandings: async function(season = 'current') {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:constructor_standings:${season}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructorStandings.json`);
        return response.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
      } catch (error) {
        logger.error('Failed to fetch constructor standings from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchRaceResults: async function(season, round) {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:results:${season}:${round}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/${round}/results.json`);
        return response.data.MRData.RaceTable.Races[0]?.Results || [];
      } catch (error) {
        logger.error('Failed to fetch race results from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchQualifyingResults: async function(season, round) {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:qualifying:${season}:${round}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/${round}/qualifying.json`);
        return response.data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
      } catch (error) {
        logger.error('Failed to fetch qualifying results from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchDriverInfo: async function(driverId) {
    return this.fetchWithCache(`jolpica:driver:${driverId}`, 24 * 60 * 60 * 1000, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/drivers/${driverId}.json`);
        return response.data.MRData.DriverTable.Drivers[0];
      } catch (error) {
        logger.error('Failed to fetch driver info from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchConstructorInfo: async function(constructorId) {
    return this.fetchWithCache(`jolpica:constructor:${constructorId}`, 24 * 60 * 60 * 1000, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/constructors/${constructorId}.json`);
        return response.data.MRData.ConstructorTable.Constructors[0];
      } catch (error) {
        logger.error('Failed to fetch constructor info from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchAllDrivers: async function(season = 'current') {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:all_drivers:${season}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/drivers.json`);
        return response.data.MRData.DriverTable.Drivers;
      } catch (error) {
        logger.error('Failed to fetch all drivers from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchAllConstructors: async function(season = 'current') {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:all_constructors:${season}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/constructors.json`);
        return response.data.MRData.ConstructorTable.Constructors;
      } catch (error) {
        logger.error('Failed to fetch all constructors from Jolpica', { error: error.message });
        throw error;
      }
    });
  },

  fetchSeasonResults: async function(season) {
    const ttl = this.getSeasonTTL(season);
    return this.fetchWithCache(`jolpica:season_results:${season}`, ttl, async () => {
      try {
        const response = await axios.get(`https://api.jolpi.ca/ergast/f1/${season}/results.json?limit=1000`);
        return response.data.MRData.RaceTable.Races || [];
      } catch (error) {
        logger.error('Failed to fetch season results from Jolpica', { error: error.message, season });
        throw error;
      }
    });
  }
};

module.exports = jolpicaService;
