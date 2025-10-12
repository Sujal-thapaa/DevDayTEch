// Google Maps Configuration
// 
// IMPORTANT: The credentials you provided are OAuth 2.0 credentials (for user authentication)
// For Google Maps, you need a "Maps JavaScript API" key
// 
// To get a Maps API key:
// 1. Go to https://console.cloud.google.com/google/maps-apis
// 2. Enable "Maps JavaScript API"
// 3. Go to Credentials and create an API key
// 4. Replace the placeholder below with your API key
//
// For development, you can temporarily use a restricted API key

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBKF4gRJ027u1aOTMVQPM32AFXYrfEpLC0';

// Note: Never commit real API keys to version control
// Use environment variables in production

