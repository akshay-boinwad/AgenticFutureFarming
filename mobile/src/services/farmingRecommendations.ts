
import type { WeatherData, DailyForecast } from './weather';

export type FarmingRecommendation = {
  id: string;
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  category: 'irrigation' | 'rain' | 'crop-care';
};

export function getFarmingRecommendations(
  weather: WeatherData,
  forecast: DailyForecast[]
): FarmingRecommendation[] {
  const recommendations: FarmingRecommendation[] = [];

  // 1. Irrigation guidance based on current weather
  if (
    weather.temperature >= 35 &&
    weather.precipitation < 1
  ) {
    recommendations.push({
      id: 'irrigation-hot',
      title: 'Check irrigation needs',
      message:
        'High temperatures and little current precipitation may increase water demand. Check soil moisture before irrigating.',
      priority: 'high',
      category: 'irrigation',
    });
  } else if (weather.precipitation >= 5) {
    recommendations.push({
      id: 'irrigation-rain',
      title: 'Review irrigation plans',
      message:
        'Precipitation is currently being reported. Check soil moisture and avoid unnecessary irrigation if the root zone is adequately wet.',
      priority: 'medium',
      category: 'irrigation',
    });
  } else {
    recommendations.push({
      id: 'irrigation-monitor',
      title: 'Monitor soil moisture',
      message:
        'Check soil moisture and crop growth stage before deciding when to irrigate.',
      priority: 'low',
      category: 'irrigation',
    });
  }

  // 2. Rain alerts from the upcoming forecast
  const rainyDays = forecast.filter(
    (day) =>
      day.rainProbability >= 60 ||
      day.precipitation >= 5
  );

  if (rainyDays.length > 0) {
    recommendations.push({
      id: 'rain-alert',
      title: 'Rain expected in the forecast',
      message:
        `${rainyDays.length} day(s) show a higher chance of rain or notable precipitation. Review irrigation, drainage, and planned field activities.`,
      priority: 'medium',
      category: 'rain',
    });
  } else {
    recommendations.push({
      id: 'rain-monitor',
      title: 'Monitor upcoming rainfall',
      message:
        'No strong rain signal was detected by the current simple thresholds. Check updated forecasts before scheduling field activities.',
      priority: 'low',
      category: 'rain',
    });
  }

  // 3. Weather-related crop-care suggestions
  const stormDays = forecast.filter(
    (day) => [95, 96, 99].includes(day.weatherCode)
  );

  if (stormDays.length > 0) {
    recommendations.push({
      id: 'crop-storm',
      title: 'Thunderstorm precaution',
      message:
        'Thunderstorms appear in the forecast. Review local alerts and consider postponing spraying or exposed field work during unsafe conditions.',
      priority: 'high',
      category: 'crop-care',
    });
  } else if (weather.temperature >= 35) {
    recommendations.push({
      id: 'crop-heat',
      title: 'Heat precaution',
      message:
        'High temperatures can stress some crops. Monitor wilting and soil moisture, and follow crop-specific guidance for heat protection.',
      priority: 'medium',
      category: 'crop-care',
    });
  } else {
    recommendations.push({
      id: 'crop-monitor',
      title: 'Continue crop monitoring',
      message:
        'Inspect crops regularly for pests, disease symptoms, and moisture stress. Recommendations may vary by crop and growth stage.',
      priority: 'low',
      category: 'crop-care',
    });
  }

  return recommendations;
}