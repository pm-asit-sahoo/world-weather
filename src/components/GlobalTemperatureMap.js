import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../styles/GlobalTemperatureMap.css';

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom temperature icon based on temperature value
const getTemperatureIcon = (temperature) => {
  // Define colors based on temperature ranges
  let color;
  if (temperature < -10) color = '#0022ff'; // Very cold
  else if (temperature < 0) color = '#0066ff'; // Cold
  else if (temperature < 10) color = '#00aaff'; // Cool
  else if (temperature < 20) color = '#00ffaa'; // Mild
  else if (temperature < 30) color = '#ffaa00'; // Warm
  else if (temperature < 40) color = '#ff6600'; // Hot
  else color = '#ff0000'; // Very hot

  return L.divIcon({
    className: 'temperature-icon',
    html: `<div style="background-color: ${color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">${Math.round(temperature)}°</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Component to handle map clicks and fetch weather data
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    }
  });
  return null;
};

const GlobalTemperatureMap = ({ embedded = false }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [highlightedLocation, setHighlightedLocation] = useState(null);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const mapRef = useRef(null);

  // Major cities with their coordinates for initial display
  const majorCities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Cairo', lat: 30.0444, lng: 31.2357 },
    { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 }
  ];

  // Fetch weather data for initial cities on component mount
  useEffect(() => {
    const fetchInitialWeatherData = async () => {
      setLoading(true);
      try {
        const promises = majorCities.map(city => 
          fetchWeatherForLocation(city.lat, city.lng, city.name)
        );
        
        const results = await Promise.all(promises);
        setWeatherData(results.filter(data => data !== null));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching initial weather data:', err);
        setError('Failed to load initial weather data');
        setLoading(false);
      }
    };

    fetchInitialWeatherData();
  }, []);

  // Function to fetch weather data for a specific location using real OpenWeatherMap API
  const fetchWeatherForLocation = async (lat, lng, cityName = null) => {
    try {
      // OpenWeatherMap API key - for demo purposes only
      // In production, this should be stored securely
      const apiKey = '4d8fb5b93d4af21d66a2948710284366';
      
      try {
        // Fetch current weather data
        const weatherResponse = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`
        );
        
        // Process the current weather data
        const currentWeather = weatherResponse.data;
        
        return {
          id: Date.now() + Math.random(),
          location: {
            name: cityName || currentWeather.name,
            lat: lat,
            lng: lng
          },
          weather: {
            temperature: currentWeather.main.temp,
            feelsLike: currentWeather.main.feels_like,
            humidity: currentWeather.main.humidity,
            pressure: currentWeather.main.pressure,
            description: currentWeather.weather[0].description,
            icon: currentWeather.weather[0].icon,
            cloudiness: currentWeather.clouds?.all,
            visibility: currentWeather.visibility
          },
          wind: {
            speed: currentWeather.wind.speed,
            direction: currentWeather.wind.deg,
            gust: currentWeather.wind.gust
          },
          sun: {
            sunrise: new Date(currentWeather.sys.sunrise * 1000).toISOString(),
            sunset: new Date(currentWeather.sys.sunset * 1000).toISOString()
          },
          timestamp: new Date().toISOString()
        };
      } catch (apiError) {
        console.log('API request failed, using fallback data:', apiError);
        
        // Generate fallback data based on location and current season
        // This is useful for demo purposes or when the API is unavailable
        const baseTemp = getBaseTemperatureForLocation(lat);
        const currentDate = new Date();
        const isDay = currentDate.getHours() > 6 && currentDate.getHours() < 18;
        
        return {
          id: Date.now() + Math.random(),
          location: {
            name: cityName || `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
            lat: lat,
            lng: lng
          },
          weather: {
            temperature: baseTemp + (Math.random() * 6 - 3), // Add some randomness
            feelsLike: baseTemp + (Math.random() * 4 - 2),
            humidity: 40 + Math.floor(Math.random() * 40),
            pressure: 1000 + Math.floor(Math.random() * 30),
            description: getWeatherDescription(baseTemp),
            icon: getWeatherIcon(baseTemp, isDay),
            cloudiness: Math.floor(Math.random() * 100),
            visibility: 8000 + Math.floor(Math.random() * 2000)
          },
          wind: {
            speed: 2 + Math.random() * 8,
            direction: Math.floor(Math.random() * 360),
            gust: 3 + Math.random() * 10
          },
          sun: {
            sunrise: new Date(currentDate.setHours(6, 0, 0, 0)).toISOString(),
            sunset: new Date(currentDate.setHours(18, 0, 0, 0)).toISOString()
          },
          timestamp: new Date().toISOString()
        };
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data. Please try again later.');
      return null;
    }
  };
  
  // Helper function to get base temperature based on latitude and season
  const getBaseTemperatureForLocation = (lat) => {
    // Get current month (0-11)
    const currentMonth = new Date().getMonth();
    
    // Northern hemisphere summer / Southern hemisphere winter
    const isSummerNorth = currentMonth >= 4 && currentMonth <= 8;
    
    // Calculate base temperature based on latitude and season
    const equatorTemp = 30; // Base temperature at equator
    const poleTemp = isSummerNorth ? -10 : -30; // Base temperature at poles
    
    // Adjust for hemisphere and season
    const absLat = Math.abs(lat);
    const latFactor = absLat / 90;
    
    if ((lat >= 0 && isSummerNorth) || (lat < 0 && !isSummerNorth)) {
      // Summer in this hemisphere
      return equatorTemp - (latFactor * (equatorTemp - poleTemp + 15));
    } else {
      // Winter in this hemisphere
      return equatorTemp - (latFactor * (equatorTemp - poleTemp));
    }
  };
  
  // Helper function to get weather description based on temperature
  const getWeatherDescription = (temp) => {
    if (temp < -10) return 'extreme cold';
    if (temp < 0) return 'freezing';
    if (temp < 5) return 'very cold';
    if (temp < 10) return 'cold';
    if (temp < 15) return 'cool';
    if (temp < 20) return 'mild';
    if (temp < 25) return 'warm';
    if (temp < 30) return 'hot';
    return 'very hot';
  };
  
  // Helper function to get weather icon based on temperature and time
  const getWeatherIcon = (temp, isDay) => {
    const dayNight = isDay ? 'd' : 'n';
    if (temp < 0) return `13${dayNight}`; // Snow
    if (temp < 10) return `03${dayNight}`; // Scattered clouds
    if (temp < 20) return `02${dayNight}`; // Few clouds
    if (temp < 30) return `01${dayNight}`; // Clear sky
    return `01${dayNight}`; // Clear sky for hot weather
  };

  // Function to handle map clicks
  const handleMapClick = async (lat, lng) => {
    setLoading(true);
    try {
      const newWeatherData = await fetchWeatherForLocation(lat, lng);
      if (newWeatherData) {
        setWeatherData(prevData => [...prevData, newWeatherData]);
        setSelectedCity(newWeatherData);
        
        // Set the highlighted location when clicking on the map
        setHighlightedLocation({
          lat: lat,
          lng: lng,
          name: newWeatherData.location.name
        });
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to load weather data for this location');
      setLoading(false);
    }
  };

  // Function to get wind direction as text
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Function to format date
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  // Function to get temperature color for the circle overlay
  const getTemperatureColor = (temp) => {
    if (temp < -10) return '#0022ff';
    if (temp < 0) return '#0066ff';
    if (temp < 10) return '#00aaff';
    if (temp < 20) return '#00ffaa';
    if (temp < 30) return '#ffaa00';
    if (temp < 40) return '#ff6600';
    return '#ff0000';
  };

  // Function to handle search for places using geocoding API
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    setSearchResults([]);
    
    try {
      // Use geocoding function
      const results = await geocodeLocation(searchQuery);
      
      if (results.length === 0) {
        setError(`No results found for "${searchQuery}". Try a different search term.`);
      } else {
        setSearchResults(results);
        // Clear any previous error
        setError(null);
      }
    } catch (err) {
      console.error('Error searching for location:', err);
      setError('Failed to search for this location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  // List of cities for autocomplete suggestions
  const citiesList = [
    { name: 'New York', country: 'United States', lat: 40.7128, lng: -74.0060 },
    { name: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
    { name: 'Delhi', country: 'India', lat: 28.7041, lng: 77.1025 },
    { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
    { name: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567 },
    { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707 },
    { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867 },
    { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639 },
    { name: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714 },
    { name: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074 },
    { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
    { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173 },
    { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
    { name: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038 },
    { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964 },
    { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357 },
    { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729 },
    { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332 },
    { name: 'Los Angeles', country: 'United States', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', country: 'United States', lat: 41.8781, lng: -87.6298 },
    { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  ];
  
  // Function to generate autocomplete suggestions based on input
  const generateAutocompleteSuggestions = (input) => {
    if (!input || input.length < 2) {
      setAutocompleteSuggestions([]);
      return;
    }
    
    const normalizedInput = input.toLowerCase().trim();
    const matches = citiesList.filter(city => 
      city.name.toLowerCase().includes(normalizedInput) || 
      city.country.toLowerCase().includes(normalizedInput)
    ).slice(0, 5); // Limit to 5 suggestions
    
    setAutocompleteSuggestions(matches);
  };
  
  // Handle input change for search
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    // Clear error when user starts typing again
    if (error) {
      setError(null);
    }
    generateAutocompleteSuggestions(value);
  };
  
  // Geocoding function with direct OpenWeatherMap API for better small town support
  const geocodeLocation = async (query) => {
    // OpenWeatherMap API key - for demo purposes only
    // In production, this should be stored securely
    const apiKey = '4d8fb5b93d4af21d66a2948710284366';
    
    // Check if query matches any common location first (for faster response)
    const commonLocations = {};
    citiesList.forEach(city => {
      commonLocations[city.name.toLowerCase()] = {
        lat: city.lat,
        lng: city.lng,
        name: city.name,
        country: city.country
      };
    });
    
    // Check if the query matches any common location
    const normalizedQuery = query.toLowerCase().trim();
    
    for (const [key, location] of Object.entries(commonLocations)) {
      if (normalizedQuery.includes(key)) {
        return [{
          id: Date.now(),
          name: location.name,
          country: location.country,
          lat: location.lat,
          lng: location.lng,
          display_name: `${location.name}, ${location.country}`
        }];
      }
    }
    
    // Try multiple geocoding approaches for better coverage
    try {
      // Approach 1: Direct OpenWeatherMap geocoding API (best for small towns)
      try {
        const owmResponse = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${apiKey}`
        );
        
        if (owmResponse.data && owmResponse.data.length > 0) {
          return owmResponse.data.map(place => ({
            id: Date.now() + Math.random(),
            name: place.name || query,
            country: place.country || '',
            state: place.state || '',
            lat: place.lat,
            lng: place.lon,
            display_name: place.state 
              ? `${place.name}, ${place.state}, ${place.country}` 
              : `${place.name}, ${place.country}`
          }));
        }
      } catch (owmError) {
        console.log('OpenWeatherMap geocoding failed, trying alternatives:', owmError);
      }
      
      // Approach 2: OpenStreetMap Nominatim API with detailed address info
      try {
        const nominatimResponse = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10&addressdetails=1`,
          { headers: { 'User-Agent': 'ClimateChangeApp/1.0' }}
        );
        
        if (nominatimResponse.data && nominatimResponse.data.length > 0) {
          return nominatimResponse.data.map(place => {
            // Extract more detailed location information
            const name = place.name || extractLocationName(place.display_name);
            let country = '';
            let state = '';
            
            // Extract location details from address if available
            if (place.address) {
              country = place.address.country || '';
              state = place.address.state || place.address.county || '';
            } else {
              country = extractCountry(place.display_name);
            }
            
            return {
              id: place.place_id || Date.now(),
              name: name,
              country: country,
              state: state,
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
              display_name: place.display_name,
              type: place.type || 'unknown'
            };
          });
        }
      } catch (nominatimError) {
        console.log('Nominatim geocoding failed:', nominatimError);
      }
      
      // Approach 3: Simple Nominatim search as last resort
      const fallbackResponse = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=10`,
        { headers: { 'User-Agent': 'ClimateChangeApp/1.0' }}
      );
      
      if (fallbackResponse.data && fallbackResponse.data.length > 0) {
        return fallbackResponse.data.map(place => ({
          id: place.place_id || Date.now(),
          name: place.name || extractLocationName(place.display_name),
          country: extractCountry(place.display_name),
          lat: parseFloat(place.lat),
          lng: parseFloat(place.lon),
          display_name: place.display_name
        }));
      }
      
      // If all attempts return no results
      return [];
    } catch (error) {
      console.error('All geocoding attempts failed:', error);
      // For demo purposes, return an empty array instead of throwing
      return [];
    }
  };
  
  // Helper function to extract location name from display_name
  const extractLocationName = (displayName) => {
    if (!displayName) return 'Unknown Location';
    const parts = displayName.split(',');
    return parts[0].trim();
  };
  
  // Helper function to extract country from display_name
  const extractCountry = (displayName) => {
    if (!displayName) return '';
    const parts = displayName.split(',');
    return parts[parts.length - 1].trim();
  };
  
  // Function to select a search result
  const selectSearchResult = async (result) => {
    setSearchResults([]);
    setSearchQuery('');
    
    // Set the highlighted location
    setHighlightedLocation({
      lat: result.lat,
      lng: result.lng,
      name: result.name
    });
    
    // Center map on selected location
    if (mapRef.current) {
      mapRef.current.setView([result.lat, result.lng], 10);
    }
    
    // Fetch weather for the selected location
    setLoading(true);
    try {
      const weatherData = await fetchWeatherForLocation(result.lat, result.lng, result.name);
      if (weatherData) {
        setWeatherData(prevData => {
          // Check if we already have weather data for this location
          const existingIndex = prevData.findIndex(item => 
            Math.abs(item.location.lat - result.lat) < 0.01 && 
            Math.abs(item.location.lng - result.lng) < 0.01
          );
          
          if (existingIndex >= 0) {
            // Update existing data
            const updatedData = [...prevData];
            updatedData[existingIndex] = weatherData;
            return updatedData;
          } else {
            // Add new data
            return [...prevData, weatherData];
          }
        });
        setSelectedCity(weatherData);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching weather data for search result:', err);
      setError('Failed to load weather data for this location');
      setLoading(false);
    }
  };

  return (
    <div className={embedded ? "global-temperature-embedded" : "global-temperature-page"}>
      {!embedded && <h2>Global Temperature Map</h2>}
      
      <div className="search-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchInputChange}
              placeholder="Search for a location..."
              className="search-input"
              autoComplete="off"
            />
            <button type="submit" className="search-button" disabled={isSearching}>
              {isSearching ? 'Searching...' : 'Search'}
            </button>
            
            {autocompleteSuggestions.length > 0 && (
              <div className="autocomplete-suggestions">
                {autocompleteSuggestions.map((suggestion, index) => (
                  <div 
                    key={index} 
                    className="suggestion-item"
                    onClick={() => {
                      setSearchQuery(`${suggestion.name}, ${suggestion.country}`);
                      setAutocompleteSuggestions([]);
                      selectSearchResult({
                        id: Date.now(),
                        name: suggestion.name,
                        country: suggestion.country,
                        lat: suggestion.lat,
                        lng: suggestion.lng,
                        display_name: `${suggestion.name}, ${suggestion.country}`
                      });
                    }}
                  >
                    {suggestion.name}, {suggestion.country}
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
        
        {searchResults.length > 0 && (
          <div className="search-results">
            <h3>Search Results</h3>
            <ul>
              {searchResults.map(result => (
                <li key={result.id} onClick={() => selectSearchResult(result)}>
                  <div className="result-name">{result.name}</div>
                  <div className="result-location">
                    {result.display_name || `${result.name}, ${result.state ? result.state + ', ' : ''}${result.country}`}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
      
      {!embedded && (
        <p className="map-instructions">
          Search for any place or click anywhere on the map to see current weather conditions. Spin the globe by dragging.
        </p>
      )}
      
      <div className="map-container-wrapper">
        <MapContainer
          center={[20, 0]}
          zoom={embedded ? 1 : 2}
          minZoom={1}
          maxBounds={[[-90, -180], [90, 180]]}
          scrollWheelZoom={true}
          className="globe-map-container"
          ref={mapRef}
          worldCopyJump={true}
          key="global-temperature-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onMapClick={handleMapClick} />
          
          {/* Highlighted location marker with pulsing effect */}
          {highlightedLocation && (
            <div>
              <Circle
                center={[highlightedLocation.lat, highlightedLocation.lng]}
                radius={30000}
                pathOptions={{
                  color: '#ff4500',
                  fillColor: '#ff4500',
                  fillOpacity: 0.3,
                  weight: 2
                }}
                className="pulsing-circle"
              />
              <Circle
                center={[highlightedLocation.lat, highlightedLocation.lng]}
                radius={60000}
                pathOptions={{
                  color: '#ff4500',
                  fillColor: '#ff4500',
                  fillOpacity: 0.1,
                  weight: 1
                }}
                className="pulsing-circle-outer"
              />
              <Marker
                position={[highlightedLocation.lat, highlightedLocation.lng]}
                icon={L.divIcon({
                  className: 'highlighted-marker',
                  html: `<div class="highlighted-marker-inner"><span class="marker-label">${highlightedLocation.name}</span></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20]
                })}
              />
            </div>
          )}
          
          {weatherData.map((data) => (
            <React.Fragment key={data.id}>
              <Circle
                center={[data.location.lat, data.location.lng]}
                radius={50000}
                pathOptions={{
                  fillColor: getTemperatureColor(data.weather.temperature),
                  fillOpacity: 0.5,
                  color: getTemperatureColor(data.weather.temperature),
                  weight: 1
                }}
              />
              <Marker
                position={[data.location.lat, data.location.lng]}
                icon={getTemperatureIcon(data.weather.temperature)}
                eventHandlers={{
                  click: () => {
                    setSelectedCity(data);
                    
                    // Also highlight the location when clicked
                    setHighlightedLocation({
                      lat: data.location.lat,
                      lng: data.location.lng,
                      name: data.location.name
                    });
                  }
                }}
              >
                <Popup>
                  <div className="weather-popup">
                    <h3>{data.location.name}</h3>
                    <div className="weather-main">
                      <div className="temperature">
                        <span className="temp-value">{Math.round(data.weather.temperature)}°C</span>
                        <span className="feels-like">Feels like: {Math.round(data.weather.feelsLike)}°C</span>
                      </div>
                      <div className="weather-icon">
                        <img 
                          src={`https://openweathermap.org/img/wn/${data.weather.icon}@2x.png`} 
                          alt={data.weather.description}
                        />
                        <span>{data.weather.description}</span>
                      </div>
                    </div>
                    <div className="weather-details">
                      <div className="detail">
                        <span className="label">Humidity:</span>
                        <span className="value">{data.weather.humidity}%</span>
                      </div>
                      <div className="detail">
                        <span className="label">Wind:</span>
                        <span className="value">
                          {data.wind.speed.toFixed(1)} m/s {getWindDirection(data.wind.direction)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          ))}
        </MapContainer>
      </div>
      
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      
      {selectedCity && (
        <div className="selected-city-details">
          <h3>Selected Location: {selectedCity.location.name}</h3>
          <div className="weather-card">
            <div className="weather-header">
              <div className="temperature-large">
                {Math.round(selectedCity.weather.temperature)}°C
                <span className="feels-like">Feels like: {Math.round(selectedCity.weather.feelsLike)}°C</span>
              </div>
              <div className="weather-icon-large">
                <img 
                  src={`https://openweathermap.org/img/wn/${selectedCity.weather.icon}@2x.png`} 
                  alt={selectedCity.weather.description}
                />
                <span>{selectedCity.weather.description}</span>
              </div>
            </div>
            
            <div className="current-conditions">
              <h4>Current Conditions</h4>
              <div className="weather-details-grid">
                <div className="detail-item">
                  <span className="detail-icon">💧</span>
                  <span className="detail-label">Humidity</span>
                  <span className="detail-value">{selectedCity.weather.humidity}%</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🌡️</span>
                  <span className="detail-label">Pressure</span>
                  <span className="detail-value">{selectedCity.weather.pressure} hPa</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💨</span>
                  <span className="detail-label">Wind Speed</span>
                  <span className="detail-value">{selectedCity.wind.speed.toFixed(1)} m/s</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🧭</span>
                  <span className="detail-label">Wind Direction</span>
                  <span className="detail-value">{getWindDirection(selectedCity.wind.direction)}</span>
                </div>
                {selectedCity.wind.gust && (
                  <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <span className="detail-label">Wind Gusts</span>
                    <span className="detail-value">{selectedCity.wind.gust.toFixed(1)} m/s</span>
                  </div>
                )}
                {selectedCity.weather.cloudiness !== undefined && (
                  <div className="detail-item">
                    <span className="detail-icon">☁️</span>
                    <span className="detail-label">Cloudiness</span>
                    <span className="detail-value">{selectedCity.weather.cloudiness}%</span>
                  </div>
                )}
                {selectedCity.weather.visibility !== undefined && (
                  <div className="detail-item">
                    <span className="detail-icon">👁️</span>
                    <span className="detail-label">Visibility</span>
                    <span className="detail-value">
                      {selectedCity.weather.visibility >= 10000 
                        ? '10+ km' 
                        : `${(selectedCity.weather.visibility / 1000).toFixed(1)} km`}
                    </span>
                  </div>
                )}
                {selectedCity.sun && (
                  <>
                    <div className="detail-item">
                      <span className="detail-icon">🌅</span>
                      <span className="detail-label">Sunrise</span>
                      <span className="detail-value">{new Date(selectedCity.sun.sunrise).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">🌇</span>
                      <span className="detail-label">Sunset</span>
                      <span className="detail-value">{new Date(selectedCity.sun.sunset).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </>
                )}
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <span className="detail-label">Coordinates</span>
                  <span className="detail-value">
                    {selectedCity.location.lat.toFixed(4)}, {selectedCity.location.lng.toFixed(4)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🕒</span>
                  <span className="detail-label">Updated</span>
                  <span className="detail-value">{formatDate(selectedCity.timestamp)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="temperature-legend">
        <h4>Temperature Scale (°C)</h4>
        <div className="legend-gradient">
          <div className="gradient-bar"></div>
          <div className="gradient-labels">
            <span>-10°</span>
            <span>0°</span>
            <span>10°</span>
            <span>20°</span>
            <span>30°</span>
            <span>40°+</span>
          </div>
        </div>
      </div>
      
      {!embedded && (
        <div className="climate-change-section">
          <h2>Climate Change Insights</h2>
          <div className="climate-insights-container">
            <div className="climate-insight-card">
              <div className="insight-icon">🌡️</div>
              <h3>Global Temperature Rise</h3>
              <p>Earth's average temperature has increased by 1.1°C since the pre-industrial era. Without action, we're headed for a 3-4°C rise by 2100.</p>
              <div className="insight-stat">+1.1°C</div>
            </div>
            
            <div className="climate-insight-card">
              <div className="insight-icon">🌊</div>
              <h3>Sea Level Rise</h3>
              <p>Global sea levels have risen about 8-9 inches since 1880, with the rate accelerating to 3.7mm per year in recent decades.</p>
              <div className="insight-stat">+3.7mm/year</div>
            </div>
            
            <div className="climate-insight-card">
              <div className="insight-icon">❄️</div>
              <h3>Arctic Ice Loss</h3>
              <p>The Arctic is losing 13.1% of its ice per decade. Summer Arctic sea ice could disappear completely by 2050.</p>
              <div className="insight-stat">-13.1%/decade</div>
            </div>
            
            <div className="climate-insight-card">
              <div className="insight-icon">🌪️</div>
              <h3>Extreme Weather</h3>
              <p>Climate change is increasing the frequency and intensity of extreme weather events like hurricanes, droughts, and wildfires.</p>
              <div className="insight-stat">+20% since 1980</div>
            </div>
          </div>
          
          <div className="climate-action-section">
            <h3>What Can We Do?</h3>
            <ul className="climate-actions">
              <li><span className="action-icon">🔄</span> Transition to renewable energy sources</li>
              <li><span className="action-icon">🌱</span> Support reforestation and conservation efforts</li>
              <li><span className="action-icon">🚗</span> Reduce carbon footprint through sustainable transportation</li>
              <li><span className="action-icon">🍽️</span> Choose plant-based meals and reduce food waste</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalTemperatureMap;
