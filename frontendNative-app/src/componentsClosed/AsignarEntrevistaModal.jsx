/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import axios from "axios";
import API_URL from "../config";

const AsignarEntrevistaModal = ({ show, handleClose, postulacion }) => {
    const [formData, setFormData] = useState({
        identrevista: "",
        fecha: "",
        hora: "",
        lugarMedio: "",
        postulacion_idpostulaciones: postulacion.idpostulacion,
        estadoEntrevista: ""
    });

    const handleChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post(`${API_URL}`, {
                action: "asignarEntrevista",
                ...formData
            });
            if (response.data.success) {
                Alert.alert("Éxito", "Entrevista asignada exitosamente");
                handleClose();
            } else {
                Alert.alert("Error", "Error al asignar la entrevista");
            }
        } catch (error) {
            console.error("Error al asignar la entrevista", error);
            Alert.alert("Error", "Error al asignar la entrevista");
        }
    };

    return (
        <Modal visible={show} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>Asignar Entrevista</Text>
                    <Text>Fecha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="YYYY-MM-DD"
                        value={formData.fecha}
                        onChangeText={(text) => handleChange("fecha", text)}
                    />
                    <Text>Hora</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="HH:MM"
                        value={formData.hora}
                        onChangeText={(text) => handleChange("hora", text)}
                    />
                    <Text>Lugar/Medio</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Lugar o medio"
                        value={formData.lugarMedio}
                        onChangeText={(text) => handleChange("lugarMedio", text)}
                    />
                    <Button title="Asignar" onPress={handleSubmit} />
                    <Button title="Cancelar" color="red" onPress={handleClose} />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
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
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default AsignarEntrevistaModal;
