import React from "react";
import { View, StyleSheet } from "react-native";
import TablaPazYSalvo from "../componentsClosed/TablaPazySalvo";

const PazYSalvos = () => {

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TablaPazYSalvo />
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

export default PazYSalvos;
