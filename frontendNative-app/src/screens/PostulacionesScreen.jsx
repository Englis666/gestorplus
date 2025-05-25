/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import TablaPostulaciones from "../componentsClosed/TablaPostulaciones";

const Postulaciones = () => {

    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <TablaPostulaciones />
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default Postulaciones;