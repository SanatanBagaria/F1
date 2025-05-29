"use client"

import { useState, useEffect } from "react"
import { f1Api } from "../services/f1Api"

export const useChampionshipWinners = (startYear = 2020, endYear = new Date().getFullYear()) => {
  const [champions, setChampions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataSource, setDataSource] = useState("")

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        setLoading(true)
        setError(null)

        const result = await f1Api.getChampionshipWinners(startYear, endYear)
        setChampions(result.data)
        setDataSource(result.source)
      } catch (err) {
        setError(err.message)
        console.error("Failed to fetch championship winners:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchChampions()
  }, [startYear, endYear])

  const refetch = async () => {
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
  }

  return { champions, loading, error, refetch, dataSource }
}

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
        console.log(`Received ${result.data.length} races for ${season}`)

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

  return { races, loading, error, dataSource }
}
