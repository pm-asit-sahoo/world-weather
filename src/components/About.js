import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-header">
        <h1>About This Project</h1>
        <p className="about-subtitle">
          Understanding climate change through data visualization
        </p>
      </section>

      <section className="about-section">
        <h2>Project Overview</h2>
        <p>
          The Climate Change Data Visualization Dashboard is a web application designed to present 
          climate data in an accessible and interactive format. This project aims to raise awareness 
          about climate change by visualizing key climate indicators such as global temperature trends, 
          CO2 emissions, sea level rise, and extreme weather events.
        </p>
        <p>
          By making climate data more accessible and understandable, we hope to contribute to greater 
          public awareness and informed decision-making regarding climate action.
        </p>
      </section>

      <section className="about-section">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Interactive Charts</h3>
            <p>Visualize climate data through interactive and responsive charts</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h3>Global Map</h3>
            <p>Explore extreme weather events around the world</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Access the dashboard on any device with a fully responsive layout</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Real-time Updates</h3>
            <p>Data is regularly updated from reliable climate sources</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Data Sources</h2>
        <p>
          The data presented in this dashboard is sourced from reputable scientific organizations 
          that monitor and research climate change. These include:
        </p>
        <ul className="data-sources-list">
          <li>
            <strong>NASA Goddard Institute for Space Studies (GISS)</strong> - 
            Global temperature data
          </li>
          <li>
            <strong>National Oceanic and Atmospheric Administration (NOAA)</strong> - 
            Climate monitoring and research
          </li>
          <li>
            <strong>Mauna Loa Observatory</strong> - 
            Atmospheric CO2 concentration measurements
          </li>
          <li>
            <strong>Commonwealth Scientific and Industrial Research Organisation (CSIRO)</strong> - 
            Sea level data
          </li>
          <li>
            <strong>World Meteorological Organization (WMO)</strong> - 
            Extreme weather event tracking
          </li>
        </ul>
        <p className="note">
          Note: For demonstration purposes, this project uses simulated data that represents 
          real climate trends but may not reflect the most current measurements.
        </p>
      </section>

      <section className="about-section">
        <h2>Technologies Used</h2>
        <div className="tech-stack">
          <div className="tech-item">
            <h3>Frontend</h3>
            <ul>
              <li>React.js</li>
              <li>Chart.js</li>
              <li>Leaflet.js</li>
              <li>React Router</li>
            </ul>
          </div>
          <div className="tech-item">
            <h3>Data Processing</h3>
            <ul>
              <li>JavaScript</li>
              <li>Axios</li>
            </ul>
          </div>
          <div className="tech-item">
            <h3>Deployment</h3>
            <ul>
              <li>GitHub</li>
              <li>Netlify</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Project Purpose</h2>
        <p>
          This project was created as a demonstration of web development skills, data visualization 
          techniques, and API integration. It serves as a portfolio piece to showcase:
        </p>
        <ul>
          <li>Frontend development with React</li>
          <li>Data visualization with Chart.js and Leaflet</li>
          <li>Responsive web design</li>
          <li>API integration and data handling</li>
          <li>Modern UI/UX design principles</li>
        </ul>
        <p>
          Beyond its technical aspects, this project aims to contribute to climate change education 
          and awareness by making complex climate data more accessible to the general public.
        </p>
      </section>

      <section className="about-section contact-section">
        <h2>Contact & Contribute</h2>
        <p>
          This project is open-source and welcomes contributions. If you'd like to contribute, 
          report issues, or suggest improvements, please visit the GitHub repository.
        </p>
        <div className="contact-buttons">
          <a href="https://github.com/pm-asit-sahoo/climate-dashboard" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            GitHub Repository
          </a>
          <a href="https://www.linkedin.com/in/sahooasit/" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
            Connect on LinkedIn
          </a>
          <a href="https://pm-asit-sahoo.github.io/asit-portfolio/" target="_blank" rel="noopener noreferrer" className="btn btn-tertiary">
            Portfolio
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
