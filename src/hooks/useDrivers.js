"use client"

import { useState, useEffect, useCallback } from "react"
import { f1Api } from "../services/f1Api"

export const useDrivers = (season = null, preferredApi = null) => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    let ignore = false // Prevent memory leaks

    // Set preferred API if provided
    if (preferredApi) {
      f1Api.setPreferredApi(preferredApi)
    }

    const fetchDrivers = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Fetching drivers for season: ${season || 'current'} with API: ${preferredApi || 'auto'}`);
        
        const result = await f1Api.getDrivers(season)
        
        // Only update state if component is still mounted
        if (!ignore) {
          setDrivers(result.data)
          setDataSource(result.source)
          console.log(`Successfully fetched ${result.data.length} drivers from ${result.source}`);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          console.error("Failed to fetch drivers:", err)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchDrivers()

    // Cleanup function
    return () => {
      ignore = true
    }
  }, [season, preferredApi])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      console.log(`Refetching drivers for season: ${season || 'current'}`);
      
      const result = await f1Api.getDrivers(season)
      setDrivers(result.data)
      setDataSource(result.source)
      
      console.log(`Successfully refetched ${result.data.length} drivers from ${result.source}`);
    } catch (err) {
      setError(err.message)
      console.error("Failed to refetch drivers:", err)
    } finally {
      setLoading(false)
    }
  }, [season])

  // Function to change API source
  const changeApiSource = useCallback((newSource) => {
    console.log(`Changing API source to: ${newSource}`);
    if (f1Api.setPreferredApi(newSource)) {
      refetch()
      return true
    }
    return false
  }, [refetch])

  return { drivers, loading, error, refetch, dataSource, changeApiSource }
}

export const useDriverStandings = (season = null) => {
  const [standings, setStandings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    let ignore = false

    const fetchStandings = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Fetching driver standings for season: ${season || 'current'}`);
        
        const result = await f1Api.getDriverStandings(season)
        
        if (!ignore) {
          setStandings(result.data)
          setDataSource(result.source)
          console.log(`Successfully fetched ${result.data.length} driver standings from ${result.source}`);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message)
          console.error("Failed to fetch driver standings:", err)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    fetchStandings()

    return () => {
      ignore = true
    }
  }, [season])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await f1Api.getDriverStandings(season)
      setStandings(result.data)
      setDataSource(result.source)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [season])

  return { standings, loading, error, dataSource, refetch }
}
