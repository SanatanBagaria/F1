const f1Api = require('f1-api-node')

export class F1SessionService {
  // Get race schedule for the year (includes all sessions)
  async getRaceSchedule(year = new Date().getFullYear()) {
    try {
      const schedule = await f1Api.getRaceSchedule(year)
      return this.transformScheduleData(schedule)
    } catch (error) {
      console.error('Error fetching race schedule:', error)
      throw error
    }
  }

  // Transform and enrich schedule data with session times
  transformScheduleData(schedule) {
    const currentTime = new Date()
    
    return schedule.map(race => {
      // Parse race weekend sessions (you'll need to extract these from the scraped data)
      const sessions = this.extractSessionsFromRace(race)
      
      // Determine if any session is currently live
      const liveSession = sessions.find(session => {
        const sessionStart = new Date(session.startTime)
        const sessionEnd = new Date(session.endTime)
        return currentTime >= sessionStart && currentTime <= sessionEnd
      })

      return {
        ...race,
        sessions,
        isLive: !!liveSession,
        liveSession: liveSession || null
      }
    })
  }

  // Extract individual sessions from race data
  extractSessionsFromRace(race) {
    const sessions = []
    const raceDate = new Date(race.date)
    
    // Typical F1 weekend schedule (you can make this more sophisticated)
    const sessionSchedule = [
      { name: 'Practice 1', day: -2, startHour: 13, duration: 90 },
      { name: 'Practice 2', day: -2, startHour: 16, duration: 90 },
      { name: 'Practice 3', day: -1, startHour: 12, duration: 60 },
      { name: 'Qualifying', day: -1, startHour: 15, duration: 60 },
      { name: 'Race', day: 0, startHour: 14, duration: 120 }
    ]

    sessionSchedule.forEach(session => {
      const sessionDate = new Date(raceDate)
      sessionDate.setDate(sessionDate.getDate() + session.day)
      sessionDate.setHours(session.startHour, 0, 0, 0)
      
      const endTime = new Date(sessionDate)
      endTime.setMinutes(endTime.getMinutes() + session.duration)

      sessions.push({
        name: session.name,
        type: session.name.toLowerCase().replace(' ', '_'),
        startTime: sessionDate.toISOString(),
        endTime: endTime.toISOString(),
        circuit: race.circuit,
        location: race.location
      })
    })

    return sessions
  }

  // Check if any session is currently live
  async getCurrentLiveSession() {
    try {
      const currentYear = new Date().getFullYear()
      const schedule = await this.getRaceSchedule(currentYear)
      
      for (const race of schedule) {
        if (race.liveSession) {
          return {
            isLive: true,
            session: race.liveSession,
            race: race
          }
        }
      }

      return { isLive: false, session: null, race: null }
    } catch (error) {
      console.error('Error checking live session:', error)
      return { isLive: false, session: null, race: null }
    }
  }
}

export const f1SessionService = new F1SessionService()
