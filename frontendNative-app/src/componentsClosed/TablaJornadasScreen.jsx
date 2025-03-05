import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://192.168.68.195/gestorplus/backend";

const TablaJornadas = () => {
  const [jornadas, setJornadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (!token) throw new Error("No se encontró un token");

        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) throw new Error("El token está expirado");

        const Rol = decodedToken?.data?.rol;
        setRol(Rol);

        const roleActions = {
          "1": "obtenerTodasLasJornadas",
          "2": "obtenerTodasLasJornadas",
          "3": "obtenerJornadas",
        };

        const action = roleActions[Rol];
        if (!action) {
          setError("Rol no reconocido");
          setLoading(false);
          return;
        }

        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          params: { action },
        });

        const Jornadas = response.data?.Jornadas;
        if (Array.isArray(Jornadas)) {
          setJornadas(Jornadas);
        } else {
          setJornadas([]);
          setError("Las Jornadas no son un array");
        }
      } catch (error) {
        setError(error.message || "Hubo un problema al cargar las Jornadas.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const actualizarJornada = (idJornada, estado) => {
    setJornadas((prevJornadas) =>
      prevJornadas.map((jornada) =>
        jornada.idJornada === idJornada ? { ...jornada, estado } : jornada
      )
    );
  };

  const handleCorroborar = async (idJornada) => {
    try {
      await axios.post(`${API_URL}/`, {
        action: "corroborarJornada",
        data: { idJornada },
      });
      actualizarJornada(idJornada, true);
      Alert.alert("Éxito", "La jornada ha sido corroborada correctamente.");
    } catch {
      Alert.alert("Error", "Hubo un problema al corroborar la jornada.");
    }
  };

  const handleNoCorroborar = async (idJornada) => {
    try {
      await axios.post(`${API_URL}/`, {
        action: "noCorroborarJornada",
        data: { idJornada },
      });
      actualizarJornada(idJornada, false);
      Alert.alert("Éxito", "La jornada ha sido marcada como no corroborada.");
    } catch {
      Alert.alert("Error", "Hubo un problema al procesar la solicitud.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>;

  return (
    <ScrollView>
      <Text style={{ fontSize: 18, fontWeight: "bold", textAlign: "center", marginVertical: 10 }}>
        Jornadas (Control de Entrada de Trabajo)
      </Text>
      {jornadas.length > 0 ? (
        jornadas.map((jornada) => (
          <View key={jornada.idJornada} style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>Fecha: {jornada.fecha}</Text>
            <Text>Hora de Entrada: {jornada.horaEntrada}</Text>
            <Text>Hora de Salida: {jornada.horaSalida}</Text>
            <Text>Empleado: {jornada.nombres}</Text>
            <Text>Estado: {jornada.estado ? "Jornada admitida" : "Jornada no admitida"}</Text>
            {rol === "1" || rol === "2" ? (
              <View style={{ flexDirection: "row", marginTop: 10 }}>
                <Button title="Corroborar" onPress={() => handleCorroborar(jornada.idJornada)} />
                <View style={{ width: 10 }} />
                <Button title="No corroborar" color="red" onPress={() => handleNoCorroborar(jornada.idJornada)} />
              </View>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>No hay jornadas disponibles.</Text>
      )}
    </ScrollView>
  );
};

export default TablaJornadas;
