/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, StyleSheet, Text } from "react-native";
import TablaAusencias from "../componentsClosed/TablaAusencia";

const Ausencias = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Gestión de Ausencias</Text>
            <View style={styles.content}>
                <TablaAusencias />
            </View>
            <Text style={styles.footer}>Gestorplus</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60, // Espacio adicional en la parte superior para el título
        paddingHorizontal: 20,
        backgroundColor: "#f0f8ff", // Un color de fondo suave
        alignItems: "center", // Centrar horizontalmente
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#4682b4", // Un color azul más oscuro para el título
        marginBottom: 30,
    },
    content: {
        width: "95%", // Un poco menos del ancho completo para márgenes
        backgroundColor: "#fff",
        borderRadius: 12, // Bordes un poco más redondeados
        padding: 25,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 }, // Sombra un poco más pronunciada
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5, // Elevación para Android
        marginBottom: 30,
    },
    footer: {
        fontSize: 14,
        color: "#777",
        marginTop: 20,
    },
});

export default Ausencias;