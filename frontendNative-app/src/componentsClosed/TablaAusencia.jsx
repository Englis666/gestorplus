import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, Alert, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";

const TablaAusencias = () => {
    const [ausencias, setAusencias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [solicitud, setSolicitud] = useState({
        fechaInicio: "",
        fechaFin: "",
        tipoAusencia: "",
        descripcion: "",
    });

    useEffect(() => {
        axios.get("http://192.168.68.195/gestorplus/backend/", { params: { action: "obtenerTodasLasAusencias" } })
            .then(response => {
                setAusencias(response.data?.Ausencias || []);
                setLoading(false);
            })
            .catch(error => {
                setError("Error al obtener las ausencias.");
                setLoading(false);
            });
    }, []);

    const handleSolicitarAusencia = () => {
        if (new Date(solicitud.fechaInicio) > new Date(solicitud.fechaFin)) {
            Alert.alert("Error", "La fecha de inicio no puede ser posterior a la fecha de fin.");
            return;
        }
        axios.post("http://localhost/gestorplus/backend/", { action: "solicitarAusencia", ...solicitud })
            .then(() => {
                Alert.alert("Éxito", "Solicitud enviada con éxito.");
                setModalVisible(false);
            })
            .catch(() => Alert.alert("Error", "Hubo un problema al enviar la solicitud."));
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Ausencias</Text>
            <FlatList
                data={ausencias}
                keyExtractor={(item) => item.idausencia.toString()}
                renderItem={({ item }) => (
                    <View style={{ padding: 10, borderBottomWidth: 1 }}>
                        <Text>Fecha Inicio: {item.fechaInicio}</Text>
                        <Text>Fecha Fin: {item.fechaFin}</Text>
                        <Text>Tipo: {item.tipoAusencia}</Text>
                        <Text>Descripción: {item.descripcion}</Text>
                    </View>
                )}
            />

            <Button title="Solicitar Ausencia" onPress={() => setModalVisible(true)} />

            <Modal visible={modalVisible} animationType="slide">
                <View style={{ padding: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>Solicitar Ausencia</Text>
                    <TextInput placeholder="Fecha Inicio" onChangeText={(text) => setSolicitud({ ...solicitud, fechaInicio: text })} />
                    <TextInput placeholder="Fecha Fin" onChangeText={(text) => setSolicitud({ ...solicitud, fechaFin: text })} />
                    <Picker selectedValue={solicitud.tipoAusencia} onValueChange={(itemValue) => setSolicitud({ ...solicitud, tipoAusencia: itemValue })}>
                        <Picker.Item label="Seleccione un tipo" value="" />
                        <Picker.Item label="Enfermedad" value="Enfermedad" />
                        <Picker.Item label="Vacaciones" value="Vacaciones" />
                        <Picker.Item label="Personal" value="Personal" />
                    </Picker>
                    <TextInput placeholder="Descripción" onChangeText={(text) => setSolicitud({ ...solicitud, descripcion: text })} multiline />
                    <Button title="Enviar" onPress={handleSolicitarAusencia} />
                    <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                </View>
            </Modal>
        </View>
    );
};

export default TablaAusencias;
