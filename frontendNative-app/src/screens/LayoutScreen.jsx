import React from "react";
import { View, StyleSheet } from "react-native";
import ConvocatoriaLayout from "../components/ConvocatoriaLayout";

const Layout = () => {
    return (
        <View style={styles.container}>
            <ConvocatoriaLayout/>
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

export default Layout;
