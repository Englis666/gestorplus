import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

const TablaContratos = () => {
    const contratos = []; // Aquí deberías cargar los datos reales

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vinculaciones</Text>
            <FlatList
                data={contratos}
                keyExtractor={(item) => item.num_doc.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text>Número de documento: {item.num_doc}</Text>
                        <Text>Nombre y Apellido: {item.nombre}</Text>
                        <Text>Inicio: {item.fecha_inicio}</Text>
                        <Text>Fin: {item.fecha_fin}</Text>
                        <Text>Tipo de contrato: {item.tipo_contrato}</Text>
                        <Text>Salario: {item.salario}</Text>
                        <Text>Estado: {item.estado}</Text>
                        <Text>Firma: {item.fecha_firma}</Text>
                        <TouchableOpacity style={styles.buttonDanger}>
                            <Text style={styles.buttonText}>Desactivar contrato y realizar paz y salvo</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#f8f9fa",
        padding: 16,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    buttonDanger: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        marginTop: 5,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
    },
});

export default TablaContratos;
