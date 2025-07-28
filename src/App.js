import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './styles/App.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import TemperatureTrends from './components/TemperatureTrends';
import CO2Emissions from './components/CO2Emissions';
import SeaLevelRise from './components/SeaLevelRise';
import ExtremesMap from './components/ExtremesMap';
import GlobalTemperatureMap from './components/GlobalTemperatureMap';
import About from './components/About';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/temperature" element={<TemperatureTrends />} />
          <Route path="/emissions" element={<CO2Emissions />} />
          <Route path="/sea-level" element={<SeaLevelRise />} />
          <Route path="/extremes" element={<ExtremesMap />} />
          <Route path="/global-temperature" element={<GlobalTemperatureMap />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
