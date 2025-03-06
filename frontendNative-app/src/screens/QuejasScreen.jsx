import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Chat from '../componentsClosed/Chat';
import SidebarChat from '../componentsClosed/SidebarChat';

const Quejas = () => {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigation = useNavigation();

    const getCookie = (name) => {
        // Simulación de obtención de cookie en React Native
        return null;
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            Alert.alert('Error', 'El mensaje está vacío');
            return;
        }

        const token = getCookie("auth_token");
        if (!token) {
            Alert.alert('Error', 'No se encontró el token. Redirigiendo al login...');
            navigation.navigate("Login");
            return;
        }

        const data = {
            action: 'enviarMensajes',
            message,
            targetNum_doc: selectedUser?.num_doc,
        };

        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://192.168.80.28/gestorplus/backend/', data, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data?.status === 'success') {
                setChatMessages((prevMessages) => [...prevMessages, { message }]);
                setMessage('');
            } else {
                setError(response.data.message || 'Error desconocido');
            }
        } catch (error) {
            setError('Error enviando el mensaje');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <SidebarChat onUserSelect={setSelectedUser} />
            <View style={styles.chatContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>{selectedUser ? selectedUser.nombres : 'Selecciona un usuario'}</Text>
                </View>
                <Chat selectedUser={selectedUser} chatMessages={chatMessages} error={error} loading={loading} noMessages={chatMessages.length === 0} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Escribe un mensaje"
                        editable={!loading}
                    />
                    <TouchableOpacity style={[styles.sendButton, (message.trim() === '' || loading) && styles.disabledButton]} onPress={handleSendMessage} disabled={message.trim() === '' || loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendButtonText}>Enviar</Text>}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 20 },
    chatContainer: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 20, shadowOpacity: 0.1, shadowRadius: 10 },
    header: { paddingVertical: 15 },
    headerText: { fontSize: 18, fontWeight: 'bold' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    input: { flex: 1, height: 45, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
    sendButton: { backgroundColor: '#007bff', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 5, marginLeft: 5 },
    disabledButton: { opacity: 0.5 },
    sendButtonText: { color: '#fff', fontSize: 16 },
});

export default Quejas;