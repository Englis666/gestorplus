import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerEmpleados = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token no encontrado");

  const response = await axios.get(`${API_URL}obtenerEmpleados`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data?.empleados || [];
};
