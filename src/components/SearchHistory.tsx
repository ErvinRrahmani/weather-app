import React from 'react';
import type { SearchHistoryItem } from '../types/weather';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onSelectCity: (cityName: string) => void;
  onRemoveItem: (id: string) => void;
  onUndoRemove?: () => void;
  onClearAll?: () => void;
  canUndo?: boolean;
  loading?: boolean;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({
  history,
  onSelectCity,
  onRemoveItem,
  onUndoRemove,
  onClearAll,
  canUndo = false,
  loading = false
}) => {
  if (history.length === 0 && !canUndo) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Recent Searches</h3>
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
            {history.length} {history.length === 1 ? 'city' : 'cities'}
          </span>
        </div>
        
        {canUndo && onUndoRemove && (
          <button
            onClick={onUndoRemove}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-105"
            aria-label="Undo last removal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="font-medium">Undo</span>
          </button>
        )}
      </div>

      {history.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item) => (
            <div
              key={item.id}
              className={`group relative bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-black/10 transition-all duration-300 ${loading ? 'opacity-75' : 'hover:scale-[1.02]'}`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveItem(item.id);
                }}
                disabled={loading}
                className={`
                  absolute top-3 right-3 z-10 p-2 rounded-full
                  bg-white/90 hover:bg-red-50 border border-gray-200 hover:border-red-200
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200
                  ${loading ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110'}
                `}
                aria-label={`Remove ${item.cityName} from history`}
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>

              <button
                onClick={() => {
                  onSelectCity(item.cityName);
                }}
                disabled={loading}
                className={`
                  w-full text-left p-6
                  transition-all duration-200
                  ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-blue-50/50 active:scale-95'}
                `}
                aria-label={`Search weather for ${item.cityName}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                      {item.cityName}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(item.searchedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}

      {history.length === 0 && !canUndo && (
        <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200/50">
          <div className="max-w-md mx-auto">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No recent searches</h3>
            <p className="text-gray-500">Search for a city to see your history here</p>
          </div>
        </div>
      )}

      {history.length > 0 && onClearAll && (
        <div className="mt-8 text-center">
          <button
            onClick={onClearAll}
            disabled={loading}
            className={`
              text-sm font-medium transition-colors duration-200
              ${loading 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-500 hover:text-red-600 hover:underline'
              }
            `}
            aria-label="Clear all search history"
          >
            Clear all search history
          </button>
        </div>
      )}
    </div>
  );
}; 