import React, { useState } from 'react';
import { validateCityName } from '../utils/weatherUtils';

interface SearchFormProps {
  onSearch: (cityName: string) => void;
  loading?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading = false }) => {
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateCityName(cityName);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid city name');
      return;
    }

    setError(null);
    onSearch(cityName.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCityName(value);
    
    if (error) {
      setError(null);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={cityName}
            onChange={handleInputChange}
            placeholder="Enter city name (e.g., London, New York, Tokyo)..."
            className={`
              w-full pl-6 pr-6 py-5 text-lg
              bg-white/95 backdrop-blur-sm
              border-2 rounded-2xl
              shadow-lg shadow-black/5
              transition-all duration-200
              placeholder-gray-400
              focus:outline-none focus:ring-0
              ${error 
                ? 'border-red-300 focus:border-red-500' 
                : 'border-gray-200 focus:border-blue-400 hover:border-gray-300'
              }
            `}
            disabled={loading}
            aria-label="City name input"
            aria-describedby={error ? "search-error" : undefined}
          />
          
          {loading && (
            <div className="absolute inset-y-0 right-0 pr-6 flex items-center">
              <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </div>

        {error && (
          <div 
            id="search-error"
            className="flex items-center space-x-3 text-red-600 bg-red-50 border border-red-200 rounded-xl px-6 py-4"
            role="alert"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !cityName.trim()}
          className={`
            w-full py-5 px-8 text-lg font-semibold rounded-2xl
            transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-blue-500/20
            ${loading || !cityName.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
          aria-label="Search for weather"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-3">
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Searching...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Search Weather</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
}; 