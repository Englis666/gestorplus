import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerPermisosDependiendoRol = async (rolObtenido) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");

  const actionMap = {
    1: "obtenerTodosLosPermisos",
    2: "obtenerTodosLosPermisos",
    3: "obtenerPermisos",
  };

  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { action: actionMap[rolObtenido] },
  });

  const data = response.data;

  if (!data) throw new Error("No se encontraron datos");
  if (Array.isArray(data.permisos)) return data.permisos;
  if (Array.isArray(data)) return data;
  return [];
};

export const permisoAceptado = async (idPermisos) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const response = await axios.post(
    API_URL,
    {
      action: "permisoAceptado",
      idPermisos,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status !== 200) {
    throw new Error("Error al aceptar el permiso");
  }
  return response.data;
};

export const permisoRechazado = async (idPermisos) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const response = await axios.post(
    API_URL,
    {
      action: "permisoRechazado",
      idPermisos,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status !== 200) {
    console.log("Error al rechazar el permiso:", response);
    throw new Error("Error al rechazar el permiso");
  }
  return response.data;
};
export const solicitarPermiso = async (datosPermiso) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const response = await axios.post(
    API_URL,
    {
      action: "solicitarPermiso",
      ...datosPermiso,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status !== 200) {
    throw new Error("Error al solicitar el permiso");
  }
  return response.data;
};
