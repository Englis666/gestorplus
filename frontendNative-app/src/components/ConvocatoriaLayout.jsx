import React, { useEffect, useState } from "react";
import { 
    View, Text, FlatList, TouchableOpacity, ActivityIndicator, 
    TextInput, StyleSheet, KeyboardAvoidingView, Platform 
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const ConvocatoriaLayout = () => {
    const navigation = useNavigation();
    const [convocatorias, setConvocatorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        axios.get("http://192.168.80.81/gestorplus/backend/", { params: { action: "obtenerConvocatorias" } })
            .then((response) => {
                console.log("API Response:", response.data);
                setConvocatorias(response.data.convocatorias || []);
            })
            .catch((error) => {
                console.error("Error de API:", error.message);
                setError("No se pudieron cargar las convocatorias");
            })
            .finally(() => {
                console.log("Finalizando carga");
                setLoading(false);
            });
    }, []);

    const handleDetailsClick = () => {
        navigation.navigate("Login"); // Siempre redirige al login
    };
    const filteredConvocatorias = convocatorias.filter(convocatoria =>
        convocatoria.nombreConvocatoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        convocatoria.nombreCargo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <ActivityIndicator size="large" color="#007bff" style={styles.loading} />;
    if (error) return <Text style={styles.error}>{error}</Text>;

   return (
           <KeyboardAvoidingView 
               behavior={Platform.OS === "ios" ? "padding" : "height"} 
               style={styles.container}
           >
               <TextInput
                   style={styles.searchBar}
                   placeholder="Buscar convocatoria..."
                   placeholderTextColor="#666"
                   value={searchTerm}
                   onChangeText={setSearchTerm}
               />
               {filteredConvocatorias.length === 0 ? (
                   <Text style={styles.noResults}>No se encontraron convocatorias</Text>
               ) : (
                   <FlatList
                       data={filteredConvocatorias}
                       keyExtractor={(item, index) => item.idconvocatoria?.toString() || `conv-${index}`}
                       renderItem={({ item }) => (
                           <View style={styles.card}>
                               <Text style={styles.title}>{item.nombreCargo}</Text>
                               <Text style={styles.description}>{item.descripcion}</Text>
                               <Text style={styles.subText}>Salario: {item.salario}</Text>
                               <Text style={styles.subText}>Cantidad disponible: {item.cantidadConvocatoria}</Text>
                               <TouchableOpacity style={styles.button} onPress={() => handleDetailsClick(item)}>
                                   <Text style={styles.buttonText}>Ver detalles</Text>
                               </TouchableOpacity>
                           </View>
                       )}
                   />
               )}
           </KeyboardAvoidingView>
       );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        padding: 20,
    },
    searchBar: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        fontSize: 16,
        color: "#000",
        borderColor: "#ccc",
        borderWidth: 1,
    },
    noResults: {
        textAlign: "center",
        fontSize: 16,
        color: "#666",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    error: {
        textAlign: "center",
        color: "red",
        marginTop: 20,
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        color: "#666",
        marginBottom: 5,
    },
    subText: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
export default ConvocatoriaLayout;
