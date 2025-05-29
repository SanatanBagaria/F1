import { API_SOURCES } from './constants.js'
import { RaceDataService } from '../data/raceData.js'
import { DriverDataService } from '../data/driverData.js'
import { TeamDataService } from '../data/teamData.js'

export class F1ApiService {
  constructor() {
    // Default to AUTO which will choose the best API based on the data requested
    this.preferredApi = API_SOURCES.AUTO
    
    // Initialize data services
    this.raceData = new RaceDataService()
    this.driverData = new DriverDataService()
    this.teamData = new TeamDataService()
  }

  // Set preferred API source
  setPreferredApi(apiSource) {
    if (Object.values(API_SOURCES).includes(apiSource)) {
      this.preferredApi = apiSource
      return true
    }
    return false
  }

  // Get current preferred API
  getPreferredApi() {
    return this.preferredApi
  }

  // RACE METHODS - Delegate to RaceDataService
  async getRaceSchedule(season = new Date().getFullYear()) {
    return this.raceData.getRaceSchedule(season)
  }

  async getRaceResults(season = new Date().getFullYear()) {
    return this.raceData.getRaceResults(season)
  }

  async getRaceResultsIndividually(season) {
    return this.raceData.getRaceResultsIndividually(season)
  }

  async getQualifyingResults(season = new Date().getFullYear()) {
    return this.raceData.getQualifyingResults(season)
  }

  async getRaceResultsByRound(season, round) {
    return this.raceData.getRaceResultsByRound(season, round)
  }

  async getQualifyingResultsByRound(season, round) {
    return this.raceData.getQualifyingResultsByRound(season, round)
  }

  async getChampionshipWinners(startYear = 2020, endYear = new Date().getFullYear()) {
    return this.raceData.getChampionshipWinners(startYear, endYear)
  }

  // DRIVER METHODS - Delegate to DriverDataService
  async getDrivers(season = new Date().getFullYear()) {
    return this.driverData.getDrivers(season, this.preferredApi)
  }

  async getDriversFromOpenF1() {
    return this.driverData.getDriversFromOpenF1()
  }

  async getDriversFromErgast(season = new Date().getFullYear()) {
    return this.driverData.getDriversFromErgast(season)
  }

  async getDriverStandings(season = new Date().getFullYear()) {
    return this.driverData.getDriverStandings(season)
  }

  // TEAM METHODS - Delegate to TeamDataService
  async getTeams(season = new Date().getFullYear()) {
    return this.teamData.getTeams(season, this.preferredApi)
  }

  async getTeamsFromOpenF1() {
    return this.teamData.getTeamsFromOpenF1()
  }

  async getTeamsFromErgast(season = new Date().getFullYear()) {
    return this.teamData.getTeamsFromErgast(season)
  }

  async getConstructorStandings(season = new Date().getFullYear()) {
    return this.teamData.getConstructorStandings(season)
  }

  async getTeamDetails(season = new Date().getFullYear()) {
    return this.teamData.getTeamDetails(season, this.preferredApi)
  }

  // UTILITY METHODS
  async getRecentSessions() {
    try {
      const response = await fetch(`${OPENF1_BASE_URL}/sessions?year=2024`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const sessions = await response.json()

      // Sort by date and get the most recent
      return sessions.sort((a, b) => new Date(b.date_start) - new Date(a.date_start)).slice(0, 10) // Get last 10 sessions
    } catch (error) {
      console.error("Error fetching recent sessions:", error)
      return []
    }
  }
}
