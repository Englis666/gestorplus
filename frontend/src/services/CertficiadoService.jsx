import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerDatosParaCertificado = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  try {
    const response = await axios.get(`${API_URL}obtenerDatosParaCertificado`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (!data || !data.certificado)
      throw new Error("No se encontraron datos para el certificado");

    return data.certificado;
  } catch (error) {
    console.error("Error al obtener datos para el certificado:", error);
    throw error;
  }
};
