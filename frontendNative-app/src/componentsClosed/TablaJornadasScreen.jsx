import React, { useState, useEffect } from "react";
import { View, Text, Button, ScrollView, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaJornadas = () => {
  const [jornadas, setJornadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    


    const token = getCookie("auth_token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
        if (isTokenExpired) {
          setError("El token ha expirado.");
          setLoading(false);
          return;
        }

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

        axios
          .get("http://localhost/gestorplus/backend/", {
            headers: { Authorization: `Bearer ${token}` },
            params: { action 
          })
          .then((response) => {
            const jornadas = response.data?.Jornadas || [];
            setJornadas(jornadas);
            setLoading(false);
          })
          .catch(() => {
            setError("Hubo un problema al cargar las jornadas.");
            setLoading(false);
          });
      } catch {
        setError("Token inválido o malformado.");
        setLoading(false);
      }
    } else {
      setError("Token no encontrado.");
      setLoading(false);
    }
  }, []);

  const handleCorroborar = (idJornada) => {
    axios.post("http://localhost/gestorplus/backend/", {
      action: "corroborarJornada",
      data: { idJornada },
    }).then(() => {
      Alert.alert("Éxito", "La jornada ha sido corroborada correctamente.");
    }).catch(() => {
      Alert.alert("Error", "Hubo un problema al corroborar la jornada.");
    });
  };

  const handleNoCorroborar = (idJornada) => {
    axios.post("http://localhost/gestorplus/backend/", {
      action: "noCorroborarJornada",
      data: { idJornada },
    }).then(() => {
      Alert.alert("Éxito", "La jornada ha sido marcada como no corroborada.");
    }).catch(() => {
      Alert.alert("Error", "Hubo un problema al procesar la solicitud.");
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

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
