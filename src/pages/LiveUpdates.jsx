"use client";

import { useState } from "react";
import { useLiveData } from "../hooks/useLiveData";
import LiveTiming from "../components/LiveTiming";
//import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject } from '@syncfusion/ej2-react-schedule';
import RaceWeekendSchedule from "../components/RaceWeekendSchedule";
import ScheduleWithData from "../components/ScheduleWithData"


const LiveUpdates = () => {
  const [activeTab, setActiveTab] = useState("timing");

  // Only use Socket.IO data for timing and commentary
  const {
    liveData,
    loading,
    error,
    isLive,
    connectionStatus,
    latency,
    refetch,
  } = useLiveData();

  // Mock commentary data (you can make this real-time via Socket.IO too)
  const raceCommentary = [
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      lap: 45,
      message: "Live data being fetched from OpenF1 API",
      type: "info",
      priority: "high",
    },
    {
      id: 2,
      time: new Date(Date.now() - 60000).toLocaleTimeString(),
      lap: 44,
      message: "Real-time telemetry and timing data available",
      type: "info",
      priority: "medium",
    },
  ];

  if (loading && (activeTab === "timing" || activeTab === "commentary")) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <div className="space-y-2">
            <h2 className="text-xl font-extralight text-gray-900 dark:text-white">
              Loading
            </h2>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Fetching live data
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && (activeTab === "timing" || activeTab === "commentary")) {
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
                Live
              </h1>
              <div className="w-1 h-12 bg-red-600"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg text-gray-500 dark:text-gray-400 font-light">
                {liveData.currentSession
                  ? liveData.currentSession.session_name
                  : "Latest session data"}
              </p>
              {/* Only show connection status for timing and commentary */}
              {(activeTab === "timing" || activeTab === "commentary") && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      connectionStatus === "connected" && isLive
                        ? "bg-green-600 animate-pulse"
                        : connectionStatus === "connected"
                        ? "bg-blue-600"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`font-light ${
                      connectionStatus === "connected"
                        ? isLive
                          ? "text-green-600 dark:text-green-400"
                          : "text-blue-600 dark:text-blue-400"
                        : connectionStatus === "error"
                        ? "text-red-600 dark:text-red-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {connectionStatus === "connected"
                      ? isLive
                        ? "Live"
                        : "Connected"
                      : connectionStatus === "error"
                      ? "Error"
                      : "Offline"}
                  </span>
                  {latency && connectionStatus === "connected" && (
                    <span className="text-gray-500 dark:text-gray-400">
                      ({latency}ms)
                    </span>
                  )}
                </div>
              )}
              {activeTab === "schedule" && (
                <div className="flex items-center justify-center space-x-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="font-light text-gray-500 dark:text-gray-400">
                    Static Data
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-px bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => setActiveTab("timing")}
              className={`group bg-white dark:bg-gray-950 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                activeTab === "timing" ? "bg-gray-50 dark:bg-gray-900" : ""
              }`}
            >
              <div className="space-y-2">
                <h3
                  className={`text-lg font-light transition-colors ${
                    activeTab === "timing"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                  }`}
                >
                  Timing
                </h3>
                <div
                  className={`w-6 h-px transition-colors ${
                    activeTab === "timing"
                      ? "bg-red-600 dark:bg-red-400"
                      : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                  }`}
                ></div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("commentary")}
              className={`group bg-white dark:bg-gray-950 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                activeTab === "commentary" ? "bg-gray-50 dark:bg-gray-900" : ""
              }`}
            >
              <div className="space-y-2">
                <h3
                  className={`text-lg font-light transition-colors ${
                    activeTab === "commentary"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                  }`}
                >
                  Commentary
                </h3>
                <div
                  className={`w-6 h-px transition-colors ${
                    activeTab === "commentary"
                      ? "bg-red-600 dark:bg-red-400"
                      : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                  }`}
                ></div>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("schedule")}
              className={`group bg-white dark:bg-gray-950 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300 ${
                activeTab === "schedule" ? "bg-gray-50 dark:bg-gray-900" : ""
              }`}
            >
              <div className="space-y-2">
                <h3
                  className={`text-lg font-light transition-colors ${
                    activeTab === "schedule"
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400"
                  }`}
                >
                  Schedule
                </h3>
                <div
                  className={`w-6 h-px transition-colors ${
                    activeTab === "schedule"
                      ? "bg-red-600 dark:bg-red-400"
                      : "bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400"
                  }`}
                ></div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Timing Tab - Uses Socket.IO live data */}
          {activeTab === "timing" && (
            <LiveTiming
              drivers={liveData.drivers}
              intervals={liveData.intervals}
              carData={liveData.carData}
              isLive={isLive}
              currentSession={liveData.currentSession}
            />
          )}
          {/* Commentary Tab - Uses Socket.IO live data */}
          {activeTab === "commentary" && (
            <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
              <div className="p-12">
                <div className="space-y-6 mb-8">
                  <h3 className="text-2xl font-extralight text-gray-900 dark:text-white">
                    Commentary
                  </h3>
                  <div className="w-12 h-px bg-red-600"></div>
                </div>

                <div className="space-y-px bg-gray-100 dark:bg-gray-800">
                  {raceCommentary.map((comment) => (
                    <div
                      key={comment.id}
                      className="bg-white dark:bg-gray-950 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-1 h-6 bg-red-600"></div>
                          <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 font-light">
                            <span>{comment.time}</span>
                            {comment.lap && (
                              <>
                                <div className="w-px h-3 bg-gray-300 dark:bg-gray-700"></div>
                                <span>Lap {comment.lap}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-900 dark:text-white font-light leading-relaxed pl-5">
                          {comment.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {/* Schedule Tab - Uses normal API calls, not Socket.IO */}
          {activeTab === "schedule" && <ScheduleWithData />}
        </div>
      </section>
    </div>
  );
};

export default LiveUpdates;
