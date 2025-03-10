import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({ num_doc: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (name, value) => {
    if (name === "num_doc" && !/^\d*$/.test(value)) return; // Solo números
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    if (!formData.num_doc || !formData.password) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("http://192.168.58.95/gestorplus/backend/", {
        action: "login",
        num_doc: formData.num_doc,
        password: formData.password,
      });

      if (response.data?.status === "success") {
        const token = response.data.token;
        await AsyncStorage.setItem("auth_token", token);

        const decodedToken = decodeToken(token);
        console.log("Token decodificado:", decodedToken); // Verificar contenido

        const userRole = decodedToken?.data?.rol;
        console.log("Rol del usuario:", userRole);

        switch (userRole) {
          case "1":
            navigation.replace("Administrador");
            break;
          case "2":
            navigation.replace("RecursosHumanos");
            break;
          case "3":
            navigation.replace("Empleado");
            break;
          case "4":
            navigation.replace("Aspirante");
            break;
          default:
            Alert.alert("Error", "Rol desconocido.");
        }
      } else {
        Alert.alert("Error", response.data?.message || "Inicio de sesión fallido.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      Alert.alert("Error", "Hubo un problema con la conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const decodeToken = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* 🔹 Header Azul */}
        <View style={styles.header}>
          <Image source={require("../assets/1.png")} style={styles.logo} />
          <Text style={styles.headerText}>Bienvenido a GestorPlus</Text>
        </View>

        {/* 🔹 Formulario */}
        <View style={styles.form}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Número de documento"
            keyboardType="numeric"
            value={formData.num_doc}
            onChangeText={(value) => handleChange("num_doc", value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleChange("password", value)}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? "Iniciando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Register")}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>No tengo cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  header: {
    backgroundColor: "#103cbe",
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    marginBottom: 5,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  form: {
    width: "100%",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#103cbe",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    width: "100%",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#103cbe",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 15,
    alignItems: "center",
  },
  registerText: {
    color: "#103cbe",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
