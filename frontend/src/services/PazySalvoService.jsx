import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerPazYSalvos = async (rol) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");

  let action;
  switch (rol) {
    case "1":
    case "2":
      action = "obtenerPazYSalvos";
      break;
    case "3":
      action = "obtenerMiPazySalvo";
      break;
    default:
      throw new Error("Rol no reconocido");
  }

  const response = await axios.get(`${API_URL}${action}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data?.Salvos || [];
};

export const generarPazYSalvo = async (form) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");

  const response = await axios.post(
    `${API_URL}generarPazYSalvo`,
    {
      ...form,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
