// app/index.tsx
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      const timeout = setTimeout(() => {
        router.replace("/login");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>¡Hola {user.name}!</Text>
      <Text style={styles.subtitle}>Bienvenido a Wampu</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5" 
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
  },
});