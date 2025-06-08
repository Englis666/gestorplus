import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerSistemaDeGestion = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  try {
    const response = await axios.get(`${API_URL}obtenerSistemaDeGestion`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (!data) throw new Error("No se encontraron datos");

    return data.sistemaDeGestion || [];
  } catch (error) {
    console.error("Error al obtener el sistema de gestión:", error);
    throw error;
  }
};

export const asignarSistemaDeGestion = async (formData) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  try {
    const response = await axios.post(
      `${API_URL}guardarResultadosSistemaDeGestion`,
      formData, // Enviar el objeto directamente, no usar spread
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const data = response.data;
    if (!data) throw new Error("No se pudo asignar el sistema de gestión");

    return data;
  } catch (error) {
    console.error("Error al asignar el sistema de gestión:", error);
    throw error;
  }
};
