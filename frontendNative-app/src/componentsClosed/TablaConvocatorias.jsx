import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert, ActivityIndicator } from "react-native";
import axios from "axios";

const API_URL = "http://192.168.80.28/gestorplus/backend/";

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
        axios
            .get(API_URL, { params: { action: "obtenerConvocatorias" } })
            .then((response) => {
                const convocatoriasData = response.data?.convocatorias;
                if (Array.isArray(convocatoriasData)) {
                    setConvocatorias(convocatoriasData);
                } else {
                    setConvocatorias([]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al obtener las convocatorias", err);
                setError("Hubo un problema al cargar las Convocatorias");
                setLoading(false);
            });
    }, []);

    const handleAgregar = () => {
        axios
            .post(API_URL, {
                action: "agregarConvocatoria",
                ...agregar,
            })
            .then((response) => {
                Alert.alert("Éxito", "Convocatoria agregada correctamente");
                setAgregar({ nombreConvocatoria: "", descripcion: "", requisitos: "", salario: "", cantidadConvocatoria: "" });
            })
            .catch((err) => {
                console.error("Error al agregar convocatoria", err);
                setError("Hubo un problema al agregar la Convocatoria");
            });
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>Gestión de Convocatorias</Text>
            {convocatorias.length > 0 ? (
                convocatorias.map((convocatoria) => (
                    <View key={convocatoria.idconvocatoria} style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 5 }}>
                        <Text>📌 {convocatoria.nombreConvocatoria}</Text>
                        <Text>📄 {convocatoria.descripcion}</Text>
                        <Text>✅ {convocatoria.requisitos}</Text>
                        <Text>💰 Salario: {convocatoria.salario}</Text>
                        <Text>👥 Cupos: {convocatoria.cantidadConvocatoria}</Text>
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 10 }}>
                            <Button title="Activar" onPress={() => Alert.alert("Activado", "Convocatoria activada")} />
                            <Button title="Desactivar" color="red" onPress={() => Alert.alert("Desactivado", "Convocatoria desactivada")} />
                        </View>
                    </View>
                ))
            ) : (
                <Text style={{ textAlign: "center", marginTop: 20 }}>No hay convocatorias disponibles.</Text>
            )}

            <View style={{ marginTop: 30, padding: 20, borderWidth: 1, borderRadius: 5 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Agregar Nueva Convocatoria</Text>
                <TextInput placeholder="Nombre" value={agregar.nombreConvocatoria} onChangeText={(text) => setAgregar({ ...agregar, nombreConvocatoria: text })} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
                <TextInput placeholder="Descripción" value={agregar.descripcion} onChangeText={(text) => setAgregar({ ...agregar, descripcion: text })} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
                <TextInput placeholder="Requisitos" value={agregar.requisitos} onChangeText={(text) => setAgregar({ ...agregar, requisitos: text })} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
                <TextInput placeholder="Salario" keyboardType="numeric" value={agregar.salario} onChangeText={(text) => setAgregar({ ...agregar, salario: text })} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
                <TextInput placeholder="Cupos" keyboardType="numeric" value={agregar.cantidadConvocatoria} onChangeText={(text) => setAgregar({ ...agregar, cantidadConvocatoria: text })} style={{ borderWidth: 1, padding: 8, marginBottom: 10 }} />
                <Button title="Agregar Convocatoria" onPress={handleAgregar} />
            </View>
        </ScrollView>
    );
};

export default TablaConvocatorias;