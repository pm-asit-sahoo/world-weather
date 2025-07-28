import axios from 'axios';

// Mock data for development purposes
// In a production environment, you would replace these with actual API calls

// Global temperature anomaly data (source: NASA GISS)
const mockTemperatureData = [
  { year: 1880, anomaly: -0.16 },
  { year: 1890, anomaly: -0.35 },
  { year: 1900, anomaly: -0.09 },
  { year: 1910, anomaly: -0.39 },
  { year: 1920, anomaly: -0.27 },
  { year: 1930, anomaly: -0.03 },
  { year: 1940, anomaly: 0.12 },
  { year: 1950, anomaly: -0.02 },
  { year: 1960, anomaly: 0.03 },
  { year: 1970, anomaly: 0.01 },
  { year: 1980, anomaly: 0.27 },
  { year: 1990, anomaly: 0.45 },
  { year: 2000, anomaly: 0.61 },
  { year: 2010, anomaly: 0.82 },
  { year: 2020, anomaly: 1.02 },
  { year: 2022, anomaly: 1.11 },
];

// CO2 concentration data (source: Mauna Loa Observatory)
const mockCO2Data = [
  { year: 1960, ppm: 316.91 },
  { year: 1970, ppm: 325.68 },
  { year: 1980, ppm: 338.75 },
  { year: 1990, ppm: 354.35 },
  { year: 2000, ppm: 369.52 },
  { year: 2010, ppm: 389.85 },
  { year: 2020, ppm: 412.44 },
  { year: 2022, ppm: 417.06 },
];

// Sea level rise data (source: CSIRO)
const mockSeaLevelData = [
  { year: 1880, rise: -120 },
  { year: 1900, rise: -100 },
  { year: 1920, rise: -80 },
  { year: 1940, rise: -60 },
  { year: 1960, rise: -40 },
  { year: 1980, rise: -20 },
  { year: 2000, rise: 0 },
  { year: 2020, rise: 90 },
  { year: 2022, rise: 101 },
];

// Extreme weather events data
const mockExtremeEventsData = [
  {
    id: 1,
    type: 'hurricane',
    name: 'Hurricane Maria',
    location: { lat: 18.2208, lng: -66.5901 },
    date: '2017-09-20',
    description: 'Category 5 hurricane that devastated Puerto Rico',
    impact: 'Over $90 billion in damage, 2,975 deaths',
    intensity: 5
  },
  {
    id: 2,
    type: 'wildfire',
    name: 'California Camp Fire',
    location: { lat: 39.8039, lng: -121.4356 },
    date: '2018-11-08',
    description: 'Most destructive wildfire in California history',
    impact: '85 deaths, 18,804 structures destroyed',
    intensity: 5
  },
  {
    id: 3,
    type: 'flood',
    name: 'Kerala Floods',
    location: { lat: 10.8505, lng: 76.2711 },
    date: '2018-08-08',
    description: 'Severe flooding in the Indian state of Kerala',
    impact: '483 deaths, 140,000 people displaced',
    intensity: 4
  },
  {
    id: 4,
    type: 'drought',
    name: 'Cape Town Water Crisis',
    location: { lat: -33.9249, lng: 18.4241 },
    date: '2018-01-01',
    description: 'Severe water shortage in Cape Town, South Africa',
    impact: 'City nearly ran out of water, severe water restrictions',
    intensity: 4
  },
  {
    id: 5,
    type: 'heatwave',
    name: 'European Heatwave',
    location: { lat: 48.8566, lng: 2.3522 },
    date: '2019-07-25',
    description: 'Record-breaking temperatures across Europe',
    impact: 'Over 2,500 deaths, infrastructure damage',
    intensity: 5
  },
  {
    id: 6,
    type: 'cyclone',
    name: 'Cyclone Idai',
    location: { lat: -19.8335, lng: 34.8888 },
    date: '2019-03-15',
    description: 'Tropical cyclone that hit Mozambique, Zimbabwe, and Malawi',
    impact: 'Over 1,000 deaths, $2 billion in damages',
    intensity: 4
  },
  {
    id: 7,
    type: 'tornado',
    name: 'Nashville Tornado',
    location: { lat: 36.1627, lng: -86.7816 },
    date: '2020-03-03',
    description: 'EF3 tornado that struck Nashville, Tennessee',
    impact: '25 deaths, 309 injuries, $1.5 billion in damages',
    intensity: 3
  },
  {
    id: 8,
    type: 'hurricane',
    name: 'Hurricane Dorian',
    location: { lat: 26.5124, lng: -78.6483 },
    date: '2019-09-01',
    description: 'Category 5 hurricane that devastated the Bahamas',
    impact: '84 deaths, $3.4 billion in damages',
    intensity: 5
  }
];

// Function to fetch global temperature data
export const fetchGlobalTemperature = async () => {
  // In a real application, you would fetch from an actual API
  // For example:
  // const response = await axios.get('https://api.example.com/climate/temperature');
  // return response.data;
  
  // For now, we'll return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemperatureData);
    }, 800);
  });
};

// Function to fetch CO2 concentration data
export const fetchCO2Data = async () => {
  // In a real application, you would fetch from an actual API
  // For example:
  // const response = await axios.get('https://api.example.com/climate/co2');
  // return response.data;
  
  // For now, we'll return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCO2Data);
    }, 600);
  });
};

// Function to fetch sea level rise data
export const fetchSeaLevelData = async () => {
  // In a real application, you would fetch from an actual API
  // For example:
  // const response = await axios.get('https://api.example.com/climate/sealevel');
  // return response.data;
  
  // For now, we'll return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockSeaLevelData);
    }, 700);
  });
};

// Function to fetch extreme weather events data
export const fetchExtremeEvents = async () => {
  // In a real application, you would fetch from an actual API
  // For example:
  // const response = await axios.get('https://api.example.com/climate/extremes');
  // return response.data;
  
  // For now, we'll return mock data with a simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockExtremeEventsData);
    }, 900);
  });
};

// Function to fetch climate data by country
export const fetchCountryData = async (countryCode) => {
  // In a real application, you would fetch from an actual API
  // For example:
  // const response = await axios.get(`https://api.example.com/climate/country/${countryCode}`);
  // return response.data;
  
  // For now, we'll return mock data with a simulated delay
  const mockCountryData = {
    temperature: {
      current: 1.2,
      projected2050: 2.4,
      projected2100: 4.1
    },
    precipitation: {
      change: -5.2,
      droughtRisk: 'High',
      floodRisk: 'Medium'
    },
    vulnerabilityIndex: 0.65,
    co2Emissions: 8.5, // tons per capita
    renewableEnergy: 12.3, // percentage of total energy
  };
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCountryData);
    }, 800);
  });
};

// Function to fetch climate policy data
export const fetchClimatePolicies = async () => {
  // In a real application, you would fetch from an actual API
  // For example:
  // const response = await axios.get('https://api.example.com/climate/policies');
  // return response.data;
  
  // For now, we'll return mock data with a simulated delay
  const mockPolicyData = [
    {
      id: 1,
      name: 'Paris Agreement',
      year: 2015,
      description: 'International treaty on climate change mitigation',
      signatories: 196,
      goal: 'Limit global warming to well below 2°C above pre-industrial levels'
    },
    {
      id: 2,
      name: 'Kyoto Protocol',
      year: 1997,
      description: 'International treaty on reducing greenhouse gas emissions',
      signatories: 192,
      goal: 'Reduce greenhouse gas emissions by 5% from 1990 levels'
    },
    {
      id: 3,
      name: 'European Green Deal',
      year: 2019,
      description: 'EU initiative to become climate neutral',
      signatories: 27,
      goal: 'Make Europe climate neutral by 2050'
    }
  ];
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPolicyData);
    }, 700);
  });
};
