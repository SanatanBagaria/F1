"use client"

import { useState, useEffect } from "react"
import { f1Api } from "../services/f1Api"

export const useTeams = (season = null, preferredApi = null) => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    // Set preferred API if provided
    if (preferredApi) {
      f1Api.setPreferredApi(preferredApi)
    }

    const fetchTeams = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get team details with the current API preference
        const result = await f1Api.getTeamDetails(season || new Date().getFullYear())

        setTeams(result.data)

        // Set data source information
        if (result.sources) {
          setDataSource(
            `Teams: ${result.sources.teams}, Drivers: ${result.sources.drivers}, Standings: ${result.sources.standings}`,
          )
        } else {
          setDataSource(f1Api.getPreferredApi())
        }
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch teams:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [season, preferredApi])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await f1Api.getTeamDetails(season || new Date().getFullYear())

      setTeams(result.data)

      // Set data source information
      if (result.sources) {
        setDataSource(
          `Teams: ${result.sources.teams}, Drivers: ${result.sources.drivers}, Standings: ${result.sources.standings}`,
        )
      } else {
        setDataSource(f1Api.getPreferredApi())
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Function to change API source
  const changeApiSource = (newSource) => {
    if (f1Api.setPreferredApi(newSource)) {
      refetch()
      return true
    }
    return false
  }

  return { teams, loading, error, refetch, dataSource, changeApiSource }
}

export const useConstructorStandings = (season = null) => {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await f1Api.getConstructorStandings(season)
        setStandings(result.data)
        setDataSource(result.source)
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch constructor standings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [season])

  return { standings, loading, error, dataSource }
}
