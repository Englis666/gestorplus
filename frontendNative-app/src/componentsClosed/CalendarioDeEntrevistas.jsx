import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";

const CalendarioDeEntrevistas = ({ entrevistas, onSelectInterview }) => {
    const [selectedInterview, setSelectedInterview] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Formatear entrevistas para el calendario
    const eventos = entrevistas.reduce((acc, entrevista) => {
        const date = moment(entrevista.fecha).format("YYYY-MM-DD");
        acc[date] = { marked: true, dotColor: "blue" };
        return acc;
    }, {});

    const handleDayPress = (day) => {
        const entrevista = entrevistas.find(
            (e) => moment(e.fecha).format("YYYY-MM-DD") === day.dateString
        );
        if (entrevista) {
            setSelectedInterview(entrevista);
            setModalVisible(true);
        }
    };

    return (
        <View style={styles.container}>
            <Calendar
                markedDates={eventos}
                onDayPress={handleDayPress}
            />

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {selectedInterview ? (
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
                        ) : null}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#fff" },
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