"use client"

import { useState, useMemo } from "react"
import { useTeams } from "../hooks/useTeams"

const Teams = () => {
  const [selectedSeason, setSelectedSeason] = useState(new Date().getFullYear())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [viewMode, setViewMode] = useState("grid")
  const [sortBy, setSortBy] = useState("position")
  const [sortOrder, setSortOrder] = useState("asc")

  const { teams, loading, error, refetch, dataSource } = useTeams(selectedSeason)

  // MOVE ALL HELPER FUNCTIONS TO THE TOP - BEFORE useMemo
  const getFullTeamName = (name) => {
    const fullNames = {
      'Red Bull Racing': 'Oracle Red Bull Racing',
      'Mercedes': 'Mercedes-AMG Petronas F1 Team',
      'Ferrari': 'Scuderia Ferrari',
      'McLaren': 'McLaren Formula 1 Team',
      'Alpine F1 Team': 'BWT Alpine F1 Team',
      'Aston Martin': 'Aston Martin Aramco F1 Team',
      'Williams': 'Williams Racing',
      'AlphaTauri': 'Scuderia AlphaTauri',
      'Alfa Romeo': 'Alfa Romeo F1 Team ORLEN',
      'Haas F1 Team': 'MoneyGram Haas F1 Team'
    }
    return fullNames[name] || name
  }

  const getPowerUnit = (constructorId) => {
    const powerUnits = {
      'red_bull': 'Honda RBPT',
      'mercedes': 'Mercedes',
      'ferrari': 'Ferrari',
      'mclaren': 'Mercedes',
      'alpine': 'Renault',
      'aston_martin': 'Mercedes',
      'williams': 'Mercedes',
      'alphatauri': 'Honda RBPT',
      'alfa': 'Ferrari',
      'haas': 'Ferrari'
    }
    return powerUnits[constructorId] || 'Unknown'
  }

  const getChassis = (constructorId, season) => {
    const chassis = {
      'red_bull': `RB${season - 2004}`,
      'mercedes': `W${season - 2009}`,
      'ferrari': `SF-${season}`,
      'mclaren': `MCL${season - 1965}`,
      'alpine': `A${season - 2020}`,
      'aston_martin': `AMR${season - 2020}`,
      'williams': `FW${season - 1977}`,
      'alphatauri': `AT0${season - 2019}`,
      'alfa': `C${season - 2017}`,
      'haas': `VF-${season - 2015}`
    }
    return chassis[constructorId] || 'Unknown'
  }

  const getTeamDrivers = (constructorId) => {
    const drivers2025 = {
      'red_bull': ['Max Verstappen', 'Sergio Pérez'],
      'mercedes': ['Lewis Hamilton', 'George Russell'],
      'ferrari': ['Charles Leclerc', 'Carlos Sainz Jr.'],
      'mclaren': ['Lando Norris', 'Oscar Piastri'],
      'alpine': ['Pierre Gasly', 'Esteban Ocon'],
      'aston_martin': ['Fernando Alonso', 'Lance Stroll'],
      'williams': ['Alexander Albon', 'Logan Sargeant'],
      'alphatauri': ['Yuki Tsunoda', 'Daniel Ricciardo'],
      'alfa': ['Valtteri Bottas', 'Zhou Guanyu'],
      'haas': ['Kevin Magnussen', 'Nico Hülkenberg']
    }
    return drivers2025[constructorId] || ['Driver 1', 'Driver 2']
  }

  const getTeamEstablished = (constructorId) => {
    const established = {
      'ferrari': '1950',
      'mclaren': '1963',
      'williams': '1977',
      'mercedes': '2010',
      'red_bull': '2005',
      'alpine': '2021',
      'aston_martin': '2021',
      'alphatauri': '2006',
      'alfa': '2019',
      'haas': '2016'
    }
    return established[constructorId] || 'Unknown'
  }

  const getTeamHeadquarters = (constructorId) => {
    const headquarters = {
      'red_bull': 'Milton Keynes, United Kingdom',
      'mercedes': 'Brackley, United Kingdom',
      'ferrari': 'Maranello, Italy',
      'mclaren': 'Woking, United Kingdom',
      'alpine': 'Enstone, United Kingdom',
      'aston_martin': 'Silverstone, United Kingdom',
      'williams': 'Grove, United Kingdom',
      'alphatauri': 'Faenza, Italy',
      'alfa': 'Hinwil, Switzerland',
      'haas': 'Kannapolis, United States'
    }
    return headquarters[constructorId] || 'Unknown'
  }

  const getTeamPrincipal = (constructorId) => {
    const principals = {
      'red_bull': 'Christian Horner',
      'mercedes': 'Toto Wolff',
      'ferrari': 'Frédéric Vasseur',
      'mclaren': 'Andrea Stella',
      'alpine': 'Bruno Famin',
      'aston_martin': 'Mike Krack',
      'williams': 'James Vowles',
      'alphatauri': 'Franz Tost',
      'alfa': 'Alessandro Alunni Bravi',
      'haas': 'Ayao Komatsu'
    }
    return principals[constructorId] || 'Unknown'
  }

  const getChampionships = (constructorId) => {
    const championships = {
      'ferrari': 16,
      'williams': 9,
      'mclaren': 8,
      'mercedes': 8,
      'red_bull': 6,
      'alpine': 2,
      'aston_martin': 0,
      'alphatauri': 0,
      'alfa': 0,
      'haas': 0
    }
    return championships[constructorId] || 0
  }

  // NOW useMemo can access all the helper functions
  const enhancedTeams = useMemo(() => {
    return teams.map((team, index) => ({
      ...team,
      rankPosition: index + 1,
      pointsPerRace: team.points ? (parseFloat(team.points) / 23).toFixed(1) : '0.0',
      winPercentage: team.wins && team.points ? ((parseInt(team.wins) / 23) * 100).toFixed(1) : '0.0',
      teamDetails: {
        fullName: getFullTeamName(team.name),
        established: team.founded || getTeamEstablished(team.constructorId),
        headquarters: team.headquarters || getTeamHeadquarters(team.constructorId),
        teamPrincipal: team.teamPrincipal || getTeamPrincipal(team.constructorId),
        powerUnit: getPowerUnit(team.constructorId),
        chassis: getChassis(team.constructorId, selectedSeason),
        drivers: getTeamDrivers(team.constructorId),
        championships: team.championships || getChampionships(team.constructorId)
      }
    }))
  }, [teams, selectedSeason])

  // Enhanced filtering and sorting
  const filteredAndSortedTeams = useMemo(() => {
    let filtered = enhancedTeams

    // Apply search filter
    if (searchTerm.trim()) {
      const lowercaseSearch = searchTerm.toLowerCase()
      filtered = enhancedTeams.filter(team =>
        team.name?.toLowerCase().includes(lowercaseSearch) ||
        team.nationality?.toLowerCase().includes(lowercaseSearch) ||
        team.teamDetails.headquarters?.toLowerCase().includes(lowercaseSearch) ||
        team.teamDetails.teamPrincipal?.toLowerCase().includes(lowercaseSearch) ||
        team.teamDetails.powerUnit?.toLowerCase().includes(lowercaseSearch)
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue
      
      switch (sortBy) {
        case 'position':
          aValue = parseInt(a.position) || 999
          bValue = parseInt(b.position) || 999
          break
        case 'points':
          aValue = parseFloat(a.points) || 0
          bValue = parseFloat(b.points) || 0
          break
        case 'wins':
          aValue = parseInt(a.wins) || 0
          bValue = parseInt(b.wins) || 0
          break
        case 'name':
          aValue = a.name || ''
          bValue = b.name || ''
          break
        case 'championships':
          aValue = parseInt(a.teamDetails.championships) || 0
          bValue = parseInt(b.teamDetails.championships) || 0
          break
        default:
          return 0
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filtered
  }, [enhancedTeams, searchTerm, sortBy, sortOrder])

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const seasons = [2025, 2024, 2023, 2022, 2021, 2020]

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">Fetching {selectedSeason} teams</p>
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
            <div className="space-y-2">
              <p className="text-sm text-red-500">
                API Connection Issue: Please check if teamData.js is using Jolpica API
              </p>
              <button
                onClick={refetch}
                className="bg-red-600 text-white px-6 py-2 hover:bg-red-700 transition-colors font-light"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
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
            <div className="space-y-2">
              <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
                {selectedSeason} Season
              </p>
              <div className="flex justify-center items-center space-x-4">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Data from: {dataSource} | {filteredAndSortedTeams.length} teams
                </p>
                <button
                  onClick={refetch}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
            </div>
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

          {/* Search and Controls */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search teams, nationality, headquarters..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-light focus:border-red-600 dark:focus:border-red-400 transition-colors"
              />
            </div>
            
            {/* Sort Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-light text-sm"
              >
                <option value="position">Sort by Position</option>
                <option value="points">Sort by Points</option>
                <option value="wins">Sort by Wins</option>
                <option value="name">Sort by Name</option>
                <option value="championships">Sort by Championships</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* View Mode */}
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
              {filteredAndSortedTeams.map((team, index) => (
                <div
                  key={team.id || team.constructorId || index}
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
                    <div className="grid grid-cols-3 gap-4">
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
                          {team.points || "0"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Points
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-light text-gray-900 dark:text-white">
                          {team.wins || "0"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Wins
                        </div>
                      </div>
                    </div>

                    {/* Drivers */}
                    {team.teamDetails?.drivers && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-light text-gray-900 dark:text-white">Drivers</h4>
                        <div className="space-y-1">
                          {team.teamDetails.drivers.slice(0, 2).map((driver, driverIndex) => (
                            <div key={driverIndex} className="text-xs text-gray-500 dark:text-gray-400 font-light">
                              {driver}
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
                      <th 
                        className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-red-600"
                        onClick={() => handleSort('position')}
                      >
                        Pos {sortBy === 'position' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-red-600"
                        onClick={() => handleSort('name')}
                      >
                        Team {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-red-600"
                        onClick={() => handleSort('points')}
                      >
                        Points {sortBy === 'points' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-red-600"
                        onClick={() => handleSort('wins')}
                      >
                        Wins {sortBy === 'wins' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">Founded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredAndSortedTeams.map((team, index) => (
                      <tr
                        key={team.id || team.constructorId || index}
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
                          <div className="text-lg font-light text-gray-900 dark:text-white">{team.points || "0"}</div>
                        </td>
                        <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">{team.wins || "0"}</td>
                        <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">
                          {team.teamDetails?.established || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedTeams.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="space-y-6">
                <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extralight text-gray-900 dark:text-white">No teams found</h3>
                  <p className="text-gray-500 dark:text-gray-400 font-light">
                    {searchTerm ? 'Try adjusting your search' : `No teams available for ${selectedSeason}`}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="text-red-600 dark:text-red-400 hover:underline font-light"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Data Source */}
      {dataSource && (
        <section className="py-12 border-t border-gray-100 dark:border-gray-800">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
              Data from {dataSource} | Last updated: {new Date().toLocaleString()}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default Teams
