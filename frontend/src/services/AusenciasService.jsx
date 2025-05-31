import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerAusencias = async (obtenerRol) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const action = {
    1: "obtenerTodasLasAusencias",
    2: "obtenerTodasLasAusencias",
    3: "obtenerAusencias",
  }[obtenerRol];
  if (!action) throw new Error("Rol inválido");
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: { action },
    });
    const data = response.data;
    if (!data) throw new Error("No se encontraron datos");
    return data;
  } catch (error) {
    console.error("Error al obtener ausencias:", error);
    throw error;
  }
};

export const aceptarAusencia = async (idausencia) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.post(
      API_URL,
      { action: "ausenciaAceptada", idausencia },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 200) throw new Error("Error al aceptar ausencia");
    return response.data;
  } catch (error) {
    console.error("Error al aceptar ausencia:", error);
    throw error;
  }
};
export const rechazarAusencia = async (idausencia) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.post(
      API_URL,
      { action: "ausenciaRechazada", idausencia },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (response.status !== 200) throw new Error("Error al rechazar ausencia");
    return response.data;
  } catch (error) {
    console.error("Error al rechazar ausencia:", error);
    throw error;
  }
};
export const solicitarAusencia = async (solicitud) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");

  const response = await axios.post(
    API_URL,
    {
      action: "solicitarAusencia",
      ...solicitud,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (response.status !== 200) {
    throw new Error("Error al enviar la solicitud de ausencia");
  }
  if (!response.data) {
    throw new Error("No se recibieron datos de la solicitud");
  }
  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};
