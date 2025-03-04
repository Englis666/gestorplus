import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import InicioAdministradorScreen from "../screens/administrador/InicioAdmin";
import { View } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Jornadas from "../screens/JornadasScreen";


const Tab = createBottomTabNavigator();

const AdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName; Q

          if (route.name === "Administrador") {
            iconName = focused ? "home" : "home-outline";
          }
          if (route.name === "Jornadas") {
            iconName = focused ? "Jornadas" : "home-outline";
          }
          if (route.name === "Certificados") {
            iconName = focused ? "Certificados" : "";
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
    </Tab.Navigator>
  );
};

export default AdminNavigator;
