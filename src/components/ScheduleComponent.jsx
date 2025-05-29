import React, { useState, useEffect } from "react"

const ScheduleComponent = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const response = await fetch('https://api.openf1.org/v1/sessions?year=2025&limit=10')
        
        if (!response.ok) {
          throw new Error('Failed to fetch sessions')
        }
        
        const data = await response.json()
        setSessions(data.sort((a, b) => new Date(b.date_start) - new Date(a.date_start)))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  const getSessionTypeIcon = (sessionType) => {
    switch (sessionType?.toLowerCase()) {
      case 'practice': return '🏃'
      case 'qualifying': return '⚡'
      case 'race': return '🏁'
      case 'sprint': return '💨'
      default: return '📅'
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
        <div className="text-center">
          <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto animate-pulse"></div>
          <p className="text-gray-500 dark:text-gray-400 font-light mt-4">Loading schedule...</p>
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

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 font-light">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          {sessions.map((session, index) => (
            <div key={session.session_key || index} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getSessionTypeIcon(session.session_type)}</span>
                <div>
                  <div className="font-light text-gray-900 dark:text-white">
                    {session.session_name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {session.location} • {session.country_name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(session.date_start).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ScheduleComponent
