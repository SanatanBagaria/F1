import React from "react";

const LiveTiming = ({
  drivers = [],
  intervals = [],
  carData = [],
  isLive = false,
  currentSession = null,
}) => {
  // Combine driver data with intervals and car data
  const combinedData = drivers
    .map((driver) => {
      const interval = intervals.find(
        (i) => i.driver_number === driver.driver_number
      );
      const car = carData.find((c) => c.driver_number === driver.driver_number);

      return {
        ...driver,
        interval: driver.interval || "N/A",
        gap: driver.gap || "N/A",
        speed: car?.speed || "N/A",
        gear: car?.gear || "N/A",
        throttle: car?.throttle || 0,
        brake: car?.brake || false,
        // Use lap_time_formatted or fallback to N/A
        lap_time_formatted: driver.lap_time_formatted || "N/A",
        // Use driver_name or fallback to full_name or driver_number
        display_name:
          driver.driver_name ||
          driver.name_acronym ||
          driver.full_name ||
          driver.driver_number,
      };
    })
    // Sort by position if available, else by driver number
    .sort(
      (a, b) =>
        (a.position || a.driver_number) - (b.position || b.driver_number)
    );

  // Show session status card when no live session is active
  if (!isLive) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl p-8 max-w-2xl mx-auto shadow-sm">
        <div className="text-center space-y-8 py-12">
          {/* Pulsing idle dot */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-900 rounded-full text-xs text-gray-500 font-light">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span>No Active Session</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl font-extralight text-gray-900 dark:text-white leading-tight">
              Live Timing Offline
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light max-w-md mx-auto">
              Live telemetry, driver speeds, and sector intervals will activate automatically as soon as the cars hit the track.
            </p>
          </div>

          {currentSession && (
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-850 max-w-md mx-auto space-y-4 text-center">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-red-600 dark:text-red-400 font-semibold">UPCOMING EVENT</span>
                <h4 className="text-lg font-light text-gray-950 dark:text-white">
                  {currentSession.session_name || "Next Session"}
                </h4>
              </div>
              
              <div className="w-full h-px bg-gray-200 dark:bg-gray-850"></div>

              <div className="grid grid-cols-2 gap-4 text-xs font-light text-gray-500 dark:text-gray-400">
                <div className="text-left">
                  <span className="block text-[10px] uppercase text-gray-400">Location</span>
                  <span className="font-normal text-gray-850 dark:text-gray-200">
                    {currentSession.location || "TBD"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase text-gray-400">Date & Time</span>
                  <span className="font-normal text-gray-850 dark:text-gray-200">
                    {currentSession.date_start 
                      ? new Date(currentSession.date_start).toLocaleString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : "TBD"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-light text-gray-900 dark:text-white flex items-center">
          <span className="mr-2">🏁</span>
          Live Timing
          {isLive ? (
            <div className="ml-2 w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
          ) : (
            <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
          )}
        </h3>
        {currentSession && (
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light mt-1">
            {currentSession.session_name} •{" "}
            {isLive ? "Live" : "Historical Data"}
          </p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-100 dark:border-gray-800">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Driver
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Team
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Best Lap
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Interval
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Gap
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Speed
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-100 dark:divide-gray-800">
            {combinedData.length > 0 ? (
              combinedData.map((driver) => (
                <tr
                  key={driver.driver_number}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className="w-1 h-8 rounded-full mr-3"
                        style={{
                          backgroundColor: `#${driver.team_colour || "6B7280"}`,
                        }}
                      ></div>
                      <span className="text-sm font-light text-gray-900 dark:text-white">
                        {driver.position || driver.driver_number}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-light text-gray-900 dark:text-white">
                        {driver.display_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 font-light">
                        {driver.full_name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-light text-gray-900 dark:text-white">
                    {driver.team_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono font-light text-gray-900 dark:text-white">
                    {driver.lap_time_formatted}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono font-light text-gray-900 dark:text-white">
                    {driver.interval}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono font-light text-gray-900 dark:text-white">
                    {driver.gap}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-mono font-light text-gray-900 dark:text-white">
                    {driver.speed !== "N/A" ? `${driver.speed} km/h` : "N/A"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {driver.brake && (
                        <span
                          className="w-2 h-2 bg-red-500 rounded-full"
                          title="Braking"
                        ></span>
                      )}
                      {driver.throttle > 50 && (
                        <span
                          className="w-2 h-2 bg-green-500 rounded-full"
                          title="Accelerating"
                        ></span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                        G{driver.gear}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-4 py-12 text-center">
                  <div className="space-y-2">
                    <p className="text-gray-500 dark:text-gray-400 font-light">
                      No timing data available
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {isLive
                        ? "Waiting for live data..."
                        : "No session currently active"}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LiveTiming;
