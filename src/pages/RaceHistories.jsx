import React, { useState } from "react"
import { useRaceSchedule } from "../hooks/useRaceSchedule"
import { useRaceResults } from "../hooks/useRaceResults"

const RaceHistories = () => {
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear())
  const [expandedRaces, setExpandedRaces] = useState(new Set())
  
  // Get race schedule (fast)
  const { races: schedule, loading: scheduleLoading, error: scheduleError, dataSource } = useRaceSchedule(selectedSeason)
  
  // Get race results on-demand (only when needed)
  const { raceResults, loadingResults, errors, fetchRaceResult } = useRaceResults()

  // Generate season options
  const currentYear = new Date().getFullYear()
  const seasons = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i)

  const handleRaceToggle = async (race) => {
    const raceKey = `${race.season}-${race.round}`
    const newExpandedRaces = new Set(expandedRaces)
    
    if (expandedRaces.has(raceKey)) {
      // Collapse race
      newExpandedRaces.delete(raceKey)
    } else {
      // Expand race and fetch results if not already loaded
      newExpandedRaces.add(raceKey)
      if (!raceResults[raceKey] && !loadingResults[raceKey]) {
        await fetchRaceResult(race.season, race.round)
      }
    }
    
    setExpandedRaces(newExpandedRaces)
  }

  if (scheduleLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">Fetching race data</p>
          </div>
        </div>
      </div>
    )
  }

  if (scheduleError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto"></div>
          <div className="space-y-4">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Error</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">{scheduleError}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Minimal Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-4">
              <div className="w-1 h-12 bg-red-600"></div>
              <h1 className="text-4xl md:text-6xl font-extralight text-gray-900 dark:text-white tracking-tight">
                Histories
              </h1>
              <div className="w-1 h-12 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
              {selectedSeason} Season
            </p>
          </div>
        </div>
      </section>

      {/* Season Selector */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 md:grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => {
                  setSelectedSeason(season)
                  setExpandedRaces(new Set())
                }}
                className={`group bg-white dark:bg-gray-950 p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                  selectedSeason === season ? "bg-gray-50 dark:bg-gray-900" : ""
                }`}
              >
                <div className="space-y-2">
                  <div className={`text-lg font-light transition-colors ${
                    selectedSeason === season 
                      ? "text-red-600 dark:text-red-400" 
                      : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                  }`}>
                    {season}
                  </div>
                  <div className={`w-6 h-px mx-auto transition-colors ${
                    selectedSeason === season 
                      ? "bg-red-600 dark:bg-red-400" 
                      : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                  }`}></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Race List */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-px bg-gray-100 dark:bg-gray-800">
            {schedule.map((race) => {
              const raceKey = `${race.season}-${race.round}`
              const isExpanded = expandedRaces.has(raceKey)
              const raceResult = raceResults[raceKey]
              const isLoadingResult = loadingResults[raceKey]
              const resultError = errors[raceKey]
              const hasResults = race.status === "completed"

              return (
                <div
                  key={race.id}
                  className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
                >
                  {/* Race Header */}
                  <div className="p-12">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-1 h-8 bg-red-600"></div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-light text-gray-900 dark:text-white">
                              Round {race.round}: {race.name}
                            </h3>
                            <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 font-light">
                              <span>{race.circuit}</span>
                              <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                              <span>{race.locality}, {race.country}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pl-5 text-sm text-gray-500 dark:text-gray-400 font-light">
                          {new Date(race.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {race.time && race.time !== "TBD" && (
                            <span className="ml-4">{race.time}</span>
                          )}
                        </div>
                      </div>

                      {/* Toggle Button */}
                      {hasResults && (
                        <button
                          onClick={() => handleRaceToggle(race)}
                          className="group/btn inline-flex items-center space-x-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                        >
                          <span>{isExpanded ? "Hide Results" : "Show Results"}</span>
                          <div className={`w-4 h-px bg-gray-300 dark:bg-gray-700 group-hover/btn:bg-red-600 dark:group-hover/btn:bg-red-400 transition-all transform ${isExpanded ? "rotate-90" : ""}`}></div>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Race Results - Loaded On Demand */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                      {isLoadingResult ? (
                        <div className="p-12">
                          <div className="space-y-4">
                            <div className="w-1 h-8 bg-red-600 animate-pulse"></div>
                            <div className="space-y-3">
                              {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex space-x-4">
                                  <div className="w-8 h-4 bg-gray-200 dark:bg-gray-800"></div>
                                  <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-800"></div>
                                  <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-800"></div>
                                  <div className="w-16 h-4 bg-gray-200 dark:bg-gray-800"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : resultError ? (
                        <div className="p-12">
                          <div className="space-y-4">
                            <div className="w-1 h-8 bg-red-600"></div>
                            <div className="space-y-2">
                              <h4 className="text-lg font-light text-gray-900 dark:text-white">Error</h4>
                              <p className="text-gray-500 dark:text-gray-400 font-light">{resultError}</p>
                              <button 
                                onClick={() => fetchRaceResult(race.season, race.round)}
                                className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                              >
                                Try Again
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : raceResult && raceResult.results && raceResult.results.length > 0 ? (
                        <div className="p-12">
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <h4 className="text-lg font-light text-gray-900 dark:text-white">Results</h4>
                              <div className="w-12 h-px bg-red-600"></div>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead className="border-b border-gray-100 dark:border-gray-800">
                                    <tr>
                                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pos</th>
                                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Driver</th>
                                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
                                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
                                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {raceResult.results.map((result) => (
                                      <tr key={result.position} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                        <td className="px-6 py-4 text-sm font-light text-gray-900 dark:text-white">
                                          {result.position}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-light text-gray-900 dark:text-white">
                                          {result.driver}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-light text-gray-500 dark:text-gray-400">
                                          {result.team}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-light text-gray-500 dark:text-gray-400">
                                          {result.time}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-light text-gray-500 dark:text-gray-400">
                                          {result.points}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-12">
                          <div className="space-y-4">
                            <div className="w-1 h-8 bg-gray-300 dark:bg-gray-700"></div>
                            <p className="text-gray-500 dark:text-gray-400 font-light">No results available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Data Source */}
      {dataSource && (
        <section className="py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              Data from {dataSource}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default RaceHistories
