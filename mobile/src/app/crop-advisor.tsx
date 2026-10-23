
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

const GREEN = '#2E7D32';

export default function CropAdvisorScreen() {
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [ph, setPh] = useState('');
  const [rainfall, setRainfall] = useState('');

  const fields = [
    { label: 'Nitrogen (N)', value: nitrogen, setter: setNitrogen, hint: 'e.g. 90' },
    { label: 'Phosphorus (P)', value: phosphorus, setter: setPhosphorus, hint: 'e.g. 42' },
    { label: 'Potassium (K)', value: potassium, setter: setPotassium, hint: 'e.g. 43' },
    { label: 'Soil pH', value: ph, setter: setPh, hint: 'e.g. 6.5' },
    { label: 'Rainfall (mm)', value: rainfall, setter: setRainfall, hint: 'e.g. 200' },
  ];

  const handleSubmit = () => {
    const values = [nitrogen, phosphorus, potassium, ph, rainfall];

    if (values.some((value) => value.trim() === '')) {
      Alert.alert('Missing information', 'Please fill in all five fields.');
      return;
    }

    const numbers = values.map(Number);

    if (numbers.some((value) => !Number.isFinite(value) || value < 0)) {
      Alert.alert('Invalid input', 'Enter valid, non-negative numbers.');
      return;
    }

    if (numbers[3] > 14) {
      Alert.alert('Invalid soil pH', 'Enter a pH value between 0 and 14.');
      return;
    }

    Alert.alert(
      'Inputs captured',
      'Your soil and rainfall inputs passed basic validation. The crop recommendation model still needs to be connected to generate a real recommendation.'
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back to Home</Text>
      </TouchableOpacity>

      <Text style={styles.eyebrow}>SMART AGRICULTURE</Text>
      <Text style={styles.title}>Crop Advisor 🌱</Text>
      <Text style={styles.subtitle}>
        Enter your soil nutrient levels and rainfall information to prepare
        a crop recommendation request.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Why these inputs?</Text>
        <Text style={styles.infoText}>
          Soil nutrients, pH and rainfall are environmental factors that can
          help a crop recommendation model assess growing conditions.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Soil and climate details</Text>

      {fields.map((field) => (
        <View key={field.label} style={styles.field} >
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            value={field.value}
            onChangeText={field.setter}
            placeholder={field.hint}
            keyboardType="decimal-pad"
            style={styles.input}
            placeholderTextColor="#8A968B"
          />
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Prepare Recommendation Request</Text>
      </TouchableOpacity>

      <View style={styles.notice}>
        <Text style={styles.noticeTitle}>Prototype status</Text>
        <Text style={styles.noticeText}>
          This screen currently validates input only. It does not recommend
          a crop or replace advice from an agricultural expert.
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
  submitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
    textAlign: 'center',
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