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

export const desactivarRol = async (idRol) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.delete(`${API_URL}desactivarRol`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { idRol },
    });
    console.log("[RolService] Respuesta de desactivarRol:", response.data);

    if (response.data && response.data.status === "success") {
      return { status: "success", message: "Rol desactivado correctamente" };
    } else {
      return {
        status: "error",
        message: response.data?.message || "Error al desactivar el rol",
      };
    }
  } catch (error) {
    console.error("[RolService] Error al desactivar rol:", error);
    return { status: "error", message: "No se pudo desactivar el rol" };
  }
};

export const activarRol = async (idRol) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  try {
    const response = await axios.post(
      `${API_URL}activarRol`,
      { idRol },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("[RolService] Respuesta de activarRol:", response.data);

    if (response.data && response.data.status === "success") {
      return { status: "success", message: "Rol activado correctamente" };
    } else {
      return {
        status: "error",
        message: response.data?.message || "Error al activar el rol",
      };
    }
  } catch (error) {
    console.error("[RolService] Error al activar rol:", error);
    return { status: "error", message: "No se pudo activar el rol" };
  }
};
