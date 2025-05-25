/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config"; // Importa la URL de la API

const Grafica = () => {
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalAusencias, setTotalAusencias] = useState(0);
  const [notificacionesGenerales, setNotificacionesGenerales] = useState(0); // Nuevo estado
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");

        if (!token) throw new Error("No se encontró el token.");

        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) throw new Error("El token ha expirado.");

        const response = await axios.get(`${API_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerTotalEstadisticas" },
        });

        setTotalEntradas(response.data.totalEntradas || 0);
        setTotalAusencias(response.data.totalAusencias || 0);
        setNotificacionesGenerales(response.data.totalGenerales || 0); // Obtener notificaciones
      } catch (err) {
        setError(err.message || "Error al obtener las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#3498db" style={styles.loading} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  const chartData = {
    labels: ["Ausencias", "Entradas", "Notificaciones"], // Añadir "Notificaciones"
    datasets: [{ data: [totalAusencias, totalEntradas, notificacionesGenerales] }], // Añadir notificacionesGenerales
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfica de Ausencias, Entradas y Notificaciones</Text> {/* Título actualizado */}
      <BarChart
        data={chartData}
        width={Dimensions.get("window").width - 40}
        height={250}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.7,
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  loading: {
    marginTop: 50,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
  chart: {
    borderRadius: 8,
    padding: 10,
  },
});

export default Grafica;
