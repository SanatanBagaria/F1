import { ERGAST_BASE_URL, OPENF1_BASE_URL, API_SOURCES } from '../base/constants.js'
import { 
  transformErgastTeamsData, 
  transformConstructorStandingsData, 
  extractTeamsFromDrivers,
  combineTeamData 
} from '../transformers/teamTransformers.js'

export class TeamDataService {
  // Main method to get teams based on preferred API
  async getTeams(season = new Date().getFullYear(), preferredApi = API_SOURCES.AUTO) {
    const currentYear = new Date().getFullYear()

    // For historical seasons, always use Ergast
    if (season < currentYear) {
      return this.getTeamsFromErgast(season)
    }

    // For current/future seasons, use preferred API
    if (preferredApi === API_SOURCES.ERGAST) {
      return this.getTeamsFromErgast(season)
    } else if (preferredApi === API_SOURCES.OPENF1) {
      return this.getTeamsFromOpenF1()
    } else {
      // AUTO - try OpenF1 first, fallback to Ergast
      try {
        const teams = await this.getTeamsFromOpenF1()
        return teams
      } catch (error) {
        console.warn("OpenF1 team fetch failed, falling back to Ergast", error)
        return this.getTeamsFromErgast(season)
      }
    }
  }

  // Get teams from OpenF1
  async getTeamsFromOpenF1() {
    try {
      // First try to get drivers to extract team information
      const driversResponse = await fetch(`${OPENF1_BASE_URL}/drivers?session_key=latest`)

      if (!driversResponse.ok) {
        const fallbackResponse = await fetch(`${OPENF1_BASE_URL}/drivers?session_key=9158`)
        if (!fallbackResponse.ok) {
          throw new Error(`HTTP error! status: ${fallbackResponse.status}`)
        }
        const fallbackData = await fallbackResponse.json()
        return {
          data: extractTeamsFromDrivers(fallbackData),
          source: API_SOURCES.OPENF1,
        }
      }

      const driversData = await driversResponse.json()
      return {
        data: extractTeamsFromDrivers(driversData),
        source: API_SOURCES.OPENF1,
      }
    } catch (error) {
      console.error("Error fetching teams from OpenF1:", error)
      throw error
    }
  }

  // Get teams from Ergast
  async getTeamsFromErgast(season = new Date().getFullYear()) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/constructors.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformErgastTeamsData(data.MRData.ConstructorTable.Constructors),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching teams from Ergast:", error)
      throw error
    }
  }

  // Get constructor standings
  async getConstructorStandings(season = new Date().getFullYear()) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/constructorStandings.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformConstructorStandingsData(
          data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [],
        ),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching constructor standings:", error)
      throw error
    }
  }

  // Get team details with drivers
  async getTeamDetails(season = new Date().getFullYear(), preferredApi = API_SOURCES.AUTO) {
    try {
      // Get teams and drivers using the preferred API
      const [teamsResult, driversResult] = await Promise.all([
        this.getTeams(season, preferredApi), 
        // You'll need to import DriverDataService or pass it as dependency
        new (await import('./driverData.js')).DriverDataService().getDrivers(season, preferredApi)
      ])

      // Get standings from Ergast (only available source)
      const standingsResult = await this.getConstructorStandings(season)

      // Combine the data
      const combinedData = combineTeamData(teamsResult.data, driversResult.data, standingsResult.data)

      return {
        data: combinedData,
        sources: {
          teams: teamsResult.source,
          drivers: driversResult.source,
          standings: standingsResult.source,
        },
      }
    } catch (error) {
      console.error("Error fetching team details:", error)
      throw error
    }
  }
}
