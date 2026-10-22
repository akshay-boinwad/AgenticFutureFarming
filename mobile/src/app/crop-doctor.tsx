import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { File } from 'expo-file-system';
import { fetch } from 'expo/fetch';

export default function CropDoctorScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow photo library access in your phone settings.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Unable to select the image.');
    }
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera Permission Required',
          'Please allow camera access for Expo Go.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Camera Error',
        'Could not open the camera. Please try again.'
      );
    }
  };

  const analyzeCrop = async () => {
    if (!image) {
      Alert.alert(
        'Select an Image',
        'Please select or take a crop photo first.'
      );
      return;
    }

    setLoading(true);

    try {
      const API_URL =
        'http://10.178.139.87:5000/api/crop/analyze';

      const filename =
        image.split('/').pop()?.split('?')[0] ||
        'crop-image.jpg';

      const imageFile = new File(image);

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });

      const responseText = await response.text();

      let result: any;

      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. HTTP ${response.status}`
        );
      }

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || `Server error: ${response.status}`
        );
      }

      const mlResult = result.result;

      if (mlResult?.prediction) {
        Alert.alert(
          'Crop Analysis Result',
          `Prediction: ${mlResult.prediction}`
        );
      } else {
        Alert.alert(
          'Image Received Successfully',
          'Your image was uploaded and validated. A trained disease-detection model is still required for actual predictions.'
        );
      }
    } catch (error) {
      console.error('Crop analysis error:', error);

      const message =
        error instanceof Error
          ? error.message
          : 'Unable to connect to the server.';

      Alert.alert('Analysis Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.heading}>🌿 Crop Doctor</Text>

      <Text style={styles.subtitle}>
        Detect crop diseases and help keep your plants healthy.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          🩺 AI Plant Health Check
        </Text>

        <Text style={styles.infoText}>
          Upload a clear photo of an affected leaf to submit it
          for analysis.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.uploadBox}
        onPress={pickImage}
        activeOpacity={0.8}
        disabled={loading}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.preview}
            resizeMode="contain"
          />
        ) : (
          <>
            <Text style={styles.uploadIcon}>📷</Text>

            <Text style={styles.uploadTitle}>
              Upload Crop Image
            </Text>

            <Text style={styles.uploadHint}>
              Tap here to select a photo from your gallery
            </Text>
          </>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity
          style={styles.changeButton}
          onPress={pickImage}
          disabled={loading}
        >
          <Text style={styles.changeButtonText}>
            Choose Another Image
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={takePhoto}
        activeOpacity={0.8}
        disabled={loading}
      >
        <Text style={styles.cameraButtonText}>
          📸 Take a Photo
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.analyzeButton,
          loading && styles.disabledButton,
        ]}
        onPress={analyzeCrop}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#FFFFFF" />

            <Text style={styles.analyzeButtonText}>
              Uploading Image...
            </Text>
          </View>
        ) : (
          <Text style={styles.analyzeButtonText}>
            🔍 Analyze Crop
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.tipCard}>
        <Text style={styles.tipTitle}>
          💡 Tips for Better Results
        </Text>

        <Text style={styles.tipText}>
          • Capture the affected leaf clearly.
        </Text>

        <Text style={styles.tipText}>
          • Use good lighting.
        </Text>

        <Text style={styles.tipText}>
          • Keep the leaf in focus.
        </Text>

        <Text style={styles.tipText}>
          • Avoid blurry or very dark images.
        </Text>
      </View>

      <Text style={styles.note}>
        Note: Images are sent to the ML service for validation.
        Actual disease prediction requires a trained model.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F1',
  },

  content: {
    padding: 20,
    paddingTop: 35,
    paddingBottom: 40,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: '#647067',
    lineHeight: 22,
    marginBottom: 22,
  },

  infoCard: {
    backgroundColor: '#E4F3E3',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#25652A',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#435B45',
    lineHeight: 21,
  },

  uploadBox: {
    minHeight: 210,
    borderWidth: 2,
    borderColor: '#81B784',
    borderStyle: 'dashed',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    overflow: 'hidden',
  },

  uploadIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  uploadTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },

  uploadHint: {
    fontSize: 13,
    color: '#778078',
    textAlign: 'center',
  },

  preview: {
    width: '100%',
    height: 240,
    borderRadius: 12,
  },

  changeButton: {
    padding: 10,
    alignItems: 'center',
  },

  changeButtonText: {
    color: '#2E7D32',
    fontSize: 13,
    fontWeight: '600',
  },

  cameraButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },

  cameraButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },

  analyzeButton: {
    backgroundColor: '#2E7D32',
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },

  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  disabledButton: {
    opacity: 0.7,
  },

  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 25,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },

  tipText: {
    fontSize: 14,
    color: '#536057',
    lineHeight: 24,
  },

  note: {
    fontSize: 12,
    color: '#7A847B',
    lineHeight: 18,
    marginTop: 18,
    textAlign: 'center',
  },
});