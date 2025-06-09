import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerEntrevistas = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  try {
    const response = await axios.get(`${API_URL}obtenerEntrevistas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Respuesta de obtenerEntrevistas:", response.data);
    if (Array.isArray(response.data.entrevistas)) {
      return response.data.entrevistas;
    } else if (Array.isArray(response.data.Entrevistas)) {
      return response.data.Entrevistas;
    } else if (Array.isArray(response.data.Entrevista)) {
      return response.data.Entrevista;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error al obtener entrevistas:", error);
    throw new Error("No se pudieron obtener las entrevistas");
  }
};

export const enviarAsistenciaEntrevista = async (identrevista, asistencia) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  try {
    const response = await axios.patch(
      `${API_URL}asistenciaConfirmada`,
      { identrevista, asistencia },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar asistencia de entrevista:", error);
    throw new Error("No se pudo enviar la asistencia de la entrevista");
  }
};

export const enviarNoAsistenciaEntrevista = async (identrevista, motivo) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  try {
    const response = await axios.patch(
      `${API_URL}asistenciaNoConfirmada`,
      { identrevista, motivo },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al enviar no asistencia de entrevista:", error);
    throw new Error("No se pudo enviar la no asistencia de la entrevista");
  }
};

export const rechazarEntrevistado = async (num_doc, identrevista) => {
  try {
    const token = getCookie("auth_token");
    if (!token) throw new Error("Token No encontrado");
    const response = await axios.patch(
      `${API_URL}rechazarEntrevistado`,
      { num_doc, identrevista },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Respuesta de rechazarEntrevistado:", response.data);
    if (!response || !response.data) {
      throw new Error("No se pudo rechazar al entrevistado");
    }
    if (response.status !== 200) {
      throw new Error("Error al rechazar al entrevistado");
    }

    return response.data;
  } catch (error) {
    console.error("Error al rechazar entrevistado:", error);
    throw new Error("No se pudo rechazar al entrevistado");
  }
};

export const asignarEntrevista = async (formData) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");
  try {
    const response = await axios.post(`${API_URL}asignarEntrevista`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Respuesta de asignarEntrevista:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al asignar entrevista:", error);
    throw error;
  }
};
