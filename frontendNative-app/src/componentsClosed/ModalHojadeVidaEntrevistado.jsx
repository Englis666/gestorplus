import React, { useState, useEffect } from "react";
import { View, Text, Modal, ActivityIndicator, ScrollView, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";

const ModalHojaDeVida = ({ num_doc = null, onClose }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (num_doc) {
            fetchHojaDeVida();
        }
    }, [num_doc]);

    const fetchHojaDeVida = async () => {
        try {
            const response = await axios.get("http://192.168.68.219/gestorplus/backend/", {
                params: { action: "obtenerDatosDelEntrevistado" },
                data: { num_doc },
            });

            setFormData(response.data);
        } catch (error) {
            console.error("Error al obtener la hoja de vida:", error);
            Alert.alert("Error", "Ocurrió un error al cargar los datos.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal visible={!!num_doc} animationType="slide" transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Hoja de Vida</Text>
                    </View>

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#007bff" />
                            <Text>Cargando...</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.modalBody}>
                            <Text style={styles.label}>Nombre y Apellido:</Text>
                            <Text style={styles.value}>{formData.nombres || "No disponible"}</Text>

                            <Text style={styles.label}>Correo Electrónico:</Text>
                            <Text style={styles.value}>{formData.email || "No disponible"}</Text>

                            <Text style={styles.label}>Fecha de Nacimiento:</Text>
                            <Text style={styles.value}>{formData.fechaNacimiento || "No disponible"}</Text>

                            <Text style={styles.label}>Dirección:</Text>
                            <Text style={styles.value}>{formData.direccion || "No disponible"}</Text>

                            <Text style={styles.label}>Ciudad:</Text>
                            <Text style={styles.value}>{formData.ciudad || "No disponible"}</Text>

                            <Text style={styles.label}>Teléfono:</Text>
                            <Text style={styles.value}>{formData.telefono || "No disponible"}</Text>

                            <Text style={styles.label}>Nivel de Estudio:</Text>
                            <Text style={styles.value}>{formData.nivelEstudio || "No disponible"}</Text>

                            <Text style={styles.label}>Título del Estudio:</Text>
                            <Text style={styles.value}>{formData.tituloEstudio || "No disponible"}</Text>

                            <Text style={styles.label}>Institución:</Text>
                            <Text style={styles.value}>{formData.institucionEstudio || "No disponible"}</Text>

                            <Text style={styles.label}>Profesión:</Text>
                            <Text style={styles.value}>{formData.profesion || "No disponible"}</Text>

                            <Text style={styles.label}>Descripción del Perfil:</Text>
                            <Text style={styles.value}>{formData.descripcion || "No disponible"}</Text>

                            <Text style={styles.label}>Inicio de Experiencia Laboral:</Text>
                            <Text style={styles.value}>{formData.inicioExp || "No disponible"}</Text>

                            <Text style={styles.label}>Fin de Experiencia Laboral:</Text>
                            <Text style={styles.value}>{formData.finExp || "No disponible"}</Text>
                        </ScrollView>
                    )}

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.buttonRechazar} onPress={onClose}>
                            <Text style={styles.buttonText}>Rechazar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.buttonAceptar} onPress={() => Alert.alert("Asignado", "El usuario ha sido asignado al sistema de gestión")}>
                            <Text style={styles.buttonText}>Aceptar y Asignar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        maxHeight: "80%",
    },
    modalHeader: {
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBody: {
        paddingVertical: 10,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 10,
    },
    value: {
        fontSize: 14,
        marginBottom: 5,
    },
    modalFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    buttonRechazar: {
        flex: 1,
        backgroundColor: "#dc3545",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginRight: 5,
    },
    buttonAceptar: {
        flex: 1,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginLeft: 5,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});

export default ModalHojaDeVida;
