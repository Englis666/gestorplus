import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TablaJornadas = () => {
    const [Jornadas, setJornadas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rol, setRol] = useState(null);

    useEffect(() => {
        const fetchJornadas = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                if (!token) throw new Error("Token no encontrado");

                const decodedToken = jwtDecode(token);
                if (decodedToken?.exp * 1000 < Date.now()) {
                    throw new Error("El token ha expirado");
                }

                const Rol = decodedToken?.data?.rol;
                setRol(Rol);

                const roleActions = {
                    "1": "obtenerTodasLasJornadas",
                    "2": "obtenerTodasLasJornadas",
                    "3": "obtenerJornadas",
                };

                const action = roleActions[Rol];
                if (!action) throw new Error("Rol no reconocido");

                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { action },
                });

                setJornadas(response.data?.Jornadas || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchJornadas();
    }, []);

    const handleCorroborar = async (idJornada) => {
        try {
            const response = await axios.post("http://localhost/gestorplus/backend/", {
                action: "corroborarJornada",
                data: { idJornada },
            });
            Alert.alert("Éxito", "La jornada ha sido corroborada correctamente.");
        } catch (err) {
            Alert.alert("Error", "Hubo un problema al corroborar la jornada.");
        }
    };

    const handleNoCorroborar = async (idJornada) => {
        try {
            const response = await axios.post("http://localhost/gestorplus/backend/", {
                action: "noCorroborarJornada",
                data: { idJornada },
            });
            Alert.alert("Éxito", "La jornada ha sido marcada como no corroborada.");
        } catch (err) {
            Alert.alert("Error", "Hubo un problema al procesar la solicitud.");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                Jornadas (Control de Entrada de Trabajo)
            </Text>
            <FlatList
                data={Jornadas}
                keyExtractor={(item) => item.idJornada.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
                        <Text>Fecha: {item.fecha}</Text>
                        <Text>Hora de Entrada: {item.horaEntrada}</Text>
                        <Text>Hora de Salida: {item.horaSalida}</Text>
                        <Text>Empleado: {item.nombres}</Text>
                        <Text>Estado: {item.estado ? "Jornada admitida" : "Jornada no admitida"}</Text>
                        {(rol === "1" || rol === "2") && (
                            <View style={{ flexDirection: "row", marginTop: 10 }}>
                                <TouchableOpacity
                                    style={{ backgroundColor: "green", padding: 10, marginRight: 10 }}
                                    onPress={() => handleCorroborar(item.idJornada)}
                                >
                                    <Text style={{ color: "white" }}>Corroborar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ backgroundColor: "red", padding: 10 }}
                                    onPress={() => handleNoCorroborar(item.idJornada)}
                                >
                                    <Text style={{ color: "white" }}>No corroborar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

export default TablaJornadas;
