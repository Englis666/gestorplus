import React from "react";
import { View, StyleSheet } from "react-native";
import TablaEntrevistas from "../componentsClosed/TablaEntrevistas";

const Entrevistas = () => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TablaEntrevistas />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Entrevistas;
