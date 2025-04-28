import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import API_URL from "../config";

const Register = () => {
    const [formData, setFormData] = useState({
        num_doc: '',
        nombres: '',
        apellidos: '',
        email: '',
        tipodDoc: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSubmit = async () => {
        if (!formData.num_doc || !formData.nombres || !formData.apellidos ||
            !formData.email || !formData.tipodDoc || !formData.password) {
            Alert.alert("Error", "Por favor complete todos los campos.");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(API_URL, {
                action: 'register',
                ...formData
            });

            if (response.data?.status === 'success') {
                Alert.alert("Registro exitoso", "Ahora puedes iniciar sesión.");
                navigation.navigate("Login");
            } else {
                Alert.alert("Error", response.data?.message || "Hubo un problema en el registro.");
            }
        } catch (error) {
            console.error("Error al registrarse:", error);
            Alert.alert("Error", "Hubo un problema con la conexión.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                {/* 🔹 Header Azul */}
                <View style={styles.header}>
                    <Image source={require("../assets/1.png")} style={styles.logo} />
                    <Text style={styles.headerText}>Crea tu Cuenta</Text>
                </View>

                {/* 🔹 Formulario */}
                <View style={styles.form}>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de Documento"
                        keyboardType="numeric"
                        value={formData.num_doc}
                        onChangeText={(value) => handleChange("num_doc", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nombres"
                        value={formData.nombres}
                        onChangeText={(value) => handleChange("nombres", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Apellidos"
                        value={formData.apellidos}
                        onChangeText={(value) => handleChange("apellidos", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo Electrónico"
                        keyboardType="email-address"
                        value={formData.email}
                        onChangeText={(value) => handleChange("email", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Tipo de Documento"
                        value={formData.tipodDoc}
                        onChangeText={(value) => handleChange("tipodDoc", value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        secureTextEntry
                        value={formData.password}
                        onChangeText={(value) => handleChange("password", value)}
                    />

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <Text style={styles.buttonText}>
                            {isSubmitting ? "Registrando..." : "Registrarse"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                        style={styles.registerButton}
                    >
                        <Text style={styles.registerText}>Ya tengo cuenta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default Register;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        width: "90%",
        maxWidth: 400,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    header: {
        backgroundColor: "#103cbe",
        width: "100%",
        alignItems: "center",
        paddingVertical: 20,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: "contain",
        marginBottom: 5,
    },
    headerText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    form: {
        width: "100%",
        padding: 20,
    },
    input: {
        backgroundColor: "#f8f9fa",
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        width: "100%",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    button: {
        backgroundColor: "#103cbe",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    registerButton: {
        marginTop: 15,
        alignItems: "center",
    },
    registerText: {
        color: "#103cbe",
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
