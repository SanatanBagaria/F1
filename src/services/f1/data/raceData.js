import { ERGAST_BASE_URL, API_SOURCES } from '../base/constants.js'
import { 
  transformRaceScheduleData, 
  transformRaceResultsData, 
  transformSingleRaceData, 
  transformQualifyingResultsData, 
  transformSingleQualifyingData,
  transformChampionshipData 
} from '../transformers/raceTransformers.js'

export class RaceDataService {
  // Get race schedule for a season
  async getRaceSchedule(season = new Date().getFullYear()) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}.json?limit=100`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformRaceScheduleData(data.MRData.RaceTable.Races),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching race schedule:", error)
      throw error
    }
  }

  // Get race results for a specific season
  async getRaceResults(season = new Date().getFullYear()) {
    try {
      console.log(`Fetching race results for season ${season} using individual approach...`)
      
      // Use the individual fetching approach
      const races = await this.getRaceResultsIndividually(season)
      
      // Transform the data using your existing transformation method
      const transformedData = transformRaceResultsData(races)
      console.log(`Transformed data: ${transformedData.length} races`)
      
      return {
        data: transformedData,
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching race results:", error)
      throw error
    }
  }

  // Get race results individually for each race
  async getRaceResultsIndividually(season) {
    try {
      console.log(`Fetching race results individually for season ${season}...`)
      
      // First get the race schedule to know all races in the season
      const scheduleResponse = await fetch(`${ERGAST_BASE_URL}/${season}.json?limit=100`)
      if (!scheduleResponse.ok) {
        throw new Error(`HTTP error fetching schedule! status: ${scheduleResponse.status}`)
      }
      const scheduleData = await scheduleResponse.json()
      const allRaces = scheduleData.MRData.RaceTable.Races
      
      console.log(`Found ${allRaces.length} races in ${season} schedule`)
      
      // Fetch results for each race individually
      const raceResultsPromises = allRaces.map(async (race) => {
        try {
          console.log(`Fetching results for Round ${race.round}: ${race.raceName}`)
          
          const resultsResponse = await fetch(
            `${ERGAST_BASE_URL}/${season}/${race.round}/results.json`
          )
          
          if (!resultsResponse.ok) {
            console.warn(`No results available for Round ${race.round}`)
            // Return race with empty results if no results available
            return { ...race, Results: [] }
          }
          
          const resultsData = await resultsResponse.json()
          const raceWithResults = resultsData.MRData.RaceTable.Races[0]
          
          console.log(`✅ Round ${race.round}: ${raceWithResults.Results?.length || 0} results`)
          return raceWithResults || { ...race, Results: [] }
          
        } catch (error) {
          console.warn(`❌ Failed to fetch results for Round ${race.round}:`, error.message)
          // Return race without results if fetch fails
          return { ...race, Results: [] }
        }
      })
      
      // Wait for all individual race fetches to complete
      const allRaceResults = await Promise.all(raceResultsPromises)
      
      console.log(`Successfully fetched results for ${allRaceResults.length} races`)
      console.log(`Races with results: ${allRaceResults.filter(race => race.Results && race.Results.length > 0).length}`)
      
      return allRaceResults
      
    } catch (error) {
      console.error("Error fetching individual race results:", error)
      throw error
    }
  }

  // Get qualifying results for a specific season
  async getQualifyingResults(season = new Date().getFullYear()) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/qualifying.json?limit=1000`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformQualifyingResultsData(data.MRData.RaceTable.Races),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching qualifying results:", error)
      throw error
    }
  }

  // Get race results for a specific race
  async getRaceResultsByRound(season, round) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/${round}/results.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformSingleRaceData(data.MRData.RaceTable.Races[0]),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching race results by round:", error)
      throw error
    }
  }

  // Get qualifying results for a specific race
  async getQualifyingResultsByRound(season, round) {
    try {
      const response = await fetch(`${ERGAST_BASE_URL}/${season}/${round}/qualifying.json`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      return {
        data: transformSingleQualifyingData(data.MRData.RaceTable.Races[0]),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching qualifying results by round:", error)
      throw error
    }
  }

  // Get championship winners for multiple seasons
  async getChampionshipWinners(startYear = 2020, endYear = new Date().getFullYear()) {
    try {
      const seasons = []
      for (let year = endYear; year >= startYear; year--) {
        seasons.push(year)
      }

      const championshipPromises = seasons.map(async (year) => {
        try {
          const [driversResponse, constructorsResponse] = await Promise.all([
            fetch(`${ERGAST_BASE_URL}/${year}/driverStandings/1.json`),
            fetch(`${ERGAST_BASE_URL}/${year}/constructorStandings/1.json`),
          ])

          if (!driversResponse.ok || !constructorsResponse.ok) {
            throw new Error(`HTTP error for year ${year}`)
          }

          const driversData = await driversResponse.json()
          const constructorsData = await constructorsResponse.json()

          return transformChampionshipData(year, driversData, constructorsData)
        } catch (error) {
          console.error(`Error fetching championship data for ${year}:`, error)
          return null
        }
      })

      const results = await Promise.all(championshipPromises)
      return {
        data: results.filter((result) => result !== null),
        source: API_SOURCES.ERGAST,
      }
    } catch (error) {
      console.error("Error fetching championship winners:", error)
      throw error
    }
  }
}
