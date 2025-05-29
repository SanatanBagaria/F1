import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import LandingPage from "./pages/LandingPage"
import RaceHistories from "./pages/RaceHistories"
import SeasonWinners from "./pages/SeasonWinners"
import CurrentStandings from "./pages/CurrentStandings"
import RaceSchedule from "./pages/RaceSchedule"
import LiveUpdates from "./pages/LiveUpdates"
import DriverRadio from "./pages/DriverRadio"
import Teams from "./pages/Teams"
import Drivers from "./pages/Drivers"
import TrackMaps from "./pages/TrackMaps"
import News from "./pages/News"
import Polls from "./pages/Polls"
import "./App.css"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/race-histories" element={<RaceHistories />} />
              <Route path="/season-winners" element={<SeasonWinners />} />
              <Route path="/standings" element={<CurrentStandings />} />
              <Route path="/schedule" element={<RaceSchedule />} />
              <Route path="/live" element={<LiveUpdates />} />
              <Route path="/radio" element={<DriverRadio />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/tracks" element={<TrackMaps />} />
              <Route path="/news" element={<News />} />
              <Route path="/polls" element={<Polls />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
