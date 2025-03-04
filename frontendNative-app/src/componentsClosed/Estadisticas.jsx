import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://192.168.115.207/gestorplus/backend/";

const Estadisticas = () => {
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalAusencias, setTotalAusencias] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (!token) throw new Error("No se encontró un token de autenticación.");

        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) throw new Error("El token ha expirado.");

        console.log("Token enviado en la petición:", token);
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: { action: "obtenerTodasLasEstadisticas" },
        });

        setTotalEntradas(response.data.totalEntradas || 0);
        setTotalAusencias(response.data.totalAusencias || 0);
      } catch (err) {
        setError(err.message || "Error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 1.1, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  if (loading) return <ActivityIndicator size="large" color="#3498db" style={styles.loading} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      {[{ title: "Total de Ausencias", value: totalAusencias },
      { title: "Entradas al Trabajo", value: totalEntradas },
      { title: "Total de Vacaciones", value: 0 }].map((item, index) => (
        <Animated.View
          key={index}
          style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECF0F1",
    padding: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    color: "#3498db",
    fontWeight: "bold",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 5,
    color: "#2c3e50",
  },
  loading: {
    marginTop: 50,
  },
  error: {
    color: "#e74c3c",
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
});

export default Estadisticas;
