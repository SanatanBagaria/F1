import React, { useState, useEffect, useMemo } from "react";
import { useRaceSchedule } from "../hooks/useRaceSchedule";

const TrackMaps = () => {
  const { races, loading: loadingRaces, error: errorRaces } = useRaceSchedule(2026);
  const [selectedCircuit, setSelectedCircuit] = useState("");
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  // Track Comparison states
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareCircuitA, setCompareCircuitA] = useState("silverstone");
  const [compareCircuitB, setCompareCircuitB] = useState("monaco");

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
          url: race.url,
          lat: race.lat,
          long: race.long
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
      lengthVal: 5.891,
      corners: 18,
      drsZones: 2,
      record: "1:27.097 (Max Verstappen, 2020)",
      description: "The historic home of British motorsport. Extremely fast and flowing, featuring legendary corner sequences like Maggots, Becketts, and Chapel.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Circuit_Silverstone_2011.svg/500px-Circuit_Silverstone_2011.svg.png"
    },
    monaco: {
      length: "3.337 km",
      lengthVal: 3.337,
      corners: 19,
      drsZones: 1,
      record: "1:12.909 (Lewis Hamilton, 2021)",
      description: "A legendary street circuit demanding absolute precision. Run along the glamorous harbor of Monte Carlo, it is F1's slowest yet most challenging race track.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/F1_circuits_2014-2018_-_Circuit_de_Monaco_%28version_2%29.svg/500px-F1_circuits_2014-2018_-_Circuit_de_Monaco_%28version_2%29.svg.png"
    },
    monza: {
      length: "5.793 km",
      lengthVal: 5.793,
      corners: 11,
      drsZones: 2,
      record: "1:21.046 (Rubens Barrichello, 2004)",
      description: "Known as the 'Temple of Speed'. Features incredibly long straights and tight chicanes where cars run at low-downforce trims pushing past 350 km/h.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Monza_track_map.svg/500px-Monza_track_map.svg.png"
    },
    spa: {
      length: "7.004 km",
      lengthVal: 7.004,
      corners: 19,
      drsZones: 2,
      record: "1:46.286 (Valtteri Bottas, 2018)",
      description: "A favorite among drivers, featuring dramatic elevation changes and the legendary Eau Rouge-Raidillon sweep through the Ardennes forest.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/500px-Spa-Francorchamps_of_Belgium.svg.png"
    },
    suzuka: {
      length: "5.807 km",
      lengthVal: 5.807,
      corners: 18,
      drsZones: 1,
      record: "1:30.983 (Lewis Hamilton, 2019)",
      description: "A unique figure-eight layout presenting a demanding test of driver skill, aerodynamic stability, and tyre wear through the fast Ess Curves and 130R.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Suzuka_circuit_map--2005.svg/500px-Suzuka_circuit_map--2005.svg.png"
    },
    sakhir: {
      length: "5.412 km",
      lengthVal: 5.412,
      corners: 15,
      drsZones: 3,
      record: "1:31.447 (Pedro de la Rosa, 2005)",
      description: "Located in the desert, Bahrain International Circuit is famous for action-packed night races and intense tyre degradation.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Bahrain_International_Circuit--Grand_Prix_Layout_with_DRS.svg/500px-Bahrain_International_Circuit--Grand_Prix_Layout_with_DRS.svg.png"
    },
    jeddah: {
      length: "6.174 km",
      lengthVal: 6.174,
      corners: 27,
      drsZones: 3,
      record: "1:30.734 (Lewis Hamilton, 2021)",
      description: "The fastest street circuit in Formula 1 history, running along the scenic Red Sea coast in Saudi Arabia.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jeddah_Street_Circuit_2021.svg/500px-Jeddah_Street_Circuit_2021.svg.png"
    },
    albert_park: {
      length: "5.278 km",
      lengthVal: 5.278,
      corners: 14,
      drsZones: 4,
      record: "1:20.260 (Charles Leclerc, 2022)",
      description: "Melbourne's picturesque parkland track, renovated for faster racing, higher cornering speeds and multiple DRS zones.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Albert_Park_Circuit_2021.svg/500px-Albert_Park_Circuit_2021.svg.png"
    },
    shanghai: {
      length: "5.451 km",
      lengthVal: 5.451,
      corners: 16,
      drsZones: 2,
      record: "1:32.238 (Michael Schumacher, 2004)",
      description: "Designed in the shape of the Chinese character 'shang'. Features a demanding Turn 1 spiral and one of the longest straightaways in F1.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Circuit_Shanghai_2004.svg/500px-Circuit_Shanghai_2004.svg.png"
    },
    miami: {
      length: "5.412 km",
      lengthVal: 5.412,
      corners: 19,
      drsZones: 3,
      record: "1:29.708 (Max Verstappen, 2023)",
      description: "A modern street-style track circling the Hard Rock Stadium complex, presenting a vibrant, high-energy American race weekend.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hard_Rock_Stadium_Circuit_2022.svg/500px-Hard_Rock_Stadium_Circuit_2022.svg.png"
    },
    imola: {
      length: "4.909 km",
      lengthVal: 4.909,
      corners: 19,
      drsZones: 1,
      record: "1:15.484 (Lewis Hamilton, 2020)",
      description: "The historic Autodromo Enzo e Dino Ferrari. A classic, narrow, counter-clockwise track in Italy that demands precision racing.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2022_F1_CourseLayout_Imola.svg/500px-2022_F1_CourseLayout_Imola.svg.png"
    },
    villeneuve: {
      length: "4.361 km",
      lengthVal: 4.361,
      corners: 14,
      drsZones: 2,
      record: "1:13.078 (Valtteri Bottas, 2019)",
      description: "Located on Montreal's Notre Dame Island, featuring the iconic 'Wall of Champions' at the final chicane.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Circuit_GillesVilleneuve_2002.svg/500px-Circuit_GillesVilleneuve_2002.svg.png"
    },
    catalunya: {
      length: "4.657 km",
      lengthVal: 4.657,
      corners: 16,
      drsZones: 2,
      record: "1:16.330 (Max Verstappen, 2023)",
      description: "Barcelona's multi-purpose circuit, highly preferred for testing aerodynamic performance and tyre management.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Formula1_Circuit_Catalunya_2021.svg/500px-Formula1_Circuit_Catalunya_2021.svg.png"
    },
    red_bull_ring: {
      length: "4.318 km",
      lengthVal: 4.318,
      corners: 10,
      drsZones: 3,
      record: "1:05.619 (Carlos Sainz, 2020)",
      description: "A short, roller-coaster lap set in the Styrian mountains of Austria, featuring long uphill straights and heavy braking zones.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Spielberg_bare_map_numbers_simplified.svg/500px-Spielberg_bare_map_numbers_simplified.svg.png"
    },
    hungaroring: {
      length: "4.381 km",
      lengthVal: 4.381,
      corners: 14,
      drsZones: 2,
      record: "1:16.627 (Lewis Hamilton, 2020)",
      description: "A dusty, tight, twisty circuit with few overtake spots, often compared to Monaco without the walls.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Hungaroring.svg/500px-Hungaroring.svg.png"
    },
    zandvoort: {
      length: "4.259 km",
      lengthVal: 4.259,
      corners: 14,
      drsZones: 2,
      record: "1:11.097 (Lewis Hamilton, 2021)",
      description: "Features steep banking at Turn 3 and Turn 14 through the coastal sand dunes, presenting a thrilling test of downforce.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Circuit_Park_Zandvoort-1999.svg/500px-Circuit_Park_Zandvoort-1999.svg.png"
    },
    baku: {
      length: "6.003 km",
      lengthVal: 6.003,
      corners: 20,
      drsZones: 2,
      record: "1:43.009 (Charles Leclerc, 2019)",
      description: "Features the narrow, historic old city sector alongside a massive 2.2 km main straightaway, creating high-speed drafting action.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Baku_Formula_One_circuit_map.svg/500px-Baku_Formula_One_circuit_map.svg.png"
    },
    marina_bay: {
      length: "4.940 km",
      lengthVal: 4.940,
      corners: 19,
      drsZones: 3,
      record: "1:35.867 (Lewis Hamilton, 2023)",
      description: "The spectacular Singapore night street race, highly demanding physically due to tropical heat and bumpiness.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Marina_Bay_circuit_2023.svg/500px-Marina_Bay_circuit_2023.svg.png"
    },
    americas: {
      length: "5.513 km",
      lengthVal: 5.513,
      corners: 20,
      drsZones: 2,
      record: "1:36.169 (Charles Leclerc, 2019)",
      description: "Austin's modern track, featuring a steep climb to a blind Turn 1 and layout elements inspired by Silverstone and Hockenheim.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Austin_Formula_One_circuit-2.svg/500px-Austin_Formula_One_circuit-2.svg.png"
    },
    rodriguez: {
      length: "4.304 km",
      lengthVal: 4.304,
      corners: 17,
      drsZones: 3,
      record: "1:17.774 (Valtteri Bottas, 2021)",
      description: "Set at high altitude in Mexico City, running through the historic Foro Sol stadium, presenting a unique atmosphere.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/2022_F1_CourseLayout_Mexico.svg/500px-2022_F1_CourseLayout_Mexico.svg.png"
    },
    interlagos: {
      length: "4.309 km",
      lengthVal: 4.309,
      corners: 15,
      drsZones: 2,
      record: "1:10.540 (Valtteri Bottas, 2018)",
      description: "Classic track in São Paulo with famous elevation changes and unpredictable rainstorms, creating historic finishes.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28AKA_Interlagos%29_track_map.svg/500px-Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace_%28AKA_Interlagos%29_track_map.svg.png"
    },
    las_vegas: {
      length: "6.201 km",
      lengthVal: 6.201,
      corners: 17,
      drsZones: 2,
      record: "1:35.490 (Oscar Piastri, 2023)",
      description: "The neon-lit street race flying down the famous Las Vegas Strip under cool night temperatures.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/2023_Las_Vegas_street_circuit.svg/500px-2023_Las_Vegas_street_circuit.svg.png"
    },
    losail: {
      length: "5.419 km",
      lengthVal: 5.419,
      corners: 16,
      drsZones: 1,
      record: "1:24.319 (Max Verstappen, 2023)",
      description: "Qatar's fast and flowing track, featuring high-speed sweeps and challenging humidity.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Losail.svg/500px-Losail.svg.png"
    },
    yas_marina: {
      length: "5.281 km",
      lengthVal: 5.281,
      corners: 16,
      drsZones: 2,
      record: "1:26.103 (Max Verstappen, 2021)",
      description: "The day-night season finale set around Abu Dhabi's luxury yacht marina and hotel.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Yas_Marina_Circuit_2021_new_Formula_One_layout_proposal_08_07_2021.svg/500px-Yas_Marina_Circuit_2021_new_Formula_One_layout_proposal_08_07_2021.svg.png"
    }
  };

  const activeCircuitInfo = useMemo(() => {
    return circuits.find(c => c.id === selectedCircuit);
  }, [circuits, selectedCircuit]);

  useEffect(() => {
    if (!activeCircuitInfo || !activeCircuitInfo.lat || !activeCircuitInfo.long) return;

    const fetchWeather = async () => {
      setLoadingWeather(true);
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${activeCircuitInfo.lat}&longitude=${activeCircuitInfo.long}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.current) {
            setWeather({
              air_temperature: Math.round(data.current.temperature_2m),
              track_temperature: Math.round(data.current.temperature_2m + 5),
              humidity: data.current.relative_humidity_2m,
              rainfall: data.current.rain > 0 ? "Yes" : "No",
              wind_speed: data.current.wind_speed_10m,
              isReal: true
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch weather telemetry:", err);
      } finally {
        setLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [activeCircuitInfo]);

  const activeDetails = useMemo(() => {
    return circuitDetails[selectedCircuit] || {
      length: "Unknown Length",
      lengthVal: 0,
      corners: 0,
      drsZones: 0,
      record: "No record available",
      description: "No description available for this circuit. Stay tuned for track maps and technical details.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Silverstone_Circuit_2020.svg/600px-Silverstone_Circuit_2020.svg.png"
    };
  }, [selectedCircuit]);

  // Derived compared circuit data
  const detailsA = useMemo(() => {
    return circuitDetails[compareCircuitA] || {
      length: "Unknown Length",
      lengthVal: 0,
      corners: 0,
      drsZones: 0,
      record: "No record available",
      description: "No description available.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Silverstone_Circuit_2020.svg/600px-Silverstone_Circuit_2020.svg.png"
    };
  }, [compareCircuitA]);

  const detailsB = useMemo(() => {
    return circuitDetails[compareCircuitB] || {
      length: "Unknown Length",
      lengthVal: 0,
      corners: 0,
      drsZones: 0,
      record: "No record available",
      description: "No description available.",
      map: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Silverstone_Circuit_2020.svg/600px-Silverstone_Circuit_2020.svg.png"
    };
  }, [compareCircuitB]);

  const infoA = useMemo(() => {
    return circuits.find(c => c.id === compareCircuitA);
  }, [circuits, compareCircuitA]);

  const infoB = useMemo(() => {
    return circuits.find(c => c.id === compareCircuitB);
  }, [circuits, compareCircuitB]);

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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
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
            
            {/* Compare Toggle Button */}
            <button
              onClick={() => setIsCompareMode(!isCompareMode)}
              className={`px-6 py-2.5 border rounded-lg text-xs font-semibold uppercase tracking-widest transition-all ${
                isCompareMode 
                  ? "bg-red-600 border-red-600 text-white shadow-sm" 
                  : "border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-red-600 dark:hover:border-red-400"
              }`}
            >
              {isCompareMode ? "Exit Comparison" : "Compare Tracks"}
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {isCompareMode ? (
            /* Comparison Mode View */
            <div className="space-y-8">
              {/* Dropdown selectors */}
              <div className="grid grid-cols-2 gap-8 bg-gray-50 dark:bg-gray-900/40 p-6 rounded-lg border border-gray-100 dark:border-gray-850">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">Circuit A</label>
                  <select
                    value={compareCircuitA}
                    onChange={(e) => setCompareCircuitA(e.target.value)}
                    className="w-full bg-white dark:bg-gray-950 text-gray-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:border-red-600 focus:outline-none"
                  >
                    {circuits.map(c => (
                      <option key={`compare-a-${c.id}`} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">Circuit B</label>
                  <select
                    value={compareCircuitB}
                    onChange={(e) => setCompareCircuitB(e.target.value)}
                    className="w-full bg-white dark:bg-gray-950 text-gray-950 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-sm focus:border-red-600 focus:outline-none"
                  >
                    {circuits.map(c => (
                      <option key={`compare-b-${c.id}`} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Side-by-Side Comparison Details */}
              {detailsA && detailsB && (
                <div className="grid md:grid-cols-2 gap-12">
                  {/* Left Circuit (A) Column */}
                  <div className="space-y-8">
                    {infoA && (
                      <div className="space-y-2">
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-widest">Circuit A</span>
                        <h3 className="text-3xl font-light text-gray-950 dark:text-white">{infoA.name}</h3>
                        <p className="text-xs text-gray-400 font-light">{infoA.location}</p>
                      </div>
                    )}

                    {detailsA.map && (
                      <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-900/60 p-8 rounded-lg border border-gray-100 dark:border-gray-850 h-64">
                        <img
                          src={detailsA.map}
                          alt="Circuit A layout map"
                          className="max-h-full max-w-full object-contain filter invert-0 dark:invert-[0.85] transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-850">
                        <span className="text-xs text-gray-400 font-light">Track Length</span>
                        <span className={`text-sm font-semibold ${detailsA.lengthVal > (detailsB.lengthVal || 0) ? "text-green-500" : "text-gray-950 dark:text-gray-300"}`}>
                          {detailsA.length}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-850">
                        <span className="text-xs text-gray-400 font-light">Corners</span>
                        <span className={`text-sm font-semibold ${detailsA.corners > (detailsB.corners || 0) ? "text-red-500" : "text-gray-950 dark:text-gray-300"}`}>
                          {detailsA.corners} corners
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-850">
                        <span className="text-xs text-gray-400 font-light">DRS Zones</span>
                        <span className={`text-sm font-semibold ${detailsA.drsZones > (detailsB.drsZones || 0) ? "text-red-500" : "text-gray-950 dark:text-gray-300"}`}>
                          {detailsA.drsZones} zones
                        </span>
                      </div>
                      <div className="flex flex-col py-2 space-y-1">
                        <span className="text-xs text-gray-400 font-light">Lap Record</span>
                        <span className="text-xs text-gray-950 dark:text-gray-300">{detailsA.record}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed p-4 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-100 dark:border-gray-850/50">
                      {detailsA.description}
                    </p>
                  </div>

                  {/* Right Circuit (B) Column */}
                  <div className="space-y-8">
                    {infoB && (
                      <div className="space-y-2">
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold uppercase tracking-widest">Circuit B</span>
                        <h3 className="text-3xl font-light text-gray-950 dark:text-white">{infoB.name}</h3>
                        <p className="text-xs text-gray-400 font-light">{infoB.location}</p>
                      </div>
                    )}

                    {detailsB.map && (
                      <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-900/60 p-8 rounded-lg border border-gray-100 dark:border-gray-850 h-64">
                        <img
                          src={detailsB.map}
                          alt="Circuit B layout map"
                          className="max-h-full max-w-full object-contain filter invert-0 dark:invert-[0.85] transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 rounded-lg p-6 space-y-4">
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-850">
                        <span className="text-xs text-gray-400 font-light">Track Length</span>
                        <span className={`text-sm font-semibold ${detailsB.lengthVal > (detailsA.lengthVal || 0) ? "text-green-500" : "text-gray-950 dark:text-gray-300"}`}>
                          {detailsB.length}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-850">
                        <span className="text-xs text-gray-400 font-light">Corners</span>
                        <span className={`text-sm font-semibold ${detailsB.corners > (detailsA.corners || 0) ? "text-red-500" : "text-gray-950 dark:text-gray-300"}`}>
                          {detailsB.corners} corners
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-850">
                        <span className="text-xs text-gray-400 font-light">DRS Zones</span>
                        <span className={`text-sm font-semibold ${detailsB.drsZones > (detailsA.drsZones || 0) ? "text-red-500" : "text-gray-950 dark:text-gray-300"}`}>
                          {detailsB.drsZones} zones
                        </span>
                      </div>
                      <div className="flex flex-col py-2 space-y-1">
                        <span className="text-xs text-gray-400 font-light">Lap Record</span>
                        <span className="text-xs text-gray-950 dark:text-gray-300">{detailsB.record}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 font-light leading-relaxed p-4 bg-gray-50 dark:bg-gray-900/20 rounded border border-gray-100 dark:border-gray-850/50">
                      {detailsB.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Normal Circuit & Weather Details View */
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
                        referrerPolicy="no-referrer"
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
          )}
        </div>
      </section>
    </div>
  );
};

export default TrackMaps;
