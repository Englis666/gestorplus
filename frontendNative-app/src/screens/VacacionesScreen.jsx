import React from "react";
import { View, StyleSheet } from "react-native";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaVacaciones from "../componentsClosed/TablaVacaciones";

const Vacaciones = () => {
    return (
        <View style={styles.container}>
            <NavbarClosed />
            <View style={styles.content}>
                <TablaVacaciones />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#ECF0F1",
    },
    content: {
        flex: 1,
        padding: 16,
        backgroundColor: "#ECF0F1",
    },
});

export default Vacaciones;
