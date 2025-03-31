import React from "react";
import { View, StyleSheet } from "react-native";
import TablaContratos from "../componentsClosed/TablaContratos";

const Contratos = () => {

    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <TablaContratos />
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


export default Contratos;
