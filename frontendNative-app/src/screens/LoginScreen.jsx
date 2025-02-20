import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import imagen from "../assets/1.png";

const Login = () => {
    const [formData, setFormData] = useState({ num_doc: "", password: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (!formData.num_doc || !formData.password) {
            Alert.alert("Por favor complete todos los campos.");
            return;
        }

        const data = {
            action: "login",
            num_doc: formData.num_doc,
            password: formData.password,
        };

        setIsSubmitting(true);
        try {
            const response = await axios.post("http://192.168.80.81//gestorplus/backend/", data);
            const serverMessage = response.data;

            if (serverMessage?.status === "success") {
                const token = serverMessage.token;

                // ✅ Guardar el token en AsyncStorage en lugar de document.cookie
                await AsyncStorage.setItem("auth_token", token);

                const decodedToken = decodeToken(token);
                const userRole = decodedToken?.data?.rol;

                switch (userRole) {
                    case "1":
                        navigation.replace("administrador/inicioAdmin");
                        break;
                    case "2":
                        navigation.replace("recursoshumanos/inicioRRHH");
                        break;
                    case "3":
                        navigation.replace("empleado/inicioEmpleado");
                        break;
                    case "4":
                        navigation.replace("aspirante/inicio");
                        break;
                    default:
                        await AsyncStorage.removeItem("auth_token");
                        console.error("Rol desconocido:", userRole);
                        Alert.alert("Rol desconocido");
                        navigation.replace("Login");
                }
            } else {
                Alert.alert(serverMessage?.message || "Error en el inicio de sesión");
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            Alert.alert("Error en el inicio de sesión. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const decodeToken = (token) => {
        try {
            const payload = token.split(".")[1];
            return JSON.parse(atob(payload));
        } catch (e) {
            console.error("Error decodificando el token:", e);
            return null;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.imageContainer}>
                    <Image source={imagen} style={styles.image} />
                    <Text style={styles.title}>Bienvenidos a GestorPlus</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.subtitle}>Bienvenido otra vezw</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de documento"
                        value={formData.num_doc}
                        onChangeText={(text) => setFormData({ ...formData, num_doc: text })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={formData.password}
                        onChangeText={(text) => setFormData({ ...formData, password: text })}
                        secureTextEntry
                    />

                    <Button title={isSubmitting ? "Iniciando..." : "Iniciar sesión"} onPress={handleSubmit} disabled={isSubmitting} />
                    <Button title="No tengo cuenta" onPress={() => navigation.navigate("Register")} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    formContainer: {
        flexDirection: "row",
        width: "90%",
        borderRadius: 20,
        backgroundColor: "white",
        elevation: 5,
        padding: 20,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#103cbe",
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
    },
    image: { width: 150, height: 150, resizeMode: "contain" },
    title: { color: "white", fontSize: 18, fontWeight: "bold" },
    form: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    subtitle: { fontSize: 16, textAlign: "center", marginBottom: 20 },
    input: {
        width: "100%",
        height: 50,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingLeft: 10,
    },
});

export default Login;
