import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Text, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pantallas
import Layout from "./src/screens/LayoutScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import InicioAspiranteScreen from "./src/screens/aspirante/InicioAspiranteScreen";
import InicioAdministradorScreen from "./src/screens/administrador/InicioAdmin";
import DetallesConvocatoria from "./src/components/DetallesConvocatoria";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (token) {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUserRole(decodedToken?.data?.rol);
        }
      } catch (error) {
        console.error("Error obteniendo el token:", error);
      } finally {
        setLoading(false);
      }
    };
    checkUserRole();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          await AsyncStorage.removeItem("auth_token");
          setUserRole(null);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <View style={styles.container}>
        {userRole && <Navbar userRole={userRole} handleLogout={handleLogout} />}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userRole ? (
            <>
              <Stack.Screen name="Layout" component={LayoutScreen} />
              {userRole === "1" ? (
                <Stack.Screen name="Administrador" component={InicioAdministradorScreen} />
              ) : (
                <Stack.Screen name="Aspirante" component={InicioAspiranteScreen} />
              )}
              <Stack.Screen name="DetallesConvocatoria" component={DetallesConvocatoria} />
            </>
          ) : (
            <>
              <Stack.Screen name="Layout" component={Layout} />
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} setUserRole={setUserRole} />}
              </Stack.Screen>
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

// 📌 Navbar dentro de App.jsx
const Navbar = ({ userRole, handleLogout }) => {
  return (
    <View style={styles.navbar}>
      <NavButton title="Inicio" />
      {userRole === "1" ? <NavButton title="Administrador" /> : <NavButton title="Aspirante" />}
      <NavButton title="Detalles" />
      <NavButton title="Logout" onPress={handleLogout} />
    </View>
  );
};

// 📌 Botón de navegación
const NavButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.navButton} onPress={onPress}>
      <Text style={styles.navText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 10,
  },
  navButton: {
    padding: 10,
  },
  navText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
