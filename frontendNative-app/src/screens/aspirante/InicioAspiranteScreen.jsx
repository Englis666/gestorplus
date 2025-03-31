import React from "react";
import { View, StyleSheet } from "react-native";
import Convocatoria from "../../components/Convocatoria";

const InicioAspiranteScreen = () => {
    return (
        <View style={styles.container}>
            <Convocatoria/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#f4f4f4", 
        padding: 10, 
    },
});

export default InicioAspiranteScreen;
