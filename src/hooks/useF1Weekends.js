import { useState, useEffect } from "react"

export const useF1Weekends = (year = 2025) => {
  const [weekends, setWeekends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`https://api.openf1.org/v1/sessions?year=${year}&limit=100`)
        if (!res.ok) throw new Error('Failed to fetch sessions')
        const data = await res.json()
        // Group by meeting_key (race weekend)
        const grouped = {}
        data.forEach(session => {
          if (!session.meeting_key) return
          if (!grouped[session.meeting_key]) grouped[session.meeting_key] = []
          grouped[session.meeting_key].push(session)
        })
        // Sort weekends by date (latest first), and sessions by date (earliest first)
        const weekendsArr = Object.values(grouped)
          .map(sessions => sessions.sort((a, b) => new Date(a.date_start) - new Date(b.date_start)))
          .sort((a, b) => new Date(b[0].date_start) - new Date(a[0].date_start))
        setWeekends(weekendsArr)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchSessions()
  }, [year])

  return { weekends, loading, error }
}
