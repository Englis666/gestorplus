/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import TablaVacaciones from "../componentsClosed/TablaVacaciones";

const Vacaciones = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TablaVacaciones />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#ECF0F1",
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: "#ECF0F1",
    },
});

export default Vacaciones;
