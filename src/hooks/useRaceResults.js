"use client"

import { useState, useCallback } from "react"
import { f1Api } from "../services/f1Api"

export const useRaceResults = () => {
  const [raceResults, setRaceResults] = useState({})
  const [loadingResults, setLoadingResults] = useState({})
  const [errors, setErrors] = useState({})

  const fetchRaceResult = useCallback(async (season, round) => {
    const raceKey = `${season}-${round}`
    
    // If already loaded or loading, don't fetch again
    if (raceResults[raceKey] || loadingResults[raceKey]) {
      return raceResults[raceKey]
    }

    try {
      setLoadingResults(prev => ({ ...prev, [raceKey]: true }))
      setErrors(prev => ({ ...prev, [raceKey]: null }))

      console.log(`Fetching results for ${season} Round ${round}...`)
      const result = await f1Api.getRaceResultsByRound(season, round)
      
      setRaceResults(prev => ({ 
        ...prev, 
        [raceKey]: result.data 
      }))
      
      return result.data
    } catch (error) {
      console.error(`Error fetching race results for ${season} Round ${round}:`, error)
      setErrors(prev => ({ 
        ...prev, 
        [raceKey]: error.message 
      }))
      return null
    } finally {
      setLoadingResults(prev => ({ ...prev, [raceKey]: false }))
    }
  }, [raceResults, loadingResults])

  const clearRaceResult = useCallback((season, round) => {
    const raceKey = `${season}-${round}`
    setRaceResults(prev => {
      const newResults = { ...prev }
      delete newResults[raceKey]
      return newResults
    })
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[raceKey]
      return newErrors
    })
  }, [])

  return {
    raceResults,
    loadingResults,
    errors,
    fetchRaceResult,
    clearRaceResult
  }
}
