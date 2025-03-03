import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Grafica = () => {
  const [totalEntradas, setTotalEntradas] = useState(0);
  const [totalAusencias, setTotalAusencias] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");

        if (!token) {
          setError("No se encontró el token.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://192.168.43.98/gestorplus/backend/",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { action: "obtenerTotalEstadisticas" },
          },
        );

        setTotalEntradas(response.data.totalEntradas || 0);
        setTotalAusencias(response.data.totalAusencias || 0);
        setLoading(false);
      } catch (err) {
        setError("Error al obtener las estadísticas.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#3498db" style={styles.loading} />
    );
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfica de Ausencias y Entradas</Text>
      <BarChart
        data={{
          labels: ["Ausencias", "Entradas"],
          datasets: [{ data: [totalAusencias, totalEntradas] }],
        }}
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
