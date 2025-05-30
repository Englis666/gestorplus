import { jwtDecode } from "jwt-decode";

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

export const decodedTokenWithRol = () => {
  const token = getCookie("auth_token");
  if (!token) return null;
  try {
    const decodedToken = jwtDecode(token);
    return decodedToken?.data?.rol || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
