import React, { useState, useEffect, useRef, useMemo } from "react";

const ScheduleWithData = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  
  // Ref for the next/current session to auto-scroll to
  const nextSessionRef = useRef(null);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch sessions for 2026 using OpenF1 API
        const response = await fetch('https://api.openf1.org/v1/sessions?year=2026');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sort sessions chronologically (oldest first)
        const sortedSessions = data.sort((a, b) => 
          new Date(a.date_start) - new Date(b.date_start)
        );
        
        setSessions(sortedSessions);
      } catch (err) {
        console.error('Error fetching session data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, []);

  // Filtered sessions
  const filteredSessions = useMemo(() => {
    return sessions.filter(session => {
      if (filterType === "all") return true;
      if (!session.session_type && !session.session_name) return false;
      
      const type = (session.session_type || "").toLowerCase();
      const name = (session.session_name || "").toLowerCase();
      
      if (filterType === "sprint") {
        return type.includes("sprint") || name.includes("sprint");
      }
      
      return type === filterType.toLowerCase() || name.includes(filterType.toLowerCase());
    });
  }, [sessions, filterType]);

  // Find the index of the next upcoming or currently live session
  const nextSessionIndex = useMemo(() => {
    const now = new Date();
    // Find first session that hasn't completed yet (live or upcoming)
    const idx = filteredSessions.findIndex(session => {
      const end = new Date(session.date_end || session.date_start);
      return end >= now;
    });
    return idx >= 0 ? idx : filteredSessions.length - 1;
  }, [filteredSessions]);

  // Auto-scroll to the next session on load (affects only the container, not the page)
  useEffect(() => {
    if (!loading && filteredSessions.length > 0 && nextSessionRef.current && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        const element = nextSessionRef.current;
        container.scrollTo({
          top: element.offsetTop - 20,
          behavior: "smooth"
        });
      }, 500); // Small delay to allow layout to settle
    }
  }, [loading, filteredSessions, filterType]);

  const getSessionTypeIcon = (sessionType) => {
    if (!sessionType) return '📅';
    switch (sessionType.toLowerCase()) {
      case 'practice':
        return '🏃';
      case 'qualifying':
        return '⚡';
      case 'race':
        return '🏁';
      case 'sprint':
        return '💨';
      default:
        return '📅';
    }
  };

  const getSessionStatus = (session) => {
    if (!session || !session.date_start || !session.date_end) {
      return { 
        status: 'unknown', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' 
      };
    }

    try {
      const now = new Date();
      const start = new Date(session.date_start);
      const end = new Date(session.date_end);

      if (now < start) return { status: 'upcoming', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
      if (now >= start && now <= end) return { status: 'live', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 animate-pulse' };
      return { status: 'completed', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    } catch (error) {
      return { 
        status: 'error', 
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' 
      };
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
    } catch (error) {
      return { date: 'TBD', time: 'TBD' };
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12">
        <h3 className="text-xl font-light text-gray-900 dark:text-white mb-6">2026 F1 Session Timeline</h3>
        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center justify-between p-6 border border-gray-100 dark:border-gray-850">
              <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-800 rounded"></div>
              <div className="w-16 h-6 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-12 text-center">
        <p className="text-red-600 dark:text-red-400">Error loading sessions: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 p-8 md:p-12 rounded-xl space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="space-y-1">
          <h3 className="text-2xl font-light text-gray-900 dark:text-white">2026 F1 Session Timeline</h3>
          <p className="text-xs text-gray-500">Auto-anchored to the next upcoming session. Scroll up for past sessions, down for upcoming.</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {["all", "race", "qualifying", "practice", "sprint"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-light tracking-wide transition-all uppercase ${
                filterType === type 
                  ? "bg-red-600 text-white" 
                  : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline View inside a Scrollable Container */}
      <div 
        ref={scrollContainerRef}
        className="max-h-[600px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent relative pl-16 space-y-8 py-4"
      >
        {/* Vertical line centered at 40px left offset inside container */}
        <div className="absolute left-[40px] top-0 bottom-0 border-l border-gray-200 dark:border-gray-800 pointer-events-none"></div>

        {filteredSessions.map((session, index) => {
          const sessionStatus = getSessionStatus(session);
          const { date, time } = formatDateTime(session.date_start);
          const isNext = index === nextSessionIndex;
          
          return (
            <div 
              key={session.session_key || index} 
              ref={isNext ? nextSessionRef : null}
              className="relative group"
            >
              {/* Timeline node - aligned perfectly with vertical line */}
              <div className={`absolute -left-10 top-4 w-8 h-8 rounded-full border bg-white dark:bg-gray-950 flex items-center justify-center text-sm shadow-sm transition-colors ${
                isNext 
                  ? "border-red-600 scale-110 ring-4 ring-red-600/10" 
                  : "border-gray-200 dark:border-gray-800 group-hover:border-red-500"
              }`}>
                {getSessionTypeIcon(session.session_type)}
              </div>

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-lg transition-all duration-300 border ${
                isNext 
                  ? "border-red-500 bg-red-500/5 shadow-md" 
                  : "border-gray-100 dark:border-gray-900/10 bg-white dark:bg-gray-900/40 hover:shadow-sm"
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h4 className={`text-lg font-light ${isNext ? "text-red-600 dark:text-red-400 font-normal" : "text-gray-900 dark:text-white"}`}>
                      {session.session_name || 'Unknown Session'}
                    </h4>
                    {isNext && (
                      <span className="bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                        NEXT
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${sessionStatus.color}`}>
                      {sessionStatus.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-light">
                    <span className="font-normal text-gray-700 dark:text-gray-300">
                      {session.location || 'Unknown Location'} ({session.country_code || 'F1'})
                    </span>
                    {session.circuit_short_name && (
                      <>
                        <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                        <span>{session.circuit_short_name} Circuit</span>
                      </>
                    )}
                    <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></div>
                    <span>Key: {session.session_key}</span>
                  </div>
                </div>

                <div className="text-left sm:text-right text-xs text-gray-500 dark:text-gray-400 font-light">
                  <div className="font-normal text-gray-700 dark:text-gray-300">{date}</div>
                  <div>{time}</div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSessions.length === 0 && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400 font-light">
            No sessions matching this type found in the 2026 calendar.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleWithData;
