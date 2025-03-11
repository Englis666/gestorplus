import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, Alert, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import API_URL from "../config"; // Importamos la URL desde config.js

const TablaVacantes = () => {
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
        axios.get(`${API_URL}`, { params: { action: "obtenerConvocatorias" } })
            .then(response => {
                const data = response.data?.convocatorias;
                setConvocatorias(Array.isArray(data) ? data : []);
            })
            .catch(() => setError("Hubo un problema al cargar las Convocatorias"))
            .finally(() => setLoading(false));
    }, []);

    const handleAgregar = () => {
        axios.post(`${API_URL}`, { action: "agregarConvocatoria", ...agregar })
            .then(response => {
                if (response.data.success) {
                    Alert.alert("Éxito", "Vacante agregada con éxito");
                    setConvocatorias([...convocatorias, agregar]);
                    setAgregar({ nombreConvocatoria: "", descripcion: "", requisitos: "", salario: "", cantidadConvocatoria: "" });
                } else {
                    Alert.alert("Error", "No se pudo agregar la vacante");
                }
            })
            .catch(() => Alert.alert("Error", "Hubo un problema al agregar la vacante"));
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión y Control de Convocatorias</Text>
            <FlatList
                data={convocatorias}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Nombre: {item.nombreConvocatoria}</Text>
                        <Text>Descripción: {item.descripcion}</Text>
                        <Text>Requisitos: {item.requisitos}</Text>
                        <Text>Salario: {item.salario}</Text>
                        <Text>Cupos: {item.cantidadConvocatoria}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttonSuccess}>
                                <Text style={styles.buttonText}>Activar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonDanger}>
                                <Text style={styles.buttonText}>Desactivar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text>No hay Convocatorias disponibles.</Text>}
            />
            <View style={styles.form}>
                <Text style={styles.formTitle}>Agregar Vacante</Text>
                <TextInput style={styles.input} placeholder="Nombre" value={agregar.nombreConvocatoria} onChangeText={text => setAgregar({ ...agregar, nombreConvocatoria: text })} />
                <TextInput style={styles.input} placeholder="Descripción" value={agregar.descripcion} onChangeText={text => setAgregar({ ...agregar, descripcion: text })} />
                <TextInput style={styles.input} placeholder="Requisitos" value={agregar.requisitos} onChangeText={text => setAgregar({ ...agregar, requisitos: text })} />
                <TextInput style={styles.input} placeholder="Salario" keyboardType="numeric" value={agregar.salario} onChangeText={text => setAgregar({ ...agregar, salario: text })} />
                <TextInput style={styles.input} placeholder="Cupos" keyboardType="numeric" value={agregar.cantidadConvocatoria} onChangeText={text => setAgregar({ ...agregar, cantidadConvocatoria: text })} />
                <Button title="Agregar Vacante" onPress={handleAgregar} color="#007bff" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
    card: { backgroundColor: "#f8f9fa", padding: 16, borderRadius: 10, marginBottom: 10, elevation: 2 },
    buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    buttonSuccess: { backgroundColor: "green", padding: 10, borderRadius: 5 },
    buttonDanger: { backgroundColor: "red", padding: 10, borderRadius: 5 },
    buttonText: { color: "white", textAlign: "center" },
    form: { marginTop: 20, padding: 16, backgroundColor: "#fff", borderRadius: 10, elevation: 2 },
    formTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginBottom: 10 },
    error: { color: "red", textAlign: "center", marginTop: 20 }
});

export default TablaVacantes;
