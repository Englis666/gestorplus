import React, { useState, useEffect } from "react";
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput, ScrollView
} from "react-native";
import axios from "axios";
import API_URL from "../config";

const TablaCargos = () => {
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nuevoCargo, setNuevoCargo] = useState("");

    useEffect(() => {
        fetchCargos();
    }, []);

    const fetchCargos = async () => {
        try {
            const response = await axios.get(API_URL, {
                params: { action: "obtenerCargos" },
            });
            const lista = response.data?.cargos;
            setCargos(Array.isArray(lista) ? lista : []);
            setLoading(false);
        } catch (err) {
            console.error("[fetchCargos] Error al obtener los cargos:", err);
            setError("Error al obtener los cargos.");
            setCargos([]);
            setLoading(false);
        }
    };

    const desactivarCargo = async (idCargo) => {
        try {
            await axios.patch(
                API_URL + "?action=desactivarCargo",
                { idCargo },
            );
            await fetchCargos();
        } catch (err) {
            const mensaje = err?.response?.data?.error ??
                "No se pudo desactivar el cargo. Inténtalo de nuevo.";
            Alert.alert("Error", mensaje);
        }
    };

    const activarCargo = async (idCargo) => {
        try {
            await axios.patch(
                API_URL + "?action=activarCargo",
                { idCargo },
            );
            await fetchCargos();
        } catch (err) {
            console.error("[activarCargo] error al activar el cargo:", err);
            Alert.alert("Error", "No se pudo activar el cargo. Inténtalo de nuevo.");
        }
    };

    const agregarNuevoCargo = async () => {
        if (!nuevoCargo.trim()) {
            Alert.alert("Error", "El nombre del cargo no puede estar vacío.");
            return;
        }
        try {
            const response = await axios.post(API_URL, {
                action: "agregarCargo",
                nombreCargo: nuevoCargo,
            });
            setNuevoCargo("");
            await fetchCargos();
        } catch (err) {
            const mensaje = err?.response?.data?.error ??
                "No se pudo agregar el cargo. Inténtalo de nuevo.";
            Alert.alert("Error", mensaje);
        }
    };

    if (loading) {
        return <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#007bff" /></View>;
    }

    if (error) {
        return <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View>;
    }

    return (
        <ScrollView style={styles.scrollViewContainer} contentContainerStyle={styles.container}>
            <Text style={styles.title}>Cargos del sistema</Text>

            <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Cargos existentes</Text>
                <FlatList
                    data={cargos}
                    keyExtractor={(item, index) => (item.idCargo || item.idcargo || item.id || index).toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.cargoNombre}>{item.nombreCargo}</Text>
                            <Text style={styles.cargoEstado}>Estado: {item.estadoCargo}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity
                                    style={[styles.button, styles.desactivarButton, item.estadoCargo !== "Activo" && styles.disabledButton]}
                                    onPress={() => desactivarCargo(item.idCargo || item.idcargo || item.id)}
                                    disabled={item.estadoCargo !== "Activo"}
                                >
                                    <Text style={styles.buttonText}>Desactivar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, styles.activarButton, item.estadoCargo === "Activo" && styles.disabledButton]}
                                    onPress={() => activarCargo(item.idCargo || item.idcargo || item.id)}
                                    disabled={item.estadoCargo === "Activo"}
                                >
                                    <Text style={styles.buttonText}>Activar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyListText}>No existen cargos en la base de datos</Text>}
                />
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Agregar Nuevo Cargo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre del nuevo cargo"
                    value={nuevoCargo}
                    onChangeText={setNuevoCargo}
                />
                <TouchableOpacity style={styles.agregarButton} onPress={agregarNuevoCargo}>
                    <Text style={styles.buttonText}>Agregar Cargo</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollViewContainer: {
        flex: 1,
        backgroundColor: "#f4f4f4",
    },
    container: {
        padding: 20,
        alignItems: "stretch", // Para que los hijos ocupen el ancho completo
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    listContainer: {
        marginBottom: 20,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    listTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#555",
    },
    listItem: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    cargoNombre: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    cargoEstado: {
        fontSize: 14,
        color: "#777",
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        minWidth: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    desactivarButton: {
        backgroundColor: "#dc3545",
    },
    activarButton: {
        backgroundColor: "#28a745",
    },
    disabledButton: {
        backgroundColor: "#6c757d",
        opacity: 0.7,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    emptyListText: {
        fontSize: 16,
        color: "#777",
        textAlign: "center",
        paddingVertical: 20,
    },
    formContainer: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#555",
        textAlign: "center",
    },
    input: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    agregarButton: {
        backgroundColor: "#007bff",
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
});

export default TablaCargos;