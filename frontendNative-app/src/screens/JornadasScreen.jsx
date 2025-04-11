import React from "react";
import { View, StyleSheet } from "react-native";
import TablaJornadasScreen from "../componentsClosed/TablaJornadasScreen";

const Jornadas = () => {
    return (
        <View style={styles.container}>
            <TablaJornadasScreen />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
});

export default Jornadas;
