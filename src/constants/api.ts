export const API_CONFIG = {
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  ICON_BASE_URL: 'https://openweathermap.org/img/wn',
  API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY || 'your-api-key-here',
  DEFAULT_UNITS: 'metric' as const,
} as const;

export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  CITY_NOT_FOUND: 'City not found. Please check the spelling and try again.',
  API_KEY_INVALID: 'Invalid API key. Please check your configuration.',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

export const STORAGE_KEYS = {
  SEARCH_HISTORY: 'weather-app-search-history',
} as const; 