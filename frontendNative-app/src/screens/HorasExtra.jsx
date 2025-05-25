/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import react from "react";
import { View, StyleSheet } from "react-native";
import TablaHorasExtra from "../componentsClosed/TablaHorasExtra";

const HorasExtra = () => {

    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <TablaHorasExtra />
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

export default HorasExtra;

