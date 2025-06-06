/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import API_URL from "../config"; // Importamos la URL base

const TablaEmpleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");

        if (!token) {
          setError("Token no encontrado.");
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode(token);
        if (decodedToken?.exp * 1000 < Date.now()) {
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerUsuarios" },
        });

        console.log("Respuesta de la API:", response.data);

        const empleadosData = response.data?.RRHH;
        setEmpleados(Array.isArray(empleadosData) ? empleadosData : []);
      } catch (err) {
        console.error("Error al obtener empleados:", err);
        setError("Hubo un problema al cargar los empleados.");
      }
      setLoading(false);
    };

    fetchEmpleados();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empleados (Control de Información)</Text>
      {empleados.length === 0 ? (
        <Text style={styles.noData}>No hay empleados disponibles.</Text>
      ) : (
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.num_doc.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}><Text style={styles.bold}>Nombre:</Text> {item.nombres}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Email:</Text> {item.email}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Rol:</Text> {item.nombreRol}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Tipo Documento:</Text> {item.tipoDoc}</Text>
              <Text style={styles.text}><Text style={styles.bold}>Número Documento:</Text> {item.num_doc}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ECF0F1", padding: 16 },
  title: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { color: "red", textAlign: "center", marginTop: 20 },
  noData: { textAlign: "center", fontSize: 16, color: "#555" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  text: { fontSize: 14, marginBottom: 4 },
  bold: { fontWeight: "bold" },
  button: { backgroundColor: "blue", padding: 10, marginTop: 10, borderRadius: 5, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});

export default TablaEmpleados;
