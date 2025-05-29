import React, { useState } from "react";
import { useRaceSchedule } from "../hooks/useRaceSchedule";

const RaceSchedule = () => {
  const [selectedSeason, setSelectedSeason] = useState(
    new Date().getFullYear()
  );
  const { races, loading, error, refetch, dataSource } =
    useRaceSchedule(selectedSeason);

  // Generate season options (last 5 years + current + next)
  const currentYear = new Date().getFullYear();
  const seasons = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  const formatDateTime = (date, time) => {
    try {
      const raceDateTime = new Date(`${date}T${time}`);
      return {
        date: raceDateTime.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        time: raceDateTime.toLocaleTimeString("en-US", {
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
  const getRaceStatus = (date, time) => {
    const now = new Date();

    // Handle time format - default to 14:00:00 if not provided
    const raceTime = time && time !== "TBD" ? time : "14:00:00";
    const raceDateTime = new Date(`${date}T${raceTime}`);

    // Add 2 hours for race duration
    const raceEnd = new Date(raceDateTime.getTime() + 2 * 60 * 60 * 1000);

    if (now > raceEnd) {
      return "completed";
    } else if (raceDateTime <= now && now <= raceEnd) {
      return "live";
    } else {
      return "upcoming";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "live":
        return "text-red-600 dark:text-red-400 animate-pulse";
      case "upcoming":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

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
              Fetching schedule
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
                Schedule
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
        </div>
      </section>

      {/* Race List */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-px bg-gray-100 dark:bg-gray-800">
            {races.map((race) => {
              const { date: formattedDate, time: formattedTime } =
                formatDateTime(race.date, race.time);
              const status = getRaceStatus(race.date, race.time);

              return (
                <div
                  key={race.id}
                  className="group bg-white dark:bg-gray-950 p-12 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-1 h-8 bg-red-600"></div>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-xl font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                              Round {race.round}: {race.name}
                            </h3>
                            <span
                              className={`text-sm font-light uppercase tracking-wider ${getStatusColor(
                                status
                              )}`}
                            >
                              {status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 font-light">
                            <span>{race.circuit}</span>
                            <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                            <span>
                              {race.locality}, {race.country}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pl-5 space-y-1 text-sm text-gray-500 dark:text-gray-400 font-light">
                        <div>{formattedDate}</div>
                        <div>{formattedTime}</div>
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      <div className="flex items-center space-x-6">
                        <button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light">
                          Add to Calendar
                        </button>
                        <div className="w-px h-4 bg-gray-200 dark:bg-gray-800"></div>
                        <button
                          onClick={() => window.open(race.url, "_blank")}
                          className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light"
                        >
                          Circuit Info
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-colors mt-6"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Minimal Footer CTA */}
      <section className="py-24 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-2xl font-extralight text-gray-900 dark:text-white">
            Never Miss a Race
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
            Stay updated with the complete Formula 1 calendar and get
            notifications for all sessions.
          </p>
          <div className="flex justify-center space-x-8">
            <button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light">
              Add Calendar
            </button>
            <button className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors font-light">
              Set Reminders
            </button>
          </div>
          <div className="w-12 h-px bg-red-600 mx-auto"></div>
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
  );
};

export default RaceSchedule;
