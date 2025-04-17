// env.ts actualizado
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Función para determinar la URL base adecuada según la plataforma
const getApiUrl = () => {
  const configUrl = Constants.expoConfig?.extra?.API_URL;
  
  // Si se definió una URL en la configuración, úsala
  if (configUrl) return configUrl;
  
  // De lo contrario, usa una URL según la plataforma
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  } else if (Platform.OS === 'android') {
    // Para tu celular y configuración específica
    return 'http://192.168.93.108:3000';
  } else if (Platform.OS === 'ios') {
    // Para dispositivos iOS
    return 'http://192.168.93.108:3000';
  } else {
    // Fallback
    return 'http://192.168.93.108:3000';
  }
};

export const API_URL = getApiUrl();