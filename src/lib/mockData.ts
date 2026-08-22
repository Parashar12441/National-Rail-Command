export const stations = [
  { id: "NDLS", name: "New Delhi", lat: 28.6429, lng: 77.2191, type: "major" },
  { id: "CSMT", name: "Chhatrapati Shivaji Maharaj Terminus", lat: 18.9398, lng: 72.8354, type: "major" },
  { id: "HWH", name: "Howrah Junction", lat: 22.5839, lng: 88.3433, type: "major" },
  { id: "MAS", name: "Chennai Central", lat: 13.0827, lng: 80.2707, type: "major" },
  { id: "BSB", name: "Varanasi Junction", lat: 25.3340, lng: 82.9858, type: "major" },
  { id: "SBC", name: "KSR Bengaluru", lat: 12.9771, lng: 77.5671, type: "major" },
  { id: "BZA", name: "Vijayawada Junction", lat: 16.5186, lng: 80.6190, type: "hub" },
  { id: "CNB", name: "Kanpur Central", lat: 26.4549, lng: 80.3508, type: "hub" }
];

export const activeTrains = [
  {
    id: "22416",
    name: "Vande Bharat Express",
    type: "Premium",
    source: "NDLS",
    destination: "BSB",
    currentLocation: { lat: 27.5, lng: 79.2 },
    status: "ON_TIME",
    speed: 130,
    delayMinutes: 0
  },
  {
    id: "12951",
    name: "Mumbai Rajdhani",
    type: "Premium",
    source: "CSMT",
    destination: "NDLS",
    currentLocation: { lat: 23.2, lng: 75.8 },
    status: "DELAYED",
    speed: 110,
    delayMinutes: 45
  },
  {
    id: "12301",
    name: "Howrah Rajdhani",
    type: "Premium",
    source: "HWH",
    destination: "NDLS",
    currentLocation: { lat: 25.4, lng: 85.1 },
    status: "ON_TIME",
    speed: 120,
    delayMinutes: 5
  },
  {
    id: "12621",
    name: "Tamil Nadu Express",
    type: "Superfast",
    source: "MAS",
    destination: "NDLS",
    currentLocation: { lat: 17.4, lng: 78.5 },
    status: "DELAYED",
    speed: 95,
    delayMinutes: 120
  }
];

export const generateRandomDelay = () => {
  const isDelayed = Math.random() > 0.6;
  if (!isDelayed) return { delayMinutes: 0, status: "ON_TIME", confidence: 98.5 };
  
  const minutes = Math.floor(Math.random() * 180) + 15;
  return {
    delayMinutes: minutes,
    status: "DELAYED",
    confidence: (Math.random() * 15 + 80).toFixed(1)
  };
};
