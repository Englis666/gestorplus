import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerNotificacionesDependiendoRol = async (rolObtenido) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no Encontrado");

  const actionMap = {
    1: "obtenerTodasLasNotificaciones",
    2: "obtenerTodasLasNotificaciones",
    3: "obtenerNotificaciones",
  };
  const response = await axios.get(`${API_URL}${actionMap[rolObtenido]}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = response.data;
  const lista = data?.Notificaciones || data?.message || [];
  return Array.isArray(lista) ? lista : [];
};
