"use client"

import { useState, useEffect, useCallback } from "react"
import { f1Api } from "../services/f1Api"

export const useChampionshipWinners = (startYear = 2020, endYear = new Date().getFullYear()) => {
  const [champions, setChampions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    let ignore = false // Prevent memory leaks[2]

    const fetchChampions = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await f1Api.getChampionshipWinners(startYear, endYear)
        
        // Only update state if component is still mounted
        if (!ignore) {
          setChampions(result.data)
          setDataSource(result.source)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          console.error("Failed to fetch championship winners:", err)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchChampions()

    // Cleanup function to prevent memory leaks
    return () => {
      ignore = true
    }
  }, [startYear, endYear])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await f1Api.getChampionshipWinners(startYear, endYear)
      setChampions(result.data)
      setDataSource(result.source)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [startYear, endYear]) // Add dependencies to useCallback

  return { champions, loading, error, refetch, dataSource }
}

export const useRaceSchedule = (season = new Date().getFullYear()) => {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    let ignore = false

    const fetchRaceSchedule = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Fetching race schedule for season ${season}...`)
        const result = await f1Api.getRaceSchedule(season)
        console.log(`Received ${result.data.length} races for ${season}`)

        if (!ignore) {
          setRaces(result.data)
          setDataSource(result.source)
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          console.error("Failed to fetch race schedule:", err)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    if (season) { // Only fetch if season is provided
      fetchRaceSchedule()
    }

    return () => {
      ignore = true
    }
  }, [season])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await f1Api.getRaceSchedule(season)
      setRaces(result.data)
      setDataSource(result.source)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [season])

  return { races, loading, error, dataSource, refetch }
}
