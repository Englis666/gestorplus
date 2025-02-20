import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';

// Pantallas de la app
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import Layout from './src/screens/LayoutScreen';
import InicioAspiranteScreen from './src/screens/aspirante/InicioAspiranteScreen';
import DetallesConvocatoria from './src/components/DetallesConvocatoria';
import InicioAdministradorScreen from './src/screens/administrador/InicioAdministradorScreen';

// Crea el stack de navegación
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Layout">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Layout" component={Layout}/>
        <Stack.Screen name="administrador/inicioAdmin" component={InicioAdministradorScreen}/>

        <Stack.Screen name="aspirante/inicio" component={InicioAspiranteScreen}/>
        <Stack.Screen name="DetallesConvocatoria" component={DetallesConvocatoria}/>
      </Stack.Navigator>
      <StatusBar barStyle="dark-content"/>
    </NavigationContainer>
  );
}

