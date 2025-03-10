import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import axios from "axios";

const TablaCitaciones = () => {
    const [citaciones, setCitaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCitaciones = async () => {
            try {
                const response = await axios.get("http://192.168.58.95/gestorplus/backend/", {
                    params: { action: "obtenerCitaciones" },
                });

                const data = response.data.Citaciones;
                if (Array.isArray(data)) {
                    setCitaciones(data);
                } else {
                    console.error("Las citaciones no están en un arreglo");
                    setCitaciones([]);
                }
            } catch (err) {
                console.error("Error al obtener las citaciones", err);
                Alert.alert("Error", "Hubo un problema al cargar las citaciones.");
            } finally {
                setLoading(false);
            }
        };

        fetchCitaciones();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Cargando Citaciones...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Citaciones</Text>

            <FlatList
                data={citaciones}
                keyExtractor={(item) => item.identrevista.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}><Text style={styles.label}>Fecha:</Text> {item.fecha}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Hora:</Text> {item.hora}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Empleado:</Text> {item.nombres}</Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.button} onPress={() => Alert.alert("Asistencia registrada")}>
                                <Text style={styles.buttonText}>Asistencia cumplida</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, styles.noAsistencia]} onPress={() => Alert.alert("No asistencia registrada")}>
                                <Text style={styles.buttonText}>No asistencia</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    label: {
        fontWeight: "bold",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    button: {
        flex: 1,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
        alignItems: "center",
        marginHorizontal: 5,
    },
    noAsistencia: {
        backgroundColor: "#dc3545",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default TablaCitaciones;
