import { ERGAST_BASE_URL, API_SOURCES } from '../base/constants.js'
import { 
  transformDriverStandingsData, 
  transformConstructorStandingsData 
} from '../transformers/standingsTransformers.js'

export class StandingsDataService {
  // Get driver standings for a specific season
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

  // Get constructor standings for a specific season
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

  // Get current championship leaders
  async getCurrentChampionshipLeaders(season = new Date().getFullYear()) {
    try {
      const [driverStandings, constructorStandings] = await Promise.all([
        this.getDriverStandings(season),
        this.getConstructorStandings(season)
      ])

      return {
        data: {
          driverLeader: driverStandings.data[0] || null,
          constructorLeader: constructorStandings.data[0] || null,
          lastUpdated: new Date().toISOString()
        },
        source: API_SOURCES.ERGAST
      }
    } catch (error) {
      console.error("Error fetching championship leaders:", error)
      throw error
    }
  }

  // Get standings comparison between two seasons
  async getStandingsComparison(season1, season2) {
    try {
      const [standings1, standings2] = await Promise.all([
        this.getDriverStandings(season1),
        this.getDriverStandings(season2)
      ])

      const comparison = {
        season1: {
          year: season1,
          standings: standings1.data
        },
        season2: {
          year: season2,
          standings: standings2.data
        },
        comparison: this.compareStandings(standings1.data, standings2.data)
      }

      return {
        data: comparison,
        source: API_SOURCES.ERGAST
      }
    } catch (error) {
      console.error("Error fetching standings comparison:", error)
      throw error
    }
  }

  // Helper method to compare standings between seasons
  compareStandings(standings1, standings2) {
    const comparison = []
    
    standings1.forEach(driver1 => {
      const driver2 = standings2.find(d => d.driver.id === driver1.driver.id)
      if (driver2) {
        comparison.push({
          driver: driver1.driver,
          season1Position: driver1.position,
          season2Position: driver2.position,
          positionChange: driver2.position - driver1.position,
          season1Points: driver1.points,
          season2Points: driver2.points,
          pointsChange: driver2.points - driver1.points
        })
      }
    })

    return comparison.sort((a, b) => a.season2Position - b.season2Position)
  }

  // Get top N drivers from standings
  async getTopDrivers(season = new Date().getFullYear(), limit = 10) {
    try {
      const standings = await this.getDriverStandings(season)
      return {
        data: standings.data.slice(0, limit),
        source: standings.source
      }
    } catch (error) {
      console.error("Error fetching top drivers:", error)
      throw error
    }
  }

  // Get top N constructors from standings
  async getTopConstructors(season = new Date().getFullYear(), limit = 10) {
    try {
      const standings = await this.getConstructorStandings(season)
      return {
        data: standings.data.slice(0, limit),
        source: standings.source
      }
    } catch (error) {
      console.error("Error fetching top constructors:", error)
      throw error
    }
  }

  // Get standings for a specific driver across multiple seasons
  async getDriverStandingsHistory(driverId, startYear, endYear = new Date().getFullYear()) {
    try {
      const seasons = []
      for (let year = startYear; year <= endYear; year++) {
        seasons.push(year)
      }

      const standingsPromises = seasons.map(async (year) => {
        try {
          const standings = await this.getDriverStandings(year)
          const driverStanding = standings.data.find(s => s.driver.id === driverId)
          return driverStanding ? { year, ...driverStanding } : null
        } catch (error) {
          console.warn(`Failed to fetch standings for ${year}:`, error)
          return null
        }
      })

      const results = await Promise.all(standingsPromises)
      return {
        data: results.filter(result => result !== null),
        source: API_SOURCES.ERGAST
      }
    } catch (error) {
      console.error("Error fetching driver standings history:", error)
      throw error
    }
  }

  // Get standings for a specific constructor across multiple seasons
  async getConstructorStandingsHistory(constructorId, startYear, endYear = new Date().getFullYear()) {
    try {
      const seasons = []
      for (let year = startYear; year <= endYear; year++) {
        seasons.push(year)
      }

      const standingsPromises = seasons.map(async (year) => {
        try {
          const standings = await this.getConstructorStandings(year)
          const constructorStanding = standings.data.find(s => s.constructor.id === constructorId)
          return constructorStanding ? { year, ...constructorStanding } : null
        } catch (error) {
          console.warn(`Failed to fetch constructor standings for ${year}:`, error)
          return null
        }
      })

      const results = await Promise.all(standingsPromises)
      return {
        data: results.filter(result => result !== null),
        source: API_SOURCES.ERGAST
      }
    } catch (error) {
      console.error("Error fetching constructor standings history:", error)
      throw error
    }
  }
}
