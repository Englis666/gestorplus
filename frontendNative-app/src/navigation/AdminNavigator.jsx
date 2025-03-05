import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import InicioAdministradorScreen from "../screens/administrador/InicioAdmin";
import Convocatorias from "../screens/ConvocatoriasScreen";
import Empleados from "../screens/EmpleadosScreen";
import Ausencias from "../screens/AusenciasScreen";
import Jornadas from "../screens/JornadasScreen";
import Icon from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Administrador":
              iconName = focused ? "home" : "home-outline";
              break;
            case "Jornadas":
              iconName = focused ? "calendar" : "calendar-outline";
              break;
            case "Ausencias":
              iconName = focused ? "close-circle" : "close-circle-outline";
              break;
            case "Convocatorias":
              iconName = focused ? "megaphone" : "megaphone-outline";
              break;
            case "Empleados":
              iconName = focused ? "people" : "people-outline";
              break;
            default:
              iconName = "help-circle-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1f64ff",
        tabBarInactiveTintColor: "#8e8e8e",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Administrador" component={InicioAdministradorScreen} />
      <Tab.Screen name="Jornadas" component={Jornadas} />
      <Tab.Screen name="Ausencias" component={Ausencias} />
      <Tab.Screen name="Convocatorias" component={Convocatorias} />
      <Tab.Screen name="Empleados" component={Empleados} />
    </Tab.Navigator>
  );
};

export default AdminNavigator;
