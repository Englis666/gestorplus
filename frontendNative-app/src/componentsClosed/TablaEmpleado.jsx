import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import Estadisticas from "./Estadisticas";
import Grafica from "./Grafica";

const TablaEmpleado = ({ action }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");

        if (!token) {
          setError("Token no encontrado.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);

        if (!decodedToken) {
          setError("Token inválido.");
          setLoading(false);
          return;
        }

        if (decodedToken?.exp * 1000 < Date.now()) {
          setError("El token ha expirado.");
          setLoading(false);
          await AsyncStorage.removeItem("auth_token");
          return;
        }

        setRol(decodedToken?.data?.rol || "Desconocido");

        const headers = {
          Accept: "application/json",
          Authorization: `Bearer ${token.trim()}`,
        };

        const response = await axios.get("http://192.168.80.28/gestorplus/backend/", {
          headers,
          params: { action },
        });

        setNotificaciones(response.data?.Notificaciones || []);
      } catch (err) {
        setError("Error al cargar las notificaciones.");
      } finally {
        setLoading(false);
      }
    };

    obtenerToken();
  }, [action]);

  if (loading) return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  const jornadaNotificaciones = notificaciones.filter((n) => n.tipo === "Jornada");
  const actualizacionNotificaciones = notificaciones.filter((n) => n.tipo === (rol === "Empleado" ? "Aceptacion" : "Postulacion"));
  const generalNotificaciones = notificaciones.filter((n) => n.tipo === "General");

  const renderNotificacion = ({ item }) => (
    <TouchableOpacity style={styles.notificacion} onPress={() => console.log("Ver detalles de:", item)}>
      <Text style={styles.text}>{item.descripcionNotificacion}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <Estadisticas />
        <Text style={styles.title}>Notificaciones</Text>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Notificaciones Generales</Text>
          {generalNotificaciones.length === 0 ? (
            <Text style={styles.empty}>No hay notificaciones disponibles.</Text>
          ) : (
            <FlatList
              data={generalNotificaciones}
              renderItem={renderNotificacion}
              keyExtractor={(item) => item.idnotificacion.toString()}
              nestedScrollEnabled={true}
              style={styles.scrollContainer}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Notificaciones de Actualización</Text>
          {actualizacionNotificaciones.length === 0 ? (
            <Text style={styles.empty}>No hay notificaciones de actualización.</Text>
          ) : (
            <FlatList
              data={actualizacionNotificaciones}
              renderItem={renderNotificacion}
              keyExtractor={(item) => item.idnotificacion.toString()}
              nestedScrollEnabled={true}
              style={styles.scrollContainer}
            />
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.subtitle}>Control de entradas de trabajo</Text>
          {jornadaNotificaciones.length === 0 ? (
            <Text style={styles.empty}>No hay registros de jornada.</Text>
          ) : (
            <FlatList
              data={jornadaNotificaciones}
              renderItem={renderNotificacion}
              keyExtractor={(item) => item.idnotificacion.toString()}
              nestedScrollEnabled={true}
              style={styles.scrollContainer}
            />
          )}
        </View>
      </View>
      <Grafica />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: { flexGrow: 1 },
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
  loader: { marginTop: 20 },
  error: { textAlign: "center", color: "red", fontSize: 16, marginTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  card: {
    backgroundColor: "white",
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  notificacion: {
    padding: 10,
    backgroundColor: "#007bff",
    marginBottom: 8,
    borderRadius: 8,
  },
  text: { color: "white", fontSize: 16 },
  empty: { textAlign: "center", fontSize: 16, color: "gray", marginVertical: 10 },
  scrollContainer: {
    maxHeight: 200,
  },
});

export default TablaEmpleado;
