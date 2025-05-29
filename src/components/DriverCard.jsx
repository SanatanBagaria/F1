import React from 'react';

const DriverCard = ({ driver }) => (
  <div className="group bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-red-600 dark:hover:border-red-400 transition-all duration-300 cursor-pointer">
    <div className="space-y-6">
      {/* Driver Header */}
      <div className="flex items-center space-x-3">
        <div 
          className="w-1 h-8"
          style={{ backgroundColor: driver.teamColour || driver.color || '#EF4444' }}
        ></div>
        <div className="space-y-1">
          <h2 className="text-xl font-light text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
            {driver.name}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-light">
            {driver.nationality || 'Unknown Nationality'}
          </p>
        </div>
      </div>

      {/* Team Information */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider font-light">
            Team
          </div>
          <div className="text-lg font-light text-gray-900 dark:text-white">
            {driver.team}
          </div>
        </div>

        {/* Driver Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-light text-gray-900 dark:text-white">
              {driver.points || "0"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Points
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-light text-gray-900 dark:text-white">
              {driver.position || "-"}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Position
            </div>
          </div>
        </div>
      </div>

      {/* Minimal accent line */}
      <div className="w-6 h-px bg-gray-200 dark:bg-gray-800 group-hover:bg-red-600 dark:group-hover:bg-red-400 transition-colors"></div>
    </div>
  </div>
);

export default DriverCard;
