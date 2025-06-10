import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerRoles = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  try {
    const response = await axios.get(`${API_URL}obtenerRoles`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("[RolService] Respuesta de obtenerRoles:", response.data);
    if (response.data && Array.isArray(response.data.roles)) {
      return response.data.roles;
    } else if (response.data && Array.isArray(response.data.Roles)) {
      return response.data.Roles;
    } else {
      return [];
    }
  } catch (error) {
    console.error("[RolService] Error al obtener roles:", error);
    throw new Error("No se pudieron obtener los roles");
  }
};
