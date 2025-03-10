import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const TablaHorasExtra = () => {
    const [horasExtra, setHorasExtra] = useState([]);
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

                setRol(decodedToken?.data?.rol);

                axios.get("http://192.168.58.95/gestorplus/backend/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { action: "obtenerTodasLasHorasExtra" },
                })
                    .then((response) => {
                        const horas = response.data?.horasExtra;
                        setHorasExtra(Array.isArray(horas) ? horas : []);
                    })
                    .catch(() => setError("Hubo un problema al cargar las Horas Extra."))
                    .finally(() => setLoading(false));
            } catch (error) {
                setError("Token inválido o malformado.");
                setLoading(false);
            }
        } else {
            setError("Token no encontrado.");
            setLoading(false);
        }
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Horas Extra</Text>
            <Text style={styles.description}>Aquí puedes analizar tus horas extra. Para dudas, contacta con Recursos Humanos.</Text>
            <FlatList
                data={horasExtra}
                keyExtractor={(item) => item.idHoraextra.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Fecha: {item.fecha}</Text>
                        <Text>Horas Extra: {item.horasExtra}</Text>
                        <Text>Usuario: {item.usuario_num_doc}</Text>
                        {["1", "2"].includes(rol) && (
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.approveButton}>
                                    <Text style={styles.buttonText}>Aprobar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.rejectButton}>
                                    <Text style={styles.buttonText}>Rechazar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noData}>No hay horas extra registradas.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#f8f9fa",
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    approveButton: {
        backgroundColor: "green",
        padding: 8,
        borderRadius: 5,
    },
    rejectButton: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    noData: {
        textAlign: "center",
        marginTop: 20,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default TablaHorasExtra;
