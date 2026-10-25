import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

const GREEN = '#2E7D32';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'http://10.127.130.121:5000';

type CropRecommendationResponse = {
  success?: boolean;
  model_connected?: boolean;
  message?: string;
  recommendation?: unknown;
  disclaimer?: string;
};

type ResultType = 'success' | 'error' | 'info';

export default function CropAdvisorScreen() {
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [ph, setPh] = useState('');
  const [rainfall, setRainfall] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  const [resultType, setResultType] = useState<ResultType>('info');
  const [disclaimer, setDisclaimer] = useState('');

  const fields = [
    {
      label: 'Nitrogen (N)',
      value: nitrogen,
      setter: setNitrogen,
      hint: 'e.g. 90',
    },
    {
      label: 'Phosphorus (P)',
      value: phosphorus,
      setter: setPhosphorus,
      hint: 'e.g. 42',
    },
    {
      label: 'Potassium (K)',
      value: potassium,
      setter: setPotassium,
      hint: 'e.g. 43',
    },
    {
      label: 'Temperature (°C)',
      value: temperature,
      setter: setTemperature,
      hint: 'e.g. 20.9',
    },
    {
      label: 'Humidity (%)',
      value: humidity,
      setter: setHumidity,
      hint: 'e.g. 82',
    },
    {
      label: 'Soil pH',
      value: ph,
      setter: setPh,
      hint: 'e.g. 6.5',
    },
    {
      label: 'Rainfall (mm)',
      value: rainfall,
      setter: setRainfall,
      hint: 'e.g. 200',
    },
  ];

  const showResult = (type: ResultType, message: string) => {
    setResultType(type);
    setResultMessage(message);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setResultMessage('');
    setDisclaimer('');

    const rawValues = [
      nitrogen,
      phosphorus,
      potassium,
      temperature,
      humidity,
      ph,
      rainfall,
    ];

    if (rawValues.some((value) => value.trim() === '')) {
      showResult('error', 'Please fill in all seven fields.');
      return;
    }

    const values = rawValues.map(Number);

    if (values.some((value) => !Number.isFinite(value))) {
      showResult('error', 'Enter valid numeric values in all fields.');
      return;
    }

    const [
      n,
      p,
      k,
      temp,
      humidityValue,
      phValue,
      rainfallValue,
    ] = values;

    if (n < 0 || n > 200 ||
        p < 0 || p > 200 ||
        k < 0 || k > 200) {
      showResult(
        'error',
        'Nitrogen, phosphorus and potassium must be between 0 and 200.'
      );
      return;
    }

    if (temp < -10 || temp > 60) {
      showResult(
        'error',
        'Temperature must be between -10°C and 60°C.'
      );
      return;
    }

    if (humidityValue < 0 || humidityValue > 100) {
      showResult(
        'error',
        'Humidity must be between 0% and 100%.'
      );
      return;
    }

    if (phValue < 0 || phValue > 14) {
      showResult(
        'error',
        'Soil pH must be between 0 and 14.'
      );
      return;
    }

    if (rainfallValue < 0 || rainfallValue > 5000) {
      showResult(
        'error',
        'Rainfall must be between 0 and 5000 mm.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/crop/recommend`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nitrogen: n,
            phosphorus: p,
            potassium: k,
            temperature: temp,
            humidity: humidityValue,
            ph: phValue,
            rainfall: rainfallValue,
          }),
        }
      );

      let data: CropRecommendationResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error('The server returned an invalid response.');
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          `Request failed with status ${response.status}.`
        );
      }

      if (!data.success || data.recommendation == null) {
        throw new Error(
          data.message || 'No crop recommendation was returned.'
        );
      }

      showResult(
        'success',
        `Recommended crop: ${String(data.recommendation)
          .replace(/^./, (letter) => letter.toUpperCase())}`
      );

      setDisclaimer(
        data.disclaimer ||
        'This prediction is based on the training dataset and does not guarantee crop suitability.'
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred.';

      showResult(
        'error',
        `${message}\n\nCheck that the backend and Python ML service are running and that the API URL is correct.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
        disabled={isSubmitting}
      >
        <Text style={styles.backText}>
          {'\u2190'} Back to Home
        </Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>SMART AGRICULTURE</Text>

      <Text style={styles.title}>Crop Advisor 🌱</Text>

      <Text style={styles.subtitle}>
        Enter soil nutrient, soil pH and climate details to
        request a dataset-based crop recommendation.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why these inputs?</Text>
        <Text style={styles.infoText}>
          The model uses nitrogen, phosphorus, potassium,
          temperature, humidity, soil pH and rainfall to predict
          a crop label from its training dataset.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>
        Soil and climate details
      </Text>

      {fields.map((field) => (
        <View key={field.label} style={styles.field}>
          <Text style={styles.label}>{field.label}</Text>

          <TextInput
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.hint}
            keyboardType="decimal-pad"
            style={styles.input}
            placeholderTextColor="#8A968B"
            autoCapitalize="none"
            editable={!isSubmitting}
            accessibilityLabel={field.label}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        activeOpacity={0.8}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color="#FFFFFF" size="small" />
            <Text style={styles.submitText}>
              Getting Recommendation...
            </Text>
          </View>
        ) : (
          <Text style={styles.submitText}>
            Get Crop Recommendation
          </Text>
        )}
      </TouchableOpacity>

      {resultMessage !== '' && (
        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.resultCard,
            resultType === 'error' && styles.resultError,
            resultType === 'success' && styles.resultSuccess,
            resultType === 'info' && styles.resultInfo,
          ]}
        >
          <Text style={styles.resultTitle}>
            {resultType === 'error'
              ? 'Request Error'
              : resultType === 'success'
                ? 'Crop Recommendation'
                : 'Request Status'}
          </Text>

          <Text style={styles.resultText}>{resultMessage}</Text>

          {disclaimer !== '' && (
            <Text style={styles.disclaimer}>{disclaimer}</Text>
          )}
        </View>
      )}

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Important note</Text>
        <Text style={styles.noticeText}>
          This is a dataset-based prediction, not a guarantee of
          crop suitability. Confirm soil conditions, local weather,
          season and agricultural guidance before planting.
          Enter measured or otherwise reliable values; example
          placeholders are not field measurements.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7FAF5',
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  back: {
    marginBottom: 26,
  },
  backText: {
    color: GREEN,
    fontSize: 14,
    fontWeight: '700',
  },
  eyebrow: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    color: '#243B27',
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#667267',
    fontSize: 14,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 26,
  },
  infoTitle: {
    color: GREEN,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 8,
  },
  infoText: {
    color: '#435B45',
    fontSize: 13,
    lineHeight: 20,
  },
  sectionTitle: {
    color: '#243B27',
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    color: '#354638',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 7,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE6DA',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    color: '#243B27',
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: GREEN,
    borderRadius: 13,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  resultCard: {
    borderRadius: 14,
    padding: 15,
    marginTop: 16,
  },
  resultError: {
    backgroundColor: '#FDECEC',
  },
  resultSuccess: {
    backgroundColor: '#E8F5E9',
  },
  resultInfo: {
    backgroundColor: '#FFF7E5',
  },
  resultTitle: {
    color: '#243B27',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 6,
  },
  resultText: {
    color: '#435B45',
    fontSize: 13,
    lineHeight: 20,
  },
  disclaimer: {
    color: '#725F3B',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  notice: {
    backgroundColor: '#FFF7E5',
    borderRadius: 14,
    padding: 15,
    marginTop: 20,
  },
  noticeTitle: {
    color: '#815B12',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  noticeText: {
    color: '#725F3B',
    fontSize: 12,
    lineHeight: 19,
  },
});