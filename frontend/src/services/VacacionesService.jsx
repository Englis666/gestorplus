import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerVacacionesDependiendoRol = async (rolObtenido) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  const actionMap = {
    1: "obtenerTodasLasVacaciones",
    2: "obtenerTodasLasVacaciones",
    3: "obtenerVacaciones",
  };

  const response = await axios.get(`${API_URL}${actionMap[rolObtenido]}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = response.data;
  if (!data) throw new Error("No se encontraron datos");

  return data;
};
export const aceptarVacacion = async (idvacacion) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");

  const response = await axios.post(`${API_URL}aceptarVacacion`, {
    idvacacion,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status !== 200) {
    throw new Error("Error al aceptar la vacación");
  }

  return response.data;
};
export const rechazarVacacion = async (idvacacion) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");

  const response = await axios.post(
    `${API_URL}rechazarVacacion`,
    { idvacacion },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (response.status !== 200) {
    throw new Error("Error al rechazar la vacación");
  }

  return response.data;
};
export const solicitarVacacion = async (vacacionData) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no proporcionado");

  const response = await axios.post(
    `${API_URL}solicitarVacaciones`,
    { ...vacacionData },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (response.status !== 200) {
    throw new Error("Error al solicitar la vacación");
  }

  return response.data;
};
