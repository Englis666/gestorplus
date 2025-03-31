import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

// Importación de pantallas
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LayoutScreen from "../screens/LayoutScreen";
import InicioAdministradorScreen from "../screens/administrador/InicioAdmin";
import Convocatorias from "../screens/ConvocatoriasScreen";
import Empleados from "../screens/EmpleadosScreen";
import Ausencias from "../screens/AusenciasScreen";
import Jornadas from "../screens/JornadasScreen";
import Cargos from "../screens/CargosScreen";
import Certificados from "../screens/CertificadosScreen";
import HorasExtra from "../screens/HorasExtra";
import Perfil from "../screens/PerfilScreen";
import PazYSalvos from "../screens/PazYSalvos";
import EntrevistaScreen from "../screens/EntrevistaScreen";
import Postulaciones from "../screens/PostulacionesScreen";
import Quejas from "../screens/QuejasScreen";
import SistemaDeGestion from "../screens/SistemaDeGestion";
import Vacaciones from "../screens/VacacionesScreen";

const Tab = createBottomTabNavigator();

const ICONS = {
  Administrador: ["home", "home-outline"],
  Jornadas: ["calendar", "calendar-outline"],
  Ausencias: ["close-circle", "close-circle-outline"],
  Convocatorias: ["megaphone", "megaphone-outline"],
  Empleados: ["people", "people-outline"],
  Cargos: ["briefcase", "briefcase-outline"],
  Certificados: ["document-text", "document-text-outline"],
  "Horas Extra": ["time", "time-outline"],
  Perfil: ["person", "person-outline"],
  "Paz y salvos": ["shield-checkmark", "shield-checkmark-outline"],
  Entrevistas: ["chatbubbles", "chatbubbles-outline"],
  Postulaciones: ["document-attach", "document-attach-outline"],
  Quejas: ["alert-circle", "alert-circle-outline"],
  "Sistema De Gestion": ["settings", "settings-outline"],
  Vacaciones: ["airplane", "airplane-outline"],
  Logout: ["log-out", "log-out-outline"],
  Layout: ["home", "home-outline"],
  Login: ["log-in", "log-in-outline"],
  Register: ["person-add", "person-add-outline"],
};

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    const [iconFocused, iconOutline] = ICONS[route.name] || ["help-circle", "help-circle-outline"];
    return <Icon name={focused ? iconFocused : iconOutline} size={size} color={color} />;
  },
  tabBarActiveTintColor: "#1f64ff",
  tabBarInactiveTintColor: "#8e8e8e",
  headerShown: false,
  tabBarStyle: {
    height: 60,
    paddingBottom: 5,
    backgroundColor: "#fff",
  },
  tabBarScrollEnabled: true,
});

const AdminNavigator = ({ navigation }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      setIsAuthenticated(!!token);
      setLoading(false);
    };

    checkToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth_token");
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1f64ff" />
      </View>
    );
  }

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      {isAuthenticated ? (
        <>
          <Tab.Screen name="Administrador" component={InicioAdministradorScreen} />
          <Tab.Screen name="Jornadas" component={Jornadas} />
          <Tab.Screen name="Ausencias" component={Ausencias} />
          <Tab.Screen name="Convocatorias" component={Convocatorias} />
          <Tab.Screen name="Entrevistas" component={EntrevistaScreen} />
          <Tab.Screen name="Empleados" component={Empleados} />
          <Tab.Screen name="Cargos" component={Cargos} />
          <Tab.Screen name="Certificados" component={Certificados} />
          <Tab.Screen name="Paz y salvos" component={PazYSalvos} />
          <Tab.Screen name="Horas Extra" component={HorasExtra} />
          <Tab.Screen name="Perfil" component={Perfil} />
          <Tab.Screen name="Postulaciones" component={Postulaciones} />
          <Tab.Screen name="Quejas" component={Quejas} />
          <Tab.Screen name="Sistema De Gestion" component={SistemaDeGestion} />
          <Tab.Screen name="Vacaciones" component={Vacaciones} />

          {/* Botón de Cerrar Sesión */}
          <Tab.Screen name="Logout">
            {() => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ff4d4d",
                  borderRadius: 10,
                  margin: 5,
                  paddingVertical: 10,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 5,
                }}
                onPress={handleLogout}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            )}
          </Tab.Screen>
        </>
      ) : (
        <>
          <Tab.Screen name="Layout" component={LayoutScreen} />
          <Tab.Screen name="Login">
            {() => <LoginScreen setIsAuthenticated={setIsAuthenticated} />}
          </Tab.Screen>
          <Tab.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default AdminNavigator;
