import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { decode as jwtDecode } from 'jwt-decode';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { PermissionsAndroid, Platform } from 'react-native';

const Certificados = () => {
    const [tipoCertificado, setTipoCertificado] = useState('laboral');
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fechaEmision = new Date().toLocaleDateString('es-ES');

    const getToken = async () => {
        return await AsyncStorage.getItem('auth_token');
    };

    const isTokenExpired = (decodedToken) => decodedToken.exp * 1000 < Date.now();

    useEffect(() => {
        const getUserData = async () => {
            setLoading(true);
            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'No se encontró un token de autenticación');
                setLoading(false);
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                if (isTokenExpired(decodedToken)) {
                    Alert.alert('Error', 'El token está expirado');
                    setLoading(false);
                    return;
                }

                const response = await axios.get('http://localhost/gestorplus/backend/', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { action: 'obtenerDatosParaCertificado' },
                });

                if (response.data?.Certificado?.length > 0) {
                    setUserData(response.data.Certificado);
                } else {
                    setUserData([]);
                }
            } catch (err) {
                console.error(err);
                setUserData([]);
            } finally {
                setLoading(false);
            }
        };

        getUserData();
    }, []);

    const generatePDF = async () => {
        const user = userData[0] || {};

        const htmlContent = `
      <h1 style="text-align: center;">Certificado ${tipoCertificado.toUpperCase()}</h1>
      <p>La Fayette S.A.S.<br/>
      NIT: 900.123.456-7<br/>
      Dirección: Calle 123 # 45-67, Bogotá, Colombia<br/>
      Teléfono: (1) 123 4567<br/>
      Email: contacto@lafayette.com.co</p>
      <p>Bogotá, ${fechaEmision}</p>
      <p>A quien corresponda:</p>
      <p>Por la presente certificamos que ${user.nombres || '[Nombre]'}, con cédula ${user.num_doc || '[Doc]'} ha trabajado como ${user.nombreCargo || '[Cargo]'} desde el ${user.fechaInicio || '[Fecha]'} hasta la fecha.</p>
      <p>Este certificado se expide para fines que el interesado estime convenientes.</p>
      <p>Atentamente,<br/><br/>[Nombre del firmante]<br/>Cargo<br/>Teléfono</p>
    `;

        try {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
                );
            }

            const file = await RNHTMLtoPDF.convert({
                html: htmlContent,
                fileName: `certificado_${tipoCertificado}`,
                directory: 'Documents',
            });

            Alert.alert('Éxito', `PDF guardado en: ${file.filePath}`);
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'No se pudo generar el PDF');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Certificado {tipoCertificado.toUpperCase()}</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#000" />
            ) : userData.length > 0 ? (
                <View style={styles.card}>
                    <Text><Text style={styles.bold}>Nombre:</Text> {userData[0]?.nombres}</Text>
                    <Text><Text style={styles.bold}>Departamento:</Text> {userData[0]?.nombreConvocatoria}</Text>
                    <Text><Text style={styles.bold}>Fecha de ingreso:</Text> {userData[0]?.fechaInicio}</Text>
                    <Text><Text style={styles.bold}>Tipo de contrato:</Text> {userData[0]?.tipoContrato}</Text>
                </View>
            ) : (
                <Text>No hay datos disponibles</Text>
            )}

            <View style={styles.buttonContainer}>
                <Button title="Laboral" onPress={() => setTipoCertificado("laboral")} />
                <Button title="ARL" onPress={() => setTipoCertificado("arl")} />
                <Button title={`Descargar ${tipoCertificado}`} onPress={generatePDF} color="green" />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#f4f4f4' },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
    card: { padding: 15, backgroundColor: '#fff', borderRadius: 8, marginBottom: 20 },
    bold: { fontWeight: 'bold' },
    buttonContainer: { gap: 10, marginTop: 20 }
});

export default Certificados;
