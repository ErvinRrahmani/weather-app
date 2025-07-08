import { useState } from 'react';
import { SearchForm } from './components/SearchForm';
import { WeatherDisplay } from './components/WeatherDisplay';
import { SearchHistory } from './components/SearchHistory';
import { useWeather } from './hooks/useWeather';
import { useSearchHistory } from './hooks/useSearchHistory';
import './App.css';

function App() {
  const { data: weatherData, loading, error, fetchWeather, clearError } = useWeather();
  const { 
    history, 
    recentlyRemoved, 
    addToHistory, 
    removeFromHistory, 
    undoRemove, 
    clearHistory 
  } = useSearchHistory();
  
  const [searchError, setSearchError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');

  const handleSearch = async (cityName: string) => {
    try {
      setSearchError(null);
      clearError();
      
      const data = await fetchWeather(cityName);
      
      addToHistory(data.cityName, data.country);
    } catch (error) {
      console.error('Search failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      setSearchError(errorMessage);
    }
  };

  const handleSelectFromHistory = (cityName: string) => {
    handleSearch(cityName);
  };

  const handleRefresh = () => {
    if (weatherData) {
      handleSearch(weatherData.cityName);
    }
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="fixed inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10 pointer-events-none"></div>
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 h-full overflow-y-auto">
        <header className="pt-6 pb-4">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Weather Forecast
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get real-time weather information for any city around the world
            </p>
          </div>
        </header>

        <main className="container mx-auto px-4 pb-8">
          <SearchForm 
            onSearch={handleSearch} 
            loading={loading}
          />

          {(searchError || error) && (
            <div className="w-full max-w-2xl mx-auto mb-8 flex justify-center">
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-2xl p-6 shadow-xl shadow-red-500/10 max-w-md w-full">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    Unable to get weather data
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed mb-4">
                    {searchError || error}
                  </p>
                  <button
                    onClick={() => {
                      setSearchError(null);
                      clearError();
                    }}
                    className="inline-flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-colors duration-200"
                    aria-label="Dismiss error"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}

          {weatherData && (
            <WeatherDisplay 
              weatherData={weatherData} 
              onRefresh={handleRefresh}
              loading={loading}
              temperatureUnit={temperatureUnit}
              onToggleTemperatureUnit={toggleTemperatureUnit}
            />
          )}

          <SearchHistory
            history={history}
            onSelectCity={handleSelectFromHistory}
            onRemoveItem={removeFromHistory}
            onUndoRemove={undoRemove}
            onClearAll={clearHistory}
            canUndo={!!recentlyRemoved}
            loading={loading}
          />
        </main>
      </div>
      </div>
  );
}

export default App;
