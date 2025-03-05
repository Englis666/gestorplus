import React from "react";
import { View, StyleSheet } from "react-native";
import TablaEmpleados from "../componentsClosed/TablaEmpleados";

const Empleados = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TablaEmpleados />
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
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default Empleados;
