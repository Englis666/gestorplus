import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerVinculaciones = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  try {
    const response = await axios.get(`${API_URL}obtenerVinculaciones`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (!data || !Array.isArray(data.Vinculaciones)) {
      throw new Error("No se encontraron vinculaciones");
    }

    return data.Vinculaciones;
  } catch (error) {
    console.error("Error al obtener vinculaciones:", error);
    throw error;
  }
};

export const asignarVinculacion = async (formData) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  try {
    const response = await axios.post(
      `${API_URL}asignarVinculacion`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Respuesta de asignarVinculacion:", response.data);

    // Acepta tanto 'vinculacion' como 'Vinculacion' y booleano true
    if (
      response.data.vinculacion ||
      response.data.Vinculacion === true ||
      response.data.status === "success"
    ) {
      return response.data;
    }
    if (response.data.status === "error") {
      throw new Error(response.data.message || "Error al asignar vinculación");
    }
    throw new Error("No se pudo asignar la vinculación");
  } catch (error) {
    console.error("Error al asignar vinculación:", error);
    throw error;
  }
};

export const buscarIdEvaluacion = async (identrevista, idpostulacion) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");
  try {
    const response = await axios.get(`${API_URL}buscarIdEvaluacion`, {
      params: { identrevista, idpostulacion },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Respuesta de buscarIdEvaluacion:", response.data);
    // Devuelve el objeto completo
    return response.data;
  } catch (error) {
    console.error("Error al buscar ID de evaluación:", error);
    throw error;
  }
};

export const obtenerContratos = async (num_doc) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");
  try {
    const response = await axios.get(`${API_URL}obtenerContrato`, {
      params: { num_doc },
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    const contentType = response.headers["content-type"];
    if (contentType !== "application/pdf") {
      // Intenta leer el error como texto
      const text = await response.data.text();
      throw new Error(`Error al obtener contratos: ${text}`);
    }
    const file = new Blob([response.data], { type: contentType });
    const url = window.URL.createObjectURL(file);
    return url;
  } catch (error) {
    console.error("Error al obtener contratos:", error);
    throw error;
  }
};

export const subirContratoPDF = async (file, idvinculacion, num_doc) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");
  const formData = new FormData();
  formData.append("pdf_file", file);
  formData.append("idvinculacion", idvinculacion);
  formData.append("num_doc", num_doc);
  try {
    const response = await axios.post(`${API_URL}subirContrato`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir el contrato:", error);
    throw error;
  }
};
