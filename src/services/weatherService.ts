import type { WeatherResponse, WeatherData } from '../types/weather';
import { API_CONFIG, API_ENDPOINTS } from '../constants/api';
import { transformWeatherData, mapApiErrorToMessage } from '../utils/weatherUtils';

export class WeatherService {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string = API_CONFIG.BASE_URL, apiKey: string = API_CONFIG.API_KEY) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  async getCurrentWeather(cityName: string): Promise<WeatherData> {
    try {
      const url = this.buildWeatherUrl(cityName);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw await this.handleApiError(response);
      }

      const data: WeatherResponse = await response.json();
      return transformWeatherData(data);
    } catch (error) {
      throw new Error(mapApiErrorToMessage(error));
    }
  }

  private buildWeatherUrl(cityName: string): string {
    const params = new URLSearchParams({
      q: cityName,
      appid: this.apiKey,
      units: API_CONFIG.DEFAULT_UNITS,
    });

    return `${this.baseUrl}${API_ENDPOINTS.CURRENT_WEATHER}?${params.toString()}`;
  }

  private async handleApiError(response: Response): Promise<Error> {
    let errorMessage = 'Unknown error occurred';
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage) as Error & { response?: { status: number } };
    error.response = { status: response.status };
    return error;
  }
}

export const weatherService = new WeatherService();

export const createWeatherService = (baseUrl?: string, apiKey?: string): WeatherService => {
  return new WeatherService(baseUrl, apiKey);
}; 