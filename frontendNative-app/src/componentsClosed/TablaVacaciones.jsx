/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { decode as jwtDecode } from "jwt-decode";
import moment from "moment";
import { Calendar, LocaleConfig } from "react-native-calendars";
import API_URL from "../config"; // Importamos la URL desde config.js

LocaleConfig.locales['es'] = {
    monthNames: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    today: 'Hoy'
};
LocaleConfig.defaultLocale = 'es';

const TablaVacaciones = () => {
    const [vacaciones, setVacaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rol, setRol] = useState(null);
    const [form, setForm] = useState({ fechaInicio: "", fechaFin: "" });

    useEffect(() => {
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken?.exp * 1000 < Date.now()) {
                setError("El token ha expirado");
                setLoading(false);
                return;
            }

            const Rol = decodedToken?.data?.rol;
            setRol(Rol);

            const action = Rol === "1" || Rol === "2" ? "obtenerTodasLasVacaciones" : "obtenerMisVacaciones";

            axios.get(`${API_URL}`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { action },
            }).then((response) => {
                setVacaciones(Array.isArray(response.data?.Vacaciones) ? response.data.Vacaciones : []);
                setLoading(false);
            }).catch(() => {
                setError("Hubo un problema al cargar las vacaciones.");
                setLoading(false);
            });
        } catch {
            setError("Token inválido o malformado.");
            setLoading(false);
        }
    }, []);

    const handleSubmit = () => {
        const token = "TOKEN_DE_EJEMPLO";
        if (!token) {
            Alert.alert("Error", "Token no encontrado.");
            return;
        }

        axios.post(`${API_URL}`, {
            action: "solicitarVacaciones",
            fechaInicio: form.fechaInicio,
            fechaFin: form.fechaFin,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        }).then(() => {
            Alert.alert("Éxito", "Vacaciones solicitadas correctamente.");
        }).catch(() => {
            Alert.alert("Error", "Error al solicitar vacaciones.");
        });
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <ScrollView style={{ padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Solicitar Vacaciones</Text>
            <TextInput
                placeholder="Fecha Inicio (YYYY-MM-DD)"
                value={form.fechaInicio}
                onChangeText={(text) => setForm({ ...form, fechaInicio: text })}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <TextInput
                placeholder="Fecha Fin (YYYY-MM-DD)"
                value={form.fechaFin}
                onChangeText={(text) => setForm({ ...form, fechaFin: text })}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />
            <Button title="Solicitar" onPress={handleSubmit} />

            <Text style={{ fontSize: 20, fontWeight: "bold", marginVertical: 20 }}>Calendario de Vacaciones</Text>
            <Calendar
                markedDates={vacaciones.reduce((acc, v) => {
                    acc[v.fechaInicio] = { marked: true, dotColor: 'blue' };
                    acc[v.fechaFin] = { marked: true, dotColor: 'red' };
                    return acc;
                }, {})}
            />
        </ScrollView>
    );
};

export default TablaVacaciones;
