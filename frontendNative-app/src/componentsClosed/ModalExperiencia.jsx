/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView } from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { PaperProvider } from "react-native-paper";
import API_URL from "../config";

const Experiencia = ({ modalExperiencia, toggleModalExperiencia }) => {
    const [formData, setFormData] = useState({
        action: "agregarExp",
        profesion: "",
        descripcionPerfil: "",
        fechaInicioExp: "",
        fechaFinExp: "",
        cargo: "",
        empresa: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await AsyncStorage.getItem("auth_token");
            if (storedToken) {
                setToken(storedToken);
            }
        };
        fetchToken();
    }, []);

    const handleChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.post(API_URL, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "Experiencia agregada") {
                Alert.alert("Éxito", "Experiencia agregada correctamente");
            } else {
                Alert.alert("Error", "Hubo un problema al agregar la experiencia.");
            }
        } catch (error) {
            console.error("Error al registrar la experiencia:", error);
            Alert.alert("Error", "Ocurrió un problema al agregar la experiencia.");
        } finally {
            setIsSubmitting(false);
            toggleModalExperiencia();
        }
    };

    return (
        <PaperProvider>
            <Modal isVisible={modalExperiencia} onBackdropPress={toggleModalExperiencia} style={{ margin: 0 }}>
                <View style={{ flex: 1, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Actualizar Experiencia</Text>

                    <ScrollView>
                        {Object.keys(formData).map((key) => (
                            key !== "action" && (
                                <View key={key}>
                                    <Text>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={formData[key]}
                                        onChangeText={(value) => handleChange(key, value)}
                                    />
                                </View>
                            )
                        ))}
                    </ScrollView>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                        <Button title="Cerrar" onPress={toggleModalExperiencia} color="red" />
                        {isSubmitting ? (
                            <ActivityIndicator size="small" color="#0000ff" />
                        ) : (
                            <Button title="Guardar" onPress={handleSubmit} color="green" />
                        )}
                    </View>
                </View>
            </Modal>
        </PaperProvider>
    );
};

const styles = {
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
};

export default Experiencia;
