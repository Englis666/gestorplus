import React, { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = ({ setUserRole }) => {
  const navigation = useNavigation();

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem("auth_token"); // 🔹 Borra el token
      setUserRole(null); // 🔹 Actualiza el estado global
      navigation.reset({ index: 0, routes: [{ name: "Layout" }] }); // 🔹 Redirige al login
    };

    logout();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Saliendo...</Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LogoutScreen;
