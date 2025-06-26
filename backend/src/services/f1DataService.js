// backend/src/services/f1Service.js (same filename, same export)
const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const OPENF1_BASE_URL = 'https://api.openf1.org/v1';



class F1Service {
  constructor() {
    this.jolpicaRateLimit = {
      requests: 0,
      resetTime: Date.now() + 3600000
    };
  }

   async getTeamDetails(season = 'current') {
    try {
      const teams = await teamDataService.getTeamDetails(season);
      return {
        data: teams,
        source: 'Jolpica F1 API'
      };
    } catch (error) {
      console.error('Error in getTeamDetails:', error);
      throw error;
    }
  }

  async getConstructorStandings(season = 'current') {
    try {
      const standings = await teamDataService.getConstructorStandings(season);
      return {
        data: standings,
        source: 'Jolpica F1 API'
      };
    } catch (error) {
      console.error('Error in getConstructorStandings:', error);
      throw error;
    }
  }

  async checkJolpicaRateLimit() {
    if (Date.now() > this.jolpicaRateLimit.resetTime) {
      this.jolpicaRateLimit.requests = 0;
      this.jolpicaRateLimit.resetTime = Date.now() + 3600000;
    }
    
    if (this.jolpicaRateLimit.requests >= 200) {
      throw new Error('Jolpica rate limit exceeded');
    }
    
    this.jolpicaRateLimit.requests++;
  }

  // Replace Ergast calls with Jolpica (same method names)
  async getCurrentSeason() {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/current.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races;
    } catch (error) {
      console.error('Error fetching current season:', error);
      throw error;
    }
  }

  async getDriverStandings(season = 'current') {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${season}/driverStandings.json`);
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
      console.error('Error fetching driver standings:', error);
      throw error;
    }
  }

  async getConstructorStandings(season = 'current') {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${season}/constructorStandings.json`);
      const data = await response.json();
      return data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    } catch (error) {
      console.error('Error fetching constructor standings:', error);
      throw error;
    }
  }

  async getRaceResults(season, round) {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${season}/${round}/results.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races[0]?.Results || [];
    } catch (error) {
      console.error('Error fetching race results:', error);
      throw error;
    }
  }

  async getDriverInfo(driverId) {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/drivers/${driverId}.json`);
      const data = await response.json();
      return data.MRData.DriverTable.Drivers[0];
    } catch (error) {
      console.error('Error fetching driver info:', error);
      throw error;
    }
  }

  async getConstructorInfo(constructorId) {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/constructors/${constructorId}.json`);
      const data = await response.json();
      return data.MRData.ConstructorTable.Constructors[0];
    } catch (error) {
      console.error('Error fetching constructor info:', error);
      throw error;
    }
  }

  async getQualifyingResults(season, round) {
    await this.checkJolpicaRateLimit();
    try {
      const response = await fetch(`${JOLPICA_BASE_URL}/${season}/${round}/qualifying.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races[0]?.QualifyingResults || [];
    } catch (error) {
      console.error('Error fetching qualifying results:', error);
      throw error;
    }
  }

  // Add OpenF1 methods to existing service (same class)
  async getLiveSessions() {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/sessions?date_start>=2025-01-01`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching live sessions:', error);
      throw error;
    }
  }

  async getSessionDrivers(sessionKey) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/drivers?session_key=${sessionKey}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching session drivers:', error);
      throw error;
    }
  }

  async getLiveCarData(sessionKey, driverNumber, limit = 100) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/car_data?session_key=${sessionKey}&driver_number=${driverNumber}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching live car data:', error);
      throw error;
    }
  }

  async getLivePositions(sessionKey, limit = 100) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/position?session_key=${sessionKey}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching live positions:', error);
      throw error;
    }
  }

  async getLiveLaps(sessionKey, limit = 100) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/laps?session_key=${sessionKey}&limit=${limit}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching live laps:', error);
      throw error;
    }
  }

  async getDriverLocation(sessionKey, driverNumber, startDate, endDate) {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/location?session_key=${sessionKey}&driver_number=${driverNumber}&date>${startDate}&date<${endDate}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching driver location:', error);
      throw error;
    }
  }

  async getCurrentMeetings() {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/meetings?year=2025`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching current meetings:', error);
      throw error;
    }
  }
}

// Keep same export
module.exports = new F1Service();
