// Get team color based on team name
export const getTeamColor = (teamName) => {
  const teamColors = {
    "Red Bull Racing": "bg-blue-600",
    Mercedes: "bg-gray-400",
    Ferrari: "bg-red-600",
    McLaren: "bg-orange-500",
    "Aston Martin": "bg-green-600",
    Alpine: "bg-pink-500",
    Williams: "bg-blue-400",
    AlphaTauri: "bg-blue-800",
    "Alfa Romeo": "bg-red-800",
    Haas: "bg-gray-600",
    RB: "bg-blue-700",
    "Kick Sauber": "bg-green-500",
    Sauber: "bg-green-500",
  }
  return teamColors[teamName] || "bg-gray-600"
}

// Get team nationality
export const getTeamNationality = (teamName) => {
  const teamNationalities = {
    "Red Bull Racing": "Austrian",
    Mercedes: "German",
    Ferrari: "Italian",
    McLaren: "British",
    "Aston Martin": "British",
    Alpine: "French",
    Williams: "British",
    AlphaTauri: "Italian",
    "Alfa Romeo": "Swiss",
    Haas: "American",
    RB: "Italian",
    "Kick Sauber": "Swiss",
    Sauber: "Swiss",
  }
  return teamNationalities[teamName] || "Unknown"
}

// Get team founded year
export const getTeamFoundedYear = (teamName) => {
  const teamFounded = {
    "Red Bull Racing": "2005",
    Mercedes: "2010",
    Ferrari: "1950",
    McLaren: "1966",
    "Aston Martin": "2021",
    Alpine: "2021",
    Williams: "1977",
    AlphaTauri: "2020",
    "Alfa Romeo": "2019",
    Haas: "2016",
    RB: "2024",
    "Kick Sauber": "2024",
    Sauber: "1993",
  }
  return teamFounded[teamName] || "Unknown"
}

// Get team championships
export const getTeamChampionships = (teamName) => {
  const teamChampionships = {
    "Red Bull Racing": "6",
    Mercedes: "8",
    Ferrari: "16",
    McLaren: "8",
    "Aston Martin": "0",
    Alpine: "2",
    Williams: "9",
    AlphaTauri: "1",
    "Alfa Romeo": "0",
    Haas: "0",
    RB: "0",
    "Kick Sauber": "0",
    Sauber: "0",
  }
  return teamChampionships[teamName] || "0"
}

// Get team description
export const getTeamDescription = (teamName) => {
  const teamDescriptions = {
    "Red Bull Racing": "The energy drink company's F1 team, known for innovative designs and championship success.",
    Mercedes: "The German manufacturer's works team, dominant in the hybrid era with multiple championships.",
    Ferrari: "The most successful and iconic team in F1 history, based in Maranello, Italy.",
    McLaren: "British racing team with a rich heritage and focus on technological innovation.",
    "Aston Martin": "The luxury car manufacturer's return to F1 as a works team.",
    Alpine: "Renault's rebranded F1 team, representing the French manufacturer's racing division.",
    Williams: "Independent British team with a proud racing heritage and multiple championships.",
    AlphaTauri: "Red Bull's sister team, serving as a development ground for young talent.",
    "Alfa Romeo": "Swiss-based team with Italian branding, focusing on development and progress.",
    Haas: "American team bringing a fresh perspective to Formula 1.",
    RB: "The evolution of AlphaTauri, continuing Red Bull's driver development program.",
    "Kick Sauber": "Swiss team with new backing, aiming for consistent points finishes.",
    Sauber: "Swiss team with a long F1 history and focus on driver development.",
  }
  return teamDescriptions[teamName] || "A Formula 1 racing team competing in the world championship."
}

// Get team headquarters
export const getTeamHeadquarters = (teamName) => {
  const teamHeadquarters = {
    "Red Bull Racing": "Milton Keynes, UK",
    Mercedes: "Brackley, UK",
    Ferrari: "Maranello, Italy",
    McLaren: "Woking, UK",
    "Aston Martin": "Silverstone, UK",
    Alpine: "Enstone, UK",
    Williams: "Grove, UK",
    AlphaTauri: "Faenza, Italy",
    "Alfa Romeo": "Hinwil, Switzerland",
    Haas: "Kannapolis, USA",
    RB: "Faenza, Italy",
    "Kick Sauber": "Hinwil, Switzerland",
    Sauber: "Hinwil, Switzerland",
  }
  return teamHeadquarters[teamName] || "Unknown"
}

// Get team principal
export const getTeamPrincipal = (teamName) => {
  const teamPrincipals = {
    "Red Bull Racing": "Christian Horner",
    Mercedes: "Toto Wolff",
    Ferrari: "Frédéric Vasseur",
    McLaren: "Andrea Stella",
    "Aston Martin": "Mike Krack",
    Alpine: "Bruno Famin",
    Williams: "James Vowles",
    AlphaTauri: "Franz Tost",
    "Alfa Romeo": "Alessandro Alunni Bravi",
    Haas: "Ayao Komatsu",
    RB: "Laurent Mekies",
    "Kick Sauber": "Alessandro Alunni Bravi",
    Sauber: "Alessandro Alunni Bravi",
  }
  return teamPrincipals[teamName] || "Unknown"
}

// Get team engine
export const getTeamEngine = (teamName) => {
  const teamEngines = {
    "Red Bull Racing": "Honda RBPT",
    Mercedes: "Mercedes",
    Ferrari: "Ferrari",
    McLaren: "Mercedes",
    "Aston Martin": "Mercedes",
    Alpine: "Renault",
    Williams: "Mercedes",
    AlphaTauri: "Honda RBPT",
    "Alfa Romeo": "Ferrari",
    Haas: "Ferrari",
    RB: "Honda RBPT",
    "Kick Sauber": "Ferrari",
    Sauber: "Ferrari",
  }
  return teamEngines[teamName] || "Unknown"
}
