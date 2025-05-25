/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import TablaConvocatorias from "../componentsClosed/TablaConvocatorias";

const Convocatorias = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TablaConvocatorias />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    content: {
        flex: 100,
    }
});

export default Convocatorias;
