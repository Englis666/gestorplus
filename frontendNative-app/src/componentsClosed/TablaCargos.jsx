import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const TablaCargos = () => {
    const [cargos, setCargos] = useState([]);
    const [nombreCargo, setNombreCargo] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://192.168.115.207/gestorplus/backend/", { params: { action: "obtenerCargos" } })
            .then((response) => {
                const data = response.data?.cargos;
                setCargos(Array.isArray(data) ? data : []);
            })
            .catch(() => setError("Error al obtener los cargos."))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = () => {
        if (!nombreCargo.trim()) {
            Alert.alert("Error", "El nombre del cargo no puede estar vacío.");
            return;
        }
        axios
            .post("http://localhost/gestorplus/backend/", {
                action: "agregarCargo",
                nombreCargo: nombreCargo,
            })
            .then((response) => {
                if (response.data.success) {
                    Alert.alert("Éxito", "Cargo agregado con éxito");
                    setCargos([...cargos, { nombreCargo, estadoCargo: "Activo" }]);
                    setNombreCargo("");
                } else {
                    Alert.alert("Error", "No se pudo agregar el cargo");
                }
            })
            .catch(() => Alert.alert("Error", "Error al agregar el cargo"));
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cargos del sistema</Text>
            <FlatList
                data={cargos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Nombre: {item.nombreCargo}</Text>
                        <Text>Estado: {item.estadoCargo}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noData}>No existen cargos en la base de datos</Text>}
            />
            <View style={styles.form}>
                <Text style={styles.formTitle}>Agregar un nuevo cargo</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre del cargo"
                    value={nombreCargo}
                    onChangeText={setNombreCargo}
                />
                <Button title="Agregar Cargo" onPress={handleSubmit} color="#007bff" />
            </View>
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
    form: {
        marginTop: 20,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    formTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
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

export default TablaCargos;
