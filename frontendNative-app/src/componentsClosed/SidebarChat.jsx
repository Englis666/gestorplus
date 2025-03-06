import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SidebarChat = ({ onUserSelect }) => {
    const [usuariosRRHH, setUsuariosRRHH] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [rol, setRol] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const navigation = useNavigation();

    const handleUserClick = async (usuario) => {
        try {
            const response = await axios.get("http://192.168.80.28/gestorplus/backend/", {
                params: {
                    action: "obtenerIdChat",
                    num_doc: usuario.num_doc,
                },
            });

            const idChat = response.data.idChat;
            if (idChat) {
                onUserSelect({ ...usuario, idChat });
            } else {
                Alert.alert("Error", "No se encontró el idChat para este usuario");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo obtener el idChat del usuario");
        }
    };

    const fetchUsuariosRRHH = async (action) => {
        try {
            const response = await axios.get("http://localhost/gestorplus/backend/", {
                params: { action },
            });
            const rrhhData = response.data.RRHH;
            if (Array.isArray(rrhhData)) {
                setUsuariosRRHH(rrhhData);
            } else {
                setErrorMessage("Error al obtener los usuarios.");
            }
        } catch (error) {
            setErrorMessage("Error al obtener los usuarios.");
        }
    };

    useEffect(() => {
        const fetchTokenAndData = async () => {
            const token = await AsyncStorage.getItem("auth_token");
            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const Rol = decodedToken?.data?.rol;
                    setRol(Rol);

                    let action = "";
                    switch (Rol) {
                        case "1":
                        case "2":
                            action = "obtenerUsuarios";
                            break;
                        case "3":
                            action = "obtenerRRHH";
                            break;
                        default:
                            setErrorMessage("Rol no reconocido.");
                            return;
                    }

                    fetchUsuariosRRHH(action);
                } catch (error) {
                    setErrorMessage("Token inválido o malformado.");
                }
            } else {
                setErrorMessage("Token no encontrado.");
            }
        };

        fetchTokenAndData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{"←"}</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Usuarios Activos</Text>
            </View>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar empleado"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <FlatList
                data={usuariosRRHH.filter((usuario) => usuario.nombres.toLowerCase().includes(searchQuery.toLowerCase()))}
                keyExtractor={(item) => item.num_doc.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.userItem} onPress={() => handleUserClick(item)}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{item.nombres.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={styles.userName}>{item.nombres}</Text>
                            <Text style={styles.userRole}>{item.nombreRol}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.noResults}>No se encontraron resultados.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: "100%",
        padding: 20,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    backButton: {
        fontSize: 24,
        color: "#007bff",
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    searchInput: {
        padding: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        fontSize: 14,
        marginBottom: 10,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
    userItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        padding: 10,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007bff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
    },
    avatarText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 18,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    userRole: {
        fontSize: 14,
        color: "#666",
    },
    noResults: {
        textAlign: "center",
        color: "#888",
        marginTop: 20,
    },
});

export default SidebarChat;
