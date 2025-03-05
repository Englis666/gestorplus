import React from "react";
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const data = [
    {
        num_doc: "",
        nombre: "",
        salud: "",
        riesgos: "",
        recomendaciones: "",
        aptitud: "",
        comentarios: "",
    },
];

const TablaSistemaDeGestion = () => {
    return (
        <ScrollView horizontal>
            <View style={styles.container}>
                <Text style={styles.title}>Sistema de Gestión</Text>
                <Text style={styles.subtitle}>Sistema de Gestión por aspirante y empleado</Text>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.row}>
                            <Text style={styles.cell}>{item.num_doc}</Text>
                            <Text style={styles.cell}>{item.nombre}</Text>
                            <Text style={styles.cell}>{item.salud}</Text>
                            <Text style={styles.cell}>{item.riesgos}</Text>
                            <Text style={styles.cell}>{item.recomendaciones}</Text>
                            <Text style={styles.cell}>{item.aptitud}</Text>
                            <Text style={styles.cell}>{item.comentarios}</Text>
                            <TouchableOpacity style={styles.button}>
                                <Text style={styles.buttonText}>Asignarle contrato</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 8,
    },
    cell: {
        flex: 1,
        textAlign: "center",
        padding: 4,
    },
    button: {
        backgroundColor: "red",
        padding: 8,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default TablaSistemaDeGestion;
