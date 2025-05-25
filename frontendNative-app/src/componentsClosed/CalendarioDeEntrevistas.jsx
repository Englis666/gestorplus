/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import axios from "axios";
import API_URL from "../config"; // Importa la URL de la API

const CalendarioDeEntrevistas = ({ onSelectInterview }) => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.post(API_URL, { action: "obtenerEntrevistas" });

                // Validar que la API devuelve datos esperados
                if (response.data && Array.isArray(response.data.entrevistas)) {
                    setEntrevistas(response.data.entrevistas);
                } else {
                    throw new Error("Formato de respuesta inválido");
                }
            } catch (err) {
                setError("No se pudieron cargar las entrevistas");
                Alert.alert("Error", "No se pudieron obtener las entrevistas");
                console.error("Error al obtener entrevistas:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchEntrevistas();
    }, []);

    // Formatear entrevistas para el calendario
    const eventos = entrevistas.reduce((acc, entrevista) => {
        const fecha = entrevista.fecha ? moment(entrevista.fecha, "YYYY-MM-DD").format("YYYY-MM-DD") : null;
        if (fecha) acc[fecha] = { marked: true, dotColor: "blue" };
        return acc;
    }, {});

    const handleDayPress = (day) => {
        const entrevista = entrevistas.find(
            (e) => moment(e.fecha, "YYYY-MM-DD").format("YYYY-MM-DD") === day.dateString
        );
        if (entrevista) {
            setSelectedInterview(entrevista);
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <Calendar markedDates={eventos} onDayPress={handleDayPress} />
            )}

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedInterview && (
                            <>
                                <Text style={styles.modalTitle}>Entrevista</Text>
                                <Text>Con: {selectedInterview.nombres}</Text>
                                <Text>Hora: {selectedInterview.hora}</Text>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => {
                                        onSelectInterview(selectedInterview);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.closeButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
    errorText: { color: "red", textAlign: "center", marginTop: 10 },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        width: "80%",
        alignItems: "center",
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    closeButton: {
        marginTop: 20,
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: { color: "white" },
});

export default CalendarioDeEntrevistas;
