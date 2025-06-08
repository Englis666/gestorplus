import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerConvocatorias = async () => {
  try {
    const response = await axios.get(`${API_URL}obtenerConvocatorias`, {});
    return response.data.convocatorias || [];
  } catch (err) {
    console.error("Error en la petición de convocatorias:", err);
    throw err;
  }
};

export const detallesConvocatoria = (navigate, convocatoria) => {
  const token = getCookie("auth_token");
  if (token) {
    navigate("/aspirante/DetallesDeTrabajo", {
      state: { idconvocatoria: convocatoria.idconvocatoria },
    });
  } else {
    navigate("/Login");
  }
};

export const obtenerDetalleConvocatoria = async (idconvocatoria) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");

  try {
    const response = await axios.get(`${API_URL}obtenerDetalleConvocatoria`, {
      params: { idconvocatoria },
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    console.log(data);
    if (data?.convocatoria) {
      return data.convocatoria;
    } else if (data?.Convocatoria) {
      return data.Convocatoria;
    } else if (data?.data) {
      return data.data;
    } else if (Array.isArray(data) && data.length > 0) {
      return data[0];
    } else {
      throw new Error("No se encontró la convocatoria");
    }
  } catch (error) {
    console.error("Error al obtener el detalle de la convocatoria:", error);
    throw error;
  }
};
export const verificarPostulacion = async (idconvocatoria) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");

  try {
    const response = await axios.get(`${API_URL}verificarPostulacion`, {
      params: { idconvocatoria },
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error al verificar la postulación:", error);
    throw error;
  }
};

export const aplicarAConvocatoria = async (idconvocatoria) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");

  try {
    const response = await axios.post(
      `${API_URL}aplicacionDeAspirante`,
      {
        idconvocatoria,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al aplicar a la convocatoria:", error);
    throw error;
  }
};

export const agregarConvocatoria = async (formData) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No encontrado");

  try {
    const response = await axios.post(
      `${API_URL}agregarConvocatoria`,
      formData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error al agregar la convocatoria:", error);
    throw error;
  }
};
