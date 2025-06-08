import axios from "axios";
import API_URL from "../config";
const { getCookie } = require("../utils/Auth");

export const obtenerDatosDelEntrevistado = async (num_doc) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  try {
    const response = await axios.get(`${API_URL}obtenerDatosDelEntrevistado`, {
      params: { num_doc },
      headers: { Authorization: `Bearer ${token}` },
    });

    // Soporta diferentes variantes de clave
    if (response.data?.entrevistado) {
      return response.data.entrevistado;
    } else if (response.data?.Entrevistado) {
      return response.data.Entrevistado;
    } else if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos del entrevistado:", error);
    throw new Error("No se pudieron obtener los datos del entrevistado");
  }
};
export const obtenerHojadevidaPorNumDoc = async (num_doc) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  const response = await axios.get(`${API_URL}obtenerHojadevidaPorNumDoc`, {
    params: { num_doc },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.data && response.data.data) return response.data.data;
  throw new Error("No se encontró la hoja de vida");
};

export const analizarHojaDeVidaPorNumDoc = async (num_doc) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  const response = await axios.get(`${API_URL}analizarHojaDeVidaPorNumDoc`, {
    params: { num_doc },
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.data && response.data.data) return response.data.data;
  if (response.data && response.data.visualMessage)
    return { error: response.data.visualMessage };
  throw new Error("No se pudo analizar la hoja de vida");
};
