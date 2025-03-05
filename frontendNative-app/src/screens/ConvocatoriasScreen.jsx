import React from "react";
import { View, StyleSheet } from "react-native";

const Convocatorias = () => {

    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <TablaConvocatorias />
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
export default Convocatorias;
