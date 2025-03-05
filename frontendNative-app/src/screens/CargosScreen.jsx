import React from "react";
import { View, StyleSheet } from "react-native";
import TablaCargos from "../componentsClosed/TablaCargos";

const Cargos = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TablaCargos />
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
        flex: 1, // Asegura que el contenido ocupe todo el espacio
    },
});

export default Cargos;
