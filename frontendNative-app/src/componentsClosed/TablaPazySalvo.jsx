import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const TablaPazYSalvo = () => {
    const [salvos, setSalvos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rol, setRol] = useState(null);
    const [empleados, setEmpleados] = useState([]);
    const [form, setForm] = useState({
        motivo: "",
        fechaEmision: "",
        estado: "",
        empleado: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                if (!token) throw new Error("Token no encontrado");

                const decodedToken = jwtDecode(token);
                if (decodedToken.exp * 1000 < Date.now()) throw new Error("El token ha expirado");

                setRol(decodedToken.data.rol);
                const action = decodedToken.data.rol === "3" ? "obtenerMiPazySalvo" : "obtenerPazYSalvos";

                const responseSalvos = await axios.get("http://192.168.80.28/gestorplus/backend/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { action },
                });
                setSalvos(responseSalvos.data?.Salvos || []);

                const responseEmpleados = await axios.get("http://localhost/gestorplus/backend/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { action: "obtenerEmpleados" },
                });
                setEmpleados(responseEmpleados.data?.empleados || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");
            if (!token) throw new Error("Token no encontrado");

            const response = await axios.post("http://localhost/gestorplus/backend/", {
                action: "generarPazYSalvo",
                ...form
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                Alert.alert("Éxito", "Paz y salvo generado correctamente");
                setSalvos([...salvos, form]);
            } else {
                Alert.alert("Error", "No se pudo generar el paz y salvo");
            }
        } catch (err) {
            Alert.alert("Error", err.message);
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>Error: {error}</Text>;

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10 }}>Paz y Salvo</Text>
            <FlatList
                data={salvos}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1 }}>
                        <Text>Motivo: {item.motivo}</Text>
                        <Text>Fecha: {item.fechaEmision}</Text>
                        <Text>Estado: {item.estado}</Text>
                    </View>
                )}
            />
            {(rol === "1" || rol === "2") && (
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Generar Paz y Salvo</Text>
                    <TextInput placeholder="Motivo" value={form.motivo} onChangeText={(value) => handleInputChange("motivo", value)} style={{ borderWidth: 1, padding: 5, marginVertical: 5 }} />
                    <TextInput placeholder="Fecha" value={form.fechaEmision} onChangeText={(value) => handleInputChange("fechaEmision", value)} style={{ borderWidth: 1, padding: 5, marginVertical: 5 }} />
                    <TextInput placeholder="Estado" value={form.estado} onChangeText={(value) => handleInputChange("estado", value)} style={{ borderWidth: 1, padding: 5, marginVertical: 5 }} />
                    <TextInput placeholder="Empleado" value={form.empleado} onChangeText={(value) => handleInputChange("empleado", value)} style={{ borderWidth: 1, padding: 5, marginVertical: 5 }} />
                    <Button title="Generar Paz y Salvo" onPress={handleSubmit} />
                </View>
            )}
        </View>
    );
};

export default TablaPazYSalvo;
