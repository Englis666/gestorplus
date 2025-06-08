import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const calcularPostulacionesEnConvocatorias = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");
  try {
    const response = await axios.get(
      `${API_URL}calcularPostulacionesEnConvocatorias`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.convocatorias || [];
  } catch (error) {
    console.error("Error al calcular postulaciones en convocatorias:", error);
    throw error;
  }
};

export const obtenerPostulaciones = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");
  try {
    const response = await axios.get(`${API_URL}obtenerPostulaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Respuesta de obtenerPostulaciones:", response.data);
    if (response.data && Array.isArray(response.data.postulaciones)) {
      return response.data.postulaciones;
    } else if (response.data && Array.isArray(response.data.Postulaciones)) {
      return response.data.Postulaciones;
    } else if (response.data && response.data.postulaciones) {
      return [response.data.postulaciones];
    } else if (response.data && response.data.Postulaciones) {
      return [response.data.Postulaciones];
    } else {
      return [];
    }
  } catch (error) {
    console.error(
      "Error al obtener postulaciones:",
      error?.response?.data || error.message
    );
    return [];
  }
};

export const obtenerPostulacionesAgrupadas = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");
  try {
    const response = await axios.get(
      `${API_URL}obtenerPostulacionesAgrupadas`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data.postulaciones || [];
  } catch (error) {
    console.error("Error al obtener postulaciones agrupadas:", error);
    throw error;
  }
};

export const obtenerPostulacionesAspirante = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");
  try {
    const response = await axios.get(
      `${API_URL}obtenerPostulacionesAspirante`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Respuesta de obtenerPostulacionesAspirante:", response.data);
    if (response.data && Array.isArray(response.data.postulaciones)) {
      return response.data.postulaciones;
    } else if (response.data && Array.isArray(response.data.Postulaciones)) {
      return response.data.Postulaciones;
    } else {
      return [];
    }
  } catch (error) {
    console.error(
      "Error al obtener postulaciones del aspirante:",
      error?.response?.data || error.message
    );
    return [];
  }
};

export const obtenerPostulacionesAgrupadasPorConvocatoria = async (
  idconvocatoria
) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");
  const response = await axios.get(
    `${API_URL}obtenerPostulacionesAgrupadasPorConvocatoria`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { idconvocatoria },
    }
  );
  console.log(
    "Respuesta de obtenerPostulacionesAgrupadasPorConvocatoria:",
    response.data
  );
  if (response.data && Array.isArray(response.data.postulaciones)) {
    return response.data.postulaciones;
  } else if (response.data && Array.isArray(response.data.Postulaciones)) {
    return response.data.Postulaciones;
  } else if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else {
    return [];
  }
};
