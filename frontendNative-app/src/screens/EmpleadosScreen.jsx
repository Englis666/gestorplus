import React from "react";
import { View, StyleSheet } from "react-native";

const Empleados = () => {

    return (

        <View style={styles.container}>
            <View styl={styles.content}>
                <TablaEmpleados />
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

export default Empleados;

