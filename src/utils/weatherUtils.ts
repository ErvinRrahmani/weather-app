import type { WeatherResponse, WeatherData } from '../types/weather';
import { ERROR_MESSAGES } from '../constants/api';

export const transformWeatherData = (response: WeatherResponse): WeatherData => {
  const weather = response.weather[0];
  
  return {
    id: `${response.id}-${Date.now()}`,
    cityName: response.name,
    country: response.sys.country,
    temperature: Math.round(response.main.temp),
    description: weather.description,
    minTemp: Math.round(response.main.temp_min),
    maxTemp: Math.round(response.main.temp_max),
    windSpeed: response.wind.speed,
    humidity: response.main.humidity,
    icon: weather.icon,
    timestamp: Date.now(),
  };
};

export const formatTemperature = (temp: number, unit: string = '°C'): string => {
  return `${temp}${unit}`;
};

export const convertCelsiusToFahrenheit = (celsius: number): number => {
  return Math.round((celsius * 9/5) + 32);
};

export const convertFahrenheitToCelsius = (fahrenheit: number): number => {
  return Math.round((fahrenheit - 32) * 5/9);
};

export const convertTemperature = (temp: number, fromUnit: 'C' | 'F', toUnit: 'C' | 'F'): number => {
  if (fromUnit === toUnit) return temp;
  
  if (fromUnit === 'C' && toUnit === 'F') {
    return convertCelsiusToFahrenheit(temp);
  } else if (fromUnit === 'F' && toUnit === 'C') {
    return convertFahrenheitToCelsius(temp);
  }
  
  return temp;
};

export const getTemperatureUnit = (unit: 'C' | 'F'): string => {
  return unit === 'C' ? '°C' : '°F';
};

export const formatWindSpeed = (speed: number, unit: string = 'm/s'): string => {
  return `${speed} ${unit}`;
};

export const capitalizeWords = (str: string): string => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const getWeatherIconUrl = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const mapApiErrorToMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const errorWithResponse = error as { response?: { status: number } };
    if (errorWithResponse.response?.status) {
      switch (errorWithResponse.response.status) {
        case 404:
          return ERROR_MESSAGES.CITY_NOT_FOUND;
        case 401:
          return ERROR_MESSAGES.API_KEY_INVALID;
        case 429:
          return ERROR_MESSAGES.RATE_LIMIT_EXCEEDED;
        default:
          return ERROR_MESSAGES.GENERIC_ERROR;
      }
    }
  }

  if (error && typeof error === 'object' && 'code' in error) {
    const errorWithCode = error as { code?: string };
    if (errorWithCode.code === 'NETWORK_ERROR' || !navigator.onLine) {
      return ERROR_MESSAGES.NETWORK_ERROR;
    }
  }

  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.GENERIC_ERROR;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const errorWithMessage = error as { message?: string };
    return errorWithMessage.message || ERROR_MESSAGES.GENERIC_ERROR;
  }
  
  return ERROR_MESSAGES.GENERIC_ERROR;
};

export const validateCityName = (cityName: string): { isValid: boolean; error?: string } => {
  const trimmed = cityName.trim();
  
  if (!trimmed) {
    return { isValid: false, error: 'City name is required' };
  }
  
  if (trimmed.length < 2) {
    return { isValid: false, error: 'City name must be at least 2 characters long' };
  }
  
  if (trimmed.length > 50) {
    return { isValid: false, error: 'City name must be less than 50 characters' };
  }
  

  const validPattern = /^[\p{L}\s\-'.]+$/u;
  if (!validPattern.test(trimmed)) {
    return { isValid: false, error: 'City name contains invalid characters' };
  }
  
  return { isValid: true };
}; 