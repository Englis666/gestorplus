import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

const TablaEmpleado = ({ action }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const obtenerToken = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        console.log("Token obtenido:", token);

        if (!token) {
          setError("Token no encontrado.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        console.log("Token decodificado:", decodedToken);
        setRol(decodedToken?.data?.rol);

        if (decodedToken?.exp * 1000 < Date.now()) {
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://192.168.63.193/gestorplus/backend/", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          params: { action },
        });

        console.log("Respuesta de API:", response.data);
        setNotificaciones(response.data?.Notificaciones || []);
      } catch (err) {
        console.error("Error en la API:", err);
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
    <View style={styles.container}>
      <Text style={styles.title}>Notificaciones</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Notificaciones Generales</Text>
        {generalNotificaciones.length === 0 ? (
          <Text style={styles.empty}>No hay notificaciones disponibles.</Text>
        ) : (
          <FlatList data={generalNotificaciones} renderItem={renderNotificacion} keyExtractor={(item) => item.idnotificacion.toString()} />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Notificaciones de Actualización</Text>
        {actualizacionNotificaciones.length === 0 ? (
          <Text style={styles.empty}>No hay notificaciones de actualización.</Text>
        ) : (
          <FlatList data={actualizacionNotificaciones} renderItem={renderNotificacion} keyExtractor={(item) => item.idnotificacion.toString()} />
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Control de entradas de trabajo</Text>
        {jornadaNotificaciones.length === 0 ? (
          <Text style={styles.empty}>No hay registros de jornada.</Text>
        ) : (
          <FlatList data={jornadaNotificaciones} renderItem={renderNotificacion} keyExtractor={(item) => item.idnotificacion.toString()} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa", padding: 10 },
  loader: { marginTop: 20 },
  error: { textAlign: "center", color: "red", fontSize: 16, marginTop: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  subtitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
  card: { backgroundColor: "white", padding: 15, marginBottom: 15, borderRadius: 10, elevation: 3 },
  notificacion: { padding: 10, backgroundColor: "#007bff", marginBottom: 8, borderRadius: 8 },
  text: { color: "white", fontSize: 16 },
  empty: { textAlign: "center", fontSize: 16, color: "gray", marginVertical: 10 },
});

export default TablaEmpleado;
