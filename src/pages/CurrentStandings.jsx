"use client";

import { useState, useEffect } from "react";

const CurrentStandings = () => {
  const [activeTab, setActiveTab] = useState("drivers");
  const [viewMode, setViewMode] = useState("table");

  // Add state for dynamic data
  const [driversStandings, setDriversStandings] = useState([]);
  const [constructorsStandings, setConstructorsStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState("");

  const getTeamColor = (constructorId) => {
    const teamColors = {
      'red_bull': '#3671C6',
      'mclaren': '#F58020',
      'ferrari': '#F91536',
      'mercedes': '#6CD3BF',
      'aston_martin': '#229971',
      'alpine': '#2293D1',
      'williams': '#37003C',
      'alphatauri': '#5E8FAA',
      'alfa': '#C92D4B',
      'haas': '#B6BABD',
      'rb': '#6692FF',
      'kick_sauber': '#52C832'
    };
    return teamColors[constructorId] || '#666666';
  };

  const fetchStandingsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from your backend API
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      
      const [driversResponse, constructorsResponse, podiumsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/standings/drivers/current?t=${Date.now()}`),
        fetch(`${API_BASE_URL}/api/standings/teams/current?t=${Date.now()}`),
        fetch(`${API_BASE_URL}/api/driver-podiums/current?t=${Date.now()}`).catch(() => null)
      ]);

      if (!driversResponse.ok || !constructorsResponse.ok) {
        throw new Error('Failed to fetch standings data');
      }

      const driversData = await driversResponse.json();
      const constructorsData = await constructorsResponse.json();
      let podiumsData = {};
      if (podiumsResponse && podiumsResponse.ok) {
        podiumsData = await podiumsResponse.json();
      }

      // Transform drivers data
      const transformedDrivers = driversData.map((driver) => ({
        position: parseInt(driver.position),
        driver: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
        team: driver.Constructors[0].name,
        points: parseInt(driver.points),
        wins: parseInt(driver.wins),
        podiums: podiumsData[driver.Driver.driverId] || parseInt(driver.wins) || 0,
        poles: driver.poles || 0,
        fastestLaps: driver.fastestLaps || 0,
        dnfs: driver.dnfs || 0,
        pointsPerRace: driver.pointsPerRace || 0,
        teamColor: getTeamColor(driver.Constructors[0].constructorId),
      }));

      // Map constructor drivers and individual points dynamically
      const constructorsDriversMap = {};
      driversData.forEach(driver => {
        const constructorId = driver.Constructors[0].constructorId;
        const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
        const driverPoints = parseInt(driver.points);
        
        if (!constructorsDriversMap[constructorId]) {
          constructorsDriversMap[constructorId] = [];
        }
        constructorsDriversMap[constructorId].push({ name: driverName, points: driverPoints });
      });

      // Transform constructors data
      const transformedConstructors = constructorsData.map((constructor) => {
        const constId = constructor.Constructor.constructorId;
        const constructorDrivers = constructorsDriversMap[constId] || [];
        
        const d1 = constructorDrivers[0]?.name || "N/A";
        const d1Points = constructorDrivers[0]?.points || 0;
        const d2 = constructorDrivers[1]?.name || "N/A";
        const d2Points = constructorDrivers[1]?.points || 0;

        let totalPodiums = 0;
        transformedDrivers.forEach(dr => {
          if (dr.team.toLowerCase().includes(constructor.Constructor.name.toLowerCase())) {
            totalPodiums += dr.podiums;
          }
        });

        return {
          position: parseInt(constructor.position),
          team: constructor.Constructor.name,
          points: parseInt(constructor.points),
          color: getTeamColor(constId),
          wins: parseInt(constructor.wins),
          podiums: totalPodiums || parseInt(constructor.wins) || 0,
          poles: constructor.poles || 0,
          fastestLaps: constructor.fastestLaps || 0,
          driver1: d1,
          driver2: d2,
          driver1Points: d1Points,
          driver2Points: d2Points,
        };
      });

      setDriversStandings(transformedDrivers);
      setConstructorsStandings(transformedConstructors);
      setDataSource('Jolpica F1 API');

    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch standings, using fallback:", err);
      setDriversStandings([
        {
          position: 1,
          driver: "Max Verstappen",
          team: "Red Bull Racing",
          points: 393,
          wins: 7,
          podiums: 12,
          poles: 5,
          fastestLaps: 4,
          dnfs: 1,
          pointsPerRace: 19.7,
          teamColor: "#3671C6",
        },
        {
          position: 2,
          driver: "Lando Norris",
          team: "McLaren",
          points: 331,
          wins: 3,
          podiums: 8,
          poles: 2,
          fastestLaps: 2,
          dnfs: 0,
          pointsPerRace: 16.6,
          teamColor: "#F58020",
        },
        {
          position: 3,
          driver: "Charles Leclerc",
          team: "Ferrari",
          points: 307,
          wins: 2,
          podiums: 7,
          poles: 3,
          fastestLaps: 3,
          dnfs: 2,
          pointsPerRace: 15.4,
          teamColor: "#F91536",
        }
      ]);
      setConstructorsStandings([
        {
          position: 1,
          team: "McLaren",
          points: 593,
          color: "#F58020",
          wins: 5,
          podiums: 13,
          poles: 2,
          fastestLaps: 3,
          driver1: "Lando Norris",
          driver2: "Oscar Piastri",
          driver1Points: 331,
          driver2Points: 262,
        },
        {
          position: 2,
          team: "Red Bull Racing",
          points: 544,
          color: "#3671C6",
          wins: 7,
          podiums: 14,
          poles: 5,
          fastestLaps: 4,
          driver1: "Max Verstappen",
          driver2: "Sergio Perez",
          driver1Points: 393,
          driver2Points: 151,
        }
      ]);
      setDataSource('Local Offline Archive');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandingsData();
  }, []);

  const refetchData = () => {
    fetchStandingsData();
  };

  const getPositionColor = (position) => {
    switch (position) {
      case 1:
        return "text-red-600 dark:text-red-400";
      case 2:
        return "text-gray-500 dark:text-gray-400";
      case 3:
        return "text-gray-400 dark:text-gray-500";
      default:
        return "text-gray-300 dark:text-gray-600";
    }
  };

  const getPointsBarWidth = (points, maxPoints) => {
    return (points / maxPoints) * 100;
  };

  const maxDriverPoints = driversStandings.length > 0 
    ? Math.max(...driversStandings.map((d) => d.points)) 
    : 0;
  const maxConstructorPoints = constructorsStandings.length > 0 
    ? Math.max(...constructorsStandings.map((c) => c.points)) 
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">Fetching current standings</p>
          </div>
        </div>
      </div>
    );
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
                Standings
              </h1>
              <div className="w-1 h-12 bg-red-600"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
                {new Date().getFullYear()} Championship
              </p>
              <div className="flex justify-center items-center space-x-4">
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Data from: {dataSource}
                </p>
                <button
                  onClick={refetchData}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Refresh
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-500">
                  {error} - Using fallback data
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-px bg-gray-100 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("drivers")}
              className={`group bg-white dark:bg-gray-950 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                activeTab === "drivers" ? "bg-gray-50 dark:bg-gray-900" : ""
              }`}
            >
              <div className="space-y-2">
                <h3 className={`text-lg font-light transition-colors ${
                  activeTab === "drivers" 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                }`}>
                  Drivers
                </h3>
                <div className={`w-6 h-px transition-colors ${
                  activeTab === "drivers" 
                    ? "bg-red-600 dark:bg-red-400" 
                    : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                }`}></div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("constructors")}
              className={`group bg-white dark:bg-gray-950 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                activeTab === "constructors" ? "bg-gray-50 dark:bg-gray-900" : ""
              }`}
            >
              <div className="space-y-2">
                <h3 className={`text-lg font-light transition-colors ${
                  activeTab === "constructors" 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                }`}>
                  Constructors
                </h3>
                <div className={`w-6 h-px transition-colors ${
                  activeTab === "constructors" 
                    ? "bg-red-600 dark:bg-red-400" 
                    : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                }`}></div>
              </div>
            </button>

            <div className="flex items-center justify-center space-x-4 bg-white dark:bg-gray-950 p-8">
              <button
                onClick={() => setViewMode("table")}
                className={`text-sm font-light transition-colors ${
                  viewMode === "table"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                }`}
              >
                Table
              </button>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
              <button
                onClick={() => setViewMode("chart")}
                className={`text-sm font-light transition-colors ${
                  viewMode === "chart"
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                }`}
              >
                Chart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Drivers Standings */}
          {activeTab === "drivers" && (
            <>
              {/* Table View */}
              {viewMode === "table" && (
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-100 dark:border-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Pos
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Driver
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Points
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Wins
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Podiums
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {driversStandings.map((driver) => (
                          <tr
                            key={driver.position}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          >
                            <td className="px-6 py-6">
                              <span className={`text-2xl font-light ${getPositionColor(driver.position)}`}>
                                {driver.position}
                              </span>
                            </td>
                            <td className="px-6 py-6">
                              <div className="font-light text-gray-900 dark:text-white">
                                {driver.driver}
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-1 h-6"
                                  style={{ backgroundColor: driver.teamColor }}
                                ></div>
                                <span className="text-gray-500 dark:text-gray-400 font-light">
                                  {driver.team}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="text-2xl font-light text-gray-900 dark:text-white">
                                {driver.points}
                              </div>
                            </td>
                            <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">
                              {driver.wins}
                            </td>
                            <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">
                              {driver.podiums}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Chart View */}
              {viewMode === "chart" && (
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
                  <div className="space-y-8">
                    {driversStandings.slice(0, 8).map((driver) => (
                      <div
                        key={driver.position}
                        className="flex items-center space-x-8"
                      >
                        <div className={`w-8 text-2xl font-light ${getPositionColor(driver.position)}`}>
                          {driver.position}
                        </div>
                        <div className="w-48 text-lg font-light text-gray-900 dark:text-white">
                          {driver.driver}
                        </div>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1 relative">
                          <div
                            className="h-1"
                            style={{
                              backgroundColor: driver.teamColor,
                              width: `${getPointsBarWidth(driver.points, maxDriverPoints)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="w-16 text-right text-lg font-light text-gray-900 dark:text-white">
                          {driver.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Constructors Standings */}
          {activeTab === "constructors" && (
            <>
              {/* Table View */}
              {viewMode === "table" && (
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-100 dark:border-gray-800">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Pos
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Team
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Points
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Drivers
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Wins
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {constructorsStandings.map((team) => (
                          <tr
                            key={team.position}
                            className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                          >
                            <td className="px-6 py-6">
                              <span className={`text-2xl font-light ${getPositionColor(team.position)}`}>
                                {team.position}
                              </span>
                            </td>
                            <td className="px-6 py-6">
                              <div className="flex items-center space-x-3">
                                <div
                                  className="w-1 h-6"
                                  style={{ backgroundColor: team.color }}
                                ></div>
                                <div className="font-light text-gray-900 dark:text-white">
                                  {team.team}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="text-2xl font-light text-gray-900 dark:text-white">
                                {team.points}
                              </div>
                            </td>
                            <td className="px-6 py-6">
                              <div className="space-y-1">
                                <div className="text-gray-900 dark:text-white font-light">
                                  {team.driver1} ({team.driver1Points})
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 font-light">
                                  {team.driver2} ({team.driver2Points})
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-gray-500 dark:text-gray-400 font-light">
                              {team.wins}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Chart View */}
              {viewMode === "chart" && (
                <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
                  <div className="space-y-8">
                    {constructorsStandings.map((team) => (
                      <div
                        key={team.position}
                        className="flex items-center space-x-8"
                      >
                        <div className={`w-8 text-2xl font-light ${getPositionColor(team.position)}`}>
                          {team.position}
                        </div>
                        <div className="w-48 text-lg font-light text-gray-900 dark:text-white">
                          {team.team}
                        </div>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-800 h-1 relative">
                          <div
                            className="h-1"
                            style={{
                              backgroundColor: team.color,
                              width: `${getPointsBarWidth(team.points, maxConstructorPoints)}%`,
                            }}
                          ></div>
                        </div>
                        <div className="w-16 text-right text-lg font-light text-gray-900 dark:text-white">
                          {team.points}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default CurrentStandings;
