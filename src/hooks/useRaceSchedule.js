import { useState, useEffect } from 'react';

const FALLBACK_2026_RACES = [
  { round: "1", raceName: "Australian Grand Prix", Circuit: { circuitId: "albert_park", circuitName: "Albert Park Grand Prix Circuit", Location: { lat: "-37.8497", long: "144.968", locality: "Melbourne", country: "Australia" } }, date: "2026-03-08", time: "04:00:00Z" },
  { round: "2", raceName: "Chinese Grand Prix", Circuit: { circuitId: "shanghai", circuitName: "Shanghai International Circuit", Location: { lat: "31.3389", long: "121.22", locality: "Shanghai", country: "China" } }, date: "2026-03-15", time: "07:00:00Z" },
  { round: "3", raceName: "Japanese Grand Prix", Circuit: { circuitId: "suzuka", circuitName: "Suzuka Circuit", Location: { lat: "34.8431", long: "136.541", locality: "Suzuka", country: "Japan" } }, date: "2026-03-29", time: "05:00:00Z" },
  { round: "4", raceName: "Miami Grand Prix", Circuit: { circuitId: "miami", circuitName: "Miami International Autodrome", Location: { lat: "25.9581", long: "-80.2389", locality: "Miami", country: "USA" } }, date: "2026-05-03", time: "20:00:00Z" },
  { round: "5", raceName: "Canadian Grand Prix", Circuit: { circuitId: "villeneuve", circuitName: "Circuit Gilles Villeneuve", Location: { lat: "45.5", long: "-73.5228", locality: "Montreal", country: "Canada" } }, date: "2026-05-24", time: "20:00:00Z" },
  { round: "6", raceName: "Monaco Grand Prix", Circuit: { circuitId: "monaco", circuitName: "Circuit de Monaco", Location: { lat: "43.7347", long: "7.42056", locality: "Monte Carlo", country: "Monaco" } }, date: "2026-06-07", time: "13:00:00Z" },
  { round: "7", raceName: "Spanish Grand Prix", Circuit: { circuitId: "catalunya", circuitName: "Circuit de Barcelona-Catalunya", Location: { lat: "41.57", long: "2.26111", locality: "Barcelona", country: "Spain" } }, date: "2026-06-14", time: "13:00:00Z" },
  { round: "8", raceName: "Austrian Grand Prix", Circuit: { circuitId: "red_bull_ring", circuitName: "Red Bull Ring", Location: { lat: "47.2197", long: "14.7647", locality: "Spielberg", country: "Austria" } }, date: "2026-06-28", time: "13:00:00Z" },
  { round: "9", raceName: "British Grand Prix", Circuit: { circuitId: "silverstone", circuitName: "Silverstone Circuit", Location: { lat: "52.0786", long: "-1.01694", locality: "Silverstone", country: "UK" } }, date: "2026-07-05", time: "14:00:00Z" },
  { round: "10", raceName: "Belgian Grand Prix", Circuit: { circuitId: "spa", circuitName: "Circuit de Spa-Francorchamps", Location: { lat: "50.4372", long: "5.97139", locality: "Spa", country: "Belgium" } }, date: "2026-07-19", time: "13:00:00Z" },
  { round: "11", raceName: "Hungarian Grand Prix", Circuit: { circuitId: "hungaroring", circuitName: "Hungaroring", Location: { lat: "47.5789", long: "19.2486", locality: "Budapest", country: "Hungary" } }, date: "2026-07-26", time: "13:00:00Z" },
  { round: "12", raceName: "Dutch Grand Prix", Circuit: { circuitId: "zandvoort", circuitName: "Circuit Park Zandvoort", Location: { lat: "52.3888", long: "4.54092", locality: "Zandvoort", country: "Netherlands" } }, date: "2026-08-23", time: "13:00:00Z" },
  { round: "13", raceName: "Italian Grand Prix", Circuit: { circuitId: "monza", circuitName: "Autodromo Nazionale di Monza", Location: { lat: "45.6156", long: "9.28111", locality: "Monza", country: "Italy" } }, date: "2026-09-06", time: "13:00:00Z" },
  { round: "14", raceName: "Spanish Grand Prix (Madrid)", Circuit: { circuitId: "madrid", circuitName: "Madrid Circuit", Location: { lat: "40.46528", long: "-3.61528", locality: "Madrid", country: "Spain" } }, date: "2026-09-13", time: "13:00:00Z" },
  { round: "15", raceName: "Azerbaijan Grand Prix", Circuit: { circuitId: "baku", circuitName: "Baku City Circuit", Location: { lat: "40.3725", long: "49.8533", locality: "Baku", country: "Azerbaijan" } }, date: "2026-09-26", time: "11:00:00Z" },
  { round: "16", raceName: "Singapore Grand Prix", Circuit: { circuitId: "marina_bay", circuitName: "Marina Bay Street Circuit", Location: { lat: "1.2914", long: "103.864", locality: "Marina Bay", country: "Singapore" } }, date: "2026-10-11", time: "12:00:00Z" },
  { round: "17", raceName: "United States Grand Prix", Circuit: { circuitId: "americas", circuitName: "Circuit of the Americas", Location: { lat: "30.1328", long: "-97.6411", locality: "Austin", country: "USA" } }, date: "2026-10-25", time: "20:00:00Z" },
  { round: "18", raceName: "Mexico City Grand Prix", Circuit: { circuitId: "rodriguez", circuitName: "Autódromo Hermanos Rodríguez", Location: { lat: "19.4042", long: "-99.0907", locality: "Mexico City", country: "Mexico" } }, date: "2026-11-01", time: "20:00:00Z" },
  { round: "19", raceName: "Brazilian Grand Prix", Circuit: { circuitId: "interlagos", circuitName: "Autódromo José Carlos Pace", Location: { lat: "-23.7036", long: "-46.6997", locality: "São Paulo", country: "Brazil" } }, date: "2026-11-08", time: "17:00:00Z" },
  { round: "20", raceName: "Las Vegas Grand Prix", Circuit: { circuitId: "las_vegas", circuitName: "Las Vegas Strip Street Circuit", Location: { lat: "36.1147", long: "-115.173", locality: "Las Vegas", country: "USA" } }, date: "2026-11-22", time: "04:00:00Z" },
  { round: "21", raceName: "Qatar Grand Prix", Circuit: { circuitId: "losail", circuitName: "Losail International Circuit", Location: { lat: "25.49", long: "51.4542", locality: "Lusail", country: "Qatar" } }, date: "2026-11-29", time: "16:00:00Z" },
  { round: "22", raceName: "Abu Dhabi Grand Prix", Circuit: { circuitId: "yas_marina", circuitName: "Yas Marina Circuit", Location: { lat: "24.4672", long: "54.6031", locality: "Abu Dhabi", country: "UAE" } }, date: "2026-12-06", time: "13:00:00Z" }
];

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
      const raceData = Array.isArray(data) ? data : (data.MRData?.RaceTable?.Races || []);
      
      if (raceData.length === 0) {
        throw new Error("Empty race list returned from API");
      }
      
      const transformedRaces = raceData.map((race) => ({
        id: `${race.season || season}-${race.round}`,
        season: race.season || season,
        round: race.round,
        name: race.raceName,
        circuit: race.Circuit?.circuitName || 'Unknown Circuit',
        locality: race.Circuit?.Location?.locality || '',
        country: race.Circuit?.Location?.country || '',
        lat: race.Circuit?.Location?.lat || '',
        long: race.Circuit?.Location?.long || '',
        date: race.date,
        time: race.time || 'TBD',
        status: new Date(race.date) < new Date() ? 'completed' : 'upcoming',
        url: race.url || race.Circuit?.url || ''
      }));
      
      setRaces(transformedRaces);
      setDataSource('Jolpica F1 API');
      
    } catch (error) {
      console.error(`Error fetching race schedule for ${season}:`, error);
      if (parseInt(season) === 2026) {
        console.log("Using static fallback 2026 race schedule due to rate limit/error.");
        const transformedRaces = FALLBACK_2026_RACES.map((race) => ({
          id: `2026-${race.round}`,
          season: 2026,
          round: race.round,
          name: race.raceName,
          circuit: race.Circuit?.circuitName || 'Unknown Circuit',
          locality: race.Circuit?.Location?.locality || '',
          country: race.Circuit?.Location?.country || '',
          lat: race.Circuit?.Location?.lat || '',
          long: race.Circuit?.Location?.long || '',
          date: race.date,
          time: race.time || 'TBD',
          status: new Date(race.date) < new Date() ? 'completed' : 'upcoming',
          url: race.url || race.Circuit?.url || ''
        }));
        setRaces(transformedRaces);
        setDataSource("Local 2026 Calendar Backup");
      } else {
        setError(error.message || `Failed to load race schedule for ${season}`);
      }
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
