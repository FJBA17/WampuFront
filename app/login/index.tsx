// index.tsx (login) corregido para manejar "access_token"
import { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator, Alert, Pressable, Image, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import api from "@/lib/api";
import { useAuth } from "@/store/useAuth";
import { API_URL } from "@/env";

export default function Login() {
  const router = useRouter();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Solo para debugging durante el desarrollo
  console.log(`[Login] Usando API en: ${API_URL}`);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log(`[Login] Intentando login con: ${email}`);

      const response = await api.post("/auth/login", {
        email,
        password
      });

      console.log("[Login] Respuesta recibida:", JSON.stringify(response.data, null, 2));

      // Verificamos la estructura correcta de la respuesta
      // Ahora maneja tanto "token" como "access_token"
      if (response.data) {
        const userData = response.data.user;
        const tokenValue = response.data.token || response.data.access_token;

        if (userData && tokenValue) {
          console.log("[Login] Login exitoso, guardando datos de usuario");

          // Guardamos tanto el usuario como el token
          setAuth(userData, tokenValue);

          // Navegamos a la pantalla principal
          setTimeout(() => {
            router.replace("/");
          }, 300);
        } else {
          console.error("[Login] Faltan datos de usuario o token en la respuesta:", response.data);
          throw new Error("Datos de usuario o token no encontrados en la respuesta");
        }
      } else {
        console.error("[Login] Formato de respuesta incorrecto:", response.data);
        throw new Error("Formato de respuesta inesperado");
      }
    } catch (err) {
      console.error("[Login] Error completo:", err);

      if (err.response) {
        // Error del servidor con respuesta
        const status = err.response.status;
        console.error(`[Login] Error de servidor ${status}:`, err.response.data);

        if (status === 401) {
          setError("Credenciales inválidas");
        } else if (status === 404) {
          setError("Usuario no encontrado");
        } else {
          setError(`Error del servidor: ${status}`);
        }
      } else if (err.request) {
        // No se recibió respuesta
        console.error("[Login] No se recibió respuesta del servidor");
        setError(`No se pudo conectar al servidor (${API_URL}). Verifica tu conexión a internet.`);

        // Mostrar información de conexión en desarrollo
        if (__DEV__) {
          Alert.alert(
            "Problema de conexión",
            `No se pudo conectar a ${API_URL}. Verifica que:\n\n` +
            `1. El servidor backend esté ejecutándose\n` +
            `2. La IP configurada (192.168.93.108) sea correcta\n` +
            `3. El puerto 3000 esté abierto`
          );
        }
      } else {
        // Error en la configuración de la solicitud
        console.error("[Login] Error de configuración:", err.message);
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#013459" />
      <View style={styles.container}>
        {/* <Text style={styles.title}>Iniciar sesión</Text> */}
        <Image
          source={require('../../assets/icons/Wampu.png')}
          style={{ width: 225, height: 110 }}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Contraseña"
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator size="large" color="#013459" />
        ) : (
          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>
        )}

        <Text style={styles.registerLink} onPress={() => router.push("/register")}>
          ¿No tienes cuenta? Regístrate
        </Text>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height : "50%",
    justifyContent: "center",
    alignContent: "center",
    alignItems : "center",
    padding: 20,
    backgroundColor: "#013459"
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: "bold",
    textAlign: "center",
    color: "white"
  },
  input: {
    borderWidth: 1,
    borderColor: "#013459",
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 15,
    height : 50
  },
  error: {
    color: "red",
    marginBottom: 20,
    textAlign: "center"
  },
  registerLink: {
    marginTop: 20,
    textAlign: "center",
    color: "#013459"
  },
  devInfo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 10,
    color: "#888"
  },

  inputContainer: {
    paddingTop: 50,
    paddingHorizontal: 25,
    backgroundColor: "white",
    width: "100%",
    height: "50%"
  },
  button: {
    backgroundColor: '#013459',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});