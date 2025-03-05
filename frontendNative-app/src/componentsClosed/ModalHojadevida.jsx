import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import axios from "axios";

const ModalHojaDeVida = ({ modalVisible, toggleModal, num_doc }) => {
    const [formData, setFormData] = useState({
        fechaNacimiento: "",
        direccion: "",
        ciudad: "",
        ciudadNacimiento: "",
        telefono: "",
        telefonoFijo: "",
        estadohojadevida: 1,
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (modalVisible) {
            fetchHojaDeVida();
        }
    }, [modalVisible]);

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
        return null;
    };

    const fetchHojaDeVida = async () => {
        try {
            const token = getCookie("auth_token");
            if (!token) {
                Alert.alert("Error", "No se encontró el token de autenticación.");
                return;
            }

            const response = await axios.get("http://localhost/gestorplus/backend/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: { action: "datosPerfil" },
            });

            setFormData(response.data);
        } catch (error) {
            console.error("Error al obtener la hoja de vida:", error);
            Alert.alert("Error", "Ocurrió un error al cargar los datos.");
        }
    };

    const handleChange = (name, value) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const requiredFields = [
            "fechaNacimiento",
            "direccion",
            "ciudad",
            "ciudadNacimiento",
            "telefono",
        ];
        for (let field of requiredFields) {
            if (!formData[field]) {
                Alert.alert("Error", `El campo ${field} es obligatorio.`);
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        const token = getCookie("auth_token");
        if (!token) {
            Alert.alert("Error", "No se encontró el token de autenticación.");
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await axios.patch(
                "http://localhost/gestorplus/backend/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: { action: "actualizacionHojaDevida" },
                }
            );

            if (response.data.message === "Hoja de vida actualizada") {
                Alert.alert("Éxito", "Hoja de vida actualizada correctamente.");
            } else {
                Alert.alert("Error", "Hubo un error al actualizar la hoja de vida.");
            }
        } catch (error) {
            console.error("Error al registrar la hoja de vida:", error);
            Alert.alert("Error", "Ocurrió un error al actualizar.");
        } finally {
            setIsSubmitting(false);
            toggleModal();
        }
    };

    return (
        <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Actualizar Hoja de Vida</Text>
                    <ScrollView style={styles.scrollContainer}>
                        <Text style={styles.label}>Fecha de Nacimiento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={formData.fechaNacimiento}
                            onChangeText={(text) => handleChange("fechaNacimiento", text)}
                        />

                        <Text style={styles.label}>Dirección</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese su dirección"
                            value={formData.direccion}
                            onChangeText={(text) => handleChange("direccion", text)}
                        />

                        <Text style={styles.label}>Ciudad</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese su ciudad"
                            value={formData.ciudad}
                            onChangeText={(text) => handleChange("ciudad", text)}
                        />

                        <Text style={styles.label}>Ciudad de Nacimiento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ingrese ciudad de nacimiento"
                            value={formData.ciudadNacimiento}
                            onChangeText={(text) => handleChange("ciudadNacimiento", text)}
                        />

                        <Text style={styles.label}>Celular</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de celular"
                            keyboardType="numeric"
                            value={formData.telefono}
                            onChangeText={(text) => handleChange("telefono", text)}
                        />

                        <Text style={styles.label}>Teléfono Fijo</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de teléfono fijo"
                            keyboardType="numeric"
                            value={formData.telefonoFijo}
                            onChangeText={(text) => handleChange("telefonoFijo", text)}
                        />
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={toggleModal} disabled={isSubmitting}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>
                            <Text style={styles.buttonText}>
                                {isSubmitting ? "Guardando..." : "Guardar cambios"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    scrollContainer: {
        maxHeight: 300,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 8,
        marginTop: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    cancelButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: "center",
    },
    submitButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default ModalHojaDeVida;
