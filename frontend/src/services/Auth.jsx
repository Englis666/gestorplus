import axios from "axios";
import API_URL from "../config";
import { getCookie } from "../utils/Auth";

export const logearse = async (num_doc, password) => {
  try {
    const response = await axios.post(`${API_URL}login`, {
      num_doc,
      password,
    });
    const res = response.data;
    if (res?.status === "success") {
      const token = res?.data?.token;
      document.cookie = `auth_token=${token}; path=/; domain=localhost;`;
      return { status: "success", token };
    } else {
      return { status: "error", message: res?.message || "Error desconocido" };
    }
  } catch (error) {
    console.error("Error en la petición de login:", error);
    return { status: "error", message: "Error en la petición de login" };
  }
};

export const obtenerRol = () => {
  const token = getCookie("auth_token");
  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded?.data?.rol || null;
  }
  return null;
};

export const registrarse = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}registrarse`, formData);
    const res = response.data;
    if (res?.status === "success") {
      return { status: "success", message: res?.message || "Registro exitoso" };
    } else {
      return {
        status: "error",
        message: res?.message || "Error en el registro",
      };
    }
  } catch (error) {
    console.error("Error en la petición de registro:", error);
    return { status: "error", message: "Error en la petición de registro" };
  }
};

export const restablecerPassword = async (token, password) => {
  try {
    const data = { token, password };
    const response = await axios.post(`${API_URL}restablecerPassword`, data);
    return response.data;
  } catch (error) {
    console.error("Error en restablecerPassword:", error);
    throw new Error("No se pudo restablecer la contraseña");
  }
};
