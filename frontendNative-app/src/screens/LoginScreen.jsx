import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import imagen from '../assets/1.png';

const Login = () => {
    const [formData, setFormData] = useState({
        num_doc: '',
        password: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigation = useNavigation();


    const handleChange = (e, field) => {
        const value = e.target.value;
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.num_doc || !formData.password) {
            Alert.alert("Por favor complete todos los campos.");
            return;
        }

        const data = {
            action: 'login',
            num_doc: formData.num_doc,
            password: formData.password,
        };

        setIsSubmitting(true);
        axios
        .post("http://localhost/gestorplus/backend/", data)
        .then((response) => {
            const serverMessage = response.data;
            
            if (serverMessage?.status === 'success') {
                const token = serverMessage.token;
                document.cookie = `auth_token=${token}; path=/; domain=localhost;`;

                login({ token });

                const decodedToken = decodeToken(token);
                const userRole = decodedToken?.data?.rol; 
                
                switch (userRole) {
                    case "1":
                        navigation.navigate("administrador/inicioAdmin");
                        break;
                    case "2":
                        navigation.navigate("recursoshumanos/inicioRRHH");
                        break;
                    case "3":
                        navigation.navigate("empleado/inicioEmpleado");
                        break;
                    case "4":
                        navigation.navigate("aspirante/inicio");
                        break;
                    default:
                        document.cookie = "auth_token=; path=/; domain=localhost; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        console.error("Rol desconocido:", userRole);
                        navigation.navigate("/");
                        Alert.alert("Rol desconocido");
                }
            } else {
                Alert.alert(serverMessage?.message || "Error en el inicio de sesión");
                setIsSubmitting(false);
            }
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error);
            Alert.alert("Error en el inicio de sesión. Intenta de nuevo.");
            setIsSubmitting(false);
        });
    };

    const decodeToken = (token) => {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload)); 
            return decoded;
        } catch (e) {
            console.error("Error decodificando el token:", e);
            return null; 
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={imagen}
                        style={styles.image}
                    />
                    <Text style={styles.title}>Bienvenidos al software GestorPlus</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.subtitle}>Bienvenido otra vez</Text>
                    <Text style={styles.subtitle}>Estamos felices de volver a ver</Text>
                    
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
                    
                    <Button 
                        title={isSubmitting ? "Iniciando Sesión..." : "Iniciar sesión"} 
                        onPress={handleSubmit} 
                        disabled={isSubmitting}
                    />

                    <Button 
                        title="No tengo cuenta"
                        onPress={() => navigation.navigate('Registro')}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    formContainer: { 
        flexDirection: 'row', 
        width: '90%', 
        borderRadius: 20, 
        backgroundColor: 'white', 
        elevation: 5, 
        padding: 20
    },
    imageContainer: { 
        justifyContent: 'center', 
        alignItems: 'center', 
        flex: 1, 
        backgroundColor: '#103cbe', 
        borderTopLeftRadius: 20, 
        borderBottomLeftRadius: 20 
    },
    image: { 
        width: 150, 
        height: 150, 
        resizeMode: 'contain'
    },
    title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    form: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
    input: { 
        width: '100%', 
        height: 50, 
        borderColor: 'gray', 
        borderWidth: 1, 
        borderRadius: 5, 
        marginBottom: 15, 
        paddingLeft: 10 
    }
});

export default Login;
