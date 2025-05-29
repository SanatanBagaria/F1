"use client"

import { useState } from "react"

const DriverComparison = () => {
  const [driver1, setDriver1] = useState("Max Verstappen")
  const [driver2, setDriver2] = useState("Lando Norris")

  const drivers = [
    "Max Verstappen",
    "Lando Norris",
    "Charles Leclerc",
    "Oscar Piastri",
    "Carlos Sainz",
    "George Russell",
    "Lewis Hamilton",
    "Sergio Perez",
  ]

  const driverStats = {
    "Max Verstappen": {
      points: 393,
      wins: 7,
      podiums: 12,
      poles: 5,
      fastestLaps: 4,
      avgQualifying: 2.1,
      avgFinish: 1.8,
      dnfRate: 5,
      pointsPerRace: 19.7,
      team: "Red Bull Racing",
      teamColor: "bg-blue-600",
    },
    "Lando Norris": {
      points: 331,
      wins: 3,
      podiums: 8,
      poles: 2,
      fastestLaps: 2,
      avgQualifying: 4.2,
      avgFinish: 3.1,
      dnfRate: 0,
      pointsPerRace: 16.6,
      team: "McLaren",
      teamColor: "bg-orange-500",
    },
    "Charles Leclerc": {
      points: 307,
      wins: 2,
      podiums: 7,
      poles: 3,
      fastestLaps: 3,
      avgQualifying: 3.8,
      avgFinish: 3.5,
      dnfRate: 10,
      pointsPerRace: 15.4,
      team: "Ferrari",
      teamColor: "bg-red-600",
    },
  }

  const getDriver1Stats = () => driverStats[driver1] || driverStats["Max Verstappen"]
  const getDriver2Stats = () => driverStats[driver2] || driverStats["Lando Norris"]

  const ComparisonBar = ({ label, value1, value2, unit = "", isLowerBetter = false }) => {
    const max = Math.max(value1, value2)
    const better1 = isLowerBetter ? value1 < value2 : value1 > value2
    const better2 = isLowerBetter ? value2 < value1 : value2 > value1

    return (
      <div className="mb-4">
        <div className="flex justify-between text-sm font-medium text-gray-900 dark:text-white mb-2">
          <span>{label}</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex-1 text-right">
            <div className={`text-lg font-bold ${better1 ? "text-green-600" : "text-gray-600"}`}>
              {value1}
              {unit}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full ${getDriver1Stats().teamColor}`}
                style={{ width: `${(value1 / max) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="w-8 text-center text-gray-400">vs</div>
          <div className="flex-1">
            <div className={`text-lg font-bold ${better2 ? "text-green-600" : "text-gray-600"}`}>
              {value2}
              {unit}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className={`h-2 rounded-full ${getDriver2Stats().teamColor}`}
                style={{ width: `${(value2 / max) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Driver Comparison</h3>

      {/* Driver Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver 1</label>
          <select
            value={driver1}
            onChange={(e) => setDriver1(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {drivers.map((driver) => (
              <option key={driver} value={driver}>
                {driver}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Driver 2</label>
          <select
            value={driver2}
            onChange={(e) => setDriver2(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {drivers.map((driver) => (
              <option key={driver} value={driver}>
                {driver}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Driver Headers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{driver1}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{getDriver1Stats().team}</p>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{driver2}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{getDriver2Stats().team}</p>
        </div>
      </div>

      {/* Comparisons */}
      <div className="space-y-6">
        <ComparisonBar
          label="Championship Points"
          value1={getDriver1Stats().points}
          value2={getDriver2Stats().points}
        />
        <ComparisonBar label="Race Wins" value1={getDriver1Stats().wins} value2={getDriver2Stats().wins} />
        <ComparisonBar label="Podium Finishes" value1={getDriver1Stats().podiums} value2={getDriver2Stats().podiums} />
        <ComparisonBar label="Pole Positions" value1={getDriver1Stats().poles} value2={getDriver2Stats().poles} />
        <ComparisonBar
          label="Points Per Race"
          value1={getDriver1Stats().pointsPerRace}
          value2={getDriver2Stats().pointsPerRace}
        />
        <ComparisonBar
          label="Average Qualifying Position"
          value1={getDriver1Stats().avgQualifying}
          value2={getDriver2Stats().avgQualifying}
          isLowerBetter={true}
        />
        <ComparisonBar
          label="DNF Rate"
          value1={getDriver1Stats().dnfRate}
          value2={getDriver2Stats().dnfRate}
          unit="%"
          isLowerBetter={true}
        />
      </div>
    </div>
  )
}

export default DriverComparison
