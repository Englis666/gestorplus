import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importar pantallas
import LayoutScreen from "./src/screens/LayoutScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import InicioAspiranteScreen from "./src/screens/aspirante/InicioAspiranteScreen";
import DetallesTrabajo from "./src/components/DetallesConvocatoria";
import AdminNavigator from "./src/navigation/AdminNavigator";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Layout" component={LayoutScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Administrador" component={AdminNavigator} />
        <Stack.Screen name="Aspirante" component={InicioAspiranteScreen} />
        <Stack.Screen name="DetallesConvocatoria" component={DetallesTrabajo} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
