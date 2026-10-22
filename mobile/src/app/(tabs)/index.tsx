import React from 'react';


import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

const GREEN = '#2E7D32';
const BACKGROUND = '#F7FAF5';

export default function HomeScreen() {
  const openCropDoctor = () => {
    router.push('/crop-doctor');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BACKGROUND} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>🌱 Future Farming</Text>
            <Text style={styles.subtitle}>
              Smart agriculture ecosystem
            </Text>
          </View>

          <View style={styles.profile}>
            <Text style={styles.profileText}>👨‍🌾</Text>
          </View>
        </View>

        <View style={styles.banner}>
          <Text style={styles.eyebrow}>WELCOME TO YOUR FARM</Text>

          <Text style={styles.bannerTitle}>
            Grow smarter,{'\n'}farm better.
          </Text>

          <Text style={styles.bannerDescription}>
            Your intelligent farming companion is here to help.
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              🌿 Technology for better farming
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Weather overview</Text>

        <View style={styles.weatherCard}>
          <View>
            <Text style={styles.weatherLocation}>📍 Your farm</Text>
            <Text style={styles.temperature}>--°C</Text>
            <Text style={styles.mutedText}>Weather data coming soon</Text>
          </View>

          <Text style={styles.weatherIcon}>🌤️</Text>
        </View>

        <Text style={[styles.sectionTitle, styles.toolsHeading]}>
          Smart farming tools
        </Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.featureCard}
            onPress={openCropDoctor}
            activeOpacity={0.75}
          >
            <Text style={styles.featureIcon}>🩺</Text>
            <Text style={styles.featureTitle}>Crop Doctor</Text>
            <Text style={styles.featureDescription}>
              Identify possible crop diseases
            </Text>
            <Text style={styles.tapText}>Tap to open →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            activeOpacity={0.75}
            onPress={() =>
              alert('Crop Advisor will be available in a future update.')
            }
          >
            <Text style={styles.featureIcon}>🌾</Text>
            <Text style={styles.featureTitle}>Crop Advisor</Text>
            <Text style={styles.featureDescription}>
              Discover suitable crops
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            activeOpacity={0.75}
            onPress={() =>
              alert('AI Assistant will be available in a future update.')
            }
          >
            <Text style={styles.featureIcon}>🤖</Text>
            <Text style={styles.featureTitle}>AI Assistant</Text>
            <Text style={styles.featureDescription}>
              Get farming information
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.featureCard}
            activeOpacity={0.75}
            onPress={() =>
              alert('Agri-Shop will be available in a future update.')
            }
          >
            <Text style={styles.featureIcon}>🛒</Text>
            <Text style={styles.featureTitle}>Agri-Shop</Text>
            <Text style={styles.featureDescription}>
              Explore farming products
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.advisoryCard}>
          <Text style={styles.advisoryIcon}>🌱</Text>

          <View style={styles.advisoryContent}>
            <Text style={styles.advisoryTitle}>
              Your farm, your future
            </Text>

            <Text style={styles.advisoryDescription}>
              Personalized farming insights and recommendations will appear
              here as we build your smart agriculture platform.
            </Text>
          </View>
        </View>

        <Text style={styles.footer}>
          AGENTIC FUTURE FARMING • SMARTER AGRICULTURE
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  brand: {
    fontSize: 21,
    fontWeight: '800',
    color: GREEN,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 12,
    color: '#6B776B',
  },
  profile: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: 25,
  },
  banner: {
    backgroundColor: GREEN,
    borderRadius: 24,
    padding: 24,
    marginBottom: 28,
  },
  eyebrow: {
    color: '#D7F2D8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '800',
    marginTop: 15,
  },
  bannerDescription: {
    color: '#E8F5E9',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 20,
  },
  badgeText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#243B27',
    marginBottom: 14,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E7EEE5',
  },
  weatherLocation: {
    fontSize: 12,
    color: '#69766A',
  },
  temperature: {
    fontSize: 31,
    fontWeight: '800',
    color: '#263D29',
    marginTop: 8,
  },
  mutedText: {
    fontSize: 11,
    color: '#899389',
    marginTop: 4,
  },
  weatherIcon: {
    fontSize: 45,
  },
  toolsHeading: {
    marginTop: 28,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#E7EEE5',
  },
  featureIcon: {
    fontSize: 27,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#263D29',
  },
  featureDescription: {
    fontSize: 11,
    lineHeight: 16,
    color: '#7B857B',
    marginTop: 6,
  },
  tapText: {
    color: GREEN,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 8,
  },
  advisoryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#E8F5E9',
    borderRadius: 18,
    padding: 18,
    marginTop: 24,
  },
  advisoryIcon: {
    fontSize: 27,
    marginRight: 12,
  },
  advisoryContent: {
    flex: 1,
  },
  advisoryTitle: {
    color: GREEN,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 7,
  },
  advisoryDescription: {
    color: '#536854',
    fontSize: 12,
    lineHeight: 19,
  },
  footer: {
    textAlign: 'center',
    color: '#98A398',
    fontSize: 9,
    letterSpacing: 1,
    marginTop: 28,
  },
});