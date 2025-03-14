import React, { useState, useEffect } from "react";
import {
    View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet
} from "react-native";
import axios from "axios";
import { API_URL } from "../config";

const TablaContratos = () => {
    const [contratos, setContratos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchContratos();
    }, []);

    const fetchContratos = async () => {
        try {
            const response = await axios.get(API_URL, {
                params: { action: "obtenerVinculaciones" },
            });

            const data = response.data?.Contratos;
            if (Array.isArray(data)) {
                setContratos(data);
            } else {
                console.error("Los contratos no están en un arreglo");
                setContratos([]);
            }
        } catch (err) {
            console.error("Error al obtener los contratos:", err);
            setError("Hubo un problema al cargar los contratos.");
        } finally {
            setLoading(false);
        }
    };

    const desactivarContrato = (id) => {
        Alert.alert(
            "Confirmación",
            "¿Estás seguro de desactivar este contrato y realizar paz y salvo?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Aceptar", onPress: () => console.log(`Contrato ${id} desactivado`) }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Cargando Contratos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vinculaciones</Text>

            <FlatList
                data={contratos}
                keyExtractor={(item) => item.num_doc.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}><Text style={styles.label}>Número de documento:</Text> {item.num_doc}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Nombre y Apellido:</Text> {item.nombre}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Inicio:</Text> {item.fecha_inicio}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Fin:</Text> {item.fecha_fin}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Tipo de contrato:</Text> {item.tipo_contrato}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Salario:</Text> {item.salario}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Estado:</Text> {item.estado}</Text>
                        <Text style={styles.text}><Text style={styles.label}>Firma:</Text> {item.fecha_firma}</Text>

                        <TouchableOpacity
                            style={styles.buttonDanger}
                            onPress={() => desactivarContrato(item.num_doc)}
                        >
                            <Text style={styles.buttonText}>Desactivar contrato y realizar paz y salvo</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noData}>No hay contratos registrados</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
        textAlign: "center",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 16,
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
    buttonDanger: {
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
        alignItems: "center",
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold",
    },
    noData: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
        fontStyle: "italic",
    },
});

export default TablaContratos;
