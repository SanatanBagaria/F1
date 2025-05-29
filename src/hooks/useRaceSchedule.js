"use client"

import { useState, useEffect } from "react"
import { f1Api } from "../services/f1Api"

export const useRaceSchedule = (season = new Date().getFullYear()) => {
  const [races, setRaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    const fetchRaceSchedule = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Fetching race schedule for season ${season}...`)
        const result = await f1Api.getRaceSchedule(season)
        console.log(`Received ${result.data.length} races for ${season}:`, result.data)

        setRaces(result.data)
        setDataSource(result.source)
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch race schedule:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRaceSchedule()
  }, [season])

  const refetch = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`Refetching race schedule for season ${season}...`)
      const result = await f1Api.getRaceSchedule(season)
      console.log(`Received ${result.data.length} races for ${season}:`, result.data)

      setRaces(result.data)
      setDataSource(result.source)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { races, loading, error, refetch, dataSource }
}
