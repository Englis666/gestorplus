import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { decode as jwtDecode } from "jwt-decode";
import axios from "axios";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Certificados = () => {
    const fechaEmision = new Date().toLocaleDateString("es-ES");
    const [tipoCertificado, setTipoCertificado] = useState("laboral");
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);

    const getToken = async () => {
        return await AsyncStorage.getItem("auth_token");
    };

    const isTokenExpired = (decodedToken) => decodedToken.exp * 1000 < Date.now();

    useEffect(() => {
        const getUserData = async () => {
            setLoading(true);
            const token = await getToken();
            if (!token) {
                Alert.alert("Error", "No se encontró un token de autenticación");
                setLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                if (isTokenExpired(decodedToken)) {
                    Alert.alert("Error", "El token está expirado");
                    setLoading(false);
                    return;
                }

                const response = await axios.get("http://192.168.80.28/gestorplus/backend/", {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { action: "obtenerDatosParaCertificado" },
                });

                if (response.data?.Certificado) {
                    setUserData(response.data.Certificado);
                } else {
                    Alert.alert("Error", "Los datos de los certificados no son válidos");
                }
            } catch (err) {
                console.error("Error al obtener datos para el certificado", err);
                setUserData({});
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    const handleDownload = async () => {
        const titulo = tipoCertificado === "laboral" ? "Certificado Laboral" : "Certificado ARL";
        const contenido = `
      <h1>${titulo}</h1>
      <p>Fecha de emisión: ${fechaEmision}</p>
      <p>Rol: ${userData?.rol || "No disponible"}</p>
      <p>Departamento: ${userData?.departamento || "No especificado"}</p>
      <p>Fecha de ingreso: ${userData?.fechaIngreso || "No disponible"}</p>
      <p>Tipo de contrato: ${userData?.contrato || "No especificado"}</p>
      <p>Certificación: Esta hoja certifica que ${userData?.nombre || "Nombre del empleado"} pertenece a la empresa La Frayette.</p>
      ${tipoCertificado === "arl" ? `<p>Información ARL: El empleado cuenta con afiliación activa a una ARL.</p>` : ""}
      <p>Firma autorizada: La Frayette</p>
    `;

        try {
            const options = {
                html: contenido,
                fileName: `certificado_${tipoCertificado}`,
                directory: "Documents",
            };

            const file = await RNHTMLtoPDF.convert(options);
            Alert.alert("Descarga completada", `Certificado guardado en: ${file.filePath}`);
        } catch (error) {
            Alert.alert("Error", "No se pudo generar el PDF");
        }
    };

    return (
        <View style={{ flex: 1, padding: 20, backgroundColor: "#ECF0F1" }}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <View>
                    <Text style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 }}>
                        {tipoCertificado === "laboral" ? "Certificado Laboral" : "Certificado ARL"}
                    </Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Rol:</Text> {userData?.rol || "No disponible"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Departamento:</Text> {userData?.departamento || "No especificado"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Fecha de ingreso:</Text> {userData?.fechaIngreso || "No disponible"}</Text>
                    <Text><Text style={{ fontWeight: "bold" }}>Tipo de contrato:</Text> {userData?.contrato || "No especificado"}</Text>
                    {tipoCertificado === "arl" && (
                        <Text><Text style={{ fontWeight: "bold" }}>Información ARL:</Text> El empleado cuenta con afiliación activa.</Text>
                    )}
                    <Text style={{ marginTop: 10 }}><Text style={{ fontWeight: "bold" }}>Fecha de emisión:</Text> {fechaEmision}</Text>
                </View>
            )}

            <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-around" }}>
                <TouchableOpacity onPress={() => setTipoCertificado("laboral")} style={{ backgroundColor: "gray", padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: "white" }}>Certificado Laboral</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTipoCertificado("arl")} style={{ backgroundColor: "gray", padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: "white" }}>Certificado ARL</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDownload} style={{ backgroundColor: "blue", padding: 10, borderRadius: 5 }}>
                    <Text style={{ color: "white" }}>Descargar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Certificados;
