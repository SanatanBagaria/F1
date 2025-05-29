"use client"

import { useState, useEffect } from "react"
import { f1Api } from "../services/f1Api"

export const useDrivers = (season = null, preferredApi = null) => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    // Set preferred API if provided
    if (preferredApi) {
      f1Api.setPreferredApi(preferredApi)
    }

    const fetchDrivers = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await f1Api.getDrivers(season)
        setDrivers(result.data)
        setDataSource(result.source)
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch drivers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrivers()
  }, [season, preferredApi])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await f1Api.getDrivers(season)
      setDrivers(result.data)
      setDataSource(result.source)
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

  return { drivers, loading, error, refetch, dataSource, changeApiSource }
}

export const useDriverStandings = (season = null) => {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await f1Api.getDriverStandings(season)
        setStandings(result.data)
        setDataSource(result.source)
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch driver standings:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [season])

  return { standings, loading, error, dataSource }
}
