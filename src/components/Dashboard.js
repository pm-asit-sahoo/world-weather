import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';
import { fetchGlobalTemperature, fetchCO2Data, fetchSeaLevelData } from '../services/climateService';
import TemperatureChart from './charts/TemperatureChart';
import CO2Chart from './charts/CO2Chart';
import SeaLevelChart from './charts/SeaLevelChart';
import GlobalTemperatureMap from './GlobalTemperatureMap';
import ExtremesMap from './ExtremesMap';

const Dashboard = () => {
  const [temperatureData, setTemperatureData] = useState(null);
  const [co2Data, setCO2Data] = useState(null);
  const [seaLevelData, setSeaLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tempData, co2, seaLevel] = await Promise.all([
          fetchGlobalTemperature(),
          fetchCO2Data(),
          fetchSeaLevelData()
        ]);
        
        setTemperatureData(tempData);
        setCO2Data(co2);
        setSeaLevelData(seaLevel);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching climate data:', err);
        setError('Failed to load climate data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading climate data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <h1>Climate Change Dashboard</h1>
        <p className="dashboard-description">
          Visualizing key climate indicators to track the changing climate and its impacts.
        </p>
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Global Temperature Anomaly</h2>
            <Link to="/temperature" className="btn btn-primary btn-sm">Details</Link>
          </div>
          <div className="chart-container">
            {temperatureData && <TemperatureChart data={temperatureData} simplified={true} />}
          </div>
          <p className="card-description">
            Global temperature anomaly shows how much warmer or cooler the Earth is compared to the pre-industrial baseline.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">CO2 Concentration</h2>
            <Link to="/emissions" className="btn btn-primary btn-sm">Details</Link>
          </div>
          <div className="chart-container">
            {co2Data && <CO2Chart data={co2Data} simplified={true} />}
          </div>
          <p className="card-description">
            Atmospheric CO2 concentration in parts per million (ppm) over time, showing the increase in greenhouse gases.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Sea Level Rise</h2>
            <Link to="/sea-level" className="btn btn-primary btn-sm">Details</Link>
          </div>
          <div className="chart-container">
            {seaLevelData && <SeaLevelChart data={seaLevelData} simplified={true} />}
          </div>
          <p className="card-description">
            Global mean sea level rise in millimeters relative to the 1993-2008 average.
          </p>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h2 className="card-title">Extreme Weather Events</h2>
            <Link to="/extremes" className="btn btn-primary btn-sm">Full Screen Map</Link>
          </div>
          <div className="card-content">
            <div className="chart-container dashboard-extremes-container">
              <ExtremesMap embedded={true} />
            </div>
          </div>
          <p className="card-description">
            Map of recent extreme weather events and climate anomalies around the world.
          </p>
        </div>

        <div className="dashboard-card full-width">
          <div className="card-header">
            <h2 className="card-title">Global Temperature Map</h2>
            <Link to="/global-temperature" className="btn btn-primary btn-sm">Full Screen Map</Link>
          </div>
          <div className="map-container dashboard-map-container">
            <GlobalTemperatureMap />
          </div>
          <p className="card-description">
            Interactive global temperature map - click anywhere to see detailed weather information for any location on Earth.
          </p>
        </div>
      </div>

      <section className="climate-facts">
        <h2>Key Climate Facts</h2>
        <div className="facts-grid">
          <div className="fact-card">
            <h3>1.1°C</h3>
            <p>Global temperature increase since pre-industrial times</p>
          </div>
          <div className="fact-card">
            <h3>417 ppm</h3>
            <p>Current atmospheric CO2 concentration</p>
          </div>
          <div className="fact-card">
            <h3>3.7 mm/year</h3>
            <p>Rate of sea level rise</p>
          </div>
          <div className="fact-card">
            <h3>40%</h3>
            <p>Decrease in Arctic sea ice since 1979</p>
          </div>
        </div>
      </section>

      <section className="call-to-action">
        <h2>Take Climate Action</h2>
        <p>Learn how you can help address climate change in your daily life and community.</p>
        <div className="action-buttons">
          <a href="https://www.un.org/en/actnow" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            UN Act Now Campaign
          </a>
          <a href="https://www.ipcc.ch/report/ar6-wg2/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            IPCC Latest Report
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
