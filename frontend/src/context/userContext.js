import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Asegúrate de tener instalada esta librería

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  console.log(`Cookie set: ${name}=${value}`);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getCookie("auth_token");
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        setUser(decodedUser);
        console.log("User decoded from token:", decodedUser);
      } catch (error) {
        console.log("Error decoding token:", error);
        console.error("Error decoding token:", error);
      }
    } else {
      console.log("No token found in cookies.");
    }
  }, []);

  const login = (userData) => {
    const token = userData.token;
    setUser(userData);
    setCookie("auth_token", token, 7);
    console.log("User logged in:", userData);
  };

  return (
    <UserContext.Provider value={{ user, login }}>
      {children}
    </UserContext.Provider>
  );
};
