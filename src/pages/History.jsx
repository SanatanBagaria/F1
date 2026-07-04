import React, { useState, useEffect } from "react";
import { useChampionshipWinners } from "../hooks/useChampionshipWinners";
import { useRaceSchedule } from "../hooks/useRaceSchedule";

const History = () => {
  const [activeTab, setActiveTab] = useState("champions");
  const [selectedSeason, setSelectedSeason] = useState(2026);
  
  // Tab 1: Champions list
  const { champions, loading: loadingChamps, error: errorChamps } = useChampionshipWinners(2015, 2025);
  
  // Tab 2: Race schedule & results
  const { races, loading: loadingSchedule, error: errorSchedule } = useRaceSchedule(selectedSeason);
  const [expandedRace, setExpandedRace] = useState(null);
  const [raceResults, setRaceResults] = useState({});
  const [loadingResults, setLoadingResults] = useState(false);

  const seasons = Array.from({ length: 12 }, (_, i) => 2026 - i); // 2026 down to 2015

  const fetchResults = async (round) => {
    const key = `${selectedSeason}-${round}`;
    if (raceResults[key]) return;

    setLoadingResults(true);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_BASE_URL}/api/results/${selectedSeason}/${round}`);
      if (response.ok) {
        const rawData = await response.json();
        const mappedResults = rawData.map(res => ({
          position: res.position,
          driver: `${res.Driver.givenName} ${res.Driver.familyName}`,
          team: res.Constructor.name,
          time: res.Time?.time || res.status || 'N/A',
          points: res.points
        }));
        setRaceResults(prev => ({
          ...prev,
          [key]: mappedResults
        }));
      }
    } catch (err) {
      console.error("Failed to fetch race results:", err);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleRaceClick = (race) => {
    if (expandedRace === race.id) {
      setExpandedRace(null);
    } else {
      setExpandedRace(race.id);
      fetchResults(race.round);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-4">
            <div className="w-1 h-12 bg-red-600"></div>
            <h1 className="text-4xl md:text-6xl font-extralight text-gray-900 dark:text-white tracking-tight">
              F1 History Hub
            </h1>
            <div className="w-1 h-12 bg-red-600"></div>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl mx-auto">
            Explore past seasons, world champions, and detailed classification results.
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 gap-px bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <button
              onClick={() => setActiveTab("champions")}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 font-light text-lg ${
                activeTab === "champions" 
                  ? "bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400" 
                  : "bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              }`}
            >
              World Champions
            </button>
            <button
              onClick={() => setActiveTab("races")}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 font-light text-lg ${
                activeTab === "races" 
                  ? "bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400" 
                  : "bg-white dark:bg-gray-950 text-gray-900 dark:text-white"
              }`}
            >
              Race Archive
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Champions Tab */}
          {activeTab === "champions" && (
            <div className="space-y-6">
              {loadingChamps ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-t-2 border-red-600 rounded-full animate-spin"></div>
                </div>
              ) : errorChamps ? (
                <div className="text-center text-red-500 py-12">{errorChamps}</div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {champions.map((champion) => (
                    <div 
                      key={champion.year}
                      className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl p-8 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <h3 className="text-3xl font-extralight text-gray-900 dark:text-white">{champion.year}</h3>
                          <p className="text-xs text-gray-500 uppercase tracking-widest">Season Champions</p>
                        </div>
                        <div 
                          className="w-3 h-12 rounded"
                          style={{ backgroundColor: champion.teamColor }}
                        ></div>
                      </div>

                      <div className="space-y-6">
                        {/* Driver */}
                        <div className="space-y-1">
                          <span className="text-xs text-gray-400 font-light uppercase tracking-wider">Drivers' Champion</span>
                          <div className="text-lg text-gray-900 dark:text-white font-medium">{champion.driver}</div>
                          <div className="text-xs text-gray-500 font-light">{champion.team} ({champion.points} pts, {champion.wins} wins)</div>
                        </div>

                        {/* Constructor */}
                        <div className="space-y-1">
                          <span className="text-xs text-gray-400 font-light uppercase tracking-wider">Constructors' Champion</span>
                          <div className="text-lg text-gray-900 dark:text-white font-medium">{champion.constructorChampion}</div>
                          <div className="text-xs text-gray-500 font-light">{champion.constructorPoints} pts, {champion.constructorWins} wins</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Races Tab */}
          {activeTab === "races" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-light text-gray-900 dark:text-white">Historical Season Results</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Season:</span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => {
                      setSelectedSeason(parseInt(e.target.value));
                      setExpandedRace(null);
                    }}
                    className="bg-white dark:bg-gray-905 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 focus:border-red-600 focus:outline-none"
                  >
                    {seasons.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loadingSchedule ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-t-2 border-red-600 rounded-full animate-spin"></div>
                </div>
              ) : errorSchedule ? (
                <div className="text-center text-red-500 py-12">{errorSchedule}</div>
              ) : (
                <div className="space-y-4">
                  {races.map((race) => {
                    const isExpanded = expandedRace === race.id;
                    const resultsKey = `${selectedSeason}-${race.round}`;
                    const results = raceResults[resultsKey];

                    return (
                      <div
                        key={race.id}
                        onClick={() => handleRaceClick(race)}
                        className="bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-850 hover:border-red-600/30 transition-all rounded-lg p-6 cursor-pointer"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="space-y-1">
                            <span className="text-xs text-gray-400">Round {race.round}</span>
                            <h4 className="text-lg font-light text-gray-900 dark:text-white">{race.name}</h4>
                            <p className="text-xs text-gray-500 font-light">{race.circuit} • {race.locality}, {race.country}</p>
                          </div>
                          
                          <div className="text-right text-xs text-gray-500">
                            <div>{new Date(race.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                            <div className="text-red-500 mt-1 uppercase font-semibold text-[10px] tracking-widest">
                              {isExpanded ? "Click to collapse" : "Click to view results"}
                            </div>
                          </div>
                        </div>

                        {/* Collapsible Classification */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                            <h5 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-4">Official Classification</h5>
                            
                            {loadingResults ? (
                              <div className="flex justify-center py-6">
                                <div className="w-6 h-6 border-t-2 border-red-600 rounded-full animate-spin"></div>
                              </div>
                            ) : results ? (
                              <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                  <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 uppercase tracking-widest font-normal">
                                      <th className="py-2">Pos</th>
                                      <th className="py-2">Driver</th>
                                      <th className="py-2">Team</th>
                                      <th className="py-2 text-right">Time/Status</th>
                                      <th className="py-2 text-right">Pts</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {results.map((res, idx) => (
                                      <tr key={idx} className="border-b border-gray-50 dark:border-gray-850/40 text-xs font-light text-gray-800 dark:text-gray-300">
                                        <td className="py-2.5 font-medium text-gray-400">{res.position}</td>
                                        <td className="py-2.5 font-normal text-gray-950 dark:text-white">{res.driver}</td>
                                        <td className="py-2.5 text-gray-500">{res.team}</td>
                                        <td className="py-2.5 text-right text-gray-500">{res.time}</td>
                                        <td className="py-2.5 text-right font-medium text-red-600">{res.points}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-xs text-gray-500">Results unavailable.</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default History;
