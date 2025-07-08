import { useState, useEffect, useCallback } from 'react';
import type { SearchHistoryItem } from '../types/weather';
import { STORAGE_KEYS } from '../constants/api';

export const useSearchHistory = () => {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [recentlyRemoved, setRecentlyRemoved] = useState<SearchHistoryItem | null>(null);

  useEffect(() => {
    const loadHistory = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
        if (stored) {
          const parsedHistory = JSON.parse(stored);
          setHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
        }
      } catch (error) {
        console.warn('Failed to load search history from localStorage:', error);
        setHistory([]);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.warn('Failed to save search history to localStorage:', error);
    }
  }, [history]);

  const addToHistory = useCallback((cityName: string, country: string) => {
    setHistory(prev => {
      const existingIndex = prev.findIndex(
        item => item.cityName.toLowerCase() === cityName.toLowerCase() && 
                item.country === country
      );

      const newItem: SearchHistoryItem = {
        id: `${cityName}-${country}-${Date.now()}`,
        cityName,
        country,
        searchedAt: Date.now(),
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], searchedAt: Date.now() };
        return [updated[existingIndex], ...updated.filter((_, index) => index !== existingIndex)];
      } else {
        return [newItem, ...prev.slice(0, 9)];
      }
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const itemToRemove = prev.find(item => item.id === id);
      if (itemToRemove) {
        setRecentlyRemoved(itemToRemove);
        setTimeout(() => setRecentlyRemoved(null), 5000);
      }
      return prev.filter(item => item.id !== id);
    });
  }, []);

  const undoRemove = useCallback(() => {
    if (recentlyRemoved) {
      setHistory(prev => [recentlyRemoved, ...prev]);
      setRecentlyRemoved(null);
    }
  }, [recentlyRemoved]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setRecentlyRemoved(null);
  }, []);

  const getHistoryItem = useCallback((id: string): SearchHistoryItem | undefined => {
    return history.find(item => item.id === id);
  }, [history]);

  return {
    history,
    recentlyRemoved,
    addToHistory,
    removeFromHistory,
    undoRemove,
    clearHistory,
    getHistoryItem,
  };
}; 