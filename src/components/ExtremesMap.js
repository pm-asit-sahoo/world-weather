import React, { useState, useEffect } from 'react';
import { fetchExtremeEvents } from '../services/climateService';
import WorldMap from './WorldMap';
import '../styles/DetailPage.css';

const ExtremesMap = ({ embedded = false }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'hurricane', 'wildfire', 'flood', etc.

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await fetchExtremeEvents();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching extreme events:', err);
        setError('Failed to load extreme events data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading extreme weather events data...</p>
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

  // Count events by type
  const eventCounts = events.reduce((counts, event) => {
    counts[event.type] = (counts[event.type] || 0) + 1;
    return counts;
  }, {});

  // Get event types for filter
  const eventTypes = ['all', ...Object.keys(eventCounts)];

  return (
    <div className={embedded ? "extremes-map-embedded" : "detail-page"}>
      {!embedded && (
        <>
          <section className="detail-header">
            <h1>Extreme Weather Events Map</h1>
            <p className="detail-description">
              Visualizing recent extreme weather events and climate anomalies around the world.
            </p>
          </section>
        </>
      )}
      {!embedded && (
        <div className="detail-controls">
          <div className="filter-selector">
            <span className="filter-label">Filter by event type:</span>
            <div className="filter-options">
              {eventTypes.map(type => (
                <button
                  key={type}
                  className={`filter-btn ${filter === type ? 'active' : ''}`}
                  onClick={() => setFilter(type)}
                >
                  {type === 'all' ? 'All Events' : type.charAt(0).toUpperCase() + type.slice(1)}
                  {type !== 'all' && (
                    <span className="event-count">{eventCounts[type]}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="map-detail-container">
        <WorldMap filter={filter} />
      </div>

      <section className="detail-section">
        <h2>Climate Change and Extreme Weather</h2>
        <p>
          Climate change is increasing the frequency and intensity of extreme weather events around the world.
          Rising global temperatures create conditions that can lead to more severe storms, longer droughts,
          larger wildfires, and more intense flooding.
        </p>
        <div className="info-box">
          <h3>How Climate Change Affects Extreme Weather</h3>
          <ul>
            <li>
              <strong>Hurricanes and Cyclones:</strong> Warmer ocean temperatures provide more energy for storms,
              potentially increasing their intensity. Rising sea levels also make storm surges more damaging.
            </li>
            <li>
              <strong>Wildfires:</strong> Higher temperatures and changing precipitation patterns create drier
              conditions in many regions, extending fire seasons and increasing the risk of larger, more intense fires.
            </li>
            <li>
              <strong>Floods:</strong> A warmer atmosphere can hold more moisture, leading to more intense rainfall
              events and increasing the risk of flooding.
            </li>
            <li>
              <strong>Droughts:</strong> Changing precipitation patterns and increased evaporation due to higher
              temperatures can lead to more frequent and severe droughts in many regions.
            </li>
            <li>
              <strong>Heatwaves:</strong> Global warming makes heatwaves more frequent, intense, and longer-lasting,
              posing significant risks to human health and agriculture.
            </li>
          </ul>
        </div>
      </section>

      <section className="detail-section">
        <h2>Recent Significant Events</h2>
        <div className="events-grid">
          {events.slice(0, 4).map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <div className="event-meta">
                <span className="event-type">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                <span className="event-date">{event.date}</span>
              </div>
              <p className="event-description">{event.description}</p>
              <p className="event-impact"><strong>Impact:</strong> {event.impact}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section">
        <h2>Attribution Science</h2>
        <p>
          Attribution science is the field of research that seeks to determine the extent to which climate change
          has influenced the likelihood or intensity of specific extreme weather events.
        </p>
        <p>
          While no single weather event can be attributed solely to climate change, scientists can calculate how
          much more likely or intense an event was due to human-induced warming. For example, studies have shown
          that some recent heatwaves were made several times more likely due to climate change.
        </p>
        <p>
          <a href="https://www.worldweatherattribution.org/" target="_blank" rel="noopener noreferrer" className="source-link">
            Learn more about World Weather Attribution
          </a>
        </p>
      </section>

      <section className="detail-section">
        <h2>Data Sources</h2>
        <p>
          The extreme weather events data presented here is compiled from multiple sources, including:
        </p>
        <ul>
          <li>National Oceanic and Atmospheric Administration (NOAA)</li>
          <li>World Meteorological Organization (WMO)</li>
          <li>Emergency Events Database (EM-DAT)</li>
          <li>News reports and scientific publications</li>
        </ul>
        <p>
          <a href="https://www.ncdc.noaa.gov/billions/" target="_blank" rel="noopener noreferrer" className="source-link">
            Learn more about NOAA's Billion-Dollar Weather and Climate Disasters
          </a>
        </p>
      </section>
    </div>
  );
};

export default ExtremesMap;
