"use client";

import { useState, useMemo } from "react";
import { useDrivers } from "../hooks/useDrivers";

const Drivers = () => {
  const [selectedSeason, setSelectedSeason] = useState(
    new Date().getFullYear()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDriver, setSelectedDriver] = useState(null);

  const { drivers, loading, error, refetch, dataSource } =
    useDrivers(selectedSeason);

  // Filter drivers based on search term (computed, not state)
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

  const seasons = [2025, 2024, 2023, 2022, 2021, 2020];

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">
              Loading
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Fetching drivers
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto"></div>
          <div className="space-y-4">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">
              Error
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              {error}
            </p>
            <button
              onClick={refetch}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
            >
              Try Again
            </button>
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
                Drivers
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
        <div className="max-w-6xl mx-auto px-4">
          {/* Season Selector */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-gray-100 dark:bg-gray-800 mb-8">
            {seasons.map((season) => (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`group bg-white dark:bg-gray-950 p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                  selectedSeason === season ? "bg-gray-50 dark:bg-gray-900" : ""
                }`}
              >
                <div className="space-y-2">
                  <div
                    className={`text-lg font-light transition-colors ${
                      selectedSeason === season
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                    }`}
                  >
                    {season}
                  </div>
                  <div
                    className={`w-6 h-px mx-auto transition-colors ${
                      selectedSeason === season
                        ? "bg-red-600 dark:bg-red-400"
                        : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                    }`}
                  ></div>
                </div>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search drivers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-light focus:border-red-600 dark:focus:border-red-400 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Drivers Grid */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDrivers.map((driver) => (
              <div
                key={driver.id}
                className="group bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-red-600 dark:hover:border-red-400 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="space-y-4">
                  {/* Driver Image */}
                  <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <img
                      src={
                        driver.headshotUrl ||
                        driver.image ||
                        "/placeholder.svg?height=200&width=200"
                      }
                      alt={driver.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(
                          driver.name
                        )}`;
                      }}
                    />
                  </div>

                  {/* Driver Info */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-6 bg-red-600"></div>
                      <h3 className="text-lg font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {driver.name}
                      </h3>
                    </div>

                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 font-light">
                      <div>#{driver.permanentNumber}</div>
                      <div>{driver.team}</div>
                      {driver.nationality && <div>{driver.nationality}</div>}
                    </div>
                  </div>

                  <div className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-colors"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredDrivers.length === 0 && !loading && (
            <div className="text-center py-24">
              <div className="space-y-6">
                <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extralight text-gray-900 dark:text-white">
                    No drivers found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 font-light">
                    Try adjusting your search
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Driver Detail Modal */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-950 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-12">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="space-y-2">
                  <h2 className="text-2xl font-extralight text-gray-900 dark:text-white">
                    {selectedDriver.name}
                  </h2>
                  <div className="w-12 h-px bg-red-600"></div>
                </div>
                <button
                  onClick={() => setSelectedDriver(null)}
                  className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                >
                  Close
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid md:grid-cols-2 gap-12">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img
                    src={
                      selectedDriver.headshotUrl ||
                      selectedDriver.image ||
                      "/placeholder.svg?height=300&width=300"
                    }
                    alt={selectedDriver.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `/placeholder.svg?height=300&width=300&text=${encodeURIComponent(
                        selectedDriver.name
                      )}`;
                    }}
                  />
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-light text-gray-900 dark:text-white">
                      Information
                    </h3>
                    <div className="space-y-3 text-sm font-light">
                      {selectedDriver.nationality && (
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            Nationality
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {selectedDriver.nationality}
                          </span>
                        </div>
                      )}
                      {selectedDriver.dateOfBirth && (
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                          <span className="text-gray-500 dark:text-gray-400">
                            Born
                          </span>
                          <span className="text-gray-900 dark:text-white">
                            {new Date(
                              selectedDriver.dateOfBirth
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Number
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          #{selectedDriver.permanentNumber}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="text-gray-500 dark:text-gray-400">
                          Code
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedDriver.code}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">
                          Team
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedDriver.team}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedDriver.url && (
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <a
                        href={selectedDriver.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                      >
                        Wikipedia →
                      </a>
                    </div>
                  )}
                </div>
              </div>
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
  );
};

export default Drivers;
