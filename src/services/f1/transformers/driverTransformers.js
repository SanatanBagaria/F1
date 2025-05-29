import { getTeamColor } from '../utils/teamUtils.js'

// Transform OpenF1 drivers data
export const transformOpenF1DriversData = (drivers) => {
  // Remove duplicates based on driver_number
  const uniqueDrivers = drivers.reduce((acc, driver) => {
    if (!acc.find((d) => d.driver_number === driver.driver_number)) {
      acc.push(driver)
    }
    return acc
  }, [])

  return uniqueDrivers.map((driver) => ({
    id: driver.driver_number?.toString() || driver.name_acronym,
    name: driver.full_name || `${driver.first_name} ${driver.last_name}`,
    firstName: driver.first_name || "",
    lastName: driver.last_name || "",
    nationality: driver.country_code || "Unknown",
    dateOfBirth: null, // Not available in OpenF1
    permanentNumber: driver.driver_number || "N/A",
    code: driver.name_acronym || driver.last_name?.substring(0, 3).toUpperCase() || "UNK",
    url: null, // Not available in OpenF1
    team: driver.team_name || "Unknown",
    teamColor: getTeamColor(driver.team_name),
    points: 0, // Would need to fetch from standings
    wins: 0, // Would need to fetch from race results
    podiums: 0, // Would need to fetch from race results
    poles: 0, // Would need to fetch from qualifying results
    image:
      driver.headshot_url ||
      `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(driver.full_name || "Driver")}`,
    headshotUrl: driver.headshot_url,
    teamColour: driver.team_colour,
  }))
}

// Transform Ergast drivers data
export const transformErgastDriversData = (drivers) => {
  return drivers.map((driver) => ({
    id: driver.driverId,
    name: `${driver.givenName} ${driver.familyName}`,
    firstName: driver.givenName,
    lastName: driver.familyName,
    nationality: driver.nationality,
    dateOfBirth: driver.dateOfBirth,
    permanentNumber: driver.permanentNumber || "N/A",
    code: driver.code || driver.familyName.substring(0, 3).toUpperCase(),
    url: driver.url,
    team: "Unknown", // Would need to fetch from constructor data
    teamColor: "bg-gray-600",
    points: 0,
    wins: 0,
    podiums: 0,
    poles: 0,
    image: `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(driver.givenName + "+" + driver.familyName)}`,
  }))
}

// Transform driver standings data
export const transformDriverStandingsData = (standings) => {
  return standings.map((standing) => ({
    position: Number.parseInt(standing.position),
    points: Number.parseInt(standing.points),
    wins: Number.parseInt(standing.wins),
    driver: {
      id: standing.Driver.driverId,
      name: `${standing.Driver.givenName} ${standing.Driver.familyName}`,
      firstName: standing.Driver.givenName,
      lastName: standing.Driver.familyName,
      nationality: standing.Driver.nationality,
      permanentNumber: standing.Driver.permanentNumber || "N/A",
      code: standing.Driver.code || standing.Driver.familyName.substring(0, 3).toUpperCase(),
    },
    constructor: {
      id: standing.Constructors[0]?.constructorId,
      name: standing.Constructors[0]?.name,
      nationality: standing.Constructors[0]?.nationality,
    },
  }))
}
