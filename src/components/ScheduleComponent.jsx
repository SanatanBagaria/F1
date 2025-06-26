import React, { useState, useEffect } from "react";

const ScheduleComponent = () => {
  const [weekends, setWeekends] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.openf1.org/v1/sessions?year=2025&limit=100');
        if (!response.ok) throw new Error('Failed to fetch sessions');
        const data = await response.json();

        // Group by meeting_key (race weekend)
        const grouped = {};
        data.forEach(session => {
          if (!session.meeting_key) return;
          if (!grouped[session.meeting_key]) grouped[session.meeting_key] = [];
          grouped[session.meeting_key].push(session);
        });

        // Convert to array, sort by weekend date (latest first)
        const weekendsArr = Object.values(grouped)
          .map(sessions => sessions.sort((a, b) => new Date(a.date_start) - new Date(b.date_start)))
          .sort((a, b) => new Date(b[0].date_start) - new Date(a[0].date_start));

        setWeekends(weekendsArr);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const toggleExpand = (meetingKey) => {
    setExpanded(prev => ({ ...prev, [meetingKey]: !prev[meetingKey] }));
  };

  const getSessionTypeIcon = (sessionType) => {
    switch (sessionType?.toLowerCase()) {
      case 'practice': return '🏃';
      case 'qualifying': return '⚡';
      case 'race': return '🏁';
      case 'sprint': return '💨';
      default: return '📅';
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
        <div className="text-center">
          <div className="w-1 h-16 bg-gray-300 dark:bg-gray-700 mx-auto animate-pulse"></div>
          <p className="text-gray-500 dark:text-gray-400 font-light mt-4">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-light text-gray-900 dark:text-white">2025 F1 Schedule</h3>
          <div className="w-12 h-px bg-red-600"></div>
        </div>
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-red-800 dark:text-red-200 font-light">{error}</p>
          </div>
        )}
        <div className="space-y-3">
          {weekends.map((sessions, idx) => {
            const mainSession = sessions.find(s => s.session_type === "Race") || sessions[0];
            const meetingKey = mainSession.meeting_key;
            return (
              <div key={meetingKey} className="border border-gray-100 dark:border-gray-800 rounded">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => toggleExpand(meetingKey)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{getSessionTypeIcon("race")}</span>
                    <div>
                      <div className="font-light text-gray-900 dark:text-white">
                        {mainSession.meeting_name || mainSession.session_name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {mainSession.location} • {mainSession.country_name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(mainSession.date_start).toLocaleDateString()}
                    </div>
                    <button className="ml-4 text-gray-500 dark:text-gray-400 focus:outline-none">
                      {expanded[meetingKey] ? "▲" : "▼"}
                    </button>
                  </div>
                </div>
                {expanded[meetingKey] && (
                  <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                    {sessions.map(session => (
                      <div key={session.session_key} className="flex items-center justify-between px-8 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getSessionTypeIcon(session.session_type)}</span>
                          <span className="font-light text-gray-900 dark:text-white">{session.session_name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{session.session_type}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.date_start).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleComponent;
