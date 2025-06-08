import axios from "axios";
import API_URL from "../config";
import { getCookie } from "./Auth";

export const datosPerfil = async () => {
  const token = getCookie("auth_token");
  if (!token) throw new Error("No token found");
  const response = await axios.get(`${API_URL}datosPerfil`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
