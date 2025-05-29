import React, { useState, useEffect } from "react"

const ScheduleWithData = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch sessions for 2025 using OpenF1 API
        const response = await fetch('https://api.openf1.org/v1/sessions?year=2025')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data = await response.json()
        
        // Sort sessions by date (most recent first)
        const sortedSessions = data.sort((a, b) => 
          new Date(b.date_start) - new Date(a.date_start)
        )
        
        setSessions(sortedSessions)
      } catch (err) {
        console.error('Error fetching session data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSessionData()
  }, [])

  const getSessionTypeIcon = (sessionType) => {
    if (!sessionType) return '📅'
    
    switch (sessionType.toLowerCase()) {
      case 'practice':
        return '🏃'
      case 'qualifying':
        return '⚡'
      case 'race':
        return '🏁'
      case 'sprint':
        return '💨'
      default:
        return '📅'
    }
  }

  const getSessionStatus = (session) => {
    if (!session || !session.date_start || !session.date_end) {
      return { 
        status: 'unknown', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' 
      }
    }

    try {
      const now = new Date()
      const start = new Date(session.date_start)
      const end = new Date(session.date_end)

      if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' }
      if (now >= start && now <= end) return { status: 'live', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
      return { status: 'completed', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' }
    } catch (error) {
      return { 
        status: 'error', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' 
      }
    }
  }

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString)
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short'
        })
      }
    } catch (error) {
      return { date: 'TBD', time: 'TBD' }
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-light text-gray-900 dark:text-white">2025 F1 Schedule</h3>
            <div className="w-12 h-px bg-red-600"></div>
          </div>
          
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="space-y-2">
                      <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-light text-gray-900 dark:text-white">2025 F1 Schedule</h3>
            <div className="w-12 h-px bg-red-600"></div>
          </div>
          
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 font-light">
              Error loading schedule: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-light text-gray-900 dark:text-white">2025 F1 Schedule</h3>
          <div className="w-12 h-px bg-red-600"></div>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-light">
            Data from OpenF1 API • {sessions.length} sessions found
          </p>
        </div>

        <div className="space-y-px bg-gray-100 dark:bg-gray-800">
          {sessions.map((session, index) => {
            const sessionStatus = getSessionStatus(session)
            const { date, time } = formatDateTime(session.date_start)
            
            return (
              <div
                key={session.session_key || index}
                className="bg-white dark:bg-gray-950 p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">{getSessionTypeIcon(session.session_type)}</span>
                    <div className="space-y-1">
                      <h4 className="font-light text-gray-900 dark:text-white">
                        {session.session_name || 'Unknown Session'}
                      </h4>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                        <span>{session.location || 'Unknown Location'}</span>
                        <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                        <span>{session.country_name || session.country_code || 'Unknown Country'}</span>
                        {session.circuit_short_name && (
                          <>
                            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                            <span>{session.circuit_short_name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-light ${sessionStatus.color}`}>
                      {sessionStatus.status}
                    </span>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-light">
                      <div>{date}</div>
                      <div className="text-xs">{time}</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-8">
            <div className="space-y-4">
              <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
              <div className="space-y-2">
                <h4 className="text-lg font-extralight text-gray-900 dark:text-white">No Sessions Found</h4>
                <p className="text-gray-500 dark:text-gray-400 font-light">
                  No 2025 F1 sessions available in OpenF1 API
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleWithData
