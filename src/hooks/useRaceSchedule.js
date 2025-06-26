// hooks/useRaceSchedule.js
import { useState, useEffect } from 'react';

const useRaceSchedule = (season) => {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('Jolpica F1 API');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchRaceSchedule = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching race schedule for season: ${season}`);
      
      const response = await fetch(`${API_BASE_URL}/api/sessions/${season}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle both direct array and nested data structure
      const raceData = Array.isArray(data) ? data : (data.MRData?.RaceTable?.Races || []);
      
      if (raceData.length === 0) {
        console.log(`No races found for ${season}`);
        setRaces([]);
        return;
      }
      
      const transformedRaces = raceData.map((race) => ({
        id: `${race.season || season}-${race.round}`,
        season: race.season || season,
        round: race.round,
        name: race.raceName,
        circuit: race.Circuit?.circuitName || 'Unknown Circuit',
        locality: race.Circuit?.Location?.locality || '',
        country: race.Circuit?.Location?.country || '',
        date: race.date,
        time: race.time || 'TBD',
        status: new Date(race.date) < new Date() ? 'completed' : 'upcoming'
      }));
      
      console.log(`Found ${transformedRaces.length} races for ${season}`);
      setRaces(transformedRaces);
      
    } catch (error) {
      console.error(`Error fetching race schedule for ${season}:`, error);
      setError(error.message || `Failed to load race schedule for ${season}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (season) {
      fetchRaceSchedule();
    }
  }, [season]);

  return {
    races,
    loading,
    error,
    dataSource,
    refetch: fetchRaceSchedule
  };
};

export { useRaceSchedule };
