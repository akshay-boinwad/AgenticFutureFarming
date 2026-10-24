
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export type WeatherData = {
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  weatherCode: number;
};

export type DailyForecast = {
  date: string;
  maxTemperature: number;
  minTemperature: number;
  rainProbability: number;
  precipitation: number;
  weatherCode: number;
};

export async function getCurrentWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
    timezone: 'auto',
  });

  const response = await fetch(`${WEATHER_API}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to fetch current weather.');
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
    windSpeed: data.current.wind_speed_10m,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
  };
}

export async function getSevenDayForecast(
  latitude: number,
  longitude: number
): Promise<DailyForecast[]> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum',
    forecast_days: '7',
    timezone: 'auto',
  });

  const response = await fetch(`${WEATHER_API}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Unable to fetch the weather forecast.');
  }

  const data = await response.json();
  const daily = data.daily;

  if (!daily?.time || !Array.isArray(daily.time)) {
    throw new Error('Weather forecast data is unavailable.');
  }

  return daily.time.map((date: string, index: number) => ({
    date,
    maxTemperature: daily.temperature_2m_max[index],
    minTemperature: daily.temperature_2m_min[index],
    rainProbability:
      daily.precipitation_probability_max[index] ?? 0,
    precipitation: daily.precipitation_sum[index] ?? 0,
    weatherCode: daily.weather_code[index],
  }));
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if ([1, 2].includes(code)) return 'Mainly clear';
  if (code === 3) return 'Overcast';
  if ([45, 48].includes(code)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(code)) return 'Drizzle';
  if ([61, 63, 65, 66, 67].includes(code)) return 'Rain';
  if ([71, 73, 75, 77].includes(code)) return 'Snow';
  if ([80, 81, 82].includes(code)) return 'Rain showers';
  if ([85, 86].includes(code)) return 'Snow showers';
  if ([95, 96, 99].includes(code)) return 'Thunderstorm';

  return 'Conditions unavailable';
}