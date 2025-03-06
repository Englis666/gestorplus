import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, StyleSheet } from "react-native";
import axios from "axios";
import CalendarioDeEntrevistas from "./CalendarioDeEntrevistas";
import ModalHojadeVidaEntrevistado from "./ModalHojadeVidaEntrevistado";

const TablaEntrevistas = () => {
    const [entrevistas, setEntrevistas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchEntrevistas = async () => {
            try {
                const response = await axios.get("http://192.168.80.28/gestorplus/backend/", {
                    params: { action: "obtenerEntrevistas" },
                });
                const data = response.data.Entrevista;
                setEntrevistas(Array.isArray(data) ? data : []);
            } catch (err) {
                setError("Hubo un problema al cargar las entrevistas");
            } finally {
                setLoading(false);
            }
        };
        fetchEntrevistas();
    }, []);

    const enviarAsistencia = async (asistencia, identrevista) => {
        try {
            await axios.post("http://192.168.80.28/gestorplus/backend/", {
                action: asistencia ? "asistenciaConfirmada" : "asistenciaNoConfirmada",
                data: { identrevista },
            });
        } catch (err) {
            Alert.alert("Error", "Hubo un problema al corroborar la asistencia");
        }
    };

    const abrirModalHojadevida = () => {
        setModalOpen(true);
    };

    if (loading) return <Text>Cargando entrevistas...</Text>;
    if (error) return <Text>{error}</Text>;

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
                        <TouchableOpacity style={styles.buttonPrimary} onPress={() => enviarAsistencia(true, item.identrevista)}>
                            <Text style={styles.buttonText}>Asistencia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonDanger} onPress={() => enviarAsistencia(false, item.identrevista)}>
                            <Text style={styles.buttonText}>No asistencia</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSecondary} onPress={() => setSelectedInterview(item)}>
                            <Text style={styles.buttonText}>Ver detalles</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            <CalendarioDeEntrevistas entrevistas={entrevistas} onSelectInterview={setSelectedInterview} />

            <Modal visible={!!selectedInterview} animationType="slide">
                {selectedInterview && (
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Detalles de la Entrevista</Text>
                        <Text>Nombre: {selectedInterview.nombres}</Text>
                        <Text>Fecha: {selectedInterview.fecha}</Text>
                        <Text>Hora: {selectedInterview.hora}</Text>
                        <Text>Lugar: {selectedInterview.lugarMedio}</Text>
                        <Text>Descripción: {selectedInterview.descripcion}</Text>
                        <TouchableOpacity style={styles.buttonSecondary} onPress={() => setSelectedInterview(null)}>
                            <Text style={styles.buttonText}>Cerrar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonPrimary} onPress={abrirModalHojadevida}>
                            <Text style={styles.buttonText}>Revisar hoja de vida</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Modal>

            <Modal visible={modalOpen} animationType="slide">
                {selectedInterview && (
                    <ModalHojadeVidaEntrevistado num_doc={selectedInterview.num_doc} onClose={() => setModalOpen(false)} />
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default TablaEntrevistas;
