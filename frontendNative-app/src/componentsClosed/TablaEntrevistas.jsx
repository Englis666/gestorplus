/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, StyleSheet } from "react-native";
import axios from "axios";
import API_URL from "../config"; // Asegúrate de que la URL de la API esté bien configurada.
import CalendarioDeEntrevistas from "./CalendarioDeEntrevistas"; // Asegúrate de que este componente esté importado correctamente.
import ModalHojadeVidaEntrevistado from "./ModalHojadeVidaEntrevistado"; // Asegúrate de que este componente esté importado correctamente.

const TablaEntrevistas = () => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get(API_URL, {
                    params: { action: "obtenerEntrevistas" },
                });

                const data = response.data.Entrevista;
                if (Array.isArray(data)) {
                    setLoading(false);
                    setEntrevistas(data);
                } else {
                    setError("Formato de datos incorrecto.");
                }

            } catch (err) {
                setLoading(false);
                setError("Hubo un error al cargar las entrevistas.");
            }
        };

        fetchEntrevistas();
    }, []);

    if (loading) return <Text>Cargando entrevistas...</Text>;
    if (error) return <Text>{error}</Text>;

    const enviarAsistencia = async (asistencia, identrevista) => {
        try {
            await axios.post(API_URL, {
                action: asistencia ? "asistenciaConfirmada" : "asistenciaNoConfirmada",
                data: { identrevista },
            });
            Alert.alert("Éxito", "Asistencia registrada correctamente");
        } catch (err) {
            Alert.alert("Error", "Hubo un problema al corroborar la asistencia");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Entrevistas</Text>
            <FlatList
                data={entrevistas}
                keyExtractor={(item) => item.identrevista.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Fecha: {item.fecha}</Text>
                        <Text>Hora: {item.hora}</Text>
                        <Text>Nombre: {item.nombres}</Text>
                        <Text>Documento: {item.num_doc}</Text>
                        <Text>Estado: {item.estadoEntrevista}</Text>
                        <TouchableOpacity
                            style={styles.buttonPrimary}
                            onPress={() => enviarAsistencia(true, item.identrevista)}>
                            <Text style={styles.buttonText}>Asistencia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonDanger}
                            onPress={() => enviarAsistencia(false, item.identrevista)}>
                            <Text style={styles.buttonText}>No asistencia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.buttonSecondary}
                            onPress={() => setSelectedInterview(item)}>
                            <Text style={styles.buttonText}>Ver detalles</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <CalendarioDeEntrevistas entrevistas={entrevistas} onSelectInterview={setSelectedInterview} />

            {/* Modal para ver los detalles de la entrevista */}
            <Modal visible={!!selectedInterview} animationType="slide" transparent={true}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        {selectedInterview && (
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Detalles de la Entrevista</Text>
                                <Text>Nombre: {selectedInterview.nombres}</Text>
                                <Text>Fecha: {selectedInterview.fecha}</Text>
                                <Text>Hora: {selectedInterview.hora}</Text>
                                <Text>Lugar: {selectedInterview.lugarMedio}</Text>
                                <Text>Descripción: {selectedInterview.descripcion}</Text>

                                <TouchableOpacity style={styles.buttonSecondary} onPress={() => setSelectedInterview(null)}>
                                    <Text style={styles.buttonText}>Cerrar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.buttonPrimary} onPress={() => setModalOpen(true)}>
                                    <Text style={styles.buttonText}>Revisar hoja de vida</Text>
                                </TouchableOpacity>


                            </View>
                        )}
                    </View>
                </View>
            </Modal>
            // Dentro del componente TablaEntrevistas
            <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={() => {
                    setSelectedInterview(item); // Asigna la entrevista seleccionada
                    setModalOpen(true);  // Abre el modal
                }}
            >
                <Text style={styles.buttonText}>Ver detalles</Text>
            </TouchableOpacity>

            <Modal visible={modalOpen} animationType="slide">
                {selectedInterview && (
                    <ModalHojadeVidaEntrevistado
                        num_doc={selectedInterview.num_doc} // Pasa el num_doc correcto aquí
                        onClose={() => setModalOpen(false)}
                    />
                )}
            </Modal>

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
    buttonPrimary: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    buttonDanger: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    buttonSecondary: {
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
    modalBackdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo translúcido para destacar el modal
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        width: "90%",
        maxWidth: 500, // Evitar que el modal ocupe todo el ancho
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalContent: {
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default TablaEntrevistas;
