import React, { useState, useMemo } from "react";
import { useDriverStandings } from "../hooks/useDrivers";

const Drivers = () => {
  const [selectedSeason, setSelectedSeason] = useState(2026);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { standings: driversStandings, loading, error, refetch, dataSource } = useDriverStandings(selectedSeason);

  // Transform standing items to formatted driver profiles
  const drivers = useMemo(() => {
    if (!driversStandings) return [];
    return driversStandings.map((item) => ({
      id: item.driver.id,
      name: item.driver.name,
      firstName: item.driver.firstName,
      lastName: item.driver.lastName,
      code: item.driver.code || item.driver.lastName.substring(0, 3).toUpperCase(),
      team: item.constructor?.name || "No Team",
      nationality: item.driver.nationality,
      permanentNumber: item.driver.permanentNumber || "N/A",
      points: item.points || 0,
      wins: item.wins || 0,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.driver.firstName + "_" + item.driver.lastName)}`,
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=200" // generic premium helmet image as card thumbnail
    }));
  }, [driversStandings]);

  // Filter drivers based on search term
  const filteredDrivers = useMemo(() => {
    if (!searchTerm.trim()) return drivers;
    const lowercaseSearch = searchTerm.toLowerCase();
    return drivers.filter(
      (driver) =>
        driver.name.toLowerCase().includes(lowercaseSearch) ||
        driver.nationality.toLowerCase().includes(lowercaseSearch) ||
        driver.team.toLowerCase().includes(lowercaseSearch) ||
        driver.code.toLowerCase().includes(lowercaseSearch)
    );
  }, [drivers, searchTerm]);

  // Generate season list from 2026 down to 2015
  const seasons = Array.from({ length: 12 }, (_, i) => 2026 - i);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading Drivers Directory...</h2>
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
                Drivers
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Formula 1 driver directory, statistics, and career details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <input
              type="text"
              placeholder="Search driver, team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 text-sm focus:border-red-600 focus:outline-none"
            />
            {/* Season Selector */}
            <select
              value={selectedSeason}
              onChange={(e) => {
                setSelectedSeason(parseInt(e.target.value));
                setSelectedDriver(null);
              }}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 text-sm focus:border-red-600 focus:outline-none"
            >
              {seasons.map((year) => (
                <option key={year} value={year}>{year} Season</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {error ? (
            <div className="text-center space-y-4">
              <p className="text-red-500">{error}</p>
              <button onClick={refetch} className="px-4 py-2 bg-red-600 text-white rounded text-sm">Try Again</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Drivers List */}
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                {filteredDrivers.map((driver) => (
                  <div
                    key={driver.id || driver.code}
                    onClick={() => setSelectedDriver(driver)}
                    className={`border rounded-lg p-6 transition-all cursor-pointer ${
                      selectedDriver?.id === driver.id 
                        ? "border-red-600 bg-red-50/10 dark:bg-red-950/10 shadow-sm" 
                        : "border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900/50 hover:border-red-600/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 font-light uppercase tracking-wider">{driver.team}</span>
                        <h3 className="text-xl font-light text-gray-900 dark:text-white">
                          {driver.name}
                        </h3>
                      </div>
                      <span className="text-2xl font-extralight text-red-600 dark:text-red-400">
                        {driver.code}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 font-light">
                      <span>{driver.nationality}</span>
                      {driver.permanentNumber !== "N/A" && <span>No. {driver.permanentNumber}</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Driver Details Card */}
              <div className="md:col-span-1">
                {selectedDriver ? (
                  <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg p-8 space-y-6 sticky top-8 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-extralight text-gray-900 dark:text-white">{selectedDriver.name}</h2>
                        <p className="text-sm text-red-600 dark:text-red-400 font-light">{selectedDriver.team}</p>
                      </div>
                      <span className="text-4xl font-extralight text-gray-300">{selectedDriver.code}</span>
                    </div>

                    <div className="w-12 h-px bg-red-600"></div>

                    <div className="space-y-4 text-sm font-light">
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Nationality</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal">{selectedDriver.nationality}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Championship Points</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal">{selectedDriver.points} pts</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Season Wins</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal">{selectedDriver.wins}</span>
                      </div>
                      {selectedDriver.permanentNumber !== "N/A" && (
                        <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                          <span className="text-gray-400">Permanent Number</span>
                          <span className="text-gray-900 dark:text-gray-300 font-normal">{selectedDriver.permanentNumber}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => window.open(selectedDriver.url, "_blank")}
                        className="w-full text-center px-4 py-2 border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-400 text-xs text-gray-600 dark:text-gray-400 rounded transition-all"
                      >
                        Biography (Wiki)
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center text-gray-400 font-light sticky top-8">
                    Select a driver from the directory list to display detailed telemetry and stats.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {dataSource && (
        <section className="py-12 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
          Drivers directory synced via {dataSource}
        </section>
      )}
    </div>
  );
};

export default Drivers;
