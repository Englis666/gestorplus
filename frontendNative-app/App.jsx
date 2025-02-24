import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator, StatusBar, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Pantallas y Navbar
import Navbar from "./src/components/Navbar";
import LayoutScreen from "./src/screens/LayoutScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (token) {
          // Simulación de extracción de rol desde el token
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

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {userRole ? (
        <Navbar userRole={userRole} setUserRole={setUserRole} />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Layout" component={LayoutScreen} />
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} setUserRole={setUserRole} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
      <StatusBar barStyle="dark-content" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
