import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerEstadisticas = async () => {
  const token = getCookie("auth_token");

  if (!token) throw new Error("Token no encontrado");

  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: { action: "obtenerTotalEstadisticas" },
  });

  return response.data;
};
