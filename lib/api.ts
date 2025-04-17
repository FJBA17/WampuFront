// api.ts actualizado con mejor manejo de tokens
import axios from "axios";
import { API_URL } from "@/env";
import { Alert } from "react-native";
import { useAuth } from "@/store/useAuth";

// Log de depuración para ver qué URL estamos usando
console.log(`[API] Conectando a: ${API_URL}`);

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 segundos de timeout para redes móviles más lentas
});

// Interceptor para añadir el token JWT a cada petición
api.interceptors.request.use(
  (config) => {
    const token = useAuth.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] Enviando ${config.method?.toUpperCase()} a ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API] Error en la solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor para logging de respuestas y errores detallados
api.interceptors.response.use(
  (response) => {
    console.log(`[API] Respuesta exitosa de ${response.config.url}: Status ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(
        `[API] Error ${error.response.status} en ${error.config?.url}:`,
        error.response.data
      );
      // Si el token ha caducado (401) o no está autorizado (403)
      if (error.response.status === 401 || error.response.status === 403) {
        useAuth.getState().logout();
      }
    } else if (error.request) {
      // La solicitud se hizo pero no se recibió respuesta
      console.error("[API] Sin respuesta del servidor:", error.message);
      console.error("[API] URL completa:", `${error.config?.baseURL}${error.config?.url}`);
      console.error("[API] Método:", error.config?.method);
      
      // En modo desarrollo, muestra una alerta sobre el problema de conexión
      if (__DEV__) {
        Alert.alert(
          "Error de conexión",
          `No se pudo conectar a ${API_URL}. Verifica que el servidor esté funcionando y que tu dispositivo tenga conexión a la red.`
        );
      }
    } else {
      // Error en la configuración de la solicitud
      console.error("[API] Error en la configuración:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;