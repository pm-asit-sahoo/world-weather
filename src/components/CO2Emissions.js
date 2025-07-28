import React, { useState, useEffect } from 'react';
import { fetchCO2Data } from '../services/climateService';
import CO2Chart from './charts/CO2Chart';
import '../styles/DetailPage.css';

const CO2Emissions = () => {
  const [co2Data, setCO2Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('all'); // 'all', 'recent', '30years'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchCO2Data();
        setCO2Data(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching CO2 data:', err);
        setError('Failed to load CO2 data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getFilteredData = () => {
    if (!co2Data) return [];
    
    switch (timeRange) {
      case 'recent':
        // Last 20 years
        return co2Data.filter(item => item.year >= 2000);
      case '30years':
        // Last 30 years
        return co2Data.filter(item => item.year >= 1990);
      case 'all':
      default:
        return co2Data;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading CO2 data...</p>
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
  const latestPPM = filteredData.find(item => item.year === latestYear)?.ppm || 0;
  const earliestYear = Math.min(...filteredData.map(item => item.year));
  const earliestPPM = filteredData.find(item => item.year === earliestYear)?.ppm || 0;
  const totalIncrease = latestPPM - earliestPPM;
  const annualRate = totalIncrease / (latestYear - earliestYear);
  
  // Calculate decade averages
  const decadeAverages = [];
  const decades = [1960, 1970, 1980, 1990, 2000, 2010, 2020];
  
  decades.forEach((startYear, index) => {
    const endYear = decades[index + 1] || 2023;
    const decadeData = filteredData.filter(item => item.year >= startYear && item.year < endYear);
    if (decadeData.length > 0) {
      const sum = decadeData.reduce((acc, item) => acc + item.ppm, 0);
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
        <h1>Atmospheric CO2 Concentration</h1>
        <p className="detail-description">
          Tracking the levels of carbon dioxide in the atmosphere over time, measured in parts per million (ppm).
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
            className={`btn ${timeRange === '30years' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('30years')}
          >
            Last 30 Years
          </button>
          <button 
            className={`btn ${timeRange === 'recent' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setTimeRange('recent')}
          >
            Last 20 Years
          </button>
        </div>
      </div>

      <div className="detail-chart-container">
        {co2Data && <CO2Chart data={filteredData} />}
      </div>

      <div className="detail-stats">
        <div className="stat-card">
          <h3>Current Level</h3>
          <div className="stat-value">{latestPPM.toFixed(2)} ppm</div>
          <p>CO2 concentration for {latestYear}</p>
        </div>
        <div className="stat-card">
          <h3>Total Increase</h3>
          <div className="stat-value">{totalIncrease.toFixed(2)} ppm</div>
          <p>Change since {earliestYear}</p>
        </div>
        <div className="stat-card">
          <h3>Annual Rate</h3>
          <div className="stat-value">{annualRate.toFixed(2)} ppm/year</div>
          <p>Average annual increase</p>
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
                backgroundColor: `rgba(75, 192, 192, ${0.3 + (parseFloat(decade.average) - 300) / 150})`
              }}
            >
              <div className="decade-label">{decade.decade}</div>
              <div className="decade-value">{decade.average} ppm</div>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2>Understanding CO2 Concentrations</h2>
        <p>
          Carbon dioxide (CO2) is a greenhouse gas that traps heat in the Earth's atmosphere. 
          The concentration of CO2 in the atmosphere is measured in parts per million (ppm).
        </p>
        <p>
          Pre-industrial levels of CO2 were around 280 ppm. The current level of over 410 ppm 
          represents a significant increase that is primarily due to human activities such as 
          burning fossil fuels, deforestation, and industrial processes.
        </p>
        <div className="info-box">
          <h3>Why CO2 Levels Matter</h3>
          <p>
            Rising CO2 levels contribute to global warming and climate change through the greenhouse effect. 
            Higher concentrations of CO2 in the atmosphere lead to:
          </p>
          <ul>
            <li>Increased global temperatures</li>
            <li>Changes in precipitation patterns</li>
            <li>More frequent and intense extreme weather events</li>
            <li>Ocean acidification, which threatens marine ecosystems</li>
            <li>Rising sea levels due to thermal expansion and melting ice</li>
          </ul>
        </div>
      </section>

      <section className="detail-section">
        <h2>The Keeling Curve</h2>
        <p>
          The continuous measurement of atmospheric CO2 at Mauna Loa Observatory in Hawaii, 
          known as the Keeling Curve, is one of the most important long-term records of atmospheric change. 
          Started by Charles David Keeling in 1958, this record shows both the annual cycle of CO2 
          (due to seasonal plant growth in the Northern Hemisphere) and the steady increase in baseline levels.
        </p>
        <p>
          <a href="https://scrippsco2.ucsd.edu/" target="_blank" rel="noopener noreferrer" className="source-link">
            Learn more about the Keeling Curve
          </a>
        </p>
      </section>

      <section className="detail-section">
        <h2>Data Sources</h2>
        <p>
          The CO2 concentration data presented here is sourced from the Mauna Loa Observatory, 
          operated by the National Oceanic and Atmospheric Administration (NOAA) and the 
          Scripps Institution of Oceanography.
        </p>
        <p>
          <a href="https://gml.noaa.gov/ccgg/trends/" target="_blank" rel="noopener noreferrer" className="source-link">
            Learn more about NOAA's CO2 measurements
          </a>
        </p>
      </section>
    </div>
  );
};

export default CO2Emissions;
