// Get race type based on race name
export const getRaceType = (raceName) => {
  if (raceName.toLowerCase().includes("sprint")) return "sprint"
  if (
    raceName.toLowerCase().includes("street") ||
    raceName.toLowerCase().includes("vegas") ||
    raceName.toLowerCase().includes("monaco") ||
    raceName.toLowerCase().includes("singapore")
  )
    return "street"
  return "regular"
}

// Get race status based on date
export const getRaceStatus = (date, time) => {
  const raceDateTime = new Date(`${date}T${time || "14:00:00"}`)
  const now = new Date()

  if (raceDateTime < now) return "completed"
  
  // Check if race is within next 2 hours (could be live)
  const timeDiff = raceDateTime - now
  if (timeDiff > 0 && timeDiff < 2 * 60 * 60 * 1000) return "live"
  
  // Check if race is within next 24 hours
  if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) return "upcoming"
  
  return "scheduled"
}

// Get circuit distance (approximate values)
export const getCircuitDistance = (circuitId) => {
  const distances = {
    albert_park: "5.278 km",
    bahrain: "5.412 km",
    imola: "4.909 km",
    baku: "6.003 km",
    miami: "5.412 km",
    monaco: "3.337 km",
    catalunya: "4.675 km",
    silverstone: "5.891 km",
    red_bull_ring: "4.318 km",
    hungaroring: "4.381 km",
    spa: "7.004 km",
    zandvoort: "4.259 km",
    monza: "5.793 km",
    marina_bay: "5.063 km",
    suzuka: "5.807 km",
    losail: "5.380 km",
    vegas: "6.201 km",
    yas_marina: "5.281 km",
  }
  return distances[circuitId] || "Unknown"
}
