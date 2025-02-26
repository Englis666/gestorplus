
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ModalHojaDeVida from "../componentsClosed/ModalHojadevida";
import Estudios from "../componentsClosed/ModalEstudios";
import Experiencia from "../componentsClosed/ModalExperienciaLaboral";

const Perfil = () => {
  const [formData, setFormData] = useState({
    num_doc: "",
    nombres: "",
    apellidos: "",
    email: "",
    tipodDoc: "",
    password: "",
    originalData: {},
  });

  const [modalHojaDeVida, setModalHojaDeVida] = useState(false);
  const [modalEstudios, setModalEstudios] = useState(false);
  const [modalExperiencia, setModalExperiencia] = useState(false);

  const getUserData = async () => {
    try {
      const token = "auth_token"; // Ajustar para obtener el token de almacenamiento seguro
      if (!token) {
        Alert.alert("Error", "No se encontró el token de autenticación.");
        return;
      }
      const decodedToken = jwtDecode(token);
      if (decodedToken.exp * 1000 < Date.now()) {
        Alert.alert("Error", "El token ha expirado.");
        return;
      }

      const response = await axios.get("http://localhost/gestorplus/backend/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "datosPerfil" },
      });

      if (response.status === 200) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...response.data,
          originalData: { ...response.data },
        }));
      } else {
        Alert.alert("Error", "Error al obtener los datos del usuario");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al obtener los datos del usuario");
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleChange = (name, value) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const updatedData = {};
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== formData.originalData[key]) {
          updatedData[key] = formData[key];
        }
      });
      const token = "auth_token";
      const response = await axios.patch("http://192.168.43.98/gestorplus/backend/", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "actualizarPerfil" },
      });

      if (response.status === 200) {
        Alert.alert("Éxito", "Perfil actualizado correctamente");
        setFormData((prevFormData) => ({ ...prevFormData, originalData: { ...prevFormData } }));
      } else {
        Alert.alert("Error", "Hubo un error al actualizar el perfil");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al actualizar los datos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuración de perfil</Text>
      <TextInput placeholder="Correo electrónico" style={styles.input} value={formData.email} onChangeText={(value) => handleChange("email", value)} />
      <TextInput placeholder="Tipo de documento" style={styles.input} value={formData.tipodDoc} onChangeText={(value) => handleChange("tipodDoc", value)} />
      <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry value={formData.password} onChangeText={(value) => handleChange("password", value)} />
      <Button title="Actualizar datos" onPress={handleSubmit} />
      
      <TouchableOpacity style={styles.button} onPress={() => setModalHojaDeVida(true)}>
        <Text style={styles.buttonText}>Agregar o actualizar Hoja de vida</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setModalEstudios(true)}>
        <Text style={styles.buttonText}>Agregar estudios</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setModalExperiencia(true)}>
        <Text style={styles.buttonText}>Agregar Experiencia</Text>
      </TouchableOpacity>
      
      <ModalHojaDeVida visible={modalHojaDeVida} onClose={() => setModalHojaDeVida(false)} />
      <Estudios visible={modalEstudios} onClose={() => setModalEstudios(false)} />
      <Experiencia visible={modalExperiencia} onClose={() => setModalExperiencia(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default Perfil;
