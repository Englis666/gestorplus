import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import axios from "axios";
import AsignarEntrevistaModal from "./AsignarEntrevistaModal";

const TablaPostulaciones = () => {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedPostulacion, setSelectedPostulacion] = useState(null);

    useEffect(() => {
        const fetchPostulaciones = async () => {
            try {
                const response = await axios.get("http://localhost/gestorplus/backend/", {
                    params: { action: "obtenerPostulaciones" },
                });
                const data = response.data.Postulaciones;
                setPostulaciones(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Error al obtener las postulaciones");
            } finally {
                setLoading(false);
            }
        };
        fetchPostulaciones();
    }, []);

    const handleShowModal = (postulacion) => {
        setSelectedPostulacion(postulacion);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedPostulacion(null);
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Postulaciones</Text>
            <FlatList
                data={postulaciones}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.text}>Nombre: {item.nombres}</Text>
                        <Text style={styles.text}>Cargo: {item.nombreCargo}</Text>
                        <Text style={styles.text}>Estado: {item.estadoPostulacion}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleShowModal(item)}
                        >
                            <Text style={styles.buttonText}>Asignar Entrevista</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.noData}>No existen postulaciones</Text>}
            />
            {selectedPostulacion && (
                <AsignarEntrevistaModal
                    show={showModal}
                    handleClose={handleCloseModal}
                    postulacion={selectedPostulacion}
                />
            )}
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
    text: {
        fontSize: 16,
        marginBottom: 4,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "bold",
    },
    noData: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
});

export default TablaPostulaciones;
