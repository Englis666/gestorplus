import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import API_URL from '../config'; // Importa la URL de la API

const Chat = ({ selectedChat }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [loadError, setLoadError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rol, setRol] = useState(null);

    const obtenerMensajes = async (targetIdChat) => {
        const token = await AsyncStorage.getItem("auth_token");
        if (!token) {
            Alert.alert("Error", "No se encontró ningún token. Redirigiendo al login...");
            return;
        }

        if (!targetIdChat) {
            setLoadError('No se ha seleccionado un chat.');
            return;
        }

        try {
            const decodedToken = jwtDecode(token);
            const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
            if (isTokenExpired) {
                Alert.alert("Error", "El token ha expirado");
                setLoading(false);
                return;
            }

            setRol(decodedToken?.data?.rol);
            setLoading(true);

            const response = await axios.get(`${API_URL}`, {
                params: { action: 'obtenerMensajes', targetIdChat },
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 'success') {
                setChatMessages(response.data.mensajes || []);
            } else {
                setLoadError('Error al cargar los mensajes');
            }
        } catch (err) {
            setLoadError('Error al cargar los mensajes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedChat?.idChat) {
            obtenerMensajes(selectedChat.idChat);
        }
    }, [selectedChat]);

    return (
        <View style={styles.container}>
            {loadError ? <Text style={styles.error}>{loadError}</Text> : null}
            {loading && <ActivityIndicator size="large" color="#0078FF" />}
            {!loading && chatMessages.length === 0 && !loadError && (
                <Text style={styles.noMessages}>No hay mensajes todavía.</Text>
            )}
            <FlatList
                data={chatMessages}
                keyExtractor={(item) => item.idChat.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.message, item.emisor === selectedChat.idChat ? styles.myMessage : styles.otherMessage]}>
                        <Text style={styles.messageText}>{item.mensajes}</Text>
                        <Text style={styles.senderName}>{item.nombreEmisor}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 10,
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    noMessages: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    message: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '75%',
        alignSelf: 'flex-start',
    },
    myMessage: {
        backgroundColor: '#0078FF',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#f1f0f0',
    },
    messageText: {
        color: '#fff',
    },
    senderName: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
});

export default Chat;
