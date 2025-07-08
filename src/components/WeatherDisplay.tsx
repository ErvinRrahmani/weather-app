import React from 'react';
import type { WeatherData } from '../types/weather';
import { 
  formatTemperature, 
  formatWindSpeed, 
  capitalizeWords, 
  getWeatherIconUrl,
  formatDateTime,
  convertTemperature,
  getTemperatureUnit
} from '../utils/weatherUtils';

interface WeatherDisplayProps {
  weatherData: WeatherData;
  onRefresh?: () => void;
  loading?: boolean;
  temperatureUnit?: 'C' | 'F';
  onToggleTemperatureUnit?: () => void;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ 
  weatherData, 
  onRefresh,
  loading = false,
  temperatureUnit = 'C',
  onToggleTemperatureUnit
}) => {
  const {
    cityName,
    temperature,
    description,
    minTemp,
    maxTemp,
    windSpeed,
    humidity,
    icon,
    timestamp
  } = weatherData;


  const displayTemp = convertTemperature(temperature, 'C', temperatureUnit);
  const displayMinTemp = convertTemperature(minTemp, 'C', temperatureUnit);
  const displayMaxTemp = convertTemperature(maxTemp, 'C', temperatureUnit);
  const displayFeelsLike = convertTemperature(
    Math.round(temperature + (humidity > 80 ? 2 : humidity < 30 ? -2 : 0)), 
    'C', 
    temperatureUnit
  );
  const tempUnit = getTemperatureUnit(temperatureUnit);

  const getWeatherGradient = (desc: string, temp: number) => {
    const lowerDesc = desc.toLowerCase();
    if (lowerDesc.includes('clear') || lowerDesc.includes('sunny')) {
      return 'from-amber-400 via-orange-500 to-yellow-600';
    } else if (lowerDesc.includes('cloud')) {
      return 'from-slate-400 via-slate-500 to-slate-600';
    } else if (lowerDesc.includes('rain') || lowerDesc.includes('drizzle')) {
      return 'from-blue-500 via-blue-600 to-indigo-700';
    } else if (lowerDesc.includes('snow')) {
      return 'from-slate-300 via-slate-400 to-slate-500';
    } else if (lowerDesc.includes('thunder')) {
      return 'from-purple-600 via-purple-700 to-indigo-800';
    } else if (temp > 25) {
      return 'from-red-400 via-pink-500 to-purple-600';
    } else if (temp < 10) {
      return 'from-blue-400 via-cyan-500 to-teal-600';
    } else {
      return 'from-emerald-400 via-teal-500 to-cyan-600';
    }
  };

  const gradientClass = getWeatherGradient(description, temperature);

  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} p-8 text-white shadow-2xl backdrop-blur-sm`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10"></div>
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/5"></div>
        <div className="absolute top-1/2 right-1/4 h-24 w-24 rounded-full bg-white/5"></div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-white/60 text-sm">{dateString}</p>
              <p className="text-white/60 text-sm">{timeString}</p>
            </div>
            <div className="flex items-center space-x-3">
              {onToggleTemperatureUnit && (
                <button
                  onClick={onToggleTemperatureUnit}
                  disabled={loading}
                  className={`
                    w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                    transition-all duration-200 hover:bg-white/30 hover:scale-105
                    flex items-center justify-center
                    ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                  aria-label={`Switch to ${temperatureUnit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
                >
                  <span className="text-white text-lg font-bold">
                    {temperatureUnit}
                  </span>
                </button>
              )}
              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={loading}
                  className={`
                    w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                    transition-all duration-200 hover:bg-white/30 hover:scale-105
                    flex items-center justify-center
                    ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  `}
                  aria-label="Refresh weather data"
                >
                  <svg 
                    className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">{cityName}</h2>
            <div className="flex items-baseline justify-center mb-6">
              <span className="text-7xl font-thin text-white">
                {displayTemp}
              </span>
              <span className="text-3xl font-light text-white/80 ml-2">{tempUnit}</span>
            </div>
            <div className="flex justify-center items-center space-x-4">
              <img
                src={getWeatherIconUrl(icon)}
                alt={description}
                className="w-16 h-16 drop-shadow-lg"
              />
              <p className="text-white/90 text-xl font-medium capitalize">
                {capitalizeWords(description)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-8 bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/30">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-300"></div>
                <span className="text-white/90 text-sm font-medium">High</span>
                <span className="text-white font-semibold text-lg">{formatTemperature(displayMaxTemp, tempUnit)}</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-300"></div>
                <span className="text-white/90 text-sm font-medium">Low</span>
                <span className="text-white font-semibold text-lg">{formatTemperature(displayMinTemp, tempUnit)}</span>
              </div>
              <div className="w-px h-8 bg-white/30"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-300"></div>
                <span className="text-white/90 text-sm font-medium">Feels like</span>
                <span className="text-white font-semibold text-lg">{displayFeelsLike}{tempUnit}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">Humidity</p>
                  <p className="text-white text-xl font-semibold">{humidity}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">Wind Speed</p>
                  <p className="text-white text-xl font-semibold">{formatWindSpeed(windSpeed)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">Pressure</p>
                  <p className="text-white text-xl font-semibold">1013 hPa</p>
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-white/70 text-xs font-medium">Visibility</p>
                  <p className="text-white text-xl font-semibold">10 km</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">UV Index</p>
                    <p className="text-white text-2xl font-semibold">5</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-yellow-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Moderate
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/20 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm font-medium">Air Quality</p>
                    <p className="text-white text-2xl font-semibold">Good</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-green-500/80 text-white px-3 py-1 rounded-full text-sm font-medium">
                    AQI 42
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Last updated: {formatDateTime(timestamp)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 