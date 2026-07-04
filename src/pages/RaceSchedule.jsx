import React, { useState, useEffect } from "react";
import { useRaceSchedule } from "../hooks/useRaceSchedule";

const RaceSchedule = () => {
  const [selectedSeason, setSelectedSeason] = useState(2026);
  const { races, loading, error, refetch, dataSource } = useRaceSchedule(selectedSeason);
  
  // Expandable results states
  const [expandedRace, setExpandedRace] = useState(null);
  const [raceResults, setRaceResults] = useState({});
  const [loadingResults, setLoadingResults] = useState(false);
  const [standings, setStandings] = useState([]);

  // Generate season options (no future years, up to 2026)
  const seasons = Array.from({ length: 9 }, (_, i) => 2026 - i);

  // Fetch driver standings for predictions fallback
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_BASE_URL}/api/standings/drivers/${selectedSeason}`);
        if (res.ok) {
          const data = await res.json();
          setStandings(data);
        }
      } catch (err) {
        console.error("Failed to fetch standings for schedule predictions:", err);
      }
    };
    fetchStandings();
  }, [selectedSeason]);

  const fetchResults = async (round) => {
    const key = `${selectedSeason}-${round}`;
    if (raceResults[key]) return; // Already cached locally

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
      if (new Date(race.date) < new Date()) {
        fetchResults(race.round);
      }
    }
  };

  const handleAddToCalendar = (race, e) => {
    e.stopPropagation(); // Avoid expanding card
    const title = `F1 Grand Prix: ${race.name}`;
    const start = new Date(`${race.date}T${race.time || "14:00:00Z"}`);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hrs duration

    const formatDateForGoogle = (date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    };

    const details = `Round ${race.round} of F1 ${race.season} Season. Circuit: ${race.circuit}. URL: ${race.url}`;
    const location = `${race.circuit}, ${race.locality}, ${race.country}`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateForGoogle(start)}/${formatDateForGoogle(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleCalendarUrl, "_blank");
  };

  const formatDateTime = (date, time) => {
    try {
      const timeClean = time && time !== "TBD" ? (time.endsWith('Z') ? time : time + 'Z') : "14:00:00Z";
      const raceDateTime = new Date(`${date}T${timeClean}`);
      return {
        date: raceDateTime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: time === "TBD" ? "TBD" : raceDateTime.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
      };
    } catch (error) {
      return {
        date: new Date(date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: time || "TBD",
      };
    }
  };

  const getRaceStatus = (date) => {
    const now = new Date();
    const raceDate = new Date(date);
    if (now > raceDate) return "completed";
    return "upcoming";
  };

  const getStatusColor = (status) => {
    return status === "completed"
      ? "text-green-600 dark:text-green-400"
      : "text-blue-600 dark:text-blue-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading Schedule...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1 h-12 bg-red-600"></div>
              <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 dark:text-white tracking-tight">
                Race Calendar
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Track times, locations, and interactive classifications.
            </p>
          </div>
          
          {/* Season Selector Dropdown */}
          <div className="flex items-center space-x-3">
            <span className="text-gray-500 dark:text-gray-400 font-light">Season:</span>
            <select
              value={selectedSeason}
              onChange={(e) => {
                setSelectedSeason(parseInt(e.target.value));
                setExpandedRace(null);
              }}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 focus:border-red-600 focus:outline-none"
            >
              {seasons.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Race List */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-4">
            {races.map((race) => {
              const { date: formattedDate, time: formattedTime } = formatDateTime(race.date, race.time);
              const status = getRaceStatus(race.date);
              const isExpanded = expandedRace === race.id;
              const resultsKey = `${selectedSeason}-${race.round}`;
              const results = raceResults[resultsKey];

              return (
                <div
                  key={race.id}
                  onClick={() => handleRaceClick(race)}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-red-600/30 transition-all duration-300 rounded-lg p-8 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs uppercase tracking-widest font-semibold ${getStatusColor(status)}`}>
                          {status}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-light">Round {race.round}</span>
                      </div>
                      
                      <h3 className="text-2xl font-light text-gray-900 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        {race.name}
                      </h3>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                        {race.circuit} • <span className="font-normal">{race.locality}, {race.country}</span>
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 justify-between lg:justify-end">
                      <div className="text-left lg:text-right text-sm text-gray-600 dark:text-gray-400 font-light">
                        <div>{formattedDate}</div>
                        <div className="text-xs text-gray-500">{formattedTime}</div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={(e) => handleAddToCalendar(race, e)}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-all"
                        >
                          Add to Calendar
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(race.url, "_blank");
                          }}
                          className="px-4 py-2 border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-all"
                        >
                          Circuit Info
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Results Section */}
                  {isExpanded && (
                    <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                      <h4 className="text-lg font-light text-gray-900 dark:text-white mb-6">
                        {status === "completed" ? "Race Classification" : "Projected Starting Grid (based on Standings)"}
                      </h4>

                      {status === "completed" ? (
                        loadingResults ? (
                          <div className="flex justify-center py-6">
                            <div className="w-8 h-8 border-t-2 border-red-600 rounded-full animate-spin"></div>
                          </div>
                        ) : results ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                              <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 uppercase tracking-widest font-normal">
                                  <th className="py-3">Pos</th>
                                  <th className="py-3">Driver</th>
                                  <th className="py-3">Constructor</th>
                                  <th className="py-3 text-right">Time/Status</th>
                                  <th className="py-3 text-right">Points</th>
                                </tr>
                              </thead>
                              <tbody>
                                {results.map((res, i) => (
                                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800/40 text-sm font-light text-gray-900 dark:text-gray-300">
                                    <td className="py-3.5 font-medium text-gray-500">{res.position}</td>
                                    <td className="py-3.5 font-normal">{res.driver}</td>
                                    <td className="py-3.5 text-gray-500">{res.team}</td>
                                    <td className="py-3.5 text-right text-gray-500">{res.time}</td>
                                    <td className="py-3.5 text-right font-medium text-red-600">{res.points}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Results unavailable.</p>
                        )
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-gray-100 dark:border-gray-800 text-xs text-gray-400 uppercase tracking-widest">
                                <th className="py-3">Grid</th>
                                <th className="py-3">Driver</th>
                                <th className="py-3">Constructor</th>
                                <th className="py-3 text-right">Points</th>
                              </tr>
                            </thead>
                            <tbody>
                              {standings.slice(0, 15).map((std, i) => (
                                <tr key={i} className="border-b border-gray-50 dark:border-gray-800/40 text-sm font-light text-gray-900 dark:text-gray-300">
                                  <td className="py-3.5 font-medium text-gray-500">{i + 1}</td>
                                  <td className="py-3.5 font-normal">{std.Driver.givenName} {std.Driver.familyName}</td>
                                  <td className="py-3.5 text-gray-500">{std.Constructors[0]?.name || "N/A"}</td>
                                  <td className="py-3.5 text-right text-gray-500">{std.points}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      {dataSource && (
        <section className="py-12 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
          Calendar feeds dynamically synced via {dataSource}
        </section>
      )}
    </div>
  );
};

export default RaceSchedule;
