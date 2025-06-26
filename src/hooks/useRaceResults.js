// hooks/useRaceResults.js
import { useState, useCallback } from 'react';

const useRaceResults = () => {
  const [raceResults, setRaceResults] = useState({});
  const [loadingResults, setLoadingResults] = useState({});
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchRaceResult = useCallback(async (season, round) => {
    const raceKey = `${season}-${round}`;
    
    // Set loading state for this specific race
    setLoadingResults(prev => ({ ...prev, [raceKey]: true }));
    setErrors(prev => ({ ...prev, [raceKey]: null }));
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/results/${season}/${round}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the results data
      const transformedResults = {
        season,
        round,
        raceName: data.raceName || `Round ${round}`,
        results: data.map((result) => ({
          position: result.position,
          driver: `${result.Driver.givenName} ${result.Driver.familyName}`,
          team: result.Constructor.name,
          time: result.Time?.time || result.status || 'N/A',
          points: result.points || '0'
        }))
      };
      
      setRaceResults(prev => ({
        ...prev,
        [raceKey]: transformedResults
      }));
      
    } catch (error) {
      console.error(`Error fetching race result for ${season}-${round}:`, error);
      setErrors(prev => ({
        ...prev,
        [raceKey]: error.message || 'Failed to load race results'
      }));
    } finally {
      setLoadingResults(prev => ({ ...prev, [raceKey]: false }));
    }
  }, [API_BASE_URL]);

  const clearRaceResult = useCallback((season, round) => {
    const raceKey = `${season}-${round}`;
    setRaceResults(prev => {
      const newResults = { ...prev };
      delete newResults[raceKey];
      return newResults;
    });
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[raceKey];
      return newErrors;
    });
  }, []);

  return {
    raceResults,
    loadingResults,
    errors,
    fetchRaceResult,
    clearRaceResult
  };
};

export { useRaceResults };
