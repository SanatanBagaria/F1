const express = require('express');
const router = express.Router();
const jolpicaService = require('../services/jolpicaService');
const openf1Service = require('../services/openf1Service');
const newsService = require('../services/newsService');
const helpers = require('../utils/helpers');
const logger = require('../utils/logger');

// Season-specific sessions route
router.get('/sessions/:season', async (req, res, next) => {
  try {
    const season = req.params.season;
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
    next(error);
  }
});

// General sessions route (current season)
router.get('/sessions', async (req, res, next) => {
  try {
    const season = req.query.season || 'current';
    const races = await jolpicaService.fetchSeasonSchedule(season);
    res.json(races);
  } catch (error) {
    next(error);
  }
});

// Driver Standings
router.get('/standings/drivers/:season?', async (req, res, next) => {
  try {
    const season = req.params.season || 'current';
    const standings = await jolpicaService.fetchDriverStandings(season);
    res.json(standings);
  } catch (error) {
    next(error);
  }
});

// Constructor Standings
router.get('/standings/teams/:season?', async (req, res, next) => {
  try {
    const season = req.params.season || 'current';
    const standings = await jolpicaService.fetchConstructorStandings(season);
    res.json(standings);
  } catch (error) {
    next(error);
  }
});

// Race results
router.get('/results/:season/:round', async (req, res, next) => {
  try {
    const { season, round } = req.params;
    const results = await jolpicaService.fetchRaceResults(season, round);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Qualifying results
router.get('/qualifying/:season/:round', async (req, res, next) => {
  try {
    const { season, round } = req.params;
    const results = await jolpicaService.fetchQualifyingResults(season, round);
    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Driver info directory
router.get('/drivers/:driverId?', async (req, res, next) => {
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
    next(error);
  }
});

// Driver Podiums count helper
router.get('/driver-podiums/:season', async (req, res, next) => {
  try {
    const season = req.params.season;
    const races = await jolpicaService.fetchSeasonResults(season);
    
    const driverPodiums = {};
    races.forEach(race => {
      if (race.Results) {
        race.Results.forEach(result => {
          const driverId = result.Driver.driverId;
          const position = parseInt(result.position);
          
          if (!driverPodiums[driverId]) {
            driverPodiums[driverId] = 0;
          }
          if (position <= 3) {
            driverPodiums[driverId]++;
          }
        });
      }
    });
    
    res.json(driverPodiums);
  } catch (error) {
    next(error);
  }
});

// Teams directory
router.get('/teams/:constructorId?', async (req, res, next) => {
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
    next(error);
  }
});

// Enhanced standings with live session reference
router.get('/enhanced/standings/drivers/:season?', async (req, res, next) => {
  try {
    const season = req.params.season || 'current';
    const standings = await jolpicaService.fetchDriverStandings(season);
    
    if (season === 'current') {
      try {
        const sessionData = await openf1Service.fetchSessionData();
        if (sessionData && helpers.checkIfSessionIsLive(sessionData)) {
          res.json({
            standings,
            liveSession: sessionData,
            isLive: true,
            timestamp: new Date().toISOString()
          });
          return;
        }
      } catch (liveError) {
        // Log warnings as safe recovery without breaking standings endpoint
        logger.warn('Failed to fetch live session data for enhanced standings:', liveError.message);
      }
    }
    
    res.json({
      standings,
      isLive: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

// Dynamic News Aggregator endpoint
router.get('/news', async (req, res, next) => {
  try {
    const articles = await newsService.getLatestNews();
    res.json(articles);
  } catch (error) {
    next(error);
  }
});

// Circuit Weather Telemetry endpoint
router.get('/weather/:sessionKey', async (req, res, next) => {
  try {
    const weatherData = await openf1Service.fetchWeather(req.params.sessionKey);
    res.json(weatherData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
