import React from "react"

const LiveTiming = ({ drivers = [], intervals = [], carData = [], isLive = false, currentSession = null }) => {
  // Combine driver data with intervals and car data
  const combinedData = drivers.map(driver => {
    const interval = intervals.find(i => i.driver_number === driver.driver_number)
    const car = carData.find(c => c.driver_number === driver.driver_number)
    
    return {
      ...driver,
      interval: interval?.interval || "N/A",
      gap: interval?.gap_to_leader || "N/A",
      speed: car?.speed || "N/A",
      gear: car?.gear || "N/A",
      throttle: car?.throttle || 0,
      brake: car?.brake || false
    }
  }).sort((a, b) => {
    return a.driver_number - b.driver_number
  })

  // Show session status when no live session or no data
  if (!isLive && (!drivers || drivers.length === 0)) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-light text-gray-900 dark:text-white flex items-center">
            <span className="mr-2">⏱️</span>
            Live Timing
            <div className="ml-2 w-2 h-2 bg-gray-400 rounded-full"></div>
          </h3>
        </div>
        
        <div className="p-12 text-center">
          <div className="space-y-6">
            <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto"></div>
            <div className="space-y-2">
              <h4 className="text-xl font-extralight text-gray-900 dark:text-white">No Live Session</h4>
              <p className="text-gray-500 dark:text-gray-400 font-light">
                Live timing data will appear during active F1 sessions
              </p>
              {currentSession && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-light">
                    Latest session: {currentSession.session_name || 'Unknown Session'}
                  </p>
                  {currentSession.date_start && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(currentSession.date_start).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
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
            {currentSession.session_name} • {isLive ? 'Live' : 'Historical Data'}
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
              combinedData.map((driver, index) => (
                <tr key={driver.driver_number} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-1 h-8 rounded-full mr-3"
                        style={{ backgroundColor: `#${driver.team_colour || '6B7280'}` }}
                      ></div>
                      <span className="text-sm font-light text-gray-900 dark:text-white">
                        {driver.driver_number}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-light text-gray-900 dark:text-white">
                        {driver.name_acronym || driver.full_name}
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
                        <span className="w-2 h-2 bg-red-500 rounded-full" title="Braking"></span>
                      )}
                      {driver.throttle > 50 && (
                        <span className="w-2 h-2 bg-green-500 rounded-full" title="Accelerating"></span>
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
                <td colSpan="7" className="px-4 py-12 text-center">
                  <div className="space-y-2">
                    <p className="text-gray-500 dark:text-gray-400 font-light">No timing data available</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {isLive ? 'Waiting for live data...' : 'No session currently active'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiveTiming
