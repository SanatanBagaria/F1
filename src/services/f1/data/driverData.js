import { ERGAST_BASE_URL, OPENF1_BASE_URL, API_SOURCES } from '../base/constants.js'
import { 
  transformOpenF1DriversData, 
  transformErgastDriversData, 
  transformDriverStandingsData 
} from '../transformers/driverTransformers.js'

export class DriverDataService {
  constructor() {
    // CRITICAL DEBUG: Check what URL is actually being used
    console.log('DriverDataService initialized with ERGAST_BASE_URL:', ERGAST_BASE_URL);
    
    // If this shows ergast.com, your constants file is wrong!
    if (ERGAST_BASE_URL.includes('ergast.com')) {
      console.error('❌ CRITICAL ERROR: Still using old Ergast API!');
      console.error('Your constants file must be updated to use: https://api.jolpi.ca/ergast/f1');
    } else {
      console.log('✅ Using correct Jolpica API');
    }
  }

  // Main method to get drivers based on preferred API
  async getDrivers(season = new Date().getFullYear(), preferredApi = API_SOURCES.AUTO) {
    const currentYear = new Date().getFullYear()

    // For historical seasons, always use Jolpica (Ergast replacement)
    if (season < currentYear) {
      return this.getDriversFromErgast(season)
    }

    // For current/future seasons, use preferred API
    if (preferredApi === API_SOURCES.ERGAST) {
      return this.getDriversFromErgast(season)
    } else if (preferredApi === API_SOURCES.OPENF1) {
      return this.getDriversFromOpenF1()
    } else {
      // AUTO - try OpenF1 first, fallback to Jolpica
      try {
        const drivers = await this.getDriversFromOpenF1()
        return drivers
      } catch (error) {
        console.warn("OpenF1 driver fetch failed, falling back to Jolpica", error)
        return this.getDriversFromErgast(season)
      }
    }
  }

  // Get drivers from OpenF1
  async getDriversFromOpenF1() {
    try {
      console.log('Fetching drivers from OpenF1...');
      
      // Try latest session first
      const driversResponse = await fetch(`${OPENF1_BASE_URL}/drivers?session_key=latest`)

      if (!driversResponse.ok) {
        // Fallback to a known recent session
        const fallbackResponse = await fetch(`${OPENF1_BASE_URL}/drivers?session_key=9158`) // 2024 season
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error! status: ${fallbackResponse.status}`)
        }
        const fallbackData = await fallbackResponse.json()
        return {
          data: transformOpenF1DriversData(fallbackData),
          source: API_SOURCES.OPENF1,
        }
      }

      const driversData = await driversResponse.json()
      return {
        data: transformOpenF1DriversData(driversData),
        source: API_SOURCES.OPENF1,
      }
    } catch (error) {
      console.error("Error fetching drivers from OpenF1:", error)
      throw error
    }
  }

  // Get drivers from Jolpica (Ergast replacement)
  async getDriversFromErgast(season = new Date().getFullYear()) {
    try {
      const url = `${ERGAST_BASE_URL}/${season}/drivers.json`;
      console.log('Fetching drivers from URL:', url);
      
      // TEMPORARY HARDCODE FIX - Remove this once constants are fixed
      const fixedUrl = url.replace('ergast.com/api/f1', 'api.jolpi.ca/ergast/f1');
      console.log('Using corrected URL:', fixedUrl);
      
      const response = await fetch(fixedUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformErgastDriversData(data.MRData.DriverTable.Drivers),
        source: 'Jolpica F1 API', // Updated source name
      }
    } catch (error) {
      console.error("Error fetching drivers from Jolpica:", error)
      throw error
    }
  }

  // Get driver standings
  async getDriverStandings(season = new Date().getFullYear()) {
    try {
      const url = `${ERGAST_BASE_URL}/${season}/driverStandings.json`;
      console.log('Fetching driver standings from URL:', url);
      
      // TEMPORARY HARDCODE FIX - Remove this once constants are fixed
      const fixedUrl = url.replace('ergast.com/api/f1', 'api.jolpi.ca/ergast/f1');
      console.log('Using corrected URL:', fixedUrl);
      
      const response = await fetch(fixedUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformDriverStandingsData(data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []),
        source: 'Jolpica F1 API', // Updated source name
      }
    } catch (error) {
      console.error("Error fetching driver standings from Jolpica:", error)
      throw error
    }
  }
}
