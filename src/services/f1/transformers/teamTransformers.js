import { 
  getTeamColor, 
  getTeamNationality, 
  getTeamFoundedYear, 
  getTeamChampionships, 
  getTeamDescription, 
  getTeamHeadquarters, 
  getTeamPrincipal, 
  getTeamEngine 
} from '../utils/teamUtils.js'

// Transform Ergast teams data
export const transformErgastTeamsData = (constructors) => {
  return constructors.map((constructor) => ({
    id: constructor.constructorId,
    name: constructor.name,
    nationality: constructor.nationality,
    url: constructor.url,
    founded: getTeamFoundedYear(constructor.name),
    championships: getTeamChampionships(constructor.name),
    color: getTeamColor(constructor.name),
    teamColour: null,
    drivers: [], // Will be populated later
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    position: 0,
    description: getTeamDescription(constructor.name),
    headquarters: getTeamHeadquarters(constructor.name),
    teamPrincipal: getTeamPrincipal(constructor.name),
    engine: getTeamEngine(constructor.name),
  }))
}

// Transform constructor standings data
export const transformConstructorStandingsData = (standings) => {
  return standings.map((standing) => ({
    position: Number.parseInt(standing.position),
    points: Number.parseInt(standing.points),
    wins: Number.parseInt(standing.wins),
    constructor: {
      id: standing.Constructor.constructorId,
      name: standing.Constructor.name,
      nationality: standing.Constructor.nationality,
      url: standing.Constructor.url,
    },
  }))
}

// Extract unique teams from drivers data
export const extractTeamsFromDrivers = (drivers) => {
  const teams = new Map()

  drivers.forEach((driver) => {
    if (driver.team_name && !teams.has(driver.team_name)) {
      teams.set(driver.team_name, {
        id: driver.team_name.toLowerCase().replace(/\s+/g, "-"),
        name: driver.team_name,
        nationality: getTeamNationality(driver.team_name),
        url: null,
        founded: getTeamFoundedYear(driver.team_name),
        championships: getTeamChampionships(driver.team_name),
        color: getTeamColor(driver.team_name),
        teamColour: driver.team_colour,
        drivers: [],
        points: 0,
        wins: 0,
        podiums: 0,
        poles: 0,
        position: 0,
        description: getTeamDescription(driver.team_name),
        headquarters: getTeamHeadquarters(driver.team_name),
        teamPrincipal: getTeamPrincipal(driver.team_name),
        engine: getTeamEngine(driver.team_name),
      })
    }
  })

  return Array.from(teams.values())
}

// Combine team data with drivers and standings
export const combineTeamData = (teams, drivers, standings) => {
  return teams.map((team) => {
    // Find drivers for this team
    const teamDrivers = drivers.filter(
      (driver) =>
        driver.team === team.name ||
        driver.team?.toLowerCase().includes(team.name.toLowerCase()) ||
        team.name.toLowerCase().includes(driver.team?.toLowerCase()),
    )

    // Find standings for this team
    const teamStanding = standings.find(
      (standing) =>
        standing.constructor?.name === team.name ||
        standing.constructor?.name.toLowerCase().includes(team.name.toLowerCase()) ||
        team.name.toLowerCase().includes(standing.constructor?.name.toLowerCase()),
    )

    return {
      ...team,
      drivers: teamDrivers,
      position: teamStanding?.position || 0,
      points: teamStanding?.points || 0,
      wins: teamStanding?.wins || 0,
    }
  })
}
