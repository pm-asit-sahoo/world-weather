import React, { useState, useEffect } from 'react';
import { fetchGlobalTemperature } from '../services/climateService';
import TemperatureChart from './charts/TemperatureChart';
import '../styles/DetailPage.css';

const TemperatureTrends = () => {
  const [temperatureData, setTemperatureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'recent', 'century'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchGlobalTemperature();
        setTemperatureData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching temperature data:', err);
        setError('Failed to load temperature data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredData = () => {
    if (!temperatureData) return [];
    
    switch (timeRange) {
      case 'recent':
        // Last 50 years
        return temperatureData.filter(item => item.year >= 1970);
      case 'century':
        // Last 100 years
        return temperatureData.filter(item => item.year >= 1920);
      case 'all':
      default:
        return temperatureData;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading temperature data...</p>
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

  const filteredData = getFilteredData();
  
  // Calculate some statistics
  const latestYear = Math.max(...filteredData.map(item => item.year));
  const latestAnomaly = filteredData.find(item => item.year === latestYear)?.anomaly || 0;
  const baselineAnomaly = filteredData.find(item => item.year === 1880)?.anomaly || 0;
  const totalChange = latestAnomaly - baselineAnomaly;
  
  // Calculate decade averages
  const decadeAverages = [];
  const decades = [1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020];
  
  decades.forEach((startYear, index) => {
    const endYear = decades[index + 1] || 2023;
    const decadeData = filteredData.filter(item => item.year >= startYear && item.year < endYear);
    if (decadeData.length > 0) {
      const sum = decadeData.reduce((acc, item) => acc + item.anomaly, 0);
      const average = sum / decadeData.length;
      decadeAverages.push({
        decade: `${startYear}s`,
        average: average.toFixed(2)
      });
    }
  });

  return (
    <div className="detail-page">
      <section className="detail-header">
        <h1>Global Temperature Trends</h1>
        <p className="detail-description">
          Tracking the changes in global average temperature over time relative to the pre-industrial baseline.
        </p>
      </section>

      <div className="detail-controls">
        <div className="time-range-selector">
          <button 
            className={`btn ${timeRange === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('all')}
          >
            All Data
          </button>
          <button 
            className={`btn ${timeRange === 'century' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('century')}
          >
            Last Century
          </button>
          <button 
            className={`btn ${timeRange === 'recent' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('recent')}
          >
            Last 50 Years
          </button>
        </div>
      </div>

      <div className="detail-chart-container">
        {temperatureData && <TemperatureChart data={filteredData} />}
      </div>

      <div className="detail-stats">
        <div className="stat-card">
          <h3>Current Anomaly</h3>
          <div className="stat-value">{latestAnomaly.toFixed(2)}°C</div>
          <p>Temperature anomaly for {latestYear}</p>
        </div>
        <div className="stat-card">
          <h3>Total Change</h3>
          <div className="stat-value">{totalChange.toFixed(2)}°C</div>
          <p>Change since 1880</p>
        </div>
        <div className="stat-card">
          <h3>Rate of Change</h3>
          <div className="stat-value">{(totalChange / ((latestYear - 1880) / 100)).toFixed(2)}°C</div>
          <p>Per century</p>
        </div>
      </div>

      <section className="detail-section">
        <h2>Decade Averages</h2>
        <div className="decade-averages">
          {decadeAverages.map((decade, index) => (
            <div 
              key={index} 
              className="decade-item"
              style={{
                backgroundColor: `rgba(255, 99, 132, ${0.3 + (parseFloat(decade.average) + 0.5) / 2})`
              }}
            >
              <div className="decade-label">{decade.decade}</div>
              <div className="decade-value">{decade.average}°C</div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2>Understanding Temperature Anomalies</h2>
        <p>
          Temperature anomalies indicate how much warmer or cooler a period is compared to a reference baseline.
          The baseline used here is the pre-industrial average temperature from 1850-1900.
        </p>
        <p>
          A positive anomaly indicates that the observed temperature was warmer than the baseline,
          while a negative anomaly indicates that the observed temperature was cooler than the baseline.
        </p>
        <div className="info-box">
          <h3>What does a 1.5°C increase mean?</h3>
          <p>
            The Paris Agreement aims to limit global warming to well below 2°C, preferably to 1.5°C,
            compared to pre-industrial levels. A 1.5°C increase may seem small, but it represents a significant
            change in the Earth's climate system and can lead to:
          </p>
          <ul>
            <li>More frequent and intense extreme weather events</li>
            <li>Rising sea levels threatening coastal communities</li>
            <li>Disruption of ecosystems and loss of biodiversity</li>
            <li>Challenges to food security and water availability</li>
            <li>Health impacts from heat stress and changing disease patterns</li>
          </ul>
        </div>
      </section>

      <section className="detail-section">
        <h2>Data Sources</h2>
        <p>
          The temperature data presented here is sourced from NASA's Goddard Institute for Space Studies (GISS)
          Surface Temperature Analysis (GISTEMP v4), which combines land and ocean temperature records.
        </p>
        <p>
          <a href="https://data.giss.nasa.gov/gistemp/" target="_blank" rel="noopener noreferrer" className="source-link">
            Learn more about GISTEMP data
          </a>
        </p>
      </section>
    </div>
  );
};

export default TemperatureTrends;
