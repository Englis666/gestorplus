import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import axios from "axios";
import API_URL from "../config";

const TablaSistemaDeGestion = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}`, {
                    params: { action: "obtenerSistemaGestion" },
                });
                setData(response.data || []);
            } catch (err) {
                setError("Error al obtener los datos del sistema de gestión");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <ScrollView horizontal>
            <View style={styles.container}>
                <Text style={styles.title}>Sistema de Gestión</Text>
                <Text style={styles.subtitle}>Sistema de Gestión por aspirante y empleado</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={styles.cell}>{item.num_doc}</Text>
                            <Text style={styles.cell}>{item.nombre}</Text>
                            <Text style={styles.cell}>{item.salud}</Text>
                            <Text style={styles.cell}>{item.riesgos}</Text>
                            <Text style={styles.cell}>{item.recomendaciones}</Text>
                            <Text style={styles.cell}>{item.aptitud}</Text>
                            <Text style={styles.cell}>{item.comentarios}</Text>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Asignarle contrato</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        textAlign: "center",
        padding: 4,
    },
    button: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
});

export default TablaSistemaDeGestion;
