import react from "react";
import { View, StyleSheet } from "react-native";
import TablaHorasExtra from "../componentsClosed/TablaHorasExtra";

const HorasExtra = () => {

    return (

        <View style={styles.container}>
            <View style={styles.content}>
                <TablaHorasExtra />
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

export default HorasExtra;

