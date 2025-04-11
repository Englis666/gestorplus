import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, ScrollView, Alert, ActivityIndicator, StyleSheet, TouchableOpacity
} from "react-native";
import axios from "axios";
import { API_URL } from "../config"; // Asegúrate de que esté correctamente definido

const TablaConvocatorias = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agregarVisible, setAgregarVisible] = useState(false);
    const [agregar, setAgregar] = useState({
        nombreConvocatoria: "",
        descripcion: "",
        requisitos: "",
        salario: "",
        cantidadConvocatoria: "",
    });

    const fetchConvocatorias = async () => {
        try {
            const response = await axios.get(API_URL, {
                params: { action: "obtenerConvocatorias" }
            });

            console.log("Respuesta cruda:", response);
            console.log("Respuesta data:", response.data);

            const data = response.data?.convocatorias || [];  // Default a un array vacío si no existe 'convocatorias'

            if (!Array.isArray(data)) {
                throw new Error("El servidor no devolvió una lista válida de convocatorias.");
            }

            setConvocatorias(data);
            setError(null);
        } catch (err) {
            console.error("Error al obtener convocatorias:", err.message);
            console.log("Detalles del error:", err.response?.data || err);
            setError("Hubo un problema al cargar las Convocatorias.");
            setConvocatorias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConvocatorias();
    }, []);

    const handleAgregar = async () => {
        if (!agregar.nombreConvocatoria || !agregar.descripcion || !agregar.requisitos || !agregar.salario || !agregar.cantidadConvocatoria) {
            Alert.alert("Advertencia", "Por favor, complete todos los campos para agregar una convocatoria.");
            return;
        }
        try {
            await axios.post(API_URL, { action: "agregarConvocatoria", ...agregar });
            Alert.alert("Éxito", "Convocatoria agregada correctamente");
            setAgregar({
                nombreConvocatoria: "",
                descripcion: "",
                requisitos: "",
                salario: "",
                cantidadConvocatoria: ""
            });
            setAgregarVisible(false);
            fetchConvocatorias();
        } catch (err) {
            console.error("Error al agregar convocatoria:", err.message);
            Alert.alert("Error", "Hubo un problema al agregar la Convocatoria.");
        }
    };

    const handleActivar = (id) => {
        Alert.alert("Confirmación", "¿Deseas activar esta convocatoria?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Aceptar", onPress: () => console.log(`Convocatoria ${id} activada`) },
        ]);
    };

    const handleDesactivar = (id) => {
        Alert.alert("Confirmación", "¿Deseas desactivar esta convocatoria?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Aceptar", onPress: () => console.log(`Convocatoria ${id} desactivada`) },
        ]);
    };

    if (loading) return <ActivityIndicator size="large" color="#007bff" style={styles.loader} />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Gestión de Convocatorias</Text>

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAgregarVisible(!agregarVisible)}
            >
                <Text style={styles.addButtonText}>
                    {agregarVisible ? 'Ocultar Formulario' : 'Agregar Nueva Convocatoria'}
                </Text>
            </TouchableOpacity>

            {agregarVisible && (
                <View style={styles.formContainer}>
                    <Text style={styles.subTitle}>Nueva Convocatoria</Text>
                    <TextInput
                        placeholder="Nombre"
                        value={agregar.nombreConvocatoria}
                        onChangeText={(text) => setAgregar({ ...agregar, nombreConvocatoria: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Descripción"
                        value={agregar.descripcion}
                        onChangeText={(text) => setAgregar({ ...agregar, descripcion: text })}
                        style={styles.input}
                        multiline
                    />
                    <TextInput
                        placeholder="Requisitos"
                        value={agregar.requisitos}
                        onChangeText={(text) => setAgregar({ ...agregar, requisitos: text })}
                        style={styles.input}
                        multiline
                    />
                    <TextInput
                        placeholder="Salario"
                        keyboardType="numeric"
                        value={agregar.salario}
                        onChangeText={(text) => setAgregar({ ...agregar, salario: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Cupos"
                        keyboardType="numeric"
                        value={agregar.cantidadConvocatoria}
                        onChangeText={(text) => setAgregar({ ...agregar, cantidadConvocatoria: text })}
                        style={styles.input}
                    />
                    <TouchableOpacity style={styles.submitButton} onPress={handleAgregar}>
                        <Text style={styles.submitButtonText}>Guardar Convocatoria</Text>
                    </TouchableOpacity>
                </View>
            )}

            {convocatorias.length > 0 ? (
                <ScrollView horizontal style={{ marginTop: 20 }}>
                    <View style={styles.table}>
                        <View style={styles.tableHeader}>
                            <Text style={[styles.headerText, { width: 150 }]}>Nombre</Text>
                            <Text style={[styles.headerText, { width: 200 }]}>Descripción</Text>
                            <Text style={[styles.headerText, { width: 200 }]}>Requisitos</Text>
                            <Text style={[styles.headerText, { width: 100, textAlign: 'right' }]}>Salario</Text>
                            <Text style={[styles.headerText, { width: 80, textAlign: 'right' }]}>Cupos</Text>
                            <Text style={[styles.headerText, { width: 120 }]}>Acciones</Text>
                        </View>
                        {convocatorias.map((convocatoria) => (
                            <View key={convocatoria.idconvocatoria} style={styles.tableRow}>
                                <Text style={[styles.rowText, { width: 150 }]}>{convocatoria.nombreConvocatoria}</Text>
                                <Text style={[styles.rowText, { width: 200 }]}>{convocatoria.descripcion}</Text>
                                <Text style={[styles.rowText, { width: 200 }]}>{convocatoria.requisitos}</Text>
                                <Text style={[styles.rowText, { width: 100, textAlign: 'right' }]}>{convocatoria.salario}</Text>
                                <Text style={[styles.rowText, { width: 80, textAlign: 'right' }]}>{convocatoria.cantidadConvocatoria}</Text>
                                <View style={[styles.actionsContainer, { width: 120 }]}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: 'green' }]}
                                        onPress={() => handleActivar(convocatoria.idconvocatoria)}
                                    >
                                        <Text style={styles.actionButtonText}>Activar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: 'red' }]}
                                        onPress={() => handleDesactivar(convocatoria.idconvocatoria)}
                                    >
                                        <Text style={styles.actionButtonText}>Desactivar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <Text style={styles.noData}>No hay convocatorias disponibles.</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f4f6f8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    addButton: {
        backgroundColor: "#007bff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        alignItems: "center",
    },
    addButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    formContainer: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#fff",
        marginBottom: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
        color: "#555",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 12,
        backgroundColor: "#f9f9f9",
    },
    submitButton: {
        backgroundColor: "#28a745",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    submitButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
    noData: {
        textAlign: "center",
        marginTop: 20,
        fontStyle: "italic",
        color: "#777",
    },
    table: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    headerText: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#333",
    },
    tableRow: {
        flexDirection: "row",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        alignItems: 'center',
    },
    rowText: {
        fontSize: 14,
        color: "#555",
    },
    actionsContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    actionButtonText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
});

export default TablaConvocatorias;
