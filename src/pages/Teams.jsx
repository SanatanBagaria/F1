"use client"

import { useState, useMemo } from "react"
import { useTeams } from "../hooks/useTeams"
import { API_SOURCES } from "../services/f1Api"

const Teams = () => {
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [preferredApi, setPreferredApi] = useState(API_SOURCES.AUTO)

  const { teams, loading, error, refetch, dataSource, changeApiSource } = useTeams(selectedSeason, preferredApi)

  // Handle API source change
  const handleApiSourceChange = (newSource) => {
    setPreferredApi(newSource)
    changeApiSource(newSource)
  }

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm.trim()) return teams
    const lowercaseSearch = searchTerm.toLowerCase()
    return teams.filter(team =>
      team.name.toLowerCase().includes(lowercaseSearch) ||
      team.nationality?.toLowerCase().includes(lowercaseSearch) ||
      team.headquarters?.toLowerCase().includes(lowercaseSearch) ||
      team.teamPrincipal?.toLowerCase().includes(lowercaseSearch)
    )
  }, [teams, searchTerm])

  const seasons = [2025, 2024, 2023, 2022, 2021, 2020]

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">Fetching teams</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto"></div>
          <div className="space-y-4">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Error</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">{error}</p>
            <button
              onClick={refetch}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
            >
              Try Again
            </button>
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
                Teams
              </h1>
              <div className="w-1 h-12 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
              {selectedSeason} Season
            </p>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          {/* Season Selector */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-gray-100 dark:bg-gray-800">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
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

          {/* Search and View Mode */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-light focus:border-red-600 dark:focus:border-red-400 transition-colors"
              />
            </div>
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setViewMode("grid")}
                className={`text-sm font-light transition-colors ${
                  viewMode === "grid"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                }`}
              >
                Grid
              </button>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
              <button
                onClick={() => setViewMode("list")}
                className={`text-sm font-light transition-colors ${
                  viewMode === "list"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                }`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Teams Display */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="group bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-red-600 dark:hover:border-red-400 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedTeam(team)}
                >
                  <div className="space-y-6">
                    {/* Team Header */}
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-1 h-8"
                        style={{ backgroundColor: team.teamColour || team.color || '#EF4444' }}
                      ></div>
                      <div className="space-y-1">
                        <h3 className="text-lg font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                          {team.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                          {team.nationality}
                        </p>
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-xl font-light text-gray-900 dark:text-white">
                          {team.position || "-"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Position
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-light text-gray-900 dark:text-white">
                          {team.points}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Points
                        </div>
                      </div>
                    </div>

                    {/* Drivers */}
                    {team.drivers && team.drivers.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-light text-gray-900 dark:text-white">Drivers</h4>
                        <div className="space-y-1">
                          {team.drivers.map((driver, index) => (
                            <div key={index} className="text-xs text-gray-500 dark:text-gray-400 font-light">
                              {driver.name} #{driver.permanentNumber}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-colors"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && (
            <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-100 dark:border-gray-800">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pos</th>
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wins</th>
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Founded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredTeams
                      .sort((a, b) => (a.position || 999) - (b.position || 999))
                      .map((team) => (
                        <tr
                          key={team.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                          onClick={() => setSelectedTeam(team)}
                        >
                          <td className="px-6 py-6">
                            <span className="text-lg font-light text-gray-900 dark:text-white">
                              {team.position || "-"}
                            </span>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-1 h-6"
                                style={{ backgroundColor: team.teamColour || team.color || '#EF4444' }}
                              ></div>
                              <div>
                                <div className="font-light text-gray-900 dark:text-white">{team.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 font-light">{team.nationality}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="text-lg font-light text-gray-900 dark:text-white">{team.points}</div>
                          </td>
                          <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">{team.wins}</td>
                          <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">{team.founded}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredTeams.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="space-y-6">
                <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extralight text-gray-900 dark:text-white">No teams found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-light">Try adjusting your search</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-950 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-12">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-extralight text-gray-900 dark:text-white">
                    {selectedTeam.name}
                  </h2>
                  <div className="w-12 h-px bg-red-600"></div>
                </div>
                <button
                  onClick={() => setSelectedTeam(null)}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Close
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-light text-gray-900 dark:text-white">Information</h3>
                    <div className="space-y-3 text-sm font-light">
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Nationality</span>
                        <span className="text-gray-900 dark:text-white">{selectedTeam.nationality}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Founded</span>
                        <span className="text-gray-900 dark:text-white">{selectedTeam.founded}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Headquarters</span>
                        <span className="text-gray-900 dark:text-white">{selectedTeam.headquarters}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">Team Principal</span>
                        <span className="text-gray-900 dark:text-white">{selectedTeam.teamPrincipal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Championships</span>
                        <span className="text-gray-900 dark:text-white">{selectedTeam.championships}</span>
                      </div>
                    </div>
                  </div>

                  {selectedTeam.description && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-light text-gray-900 dark:text-white">About</h3>
                      <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
                        {selectedTeam.description}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-light text-gray-900 dark:text-white">Season Performance</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 border border-gray-100 dark:border-gray-800">
                        <div className="text-2xl font-light text-gray-900 dark:text-white">
                          {selectedTeam.position || "-"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</div>
                      </div>
                      <div className="text-center p-4 border border-gray-100 dark:border-gray-800">
                        <div className="text-2xl font-light text-gray-900 dark:text-white">{selectedTeam.points}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</div>
                      </div>
                    </div>
                  </div>

                  {selectedTeam.drivers && selectedTeam.drivers.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-light text-gray-900 dark:text-white">Drivers</h3>
                      <div className="space-y-3">
                        {selectedTeam.drivers.map((driver, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border border-gray-100 dark:border-gray-800">
                            <div>
                              <div className="font-light text-gray-900 dark:text-white">{driver.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 font-light">#{driver.permanentNumber}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-light text-gray-900 dark:text-white">{driver.points}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">points</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedTeam.url && (
                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
                  <a
                    href={selectedTeam.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                  >
                    Official Website →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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

export default Teams
