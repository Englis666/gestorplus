import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const obtenerJornadasDependiendoRol = async (rolObtenido) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const actionMap = {
    1: "obtenerTodasLasJornadas",
    2: "obtenerTodasLasJornadas",
    3: "obtenerJornadas",
  };
  const response = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { action: actionMap[rolObtenido] },
  });
  const data = response.data;
  if (!data) throw new Error("No se encontraron datos");
  return data;
};

export const corroborarJornada = async (idJornada) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const response = await axios.post(
    API_URL,
    {
      action: "corroborarJornada",
      idJornada,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status !== 200) {
    throw new Error("Error al corroborar la jornada");
  }
  return response.data;
};

export const noCorroborarJornada = async (idJornada) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const response = await axios.post(
    API_URL,
    {
      action: "noCorroborarJornada",
      idJornada,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!response || !response.data) {
    throw new Error("No se pudo corroborar la jornada");
  }
  if (response.status !== 200) {
    throw new Error("Error al no corroborar la jornada");
  }
  return response.data;
};

export const finalizarJornada = async (fechaBogota) => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("Token No Encontrado");
  const response = await axios.post(
    API_URL,
    {
      action: "finalizarJornada",
      data: { fechaBogota },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (response.status !== 200) {
    throw new Error("Error al finalizar la jornada");
  }
  return response.data;
};
