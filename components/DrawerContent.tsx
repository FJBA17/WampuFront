// components/DrawerContent.tsx
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, StyleSheet, Alert, Platform } from "react-native";
import { useAuth } from "@/store/useAuth";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DrawerContent(props) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sí, cerrar sesión",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

  // Filtramos los elementos del drawer para mostrar solo los que queremos
  const filteredProps = {
    ...props,
    state: {
      ...props.state,
      routes: props.state.routes.filter(
        (route) => 
          route.name !== 'login/index' && 
          route.name !== 'register/index'
      ),
    },
    // Ajustamos el índice activo después de filtrar las rutas
    navigation: {
      ...props.navigation,
      navigate: (name) => {
        if (props.navigation.navigate) {
          props.navigation.navigate(name);
        }
      },
    },
  };

  return (
    <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? insets.top : 0 }]}>
      {/* Header del Drawer */}
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name || "Usuario"}</Text>
        <Text style={styles.userEmail}>{user?.email || ""}</Text>
      </View>

      {/* Items del menú */}
      <DrawerContentScrollView 
        {...filteredProps} 
        contentContainerStyle={styles.drawerContent}
      >
        <DrawerItemList {...filteredProps} />
      </DrawerContentScrollView>

      {/* Botón de Cerrar Sesión en la parte inferior */}
      <View style={[styles.logoutContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }]}>
        <DrawerItem
          label="Cerrar Sesión"
          labelStyle={styles.logoutText}
          icon={({ size }) => (
            <Ionicons name="log-out-outline" size={size} color="#FF3B30" />
          )}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    backgroundColor: "#1E3A8A",
    paddingTop: 40,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#93C5FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
  },
  userName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    color: "#e0e0e0",
    fontSize: 14,
    marginTop: 2,
  },
  drawerContent: {
    paddingTop: 10,
  },
  logoutContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  logoutText: {
    color: "#FF3B30",
  },
});