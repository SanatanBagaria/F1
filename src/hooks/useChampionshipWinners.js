import { useState, useEffect } from 'react';

const useChampionshipWinners = (startYear = 2020, endYear = 2024) => {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('Jolpica F1 API');

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchChampionshipData = async (year) => {
    try {
      const [driverResponse, constructorResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/standings/drivers/${year}`),
        fetch(`${API_BASE_URL}/api/standings/teams/${year}`)
      ]);

      if (!driverResponse.ok || !constructorResponse.ok) {
        throw new Error(`HTTP ${driverResponse.status || constructorResponse.status}`);
      }

      const driverStandings = await driverResponse.json();
      const constructorStandings = await constructorResponse.json();

      if (!driverStandings || driverStandings.length === 0) {
        return null;
      }

      const driverChampion = driverStandings[0];
      const constructorChampion = constructorStandings?.[0];

      // Fix: Return flat structure instead of nested objects
      return {
        year: parseInt(year),
        driver: `${driverChampion.Driver.givenName} ${driverChampion.Driver.familyName}`,
        team: driverChampion.Constructors[0].name, // Return string, not object
        points: parseInt(driverChampion.points),
        wins: parseInt(driverChampion.wins),
        constructorChampion: constructorChampion?.Constructor?.name || 'Unknown',
        constructorPoints: parseInt(constructorChampion?.points || 0),
        constructorWins: parseInt(constructorChampion?.wins || 0),
        teamName: driverChampion.Constructors[0].name,
        teamColour: getTeamColor(driverChampion.Constructors[0].constructorId),
        teamColor: getTeamColor(driverChampion.Constructors[0].constructorId)
      };
    } catch (error) {
      console.error(`Failed to fetch championship data for ${year}:`, error.message);
      throw error;
    }
  };

  const getTeamColor = (constructorId) => {
    const teamColors = {
      'red_bull': '#0600EF',
      'mercedes': '#00D2BE',
      'ferrari': '#DC143C',
      'mclaren': '#FF8700',
      'alpine': '#0090FF',
      'alphatauri': '#2B4562',
      'aston_martin': '#006F62',
      'williams': '#005AFF',
      'alfa': '#900000',
      'haas': '#FFFFFF'
    };
    return teamColors[constructorId] || '#EF4444';
  };

  const fetchAllChampions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const years = [];
      for (let year = startYear; year <= endYear; year++) {
        years.push(year);
      }

      console.log(`Fetching championship data for years: ${years.join(', ')}`);

      const championsData = [];
      
      for (const year of years) {
        try {
          console.log(`Fetching championship data for ${year}`);
          const championData = await fetchChampionshipData(year);
          
          if (championData) {
            championsData.push(championData);
          }
          
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 300));
          
        } catch (error) {
          console.warn(`Failed to fetch champion data for ${year}:`, error.message);
        }
      }

      // Sort by year (most recent first)
      championsData.sort((a, b) => b.year - a.year);
      
      setChampions(championsData);
      console.log(`Successfully fetched ${championsData.length} championship records`);
      
    } catch (error) {
      console.error('Error fetching championship data:', error);
      setError(error.message || 'Failed to load championship data');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchAllChampions();
  };

  useEffect(() => {
    fetchAllChampions();
  }, [startYear, endYear]);

  return {
    champions,
    loading,
    error,
    refetch,
    dataSource
  };
};

export { useChampionshipWinners };
