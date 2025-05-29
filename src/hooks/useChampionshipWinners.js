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

        console.log(`Fetching championship winners from ${startYear} to ${endYear}...`)
        const result = await f1Api.getChampionshipWinners(startYear, endYear)
        console.log(`Received ${result.data.length} champions:`, result.data)

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

      console.log(`Refetching championship winners from ${startYear} to ${endYear}...`)
      const result = await f1Api.getChampionshipWinners(startYear, endYear)
      console.log(`Received ${result.data.length} champions:`, result.data)

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
