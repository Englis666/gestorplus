import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";

// Importación de pantallas
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
};

// Configuración de iconos y estilos de la barra
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
});

const AdminNavigator = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
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
    </Tab.Navigator>
  );
};

export default AdminNavigator;
