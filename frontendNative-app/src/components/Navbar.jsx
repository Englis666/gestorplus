import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

// Pantallas
import InicioAdministradorScreen from "../screens/administrador/InicioAdmin";
import InicioAspiranteScreen from "../screens/aspirante/InicioAspiranteScreen";

const Tab = createBottomTabNavigator();

const Navbar = ({ userRole, setUserRole }) => {
  const handleLogout = async (navigation) => {
    Alert.alert("Cerrar sesión", "¿Seguro que quieres cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Cerrar sesión",
        onPress: async () => {
          await AsyncStorage.removeItem("auth_token");
          setUserRole(null);
        },
      },
    ]);
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Administrador":
              iconName = "admin-panel-settings";
              break;
            case "Aspirante":
              iconName = "person";
              break;
            case "Logout":
              iconName = "logout";
              break;
            default:
              iconName = "help";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      {userRole === "1" ? (
        <Tab.Screen name="Administrador" component={InicioAdministradorScreen} />
      ) : userRole === "4" ? (
        <Tab.Screen name="Aspirante" component={InicioAspiranteScreen} />
      ) : null}

      <Tab.Screen
        name="Logout"
        component={() => null}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleLogout(navigation);
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default Navbar;
