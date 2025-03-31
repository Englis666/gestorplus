import React from "react";
import { View, StyleSheet } from "react-native";
import TablaAusencias from "../componentsClosed/TablaAusencia";
const Ausencias = () => {
    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <TablaAusencias />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default Ausencias;