"use client";

import { useChampionshipWinners } from "../hooks/useChampionshipWinners";

const SeasonWinners = () => {
  const { champions, loading, error, refetch, dataSource } =
    useChampionshipWinners(2020, 2024);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading</h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">Fetching champions</p>
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
                Champions
              </h1>
              <div className="w-1 h-12 bg-red-600"></div>
            </div>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
              2020-2024 World Champions
            </p>
          </div>
        </div>
      </section>

      {/* Champions List */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-px bg-gray-100 dark:bg-gray-800">
            {champions.map((champion) => (
              <div
                key={champion.year}
                className="group bg-white dark:bg-gray-950 p-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
              >
                <div className="space-y-8">
                  {/* Year Header */}
                  <div className="flex items-center space-x-4">
                    <div className="w-1 h-12 bg-red-600"></div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-extralight text-gray-900 dark:text-white">
                        {champion.year}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
                        World Championship
                      </p>
                    </div>
                  </div>

                  {/* Champions Info */}
                  <div className="grid lg:grid-cols-2 gap-12">
                    {/* Driver Champion */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-light text-gray-900 dark:text-white">
                          Drivers' Champion
                        </h3>
                        <div className="w-12 h-px bg-red-600"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-1 h-8"
                            style={{
                              backgroundColor: champion.teamColor || champion.teamColour || "#EF4444",
                            }}
                          ></div>
                          <div className="space-y-1">
                            <h4 className="text-xl font-light text-gray-900 dark:text-white">
                              {champion.driver}
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 font-light">
                              {champion.team || champion.teamName}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div className="space-y-1">
                            <div className="text-2xl font-light text-gray-900 dark:text-white">
                              {champion.points || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Points
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-light text-gray-900 dark:text-white">
                              {champion.wins || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Wins
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Constructor Champion */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-light text-gray-900 dark:text-white">
                          Constructors' Champion
                        </h3>
                        <div className="w-12 h-px bg-gray-300 dark:bg-gray-700"></div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-1 h-8"
                            style={{
                              backgroundColor: champion.teamColor || champion.teamColour || "#9CA3AF",
                            }}
                          ></div>
                          <div className="space-y-1">
                            <h4 className="text-xl font-light text-gray-900 dark:text-white">
                              {champion.constructorChampion || champion.team || 'Unknown'}
                            </h4>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pl-4">
                          <div className="space-y-1">
                            <div className="text-2xl font-light text-gray-500 dark:text-gray-400">
                              {champion.constructorPoints || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Points
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-light text-gray-500 dark:text-gray-400">
                              {champion.constructorWins || 0}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Wins
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-colors"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Empty State */}
      {champions.length === 0 && !loading && (
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center space-y-6">
              <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
              <div className="space-y-2">
                <h3 className="text-xl font-extralight text-gray-900 dark:text-white">
                  No Championship Data
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-light">
                  Championship data is currently unavailable
                </p>
              </div>
            </div>
          </div>
        </section>
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

export default SeasonWinners;
