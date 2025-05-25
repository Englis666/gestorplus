/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { TextInput, Card, DataTable, ActivityIndicator, Snackbar, Button } from "react-native-paper";
import axios from "axios";
import API_URL from "../config";
import FormularioAgregarConvocatoria from "./form/agregarConvocatoria";

const TablaConvocatorias = () => {
    const [convocatorias, setConvocatorias] = useState([]);
    const [cargos, setCargos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [agregar, setAgregar] = useState({
        nombreConvocatoria: "",
        descripcion: "",
        requisitos: "",
        salario: "",
        cantidadConvocatoria: "",
        idcargo: "",
    });
    const [selectedCargo, setSelectedCargo] = useState('');

    useEffect(() => {
        axios.get(API_URL, { params: { action: "obtenerCargos" } })
            .then(response => {
                const cargosData = response.data?.cargos;
                setCargos(Array.isArray(cargosData) ? cargosData : []);
            })
            .catch(() => setError("Hubo un problema al cargar los cargos"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        axios.get(API_URL, { params: { action: "obtenerConvocatorias" } })
            .then(response => {
                const convocatoriasData = response.data?.convocatorias;
                setConvocatorias(Array.isArray(convocatoriasData) ? convocatoriasData : []);
            })
            .catch(() => setError("Hubo un problema al cargar las Convocatorias"))
            .finally(() => setLoading(false));
    }, []);

    const handleAgregar = (e) => {
        e.preventDefault();
        if (!selectedCargo) {
            setError("Por favor, seleccione un cargo.");
            return;
        }
        axios.post("http://localhost/gestorplus/backend/", {
            action: "agregarConvocatoria",
            ...agregar,
            idcargo: selectedCargo,
        })
        .then(response => {
            setConvocatorias(response.data?.convocatorias);
            Alert.alert("Éxito", "Convocatoria agregada correctamente");
        })
        .catch(() => setError("Hubo un problema al agregar la convocatoria"))
        .finally(() => setLoading(false));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Gestión y Control de Convocatorias</Text>

            {error && <Snackbar visible={true} onDismiss={() => setError(null)}>{error}</Snackbar>}

            {loading ? (
                <ActivityIndicator animating={true} size="large" style={styles.loading} />
            ) : (
                <View style={styles.cardContainer}>
                    <Card style={styles.card}>
                        <Card.Title title="Lista de Convocatorias" titleStyle={styles.cardTitle} />
                        <Card.Content>
                            <ScrollView horizontal={true}>
                                <DataTable style={styles.table}>
                                    <DataTable.Header style={styles.tableHeader}>
                                        <DataTable.Title style={styles.columnHeader}>Nombre</DataTable.Title>
                                        <DataTable.Title style={styles.columnHeader}>Descripción</DataTable.Title>
                                        <DataTable.Title style={styles.columnHeader}>Salario</DataTable.Title>
                                        <DataTable.Title style={styles.columnHeader}>Fecha Apertura</DataTable.Title>
                                    </DataTable.Header>

                                    {convocatorias.map((convocatoria) => (
                                        <DataTable.Row key={convocatoria.idconvocatoria} style={styles.tableRow}>
                                            <DataTable.Cell style={styles.cell}>{convocatoria.nombreConvocatoria}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{convocatoria.descripcion}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{convocatoria.salario}</DataTable.Cell>
                                            <DataTable.Cell style={styles.cell}>{convocatoria.fecha_apertura}</DataTable.Cell>
                                        </DataTable.Row>
                                    ))}
                                </DataTable>
                            </ScrollView>
                        </Card.Content>
                    </Card>

                    <FormularioAgregarConvocatoria
                        agregar={agregar}
                        setAgregar={setAgregar}
                        handleAgregar={handleAgregar}
                        cargos={cargos}
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fafafa", // Fondo suave gris claro
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        textAlign: "center",
        marginBottom: 20,
        color: "#333", // Texto oscuro para mayor contraste
    },
    cardContainer: {
        marginTop: 20,
        backgroundColor: "#fff", // Fondo blanco
        borderRadius: 12, // Bordes suaves
        elevation: 2, // Sombra suave
        padding: 16,
    },
    card: {
        borderRadius: 12,
        backgroundColor: "#fff",
        borderColor: "#ddd", // Borde gris claro
        borderWidth: 1,
    },
    cardTitle: {
        color: "#333", // Título en color gris oscuro
        fontSize: 20,
    },
    loading: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    table: {
        flex: 1,
        minHeight: 200,
    },
    tableHeader: {
        backgroundColor: "#f5f5f5", // Fondo gris muy suave para los encabezados
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    columnHeader: {
        color: "#333",
        fontWeight: "600",
        textAlign: "center",
        fontSize: 14,
        paddingVertical: 12,
    },
    tableRow: {
        backgroundColor: "#fff", 
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
    },
    cell: {
        backgroundColor: "#fff", 
        color: "#333", 
        textAlign: "center",
        paddingVertical: 10,
        fontSize: 14,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: "#333", 
        color: "#fff",
        borderRadius: 8,
    },
});

export default TablaConvocatorias;
