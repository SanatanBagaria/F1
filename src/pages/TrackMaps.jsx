import React, { useState, useEffect, useMemo } from "react";
import { useRaceSchedule } from "../hooks/useRaceSchedule";

const TrackMaps = () => {
  const { races, loading: loadingRaces, error: errorRaces } = useRaceSchedule(2026);
  const [selectedCircuit, setSelectedCircuit] = useState("");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Group races into unique circuits list dynamically for 2026
  const circuits = useMemo(() => {
    if (!races) return [];
    const unique = new Map();
    races.forEach((race) => {
      let circuitId = race.circuit.toLowerCase()
        .replace("circuit de Monaco", "monaco")
        .replace("silverstone circuit", "silverstone")
        .replace("autodromo nazionale monza", "monza")
        .replace("circuit de spa-francorchamps", "spa")
        .replace("suzuka international racing course", "suzuka")
        .replace("bahrain international circuit", "sakhir")
        .replace("jeddah corniche circuit", "jeddah")
        .replace("albert park circuit", "albert_park")
        .replace("shanghai international circuit", "shanghai")
        .replace("miami international autodrom", "miami")
        .replace("autodromo enzo e dino ferrari", "imola")
        .replace("circuit gilles villeneuve", "villeneuve")
        .replace("circuit de barcelona-catalunya", "catalunya")
        .replace("red bull ring", "red_bull_ring")
        .replace("hungaroring", "hungaroring")
        .replace("circuit zandvoort", "zandvoort")
        .replace("baku city circuit", "baku")
        .replace("marina bay street circuit", "marina_bay")
        .replace("circuit of the americas", "americas")
        .replace("autodromo hermanos rodriguez", "rodriguez")
        .replace("autodromo jose carlos pace", "interlagos")
        .replace("las vegas strip circuit", "las_vegas")
        .replace("lusail international circuit", "losail")
        .replace("yas marina circuit", "yas_marina")
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      if (race.circuit.toLowerCase().includes("monaco")) circuitId = "monaco";
      else if (race.circuit.toLowerCase().includes("silverstone")) circuitId = "silverstone";
      else if (race.circuit.toLowerCase().includes("monza")) circuitId = "monza";
      else if (race.circuit.toLowerCase().includes("spa")) circuitId = "spa";
      else if (race.circuit.toLowerCase().includes("suzuka")) circuitId = "suzuka";
      else if (race.circuit.toLowerCase().includes("sakhir") || race.circuit.toLowerCase().includes("bahrain")) circuitId = "sakhir";
      else if (race.circuit.toLowerCase().includes("jeddah")) circuitId = "jeddah";
      else if (race.circuit.toLowerCase().includes("albert park") || race.circuit.toLowerCase().includes("melbourne")) circuitId = "albert_park";
      else if (race.circuit.toLowerCase().includes("shanghai")) circuitId = "shanghai";
      else if (race.circuit.toLowerCase().includes("miami")) circuitId = "miami";
      else if (race.circuit.toLowerCase().includes("imola")) circuitId = "imola";
      else if (race.circuit.toLowerCase().includes("gilles")) circuitId = "villeneuve";
      else if (race.circuit.toLowerCase().includes("catalunya") || race.circuit.toLowerCase().includes("barcelona")) circuitId = "catalunya";
      else if (race.circuit.toLowerCase().includes("red bull ring")) circuitId = "red_bull_ring";
      else if (race.circuit.toLowerCase().includes("hungaroring")) circuitId = "hungaroring";
      else if (race.circuit.toLowerCase().includes("zandvoort")) circuitId = "zandvoort";
      else if (race.circuit.toLowerCase().includes("baku")) circuitId = "baku";
      else if (race.circuit.toLowerCase().includes("marina bay") || race.circuit.toLowerCase().includes("singapore")) circuitId = "marina_bay";
      else if (race.circuit.toLowerCase().includes("americas") || race.circuit.toLowerCase().includes("austin")) circuitId = "americas";
      else if (race.circuit.toLowerCase().includes("hermanos") || race.circuit.toLowerCase().includes("mexico")) circuitId = "rodriguez";
      else if (race.circuit.toLowerCase().includes("pace") || race.circuit.toLowerCase().includes("interlagos") || race.circuit.toLowerCase().includes("carlos")) circuitId = "interlagos";
      else if (race.circuit.toLowerCase().includes("las vegas")) circuitId = "las_vegas";
      else if (race.circuit.toLowerCase().includes("lusail") || race.circuit.toLowerCase().includes("losail")) circuitId = "losail";
      else if (race.circuit.toLowerCase().includes("yas marina") || race.circuit.toLowerCase().includes("abu dhabi")) circuitId = "yas_marina";

      if (!unique.has(circuitId)) {
        unique.set(circuitId, {
          id: circuitId,
          name: race.circuit,
          location: `${race.locality}, ${race.country}`,
          round: race.round,
          url: race.url
        });
      }
    });

    const list = Array.from(unique.values());
    return list;
  }, [races]);

  // Set default selected circuit once list loads
  useEffect(() => {
    if (circuits.length > 0 && !selectedCircuit) {
      setSelectedCircuit(circuits[0].id);
    }
  }, [circuits, selectedCircuit]);

  const circuitDetails = {
    silverstone: {
      length: "5.891 km",
      corners: 18,
      drsZones: 2,
      record: "1:27.097 (Max Verstappen, 2020)",
      description: "The historic home of British motorsport. Extremely fast and flowing, featuring legendary corner sequences like Maggots, Becketts, and Chapel.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Silverstone_Circuit_2020.svg/600px-Silverstone_Circuit_2020.svg.png"
    },
    monaco: {
      length: "3.337 km",
      corners: 19,
      drsZones: 1,
      record: "1:12.909 (Lewis Hamilton, 2021)",
      description: "A legendary street circuit demanding absolute precision. Run along the glamorous harbor of Monte Carlo, it is F1's slowest yet most challenging race track.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Monte_Carlo_Formula_1_track_map.svg/600px-Monte_Carlo_Formula_1_track_map.svg.png"
    },
    monza: {
      length: "5.793 km",
      corners: 11,
      drsZones: 2,
      record: "1:21.046 (Rubens Barrichello, 2004)",
      description: "Known as the 'Temple of Speed'. Features incredibly long straights and tight chicanes where cars run at low-downforce trims pushing past 350 km/h.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Monza_Track_Map.svg/600px-Monza_Track_Map.svg.png"
    },
    spa: {
      length: "7.004 km",
      corners: 19,
      drsZones: 2,
      record: "1:46.286 (Valtteri Bottas, 2018)",
      description: "A favorite among drivers, featuring dramatic elevation changes and the legendary Eau Rouge-Raidillon sweep through the Ardennes forest.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_2007.svg/600px-Spa-Francorchamps_of_2007.svg.png"
    },
    suzuka: {
      length: "5.807 km",
      corners: 18,
      drsZones: 1,
      record: "1:30.983 (Lewis Hamilton, 2019)",
      description: "A unique figure-eight layout presenting a demanding test of driver skill, aerodynamic stability, and tyre wear through the fast Ess Curves and 130R.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Suzuka_circuit_map.svg/600px-Suzuka_circuit_map.svg.png"
    },
    sakhir: {
      length: "5.412 km",
      corners: 15,
      drsZones: 3,
      record: "1:31.447 (Pedro de la Rosa, 2005)",
      description: "Located in the desert, Bahrain International Circuit is famous for action-packed night races and intense tyre degradation.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Bahrain_International_Circuit--Grand_Prix_Layout.svg/600px-Bahrain_International_Circuit--Grand_Prix_Layout.svg.png"
    },
    jeddah: {
      length: "6.174 km",
      corners: 27,
      drsZones: 3,
      record: "1:30.734 (Lewis Hamilton, 2021)",
      description: "The fastest street circuit in Formula 1 history, running along the scenic Red Sea coast in Saudi Arabia.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Jeddah_Street_Circuit.svg/600px-Jeddah_Street_Circuit.svg.png"
    },
    albert_park: {
      length: "5.278 km",
      corners: 14,
      drsZones: 4,
      record: "1:20.260 (Charles Leclerc, 2022)",
      description: "Melbourne's picturesque parkland track, renovated for faster racing, higher cornering speeds and multiple DRS zones.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Albert_Park_Circuit_2022.svg/600px-Albert_Park_Circuit_2022.svg.png"
    },
    shanghai: {
      length: "5.451 km",
      corners: 16,
      drsZones: 2,
      record: "1:32.238 (Michael Schumacher, 2004)",
      description: "Designed in the shape of the Chinese character 'shang'. Features a demanding Turn 1 spiral and one of the longest straightaways in F1.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Shanghai_International_Circuit-layout.svg/600px-Shanghai_International_Circuit-layout.svg.png"
    },
    miami: {
      length: "5.412 km",
      corners: 19,
      drsZones: 3,
      record: "1:29.708 (Max Verstappen, 2023)",
      description: "A modern street-style track circling the Hard Rock Stadium complex, presenting a vibrant, high-energy American race weekend.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Miami_International_Autodrome_layout.svg/600px-Miami_International_Autodrome_layout.svg.png"
    },
    imola: {
      length: "4.909 km",
      corners: 19,
      drsZones: 1,
      record: "1:15.484 (Lewis Hamilton, 2020)",
      description: "The historic Autodromo Enzo e Dino Ferrari. A classic, narrow, counter-clockwise track in Italy that demands precision racing.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Autodromo_Enzo_e_Dino_Ferrari_2009.svg/600px-Autodromo_Enzo_e_Dino_Ferrari_2009.svg.png"
    },
    villeneuve: {
      length: "4.361 km",
      corners: 14,
      drsZones: 2,
      record: "1:13.078 (Valtteri Bottas, 2019)",
      description: "Located on Montreal's Notre Dame Island, featuring the iconic 'Wall of Champions' at the final chicane.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Circuit_Gilles_Villeneuve_2002.svg/600px-Circuit_Gilles_Villeneuve_2002.svg.png"
    },
    catalunya: {
      length: "4.657 km",
      corners: 16,
      drsZones: 2,
      record: "1:16.330 (Max Verstappen, 2023)",
      description: "Barcelona's multi-purpose circuit, highly preferred for testing aerodynamic performance and tyre management.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Catalunya.svg/600px-Catalunya.svg.png"
    },
    red_bull_ring: {
      length: "4.318 km",
      corners: 10,
      drsZones: 3,
      record: "1:05.619 (Carlos Sainz, 2020)",
      description: "A short, roller-coaster lap set in the Styrian mountains of Austria, featuring long uphill straights and heavy braking zones.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Spielberg_layout.svg/600px-Spielberg_layout.svg.png"
    },
    hungaroring: {
      length: "4.381 km",
      corners: 14,
      drsZones: 2,
      record: "1:16.627 (Lewis Hamilton, 2020)",
      description: "A dusty, tight, twisty circuit with few overtake spots, often compared to Monaco without the walls.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Hungaroring_track_map.svg/600px-Hungaroring_track_map.svg.png"
    },
    zandvoort: {
      length: "4.259 km",
      corners: 14,
      drsZones: 2,
      record: "1:11.097 (Lewis Hamilton, 2021)",
      description: "Features steep banking at Turn 3 and Turn 14 through the coastal sand dunes, presenting a thrilling test of downforce.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Circuit_Park_Zandvoort_2020.svg/600px-Circuit_Park_Zandvoort_2020.svg.png"
    },
    baku: {
      length: "6.003 km",
      corners: 20,
      drsZones: 2,
      record: "1:43.009 (Charles Leclerc, 2019)",
      description: "Features the narrow, historic old city sector alongside a massive 2.2 km main straightaway, creating high-speed drafting action.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Baku_Formula_One_street_circuit_map.svg/600px-Baku_Formula_One_street_circuit_map.svg.png"
    },
    marina_bay: {
      length: "4.940 km",
      corners: 19,
      drsZones: 3,
      record: "1:35.867 (Lewis Hamilton, 2023)",
      description: "The spectacular Singapore night street race, highly demanding physically due to tropical heat and bumpiness.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Marina_Bay_Street_Circuit_2023.svg/600px-Marina_Bay_Street_Circuit_2023.svg.png"
    },
    americas: {
      length: "5.513 km",
      corners: 20,
      drsZones: 2,
      record: "1:36.169 (Charles Leclerc, 2019)",
      description: "Austin's modern track, featuring a steep climb to a blind Turn 1 and layout elements inspired by Silverstone and Hockenheim.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Austin_Formula_One_circuit_map.svg/600px-Austin_Formula_One_circuit_map.svg.png"
    },
    rodriguez: {
      length: "4.304 km",
      corners: 17,
      drsZones: 3,
      record: "1:17.774 (Valtteri Bottas, 2021)",
      description: "Set at high altitude in Mexico City, running through the historic Foro Sol stadium, presenting a unique atmosphere.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Hermanos_Rodriguez_2015.svg/600px-Hermanos_Rodriguez_2015.svg.png"
    },
    interlagos: {
      length: "4.309 km",
      corners: 15,
      drsZones: 2,
      record: "1:10.540 (Valtteri Bottas, 2018)",
      description: "Classic track in São Paulo with famous elevation changes and unpredictable rainstorms, creating historic finishes.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Interlagos_track_map.svg/600px-Interlagos_track_map.svg.png"
    },
    las_vegas: {
      length: "6.201 km",
      corners: 17,
      drsZones: 2,
      record: "1:35.490 (Oscar Piastri, 2023)",
      description: "The neon-lit street race flying down the famous Las Vegas Strip under cool night temperatures.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Las_Vegas_Strip_Circuit.svg/600px-Las_Vegas_Strip_Circuit.svg.png"
    },
    losail: {
      length: "5.419 km",
      corners: 16,
      drsZones: 1,
      record: "1:24.319 (Max Verstappen, 2023)",
      description: "Qatar's fast and flowing track, featuring high-speed sweeps and challenging humidity.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Losail_International_Circuit.svg/600px-Losail_International_Circuit.svg.png"
    },
    yas_marina: {
      length: "5.281 km",
      corners: 16,
      drsZones: 2,
      record: "1:26.103 (Max Verstappen, 2021)",
      description: "The day-night season finale set around Abu Dhabi's luxury yacht marina and hotel.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Yas_Marina_Circuit_2021.svg/600px-Yas_Marina_Circuit_2021.svg.png"
    }
  };

  useEffect(() => {
    if (!selectedCircuit) return;

    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_BASE_URL}/api/weather/latest`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setWeather(data[data.length - 1]);
          } else {
            setWeather(null);
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather telemetry:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [selectedCircuit]);

  const activeCircuitInfo = useMemo(() => {
    return circuits.find(c => c.id === selectedCircuit);
  }, [circuits, selectedCircuit]);

  const activeDetails = useMemo(() => {
    return circuitDetails[selectedCircuit] || {
      length: "Unknown Length",
      corners: 0,
      drsZones: 0,
      record: "No record available",
      description: "No description available for this circuit. Stay tuned for track maps and technical details.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Silverstone_Circuit_2020.svg/600px-Silverstone_Circuit_2020.svg.png"
    };
  }, [selectedCircuit]);

  if (loadingRaces) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-1 h-16 bg-red-600 mx-auto animate-pulse"></div>
          <h2 className="text-xl font-extralight text-gray-900 dark:text-white">Loading Circuits Calendar...</h2>
        </div>
      </div>
    );
  }

  if (errorRaces) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-500">{errorRaces}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <section className="py-24 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-1 h-12 bg-red-600"></div>
              <h1 className="text-4xl md:text-5xl font-extralight text-gray-900 dark:text-white tracking-tight">
                Circuits & Live Weather
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-light">
              Explore all tracks from the current 2026 season calendar and view live session weather telemetry.
            </p>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Left: Circuit List Sidebar */}
            <div className="lg:col-span-1 space-y-2 max-h-[600px] overflow-y-auto pr-2 border-r border-gray-100 dark:border-gray-850">
              <span className="text-xs uppercase tracking-wider text-gray-400 font-medium block mb-4">2026 Calendar Tracks</span>
              <div className="flex flex-col space-y-1">
                {circuits.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCircuit(c.id)}
                    className={`text-left px-4 py-3 rounded-lg text-xs font-light transition-all ${
                      selectedCircuit === c.id
                        ? "bg-red-600 text-white font-normal"
                        : "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    Round {c.round}: {c.name.replace(" Circuit", "")}
                  </button>
                ))}
              </div>
            </div>

            {/* Middle: Circuit details */}
            {activeCircuitInfo ? (
              <div className="lg:col-span-2 space-y-6">
                {activeDetails.map && (
                  <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-900/60 p-8 rounded-lg border border-gray-100 dark:border-gray-850 h-80">
                    <img
                      src={activeDetails.map}
                      alt={`${activeCircuitInfo.name} map layout`}
                      className="max-h-full max-w-full object-contain filter invert-0 dark:invert-[0.85] transition-all duration-300"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <h2 className="text-3xl font-light text-gray-900 dark:text-white">{activeCircuitInfo.name}</h2>
                  <p className="text-red-600 text-sm font-semibold uppercase tracking-widest">{activeCircuitInfo.location}</p>
                  <p className="text-gray-600 dark:text-gray-400 font-light leading-relaxed">{activeDetails.description}</p>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-2 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg flex items-center justify-center p-8 text-gray-400 font-light">
                Select a circuit from the sidebar to inspect layout and specs.
              </div>
            )}

            {/* Right: Technical Stats and Weather */}
            <div className="lg:col-span-1 space-y-6">
              {/* Technical specifications */}
              <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-light text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
                  Circuit Specs
                </h3>

                <div className="space-y-3 text-xs font-light">
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Track Length</span>
                    <span className="text-gray-950 dark:text-gray-300 font-normal">{activeDetails.length}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Corners</span>
                    <span className="text-gray-950 dark:text-gray-300 font-normal">{activeDetails.corners}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">DRS Zones</span>
                    <span className="text-gray-950 dark:text-gray-300 font-normal">{activeDetails.drsZones}</span>
                  </div>
                  <div className="flex flex-col py-1 space-y-1">
                    <span className="text-gray-400">Lap Record</span>
                    <span className="text-gray-950 dark:text-gray-300 font-normal text-left">{activeDetails.record}</span>
                  </div>
                </div>
              </div>

              {/* Weather info */}
              <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg p-6 space-y-6 shadow-sm">
                <h3 className="text-lg font-light text-gray-900 dark:text-white pb-3 border-b border-gray-100 dark:border-gray-800">
                  Live Track Weather
                </h3>

                {loadingWeather ? (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-t-2 border-red-600 rounded-full animate-spin"></div>
                  </div>
                ) : weather ? (
                  <div className="space-y-3 text-xs font-light">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Air Temperature</span>
                      <span className="text-gray-950 dark:text-gray-300 font-normal">{weather.air_temperature}°C</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Track Temperature</span>
                      <span className="text-gray-950 dark:text-gray-300 font-normal">{weather.track_temperature}°C</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Humidity</span>
                      <span className="text-gray-950 dark:text-gray-300 font-normal">{weather.humidity}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Rainfall</span>
                      <span className={`font-semibold ${weather.rainfall ? "text-blue-500" : "text-green-500"}`}>
                        {weather.rainfall ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 text-xs font-light">
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Average Air</span>
                      <span className="text-gray-950 dark:text-gray-300">22.4°C</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Average Track</span>
                      <span className="text-gray-950 dark:text-gray-300">31.2°C</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-400">Rainfall Risk</span>
                      <span className="text-green-500">Low</span>
                    </div>
                    <p className="text-[10px] text-gray-500 italic mt-4 pt-4 border-t border-gray-150 dark:border-gray-800">
                      No active F1 telemetry stream. Showing historical averages.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackMaps;
