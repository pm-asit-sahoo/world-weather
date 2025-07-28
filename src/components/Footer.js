import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Climate Dashboard</h3>
            <p className="footer-description">
              Visualizing climate change data to raise awareness and inspire action.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Data Sources</h3>
            <ul className="footer-links">
              <li><a href="https://www.ncei.noaa.gov/" target="_blank" rel="noopener noreferrer">NOAA</a></li>
              <li><a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer">World Bank</a></li>
              <li><a href="https://www.ipcc.ch/data/" target="_blank" rel="noopener noreferrer">IPCC</a></li>
              <li><a href="https://www.nasa.gov/earth/" target="_blank" rel="noopener noreferrer">NASA Earth</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Resources</h3>
            <ul className="footer-links">
              <li><a href="https://climate.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA Climate</a></li>
              <li><a href="https://www.un.org/en/climatechange" target="_blank" rel="noopener noreferrer">UN Climate Action</a></li>
              <li><a href="https://www.ipcc.ch/" target="_blank" rel="noopener noreferrer">IPCC</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-title">Connect</h3>
            <ul className="footer-links">
              <li><a href="https://github.com/pm-asit-sahoo/world-weather" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/sahooasit/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://pm-asit-sahoo.github.io/asit-portfolio/" target="_blank" rel="noopener noreferrer">Portfolio</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">© {currentYear} Climate Dashboard. All rights reserved.</p>
          <p className="attribution">Developed by <a href="https://www.linkedin.com/in/sahooasit/" target="_blank" rel="noopener noreferrer">Asit Sahoo</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
