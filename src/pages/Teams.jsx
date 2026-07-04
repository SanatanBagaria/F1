import React, { useState, useMemo } from "react";
import { useTeams } from "../hooks/useTeams";

const Teams = () => {
  const [selectedSeason, setSelectedSeason] = useState(2026);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { teams, loading, error, refetch, dataSource } = useTeams(selectedSeason);

  const getFullTeamName = (name) => {
    const fullNames = {
      'Red Bull Racing': 'Oracle Red Bull Racing',
      'Mercedes': 'Mercedes-AMG Petronas F1 Team',
      'Ferrari': 'Scuderia Ferrari',
      'McLaren': 'McLaren Formula 1 Team',
      'Alpine F1 Team': 'BWT Alpine F1 Team',
      'Aston Martin': 'Aston Martin Aramco F1 Team',
      'Williams': 'Williams Racing',
      'AlphaTauri': 'Scuderia AlphaTauri',
      'Alfa Romeo': 'Alfa Romeo F1 Team ORLEN',
      'Haas F1 Team': 'MoneyGram Haas F1 Team'
    };
    return fullNames[name] || name;
  };

  const getPowerUnit = (constructorId) => {
    const powerUnits = {
      'red_bull': 'Honda RBPT',
      'mercedes': 'Mercedes',
      'ferrari': 'Ferrari',
      'mclaren': 'Mercedes',
      'alpine': 'Renault',
      'aston_martin': 'Mercedes',
      'williams': 'Mercedes',
      'alphatauri': 'Honda RBPT',
      'alfa': 'Ferrari',
      'haas': 'Ferrari'
    };
    return powerUnits[constructorId] || 'Unknown';
  };

  const getTeamEstablished = (constructorId) => {
    const established = {
      'ferrari': '1950',
      'mclaren': '1963',
      'williams': '1977',
      'mercedes': '2010',
      'red_bull': '2005',
      'alpine': '2021',
      'aston_martin': '2021',
      'alphatauri': '2006',
      'alfa': '2019',
      'haas': '2016'
    };
    return established[constructorId] || 'Unknown';
  };

  const getTeamHeadquarters = (constructorId) => {
    const headquarters = {
      'red_bull': 'Milton Keynes, United Kingdom',
      'mercedes': 'Brackley, United Kingdom',
      'ferrari': 'Maranello, Italy',
      'mclaren': 'Woking, United Kingdom',
      'alpine': 'Enstone, United Kingdom',
      'aston_martin': 'Silverstone, United Kingdom',
      'williams': 'Grove, United Kingdom',
      'alphatauri': 'Faenza, Italy',
      'alfa': 'Hinwil, Switzerland',
      'haas': 'Kannapolis, United States'
    };
    return headquarters[constructorId] || 'Unknown';
  };

  const getTeamPrincipal = (constructorId) => {
    const principals = {
      'red_bull': 'Christian Horner',
      'mercedes': 'Toto Wolff',
      'ferrari': 'Frédéric Vasseur',
      'mclaren': 'Andrea Stella',
      'alpine': 'Bruno Famin',
      'aston_martin': 'Mike Krack',
      'williams': 'James Vowles',
      'alphatauri': 'Laurent Mekies',
      'alfa': 'Alessandro Alunni Bravi',
      'haas': 'Ayao Komatsu'
    };
    return principals[constructorId] || 'Unknown';
  };

  const getTeamColor = (constructorId) => {
    const colors = {
      'red_bull': '#0600EF',
      'mercedes': '#00D2BE',
      'ferrari': '#DC143C',
      'mclaren': '#FF8700',
      'alpine': '#0090FF',
      'aston_martin': '#006F62',
      'williams': '#005AFF',
      'alphatauri': '#2B4562',
      'alfa': '#900000',
      'haas': '#FFFFFF'
    };
    return colors[constructorId] || '#EF4444';
  };

  const getTeamLogo = (constructorId) => {
    const logos = {
      'red_bull': 'https://media.formula1.com/content/dam/fom-website/teams/2026/red-bull-racing-logo.png',
      'mercedes': 'https://media.formula1.com/content/dam/fom-website/teams/2026/mercedes-logo.png',
      'ferrari': 'https://media.formula1.com/content/dam/fom-website/teams/2026/ferrari-logo.png',
      'mclaren': 'https://media.formula1.com/content/dam/fom-website/teams/2026/mclaren-logo.png',
      'alpine': 'https://media.formula1.com/content/dam/fom-website/teams/2026/alpine-logo.png',
      'aston_martin': 'https://media.formula1.com/content/dam/fom-website/teams/2026/aston-martin-logo.png',
      'williams': 'https://media.formula1.com/content/dam/fom-website/teams/2026/williams-logo.png',
      'haas': 'https://media.formula1.com/content/dam/fom-website/teams/2026/haas-f1-team-logo.png',
      'sauber': 'https://media.formula1.com/content/dam/fom-website/teams/2026/kick-sauber-logo.png',
      'kick_sauber': 'https://media.formula1.com/content/dam/fom-website/teams/2026/kick-sauber-logo.png',
      'rb': 'https://media.formula1.com/content/dam/fom-website/teams/2026/rb-logo.png',
      'racing_bulls': 'https://media.formula1.com/content/dam/fom-website/teams/2026/rb-logo.png'
    };
    return logos[constructorId] || null;
  };

  // Filter teams based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm.trim()) return teams;
    const lowercaseSearch = searchTerm.toLowerCase();
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(lowercaseSearch) ||
        team.nationality.toLowerCase().includes(lowercaseSearch)
    );
  }, [teams, searchTerm]);

  // Generate season list from 2026 down to 2015
  const seasons = Array.from({ length: 12 }, (_, i) => 2026 - i);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading Teams Directory...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1 h-12 bg-red-600"></div>
              <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 dark:text-white tracking-tight">
                Teams
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Formula 1 constructor profiles, technical partnerships, and standings.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <input
              type="text"
              placeholder="Search constructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 text-sm focus:border-red-600 focus:outline-none"
            />
            {/* Season Selector */}
            <select
              value={selectedSeason}
              onChange={(e) => {
                setSelectedSeason(parseInt(e.target.value));
                setSelectedTeam(null);
              }}
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded px-4 py-2 text-sm focus:border-red-600 focus:outline-none"
            >
              {seasons.map((year) => (
                <option key={year} value={year}>{year} Season</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {error ? (
            <div className="text-center space-y-4">
              <p className="text-red-500">{error}</p>
              <button onClick={refetch} className="px-4 py-2 bg-red-600 text-white rounded text-sm">Try Again</button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left Column: Teams List */}
              <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                {filteredTeams.map((team) => (
                  <div
                    key={team.id}
                    onClick={() => setSelectedTeam(team)}
                    className={`border rounded-lg p-6 transition-all cursor-pointer ${
                      selectedTeam?.id === team.id 
                        ? "border-red-600 bg-red-50/10 dark:bg-red-950/10 shadow-sm" 
                        : "border-gray-100 dark:border-gray-850 bg-white dark:bg-gray-900/50 hover:border-red-600/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 font-light uppercase tracking-wider">Pos {team.position || '-'}</span>
                        <h3 className="text-xl font-light text-gray-900 dark:text-white">
                          {team.name}
                        </h3>
                      </div>
                      <div 
                        className="w-2 h-10 rounded" 
                        style={{ backgroundColor: getTeamColor(team.id) }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 font-light">
                      <span>PU: {getPowerUnit(team.id)}</span>
                      {team.points !== undefined && <span className="font-semibold text-red-600">{team.points} pts</span>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Team Details Card */}
              <div className="md:col-span-1">
                {selectedTeam ? (
                  <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg p-8 space-y-6 sticky top-8 shadow-sm">
                    {/* Team logo */}
                    {getTeamLogo(selectedTeam.id) && (
                      <div className="flex justify-center bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-100 dark:border-gray-850">
                        <img 
                          src={getTeamLogo(selectedTeam.id)} 
                          alt={`${selectedTeam.name} logo`} 
                          className="h-16 object-contain"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-xs uppercase tracking-widest text-red-600 dark:text-red-400 font-semibold">Profile</span>
                        <h2 className="text-3xl font-extralight text-gray-900 dark:text-white leading-tight">{getFullTeamName(selectedTeam.name)}</h2>
                      </div>
                    </div>

                    <div className="w-12 h-px bg-red-600"></div>

                    <div className="space-y-4 text-sm font-light">
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Headquarters</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal text-right max-w-[180px]">{getTeamHeadquarters(selectedTeam.id)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Team Principal</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal">{getTeamPrincipal(selectedTeam.id)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Power Unit</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal">{getPowerUnit(selectedTeam.id)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-800/40">
                        <span className="text-gray-400">Established</span>
                        <span className="text-gray-900 dark:text-gray-300 font-normal">{getTeamEstablished(selectedTeam.id)}</span>
                      </div>
                      
                      {selectedTeam.drivers && selectedTeam.drivers.length > 0 && (
                        <div className="py-2">
                          <span className="text-gray-400 block mb-2">Drivers</span>
                          <div className="flex flex-wrap gap-2">
                            {selectedTeam.drivers.map((driver, idx) => (
                              <span key={idx} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-xs font-normal">
                                {driver}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => window.open(selectedTeam.url, "_blank")}
                        className="w-full text-center px-4 py-2 border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-400 text-xs text-gray-600 dark:text-gray-400 rounded transition-all"
                      >
                        Official Wikipedia Page
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-200 dark:border-gray-800 rounded-lg p-8 text-center text-gray-400 font-light sticky top-8">
                    Select a constructor from the list to display their full profile details.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {dataSource && (
        <section className="py-12 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
          Constructors synced via {dataSource}
        </section>
      )}
    </div>
  );
};

export default Teams;
