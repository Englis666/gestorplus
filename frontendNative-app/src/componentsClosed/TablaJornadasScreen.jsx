import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_URL from '../config';

const TablaJornadas = () => {
  const [jornadas, setJornadas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
  
        if (!token) {
          setError('Token no encontrado.');
          setLoading(false);
          return;
        }
  
        const decodedToken = jwtDecode(token);
        const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
        if (isTokenExpired) {
          setError('El token ha expirado.');
          setLoading(false);
          return;
        }
  
        const Rol = String(decodedToken?.data?.rol);
        setRol(Rol);
  
        const roleActions = {
          '1': 'obtenerTodasLasJornadas',
          '2': 'obtenerTodasLasJornadas',
          '3': 'obtenerJornadas',
        };
  
        const action = roleActions[Rol];
  
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { action },
        });
  
        const jornadasData = response.data?.Jornadas || [];
        setJornadas(jornadasData);
        setLoading(false); // Make sure to set loading to false after data is fetched.
      } catch (err) {
        console.error('Error:', err);
        setError('Hubo un problema al cargar las jornadas.');
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handleCorroborar = async (idJornada) => {
    try {
      await axios.post(API_URL, {
        action: 'corroborarJornada',
        data: { idJornada },
      });
      Alert.alert('Éxito', 'La jornada ha sido corroborada correctamente.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo corroborar la jornada.');
    }
  };

  const handleNoCorroborar = async (idJornada) => {
    try {
      await axios.post(API_URL, {
        action: 'noCorroborarJornada',
        data: { idJornada },
      });
      Alert.alert('Éxito', 'La jornada ha sido marcada como no corroborada.');
    } catch (err) {
      Alert.alert('Error', 'No se pudo marcar como no corroborada.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.text}>ID Jornada: {item.idJornada}</Text>
      <Text style={styles.text}>Nombres: {item.nombres}</Text>
      <Text style={styles.text}>Apellidos: {item.apellidos}</Text>
      <Text style={styles.text}>Fecha: {item.fecha}</Text>
      <Text style={styles.text}>Hora Entrada: {item.horaEntrada}</Text>
      <Text style={styles.text}>Hora Salida: {item.horaSalida}</Text>
      <Text style={styles.text}>Estado Jornada: {item.estadoJornada}</Text>
      {item.descripcion && <Text style={styles.text}>Descripción: {item.descripcion}</Text>}

      <View style={styles.buttonContainer}>
        <Button
          title="Corroborar"
          onPress={() => handleCorroborar(item.idJornada)}
          color="#28a745"
        />
        <Button
          title="No Corroborar"
          onPress={() => handleNoCorroborar(item.idJornada)}
          color="#dc3545"
        />
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;

  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jornadas (Control de Entrada de Trabajo)</Text>
      <FlatList
        data={jornadas}
        renderItem={renderItem}
        keyExtractor={(item) => item.idJornada.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text>No hay jornadas disponibles.</Text>}
      />
    </View>
  );
};

export default TablaJornadas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    marginBottom: 6,
    fontSize: 16,
    color: '#444',
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loader: {
    marginTop: 50,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    paddingBottom: 100,
  },
});