import { getRaceStatus, getRaceType, getCircuitDistance } from '../utils/raceUtils.js'

// Transform race schedule data
export const transformRaceScheduleData = (races) => {
  return races.map((race) => ({
    id: `${race.season}-${race.round}`,
    season: race.season,
    round: parseInt(race.round),
    name: race.raceName,
    date: race.date,
    time: race.time || "14:00:00Z", // Default F1 race time
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    circuitId: race.Circuit.circuitId,
    url: race.url,
    status: getRaceStatus(race.date, race.time),
    // Additional useful data
    lat: race.Circuit.Location.lat,
    long: race.Circuit.Location.long,
    // Practice and qualifying times if available
    firstPractice: race.FirstPractice ? {
      date: race.FirstPractice.date,
      time: race.FirstPractice.time
    } : null,
    secondPractice: race.SecondPractice ? {
      date: race.SecondPractice.date,
      time: race.SecondPractice.time
    } : null,
    thirdPractice: race.ThirdPractice ? {
      date: race.ThirdPractice.date,
      time: race.ThirdPractice.time
    } : null,
    qualifying: race.Qualifying ? {
      date: race.Qualifying.date,
      time: race.Qualifying.time
    } : null,
    sprint: race.Sprint ? {
      date: race.Sprint.date,
      time: race.Sprint.time
    } : null
  }))
}

// Transform race results data
export const transformRaceResultsData = (races) => {
  console.log(`Transforming ${races.length} races...`)
  const transformed = races.map((race) => ({
    id: `${race.season}-${race.round}`,
    season: race.season,
    round: Number.parseInt(race.round),
    name: race.raceName,
    date: race.date,
    time: race.time || "Unknown",
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    circuitId: race.Circuit.circuitId,
    url: race.url,
    results: race.Results ? transformRaceResults(race.Results) : [],
    totalLaps: race.Results?.[0]?.laps || "Unknown",
    distance: getCircuitDistance(race.Circuit.circuitId),
    type: getRaceType(race.raceName),
    weather: "Unknown", // Not available in Ergast
    temperature: "Unknown", // Not available in Ergast
  }))
  console.log(`Transformed ${transformed.length} races`)
  return transformed
}

// Transform individual race results
export const transformRaceResults = (results) => {
  return results.map((result) => ({
    position: Number.parseInt(result.position),
    driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
    driverId: result.Driver.driverId,
    team: result.Constructor.name,
    constructorId: result.Constructor.constructorId,
    time: result.Time?.time || result.status,
    points: Number.parseInt(result.points),
    laps: Number.parseInt(result.laps),
    status: result.status,
    grid: Number.parseInt(result.grid),
    fastestLap: result.FastestLap
      ? {
          rank: Number.parseInt(result.FastestLap.rank),
          lap: Number.parseInt(result.FastestLap.lap),
          time: result.FastestLap.Time.time,
          speed: result.FastestLap.AverageSpeed?.speed,
        }
      : null,
  }))
}

// Transform single race data (with both results and qualifying)
export const transformSingleRaceData = (race) => {
  return {
    id: `${race.season}-${race.round}`,
    season: race.season,
    round: Number.parseInt(race.round),
    name: race.raceName,
    date: race.date,
    time: race.time || "Unknown",
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    locality: race.Circuit.Location.locality,
    circuitId: race.Circuit.circuitId,
    url: race.url,
    results: race.Results ? transformRaceResults(race.Results) : [],
    totalLaps: race.Results?.[0]?.laps || "Unknown",
    distance: getCircuitDistance(race.Circuit.circuitId),
    type: getRaceType(race.raceName),
    weather: "Unknown",
    temperature: "Unknown",
    winner: race.Results?.[0]
      ? `${race.Results[0].Driver.givenName} ${race.Results[0].Driver.familyName}`
      : "Unknown",
    winnerTeam: race.Results?.[0]?.Constructor.name || "Unknown",
    winnerTime: race.Results?.[0]?.Time?.time || "Unknown",
    fastestLap: race.Results?.find((r) => r.FastestLap?.rank === "1")?.FastestLap || null,
    podium:
      race.Results?.slice(0, 3).map((result) => ({
        position: Number.parseInt(result.position),
        driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
        team: result.Constructor.name,
        time: result.Time?.time || result.status,
        points: Number.parseInt(result.points),
      })) || [],
  }
}

// Transform qualifying results data
export const transformQualifyingResultsData = (races) => {
  return races.map((race) => ({
    id: `${race.season}-${race.round}`,
    season: race.season,
    round: Number.parseInt(race.round),
    name: race.raceName,
    date: race.date,
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    qualifying: race.QualifyingResults ? transformQualifyingResults(race.QualifyingResults) : [],
  }))
}

// Transform individual qualifying results
export const transformQualifyingResults = (results) => {
  return results.map((result) => ({
    position: Number.parseInt(result.position),
    driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
    driverId: result.Driver.driverId,
    team: result.Constructor.name,
    constructorId: result.Constructor.constructorId,
    q1: result.Q1 || null,
    q2: result.Q2 || null,
    q3: result.Q3 || null,
  }))
}

// Transform single qualifying data
export const transformSingleQualifyingData = (race) => {
  return {
    id: `${race.season}-${race.round}`,
    season: race.season,
    round: Number.parseInt(race.round),
    name: race.raceName,
    date: race.date,
    circuit: race.Circuit.circuitName,
    country: race.Circuit.Location.country,
    qualifying: race.QualifyingResults ? transformQualifyingResults(race.QualifyingResults) : [],
  }
}

// Transform championship data
export const transformChampionshipData = (year, driversData, constructorsData) => {
  const driverStanding = driversData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0]
  const constructorStanding = constructorsData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0]

  if (!driverStanding || !constructorStanding) {
    return null
  }

  return {
    year: year.toString(),
    driver: `${driverStanding.Driver.givenName} ${driverStanding.Driver.familyName}`,
    driverId: driverStanding.Driver.driverId,
    team: driverStanding.Constructors[0].name,
    constructorId: driverStanding.Constructors[0].constructorId,
    points: Number.parseInt(driverStanding.points),
    wins: Number.parseInt(driverStanding.wins),
    constructorChampion: constructorStanding.Constructor.name,
    constructorPoints: Number.parseInt(constructorStanding.points),
    constructorWins: Number.parseInt(constructorStanding.wins),
  }
}
