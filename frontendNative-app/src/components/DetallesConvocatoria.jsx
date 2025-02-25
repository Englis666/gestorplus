import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    ActivityIndicator, 
    Alert, 
    TouchableOpacity 
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DetallesTrabajo = () => {
    const [detalleConvocatoria, setDetalleConvocatoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const route = useRoute();
    const {idconvocatoria} = route.params;

    useEffect(() => {
        console.log("id de convocatoria", idconvocatoria);
        axios
            .get("http://192.168.43.98/gestorplus/backend/", {
                params: {
                    action: "obtenerDetalleConvocatoria",
                    idconvocatoria: idconvocatoria,
                },
            })
            .then((response) => {
                if (response.data.DetalleConvocatoria) {
                    setDetalleConvocatoria(response.data.DetalleConvocatoria);
                } else {
                    console.error("Detalle de convocatoria no encontrado");
                    setDetalleConvocatoria(null);
                    setError("No se encontró la convocatoria seleccionada.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error al cargar el detalle: ", err);
                setError("Error al cargar el detalle de la convocatoria");
                setLoading(false);
            });
    }, [idconvocatoria]);

    const handleApply = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");

            if (!token) {
                Alert.alert("Error", "No hay token de autenticación.");
                return;
            }

            const data = {
                action: "aplicacionDeAspirante",
                idconvocatoria: idconvocatoria,
            };

            const response = await axios.post("http://192.168.136.193/gestorplus/backend/", data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setSuccessMessage(response.data.message);
            } else {
                setError(response.data.error || "Error en la aplicación.");
            }
        } catch (err) {
            console.error("Error al enviar la aplicación: ", err);
            setError("Error al enviar la aplicación.");
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Cargando detalles...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.heading}>Detalles del Trabajo</Text>

            <View style={styles.card}>
                <Text style={styles.title}>
                    {detalleConvocatoria?.nombreConvocatoria}
                </Text>
                <View style={styles.info}>
                    <Text style={styles.label}>Salario:</Text>
                    <Text style={styles.value}>{detalleConvocatoria?.salario}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}>Requerimientos:</Text>
                    <Text style={styles.value}>{detalleConvocatoria?.requisitos}</Text>
                </View>
                <View style={styles.info}>
                    <Text style={styles.label}>Descripción del trabajo:</Text>
                    <Text style={styles.value}>{detalleConvocatoria?.descripcion}</Text>
                </View>

                {successMessage && (
                    <Text style={styles.successText}>{successMessage}</Text>
                )}
                {error && <Text style={styles.errorText}>{error}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleApply}>
                    <Text style={styles.buttonText}>Aplicar Ahora</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#E3F2FD",
        alignItems: "center",
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#007bff",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        width: "100%",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#007bff",
        textAlign: "center",
        marginBottom: 10,
    },
    info: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#555",
    },
    value: {
        fontSize: 16,
        color: "#333",
    },
    successText: {
        color: "green",
        textAlign: "center",
        marginTop: 10,
    },
    errorText: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E3F2FD",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#007bff",
    },
});

export default DetallesTrabajo;
