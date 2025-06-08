import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerHorasExtra = async (obtenerRol) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const action = {
    1: "obtenerTodasLasHorasExtra",
    2: "obtenerTodasLasHorasExtra",
    3: "obtenerMisHorasExtra",
  };
  if (!action[obtenerRol]) throw new Error("Rol inválido");
  try {
    const response = await axios.get(`${API_URL}${action[obtenerRol]}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    if (!data) throw new Error("No se encontraron datos");
    console.log("Datos de horas extra:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener horas extra:", error);
    throw error;
  }
};

export const calcularHorasExtra = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.get(`${API_URL}calcularHorasExtra`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    console.log("Datos de horas extra:", data);
    if (!data) throw new Error("No se encontraron datos");
    return data;
  } catch (error) {
    console.error("Error al calcular horas extra:", error);
    throw error;
  }
};
export const calcularMinutosTrabajados = async (obtenerRol) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  const action = {
    1: "obtenerMinutosTrabajadosDelEmpleado",
    2: "obtenerMinutosTrabajadosDelEmpleado",
    3: "obtenerMinutosTrabajados",
  }[obtenerRol];

  if (!action) throw new Error("Rol inválido");

  try {
    const response = await axios.get(`${API_URL}${action}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    if (!data) throw new Error("No se encontraron datos");
    console.log("Datos de minutos trabajados:", data);
    return data;
  } catch (error) {
    console.error("Error al calcular minutos trabajados:", error);
    throw error;
  }
};
