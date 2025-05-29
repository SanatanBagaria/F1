import { ERGAST_BASE_URL, OPENF1_BASE_URL, API_SOURCES } from '../base/constants.js'
import { 
  transformOpenF1DriversData, 
  transformErgastDriversData, 
  transformDriverStandingsData 
} from '../transformers/driverTransformers.js'

export class DriverDataService {
  // Main method to get drivers based on preferred API
  async getDrivers(season = new Date().getFullYear(), preferredApi = API_SOURCES.AUTO) {
    const currentYear = new Date().getFullYear()

    // For historical seasons, always use Ergast
    if (season < currentYear) {
      return this.getDriversFromErgast(season)
    }

    // For current/future seasons, use preferred API
    if (preferredApi === API_SOURCES.ERGAST) {
      return this.getDriversFromErgast(season)
    } else if (preferredApi === API_SOURCES.OPENF1) {
      return this.getDriversFromOpenF1()
    } else {
      // AUTO - try OpenF1 first, fallback to Ergast
      try {
        const drivers = await this.getDriversFromOpenF1()
        return drivers
      } catch (error) {
        console.warn("OpenF1 driver fetch failed, falling back to Ergast", error)
        return this.getDriversFromErgast(season)
      }
    }
  }

  // Get drivers from OpenF1
  async getDriversFromOpenF1() {
    try {
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

  // Get drivers from Ergast
  async getDriversFromErgast(season = new Date().getFullYear()) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/drivers.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformErgastDriversData(data.MRData.DriverTable.Drivers),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching drivers from Ergast:", error)
      throw error
    }
  }

  // Get driver standings
  async getDriverStandings(season = new Date().getFullYear()) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/driverStandings.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformDriverStandingsData(data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching driver standings:", error)
      throw error
    }
  }
}
