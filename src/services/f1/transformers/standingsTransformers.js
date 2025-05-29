// Transform driver standings data from Ergast API
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
      url: standing.Driver.url,
      dateOfBirth: standing.Driver.dateOfBirth || null
    },
    constructor: {
      id: standing.Constructors[0]?.constructorId,
      name: standing.Constructors[0]?.name,
      nationality: standing.Constructors[0]?.nationality,
      url: standing.Constructors[0]?.url
    },
    // Additional calculated fields
    averagePointsPerRace: calculateAveragePoints(standing.points, standing.wins),
    winPercentage: calculateWinPercentage(standing.wins),
    pointsGap: null, // Will be calculated when comparing with leader
    positionChange: null // Will be calculated when comparing with previous standings
  }))
}

// Transform constructor standings data from Ergast API
export const transformConstructorStandingsData = (standings) => {
  return standings.map((standing) => ({
    position: Number.parseInt(standing.position),
    points: Number.parseInt(standing.points),
    wins: Number.parseInt(standing.wins),
    constructor: {
      id: standing.Constructor.constructorId,
      name: standing.Constructor.name,
      nationality: standing.Constructor.nationality,
      url: standing.Constructor.url
    },
    // Additional calculated fields
    averagePointsPerRace: calculateAveragePoints(standing.points, standing.wins),
    winPercentage: calculateWinPercentage(standing.wins),
    pointsGap: null, // Will be calculated when comparing with leader
    positionChange: null // Will be calculated when comparing with previous standings
  }))
}

// Transform standings data with additional calculations (gaps, changes, etc.)
export const transformStandingsWithCalculations = (standings, previousStandings = null) => {
  const leader = standings[0]
  const leaderPoints = leader ? leader.points : 0

  return standings.map((standing, index) => {
    // Calculate points gap to leader
    const pointsGap = index === 0 ? 0 : leaderPoints - standing.points

    // Calculate position change from previous standings
    let positionChange = 0
    if (previousStandings) {
      const previousStanding = previousStandings.find(
        prev => prev.driver?.id === standing.driver?.id || prev.constructor?.id === standing.constructor?.id
      )
      if (previousStanding) {
        positionChange = previousStanding.position - standing.position
      }
    }

    return {
      ...standing,
      pointsGap,
      positionChange,
      isLeader: index === 0,
      pointsToNext: index === 0 ? 0 : standings[index - 1].points - standing.points
    }
  })
}

// Transform championship battle data (top contenders)
export const transformChampionshipBattle = (driverStandings, constructorStandings, topN = 5) => {
  const topDrivers = driverStandings.slice(0, topN)
  const topConstructors = constructorStandings.slice(0, topN)

  return {
    drivers: {
      leader: topDrivers[0],
      contenders: topDrivers.slice(1),
      battle: topDrivers.map((driver, index) => ({
        ...driver,
        gapToLeader: index === 0 ? 0 : topDrivers[0].points - driver.points,
        gapToNext: index === 0 ? 0 : topDrivers[index - 1].points - driver.points,
        mathematicallyEliminated: checkMathematicalElimination(driver, topDrivers[0]),
        canWinChampionship: checkChampionshipPossibility(driver, topDrivers[0])
      }))
    },
    constructors: {
      leader: topConstructors[0],
      contenders: topConstructors.slice(1),
      battle: topConstructors.map((constructor, index) => ({
        ...constructor,
        gapToLeader: index === 0 ? 0 : topConstructors[0].points - constructor.points,
        gapToNext: index === 0 ? 0 : topConstructors[index - 1].points - constructor.points,
        mathematicallyEliminated: checkMathematicalElimination(constructor, topConstructors[0]),
        canWinChampionship: checkChampionshipPossibility(constructor, topConstructors[0])
      }))
    }
  }
}

// Transform standings comparison between two seasons
export const transformStandingsComparison = (currentStandings, previousStandings) => {
  return currentStandings.map(current => {
    const previous = previousStandings.find(
      prev => prev.driver?.id === current.driver?.id || prev.constructor?.id === current.constructor?.id
    )

    if (!previous) {
      return {
        ...current,
        comparison: {
          isNewEntry: true,
          positionChange: null,
          pointsChange: null,
          winsChange: null
        }
      }
    }

    return {
      ...current,
      comparison: {
        isNewEntry: false,
        positionChange: previous.position - current.position,
        pointsChange: current.points - previous.points,
        winsChange: current.wins - previous.wins,
        previousPosition: previous.position,
        previousPoints: previous.points,
        previousWins: previous.wins
      }
    }
  })
}

// Transform standings for visualization/charts
export const transformStandingsForChart = (standings, type = 'points') => {
  return standings.map((standing, index) => ({
    position: standing.position,
    name: standing.driver?.name || standing.constructor?.name,
    shortName: standing.driver?.code || standing.constructor?.name?.substring(0, 3).toUpperCase(),
    value: type === 'points' ? standing.points : standing.wins,
    color: getStandingColor(index),
    percentage: calculatePercentage(
      type === 'points' ? standing.points : standing.wins,
      type === 'points' ? standings[0].points : standings[0].wins
    )
  }))
}

// Helper Functions

// Calculate average points per race
const calculateAveragePoints = (totalPoints, wins) => {
  // Assuming roughly 23 races per season (can be made dynamic)
  const estimatedRaces = 23
  return totalPoints / estimatedRaces
}

// Calculate win percentage
const calculateWinPercentage = (wins) => {
  // Assuming roughly 23 races per season (can be made dynamic)
  const estimatedRaces = 23
  return (wins / estimatedRaces) * 100
}

// Check if mathematically eliminated from championship
const checkMathematicalElimination = (contender, leader) => {
  // Simplified calculation - in reality, this would need race calendar data
  const remainingRaces = 5 // This should be calculated dynamically
  const maxPointsPerRace = 26 // 25 for win + 1 for fastest lap
  const maxPossiblePoints = contender.points + (remainingRaces * maxPointsPerRace)
  
  return maxPossiblePoints < leader.points
}

// Check if can still win championship
const checkChampionshipPossibility = (contender, leader) => {
  return !checkMathematicalElimination(contender, leader)
}

// Get color for standings position
const getStandingColor = (position) => {
  const colors = [
    '#FFD700', // Gold for 1st
    '#C0C0C0', // Silver for 2nd
    '#CD7F32', // Bronze for 3rd
    '#4CAF50', // Green for points positions
    '#2196F3', // Blue for mid-field
    '#FF9800', // Orange for lower positions
    '#F44336'  // Red for last positions
  ]
  
  if (position === 0) return colors[0]
  if (position === 1) return colors[1]
  if (position === 2) return colors[2]
  if (position < 10) return colors[3]
  if (position < 15) return colors[4]
  if (position < 18) return colors[5]
  return colors[6]
}

// Calculate percentage relative to leader
const calculatePercentage = (value, leaderValue) => {
  if (leaderValue === 0) return 0
  return (value / leaderValue) * 100
}

// Transform standings for mobile/compact view
export const transformStandingsCompact = (standings) => {
  return standings.map(standing => ({
    position: standing.position,
    name: standing.driver?.code || standing.constructor?.name?.substring(0, 3),
    fullName: standing.driver?.name || standing.constructor?.name,
    points: standing.points,
    wins: standing.wins,
    gap: standing.pointsGap || 0,
    change: standing.positionChange || 0
  }))
}

// Transform standings for detailed view with all statistics
export const transformStandingsDetailed = (standings, raceResults = []) => {
  return standings.map(standing => {
    // Calculate additional statistics from race results if available
    const driverResults = raceResults.filter(
      result => result.driverId === standing.driver?.id || result.constructorId === standing.constructor?.id
    )

    const podiums = driverResults.filter(result => result.position <= 3).length
    const pointsFinishes = driverResults.filter(result => result.points > 0).length
    const dnfs = driverResults.filter(result => result.status !== 'Finished').length

    return {
      ...standing,
      statistics: {
        podiums,
        pointsFinishes,
        dnfs,
        finishRate: driverResults.length > 0 ? ((driverResults.length - dnfs) / driverResults.length) * 100 : 0,
        averageFinishPosition: calculateAverageFinishPosition(driverResults),
        bestFinish: Math.min(...driverResults.map(r => r.position).filter(p => p > 0)) || null,
        worstFinish: Math.max(...driverResults.map(r => r.position).filter(p => p > 0)) || null
      }
    }
  })
}

// Helper function to calculate average finish position
const calculateAverageFinishPosition = (results) => {
  const finishedRaces = results.filter(result => result.position > 0)
  if (finishedRaces.length === 0) return null
  
  const totalPosition = finishedRaces.reduce((sum, result) => sum + result.position, 0)
  return totalPosition / finishedRaces.length
}
