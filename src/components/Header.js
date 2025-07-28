import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">🌍</span>
          <span className="logo-text">Climate Dashboard</span>
        </Link>
        
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"} end>
                Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/temperature" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Temperature
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/emissions" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                CO2 Emissions
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/sea-level" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Sea Level
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/extremes" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Extreme Events
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/global-temperature" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                Global Map
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
                About
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
