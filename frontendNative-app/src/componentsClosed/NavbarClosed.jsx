import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ activeLink }) => {
  const navigation = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [rol, setRol] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const widthAnim = useState(new Animated.Value(60))[0];

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (!token) return;
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
        if (!isTokenExpired) setRol(decodedToken?.data?.rol);
      } catch (err) {
        console.error("Error al decodificar el token:", err);
      }
    };
    getToken();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("auth_token");
    navigation.navigate("Login");
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.timing(widthAnim, {
      toValue: isCollapsed ? 200 : 60,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const toggleSubMenu = (index) => {
    setOpenSubMenu(openSubMenu === index ? null : index);
  };

  const menuItems = [
    { label: "Jornadas", icon: "📅", path: "Jornadas", subMenu: [{ label: "Horas Extra", icon: "⏳", path: "HorasExtra" }] },
    { label: "Ausencias", icon: "⏳", path: "Ausencias", subMenu: [{ label: "Vacaciones", icon: "✈️", path: "Vacaciones" }] },
    { label: "Paz y salvos", icon: "✅", path: "PazYsalvo" },
    { label: "Quejas", icon: "⚠️", path: "Quejas" },
    { label: "Mi perfil", icon: "👤", path: "Perfil" },
    { label: "Certificados", icon: "📜", path: "Certificados" },
  ];

  if (rol === "1" || rol === "2") {
    menuItems.push({ label: "Empleados", icon: "👥", path: "Empleados" });
    menuItems.push({ label: "Contratos", icon: "📄", path: "Contratos" });
    menuItems.push({ label: "Entrevistas", icon: "📝", path: "Entrevistas", subMenu: [{ label: "Sistema de Gestión", icon: "⚙️", path: "SistemaDeGestion" }] });
    menuItems.push({ label: "Convocatorias", icon: "📢", path: "Convocatorias", subMenu: [{ label: "Postulaciones", icon: "📝", path: "Postulaciones" }, { label: "Cargos", icon: "💼", path: "Cargos" }] });
  }

  return (
    <Animated.View style={[styles.navbar, { width: widthAnim }]}>      
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCollapse}>
        <Text style={styles.icon}>{isCollapsed ? "☰" : "✖"}</Text>
      </TouchableOpacity>

      <ScrollView style={styles.menu}>
        {menuItems.map((item, index) => (
          <View key={item.label}>
            <TouchableOpacity
              style={[styles.menuItem, activeLink === item.path && styles.menuItemActive]}
              onPress={() => {
                navigation.navigate(item.path);
                if (item.subMenu) toggleSubMenu(index);
              }}>
              <Text style={styles.icon}>{item.icon}</Text>
              {!isCollapsed && <Text style={styles.text}>{item.label}</Text>}
            </TouchableOpacity>

            {item.subMenu && openSubMenu === index && !isCollapsed && (
              <View style={styles.subMenu}>
                {item.subMenu.map((subItem) => (
                  <TouchableOpacity key={subItem.label} style={styles.subMenuItem} onPress={() => navigation.navigate(subItem.path)}>
                    <Text style={styles.icon}>{subItem.icon}</Text>
                    <Text style={styles.text}>{subItem.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Text style={styles.icon}>🚪</Text>
          {!isCollapsed && <Text style={styles.text}>Cerrar sesión</Text>}
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    height: "100%",
    backgroundColor: "#fff",
    elevation: 5,
    paddingVertical: 10,
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  menu: {
    flexGrow: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuItemActive: {
    backgroundColor: "#e3f2fd",
    borderLeftWidth: 4,
    borderLeftColor: "#3498db",
  },
  icon: {
    fontSize: 20,
    color: "#3498db",
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  subMenu: {
    paddingLeft: 20,
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    color: "#e74c3c",
  },
});

export default Navbar;
