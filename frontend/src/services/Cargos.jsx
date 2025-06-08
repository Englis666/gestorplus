import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerCargos = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.get(`${API_URL}obtenerCargos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    if (!data) throw new Error("No se encontraron datos");
    return data.cargos || [];
  } catch (error) {
    console.error("Error al obtener cargos:", error);
    throw error;
  }
};

export const desactivarCargo = async (idCargo) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.patch(
      `${API_URL}desactivarCargo`,
      { idCargo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await obtenerCargos();
    return response.data;
  } catch (error) {
    console.error("Error al desactivar cargo:", error);
    throw error;
  }
};

export const activarCargo = async (idCargo) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.patch(
      `${API_URL}activarCargo`,
      { idCargo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await obtenerCargos();
    return response.data;
  } catch (error) {
    console.error("Error al activar cargo:", error);
    throw error;
  }
};

export const desactivarCargos = async (idCargo) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.patch(
      `${API_URL}desactivarCargo`,
      { idCargo },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await obtenerCargos();
    return response.data;
  } catch (error) {
    console.error("Error al desactivar cargo:", error);
    throw error;
  }
};
export const agregarCargo = async (nuevoCargo) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.post(`${API_URL}agregarCargo`, nuevoCargo, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error al agregar cargo:", error);
    throw error;
  }
};
