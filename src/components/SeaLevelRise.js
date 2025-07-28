import React, { useState, useEffect } from 'react';
import { fetchSeaLevelData } from '../services/climateService';
import SeaLevelChart from './charts/SeaLevelChart';
import '../styles/DetailPage.css';

const SeaLevelRise = () => {
  const [seaLevelData, setSeaLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'recent', 'century'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchSeaLevelData();
        setSeaLevelData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sea level data:', err);
        setError('Failed to load sea level data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredData = () => {
    if (!seaLevelData) return [];
    
    switch (timeRange) {
      case 'recent':
        // Last 50 years
        return seaLevelData.filter(item => item.year >= 1970);
      case 'century':
        // Last 100 years
        return seaLevelData.filter(item => item.year >= 1920);
      case 'all':
      default:
        return seaLevelData;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading sea level data...</p>
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
  const latestRise = filteredData.find(item => item.year === latestYear)?.rise || 0;
  const earliestYear = Math.min(...filteredData.map(item => item.year));
  const earliestRise = filteredData.find(item => item.year === earliestYear)?.rise || 0;
  const totalRise = latestRise - earliestRise;
  const annualRate = totalRise / (latestYear - earliestYear);
  
  // Calculate decade averages
  const decadeAverages = [];
  const decades = [1880, 1900, 1920, 1940, 1960, 1980, 2000, 2020];
  
  decades.forEach((startYear, index) => {
    const endYear = decades[index + 1] || 2023;
    const decadeData = filteredData.filter(item => item.year >= startYear && item.year < endYear);
    if (decadeData.length > 0) {
      const sum = decadeData.reduce((acc, item) => acc + item.rise, 0);
      const average = sum / decadeData.length;
      decadeAverages.push({
        decade: `${startYear}s`,
        average: average.toFixed(1)
      });
    }
  });

  return (
    <div className="detail-page">
      <section className="detail-header">
        <h1>Global Sea Level Rise</h1>
        <p className="detail-description">
          Tracking the rise in global mean sea level over time, measured in millimeters relative to the 1993-2008 average.
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
        {seaLevelData && <SeaLevelChart data={filteredData} />}
      </div>

      <div className="detail-stats">
        <div className="stat-card">
          <h3>Current Level</h3>
          <div className="stat-value">{latestRise.toFixed(1)} mm</div>
          <p>Sea level rise for {latestYear}</p>
        </div>
        <div className="stat-card">
          <h3>Total Rise</h3>
          <div className="stat-value">{totalRise.toFixed(1)} mm</div>
          <p>Change since {earliestYear}</p>
        </div>
        <div className="stat-card">
          <h3>Annual Rate</h3>
          <div className="stat-value">{annualRate.toFixed(2)} mm/year</div>
          <p>Average annual rise</p>
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
                backgroundColor: `rgba(54, 162, 235, ${0.3 + (parseFloat(decade.average) + 150) / 300})`
              }}
            >
              <div className="decade-label">{decade.decade}</div>
              <div className="decade-value">{decade.average} mm</div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2>Understanding Sea Level Rise</h2>
        <p>
          Sea level rise is caused by two primary factors related to global warming: the added water from 
          melting ice sheets and glaciers, and the expansion of seawater as it warms.
        </p>
        <p>
          Global sea level has risen about 8-9 inches (21-24 centimeters) since 1880, with about a third 
          of that coming in just the last two and a half decades. The rate of sea level rise has accelerated 
          over time and continues to increase.
        </p>
        <div className="info-box">
          <h3>Impacts of Sea Level Rise</h3>
          <p>
            Rising sea levels have significant impacts on coastal communities and ecosystems:
          </p>
          <ul>
            <li>Increased coastal flooding and erosion</li>
            <li>Saltwater intrusion into freshwater systems</li>
            <li>Displacement of coastal populations</li>
            <li>Loss of habitats for plants and animals</li>
            <li>Damage to infrastructure and property</li>
            <li>Threats to cultural and historical sites</li>
          </ul>
        </div>
      </section>

      <section className="detail-section">
        <h2>Regional Variations</h2>
        <p>
          Sea level does not rise uniformly across the globe. Regional factors such as land subsidence, 
          ocean currents, and gravitational effects from ice mass loss mean that some areas experience 
          higher rates of sea level rise than others.
        </p>
        <p>
          For example, the U.S. East Coast and Gulf of Mexico are experiencing rates of sea level rise 
          that are higher than the global average due to a combination of land subsidence and changes 
          in ocean circulation patterns.
        </p>
      </section>

      <section className="detail-section">
        <h2>Future Projections</h2>
        <p>
          According to the Intergovernmental Panel on Climate Change (IPCC), global mean sea level is 
          projected to rise by 0.29-0.59 meters by 2100 under a low emissions scenario, and by 0.61-1.10 
          meters under a high emissions scenario.
        </p>
        <p>
          However, these projections do not fully account for potential rapid ice sheet dynamics, 
          particularly in Antarctica, which could lead to significantly higher sea level rise.
        </p>
      </section>

      <section className="detail-section">
        <h2>Data Sources</h2>
        <p>
          The sea level data presented here is derived from multiple sources, including tide gauge 
          records and satellite altimetry measurements compiled by organizations such as CSIRO 
          (Commonwealth Scientific and Industrial Research Organisation) and NASA.
        </p>
        <p>
          <a href="https://sealevel.nasa.gov/" target="_blank" rel="noopener noreferrer" className="source-link">
            Learn more about NASA's sea level research
          </a>
        </p>
      </section>
    </div>
  );
};

export default SeaLevelRise;
