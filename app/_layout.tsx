// app/_layout.tsx
import { useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import { useAuth } from "@/store/useAuth";
import { useRouter, Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerContent from "@/components/DrawerContent";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

export default function Layout() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirigir al login si no hay usuario
  useEffect(() => {
    if (!user) {
      const timeout = setTimeout(() => {
        router.replace("/login");
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [user]);

  // Para páginas de autenticación (login/register), usar Stack Navigator
  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login/index" />
            <Stack.Screen name="register/index" />
            {/* Ocultar index de la navegación Stack cuando no hay usuario */}
            <Stack.Screen name="index" options={{ href: null }} />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    );
  }

  // Para pantallas autenticadas, usar Drawer Navigator
  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#1E3A8A" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{
            headerStyle: {
              backgroundColor: "#1E3A8A",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
            drawerActiveTintColor: "#1E3A8A",
            drawerInactiveTintColor: "#555",
            drawerIcon: ({ color, size }) => (
              <Ionicons name="menu" size={size} color={color} />
            ),
          }}
        >
          <Drawer.Screen 
            name="index" 
            options={{ 
              title: "Inicio",
              drawerIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            }} 
          />
          {/* Ocultar las pantallas de login y registro del drawer */}
          <Drawer.Screen 
            name="login/index" 
            options={{ 
              drawerItemStyle: { display: 'none' },
              href: null 
            }} 
          />
          <Drawer.Screen 
            name="register/index" 
            options={{ 
              drawerItemStyle: { display: 'none' },
              href: null 
            }} 
          />
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}