import { useState, useCallback } from 'react';
import type { WeatherData, WeatherState } from '../types/weather';
import { weatherService } from '../services/weatherService';
import { validateCityName } from '../utils/weatherUtils';

export const useWeather = () => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchWeather = useCallback(async (cityName: string): Promise<WeatherData> => {
    const validation = validateCityName(cityName);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const weatherData = await weatherService.getCurrentWeather(cityName.trim());
      
      setState({
        data: weatherData,
        loading: false,
        error: null,
      });

      return weatherData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  }, []);

  const clearWeather = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const refetchWeather = useCallback(async () => {
    if (state.data?.cityName) {
      await fetchWeather(state.data.cityName);
    }
  }, [state.data?.cityName, fetchWeather]);

  return {
    ...state,
    fetchWeather,
    clearWeather,
    clearError,
    refetchWeather,
  };
}; 