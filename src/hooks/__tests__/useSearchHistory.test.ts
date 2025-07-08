import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSearchHistory } from '../useSearchHistory';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('useSearchHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with empty history', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.history).toEqual([]);
    expect(result.current.recentlyRemoved).toBeNull();
  });

  it('should load history from localStorage on mount', () => {
    const storedHistory = [
      { id: '1', cityName: 'London', country: 'GB', searchedAt: Date.now() },
      { id: '2', cityName: 'Paris', country: 'FR', searchedAt: Date.now() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedHistory));

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.history).toEqual(storedHistory);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('weather-app-search-history');
  });

  it('should handle corrupted localStorage data gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue('invalid json');
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useSearchHistory());

    expect(result.current.history).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load search history from localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('should add new city to history', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('London', 'GB');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0]).toMatchObject({
      cityName: 'London',
      country: 'GB',
      searchedAt: expect.any(Number),
    });
  });

  it('should move existing city to top when searched again', () => {
    const existingHistory = [
      { id: '1', cityName: 'Paris', country: 'FR', searchedAt: Date.now() - 1000 },
      { id: '2', cityName: 'London', country: 'GB', searchedAt: Date.now() - 2000 },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('London', 'GB');
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].cityName).toBe('London');
    expect(result.current.history[1].cityName).toBe('Paris');
  });

  it('should limit history to 10 items', () => {
    const existingHistory = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      cityName: `City${i}`,
      country: 'US',
      searchedAt: Date.now() - i * 1000,
    }));
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('NewCity', 'US');
    });

    expect(result.current.history).toHaveLength(10);
    expect(result.current.history[0].cityName).toBe('NewCity');
  });

  it('should remove item from history', () => {
    const existingHistory = [
      { id: '1', cityName: 'London', country: 'GB', searchedAt: Date.now() },
      { id: '2', cityName: 'Paris', country: 'FR', searchedAt: Date.now() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.removeFromHistory('1');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.history[0].cityName).toBe('Paris');
    expect(result.current.recentlyRemoved?.cityName).toBe('London');
  });

  it('should clear recently removed after 5 seconds', () => {
    const existingHistory = [
      { id: '1', cityName: 'London', country: 'GB', searchedAt: Date.now() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.removeFromHistory('1');
    });

    expect(result.current.recentlyRemoved?.cityName).toBe('London');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.recentlyRemoved).toBeNull();
  });

  it('should restore recently removed item with undo', () => {
    const existingHistory = [
      { id: '1', cityName: 'London', country: 'GB', searchedAt: Date.now() },
      { id: '2', cityName: 'Paris', country: 'FR', searchedAt: Date.now() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.removeFromHistory('1');
    });

    expect(result.current.history).toHaveLength(1);
    expect(result.current.recentlyRemoved?.cityName).toBe('London');

    act(() => {
      result.current.undoRemove();
    });

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].cityName).toBe('London');
    expect(result.current.recentlyRemoved).toBeNull();
  });

  it('should clear all history', () => {
    const existingHistory = [
      { id: '1', cityName: 'London', country: 'GB', searchedAt: Date.now() },
      { id: '2', cityName: 'Paris', country: 'FR', searchedAt: Date.now() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(result.current.recentlyRemoved).toBeNull();
  });

  it('should find history item by id', () => {
    const existingHistory = [
      { id: '1', cityName: 'London', country: 'GB', searchedAt: Date.now() },
      { id: '2', cityName: 'Paris', country: 'FR', searchedAt: Date.now() },
    ];
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingHistory));

    const { result } = renderHook(() => useSearchHistory());

    const item = result.current.getHistoryItem('1');
    expect(item?.cityName).toBe('London');

    const nonExistentItem = result.current.getHistoryItem('999');
    expect(nonExistentItem).toBeUndefined();
  });

  it('should save history to localStorage when history changes', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    
    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('London', 'GB');
    });

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'weather-app-search-history',
      expect.stringContaining('London')
    );
  });

  it('should handle localStorage setItem errors gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { result } = renderHook(() => useSearchHistory());

    act(() => {
      result.current.addToHistory('London', 'GB');
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to save search history to localStorage:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
}); 