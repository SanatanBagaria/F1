import React from "react"

const RaceWeekendSchedule = ({ currentSession = null, sessions = [] }) => {
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

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-light text-gray-900 dark:text-white">Race Weekend Schedule</h3>
          <div className="w-12 h-px bg-red-600"></div>
        </div>
        
        {currentSession ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <h4 className="font-light text-red-800 dark:text-red-200 mb-2">Current Session</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getSessionTypeIcon(currentSession.session_type)}</span>
                <span className="font-light text-gray-900 dark:text-white">
                  {currentSession.session_name || 'Unknown Session'}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentSession.date_start ? 
                  new Date(currentSession.date_start).toLocaleString() : 
                  'TBD'
                }
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="space-y-4">
              <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
              <div className="space-y-2">
                <h4 className="text-lg font-extralight text-gray-900 dark:text-white">No Active Session</h4>
                <p className="text-gray-500 dark:text-gray-400 font-light">
                  Check back during race weekends for live session data
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Sessions - Use data from Socket.IO instead of fetching */}
        <div className="space-y-4">
          <h4 className="font-light text-gray-900 dark:text-white">Recent Sessions</h4>
          
          {/* Show message that we're getting data from live connection */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200 font-light">
              Session data provided by live connection
            </p>
          </div>

          {/* Display current session as recent session */}
          {currentSession ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getSessionTypeIcon(currentSession.session_type)}</span>
                  <div>
                    <div className="font-light text-gray-900 dark:text-white">
                      {currentSession.session_name || 'Unknown Session'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {currentSession.location || 'Unknown Location'} • {currentSession.country_name || 'Unknown Country'}
                    </div>
                    {currentSession.circuit_short_name && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {currentSession.circuit_short_name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-light ${getSessionStatus(currentSession).color}`}>
                    {getSessionStatus(currentSession).status}
                  </span>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {currentSession.date_start ? 
                      new Date(currentSession.date_start).toLocaleDateString() : 
                      'TBD'
                    }
                  </div>
                  {currentSession.gmt_offset && (
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      GMT{currentSession.gmt_offset}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="space-y-4">
                <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
                <div className="space-y-2">
                  <h4 className="text-lg font-extralight text-gray-900 dark:text-white">No Session Data</h4>
                  <p className="text-gray-500 dark:text-gray-400 font-light">
                    Waiting for live session data
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RaceWeekendSchedule
