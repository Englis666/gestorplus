import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator, ScrollView } from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { PaperProvider } from "react-native-paper";

const Estudios = ({ modalEstudios, toggleModalEstudios }) => {
    const [formData, setFormData] = useState({
        action: "agregarEstudio",
        nivelEstudio: "",
        areaEstudio: "",
        estadoEstudio: "",
        fechaInicioEstudio: "",
        fechaFinEstudio: "",
        tituloEstudio: "",
        institucionEstudio: "",
        ubicacionEstudio: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [token, setToken] = useState(null);

    // Obtener token desde AsyncStorage
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
            const response = await axios.post("http://localhost/gestorplus/backend/", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.message === "Estudio subido") {
                Alert.alert("Éxito", "Estudio subido correctamente");
            } else {
                Alert.alert("Error", "Hubo un problema al subir el estudio.");
            }
        } catch (error) {
            console.error("Error al registrar el estudio:", error);
            Alert.alert("Error", "Ocurrió un problema al agregar el estudio.");
        } finally {
            setIsSubmitting(false);
            toggleModalEstudios();
        }
    };

    return (
        <PaperProvider>
            <Modal isVisible={modalEstudios} onBackdropPress={toggleModalEstudios} style={{ margin: 0 }}>
                <View style={{ flex: 1, backgroundColor: "white", padding: 20, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Actualizar Estudios</Text>

                    <ScrollView>
                        <Text>Nivel de estudio</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.nivelEstudio}
                            onChangeText={(value) => handleChange("nivelEstudio", value)}
                        />

                        <Text>Área de estudio</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.areaEstudio}
                            onChangeText={(value) => handleChange("areaEstudio", value)}
                        />

                        <Text>Estado del estudio</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.estadoEstudio}
                            onChangeText={(value) => handleChange("estadoEstudio", value)}
                        />

                        <Text>Fecha de inicio</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.fechaInicioEstudio}
                            placeholder="YYYY-MM-DD"
                            onChangeText={(value) => handleChange("fechaInicioEstudio", value)}
                        />

                        <Text>Fecha de fin</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.fechaFinEstudio}
                            placeholder="YYYY-MM-DD"
                            onChangeText={(value) => handleChange("fechaFinEstudio", value)}
                        />

                        <Text>Título obtenido</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.tituloEstudio}
                            onChangeText={(value) => handleChange("tituloEstudio", value)}
                        />

                        <Text>Institución educativa</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.institucionEstudio}
                            onChangeText={(value) => handleChange("institucionEstudio", value)}
                        />

                        <Text>Ubicación</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.ubicacionEstudio}
                            onChangeText={(value) => handleChange("ubicacionEstudio", value)}
                        />
                    </ScrollView>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
                        <Button title="Cerrar" onPress={toggleModalEstudios} color="red" />
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

export default Estudios;
