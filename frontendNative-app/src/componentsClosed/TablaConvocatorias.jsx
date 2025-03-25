import React, { useState, useEffect } from "react";
import {
    View, Text, TextInput, Button, ScrollView, Alert, ActivityIndicator, StyleSheet
} from "react-native";
import axios from "axios";
import { API_URL } from "../config";

const TablaConvocatorias = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agregar, setAgregar] = useState({
        nombreConvocatoria: "",
        descripcion: "",
        requisitos: "",
        salario: "",
        cantidadConvocatoria: "",
    });

    useEffect(() => {
        fetchConvocatorias();
    }, []);

    const fetchConvocatorias = async () => {
        try {
            const response = await axios.get(API_URL, { params: { action: "obtenerConvocatorias" } });
            console.log(response);
            const data = response.data?.convocatorias;
            setConvocatorias(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error al obtener convocatorias:", err);
            setError("Hubo un problema al cargar las Convocatorias.");
        } finally {
            setLoading(false);
        }
    };

    const handleAgregar = async () => {
        try {
            await axios.post(API_URL, { action: "agregarConvocatoria", ...agregar });
            Alert.alert("Éxito", "Convocatoria agregada correctamente");
            setAgregar({ nombreConvocatoria: "", descripcion: "", requisitos: "", salario: "", cantidadConvocatoria: "" });
            fetchConvocatorias();
        } catch (err) {
            console.error("Error al agregar convocatoria:", err);
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

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Gestión de Convocatorias</Text>

            {convocatorias.length > 0 ? (
                convocatorias.map((convocatoria) => (
                    <View key={convocatoria.idconvocatoria} style={styles.card}>
                        <Text style={styles.text}><Text style={styles.label}>📌 Nombre:</Text> {convocatoria.nombreConvocatoria}</Text>
                        <Text style={styles.text}><Text style={styles.label}>📄 Descripción:</Text> {convocatoria.descripcion}</Text>
                        <Text style={styles.text}><Text style={styles.label}>✅ Requisitos:</Text> {convocatoria.requisitos}</Text>
                        <Text style={styles.text}><Text style={styles.label}>💰 Salario:</Text> {convocatoria.salario}</Text>
                        <Text style={styles.text}><Text style={styles.label}>👥 Cupos:</Text> {convocatoria.cantidadConvocatoria}</Text>

                        <View style={styles.buttonGroup}>
                            <Button title="Activar" onPress={() => handleActivar(convocatoria.idconvocatoria)} />
                            <Button title="Desactivar" color="red" onPress={() => handleDesactivar(convocatoria.idconvocatoria)} />
                        </View>
                    </View>
                ))
            ) : (
                <Text style={styles.noData}>No hay convocatorias disponibles.</Text>
            )}

            <View style={styles.formContainer}>
                <Text style={styles.subTitle}>Agregar Nueva Convocatoria</Text>

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
                />
                <TextInput
                    placeholder="Cargo de la convocatoria"
                    value={agregar.cargo}
                    onChangeText={(text) => setAgregar({ ...agregar, cargo: text })}
                />
                <TextInput
                    placeholder="Requisitos"
                    value={agregar.requisitos}
                    onChangeText={(text) => setAgregar({ ...agregar, requisitos: text })}
                    style={styles.input}
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

                <Button title="Agregar Convocatoria" onPress={handleAgregar} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
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
    buttonGroup: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    formContainer: {
        marginTop: 30,
        padding: 20,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    subTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
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

export default TablaConvocatorias;
