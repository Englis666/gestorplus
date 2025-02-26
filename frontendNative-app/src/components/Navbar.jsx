import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

// Pantallas de ejemplo
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Inicio</Text>
  </View>
);
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Perfil</Text>
  </View>
);
const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Ajustes</Text>
  </View>
);

// Configuración del Navbar
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Inicio") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Perfil") {
              iconName = focused ? "person" : "person-outline";
            } else if (route.name === "Ajustes") {
              iconName = focused ? "settings" : "settings-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#007AFF",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0,
            height: 60,
            paddingBottom: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        })}
      >
        <Tab.Screen name="Inicio" component={HomeScreen} />
        <Tab.Screen name="Perfil" component={ProfileScreen} />
        <Tab.Screen name="Ajustes" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
