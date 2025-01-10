import React, { createContext, useContext, useState, useEffect } from "react";
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

const deleteCookie = (name) => {
    setCookie(name, "", -1);
    console.log(`Cookie deleted: ${name}`);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getCookie('auth_token'); // Obtener el token de la cookie
        if (token) {
            try {
                const decodedUser = jwtDecode(token); // Decodificar el token
                setUser(decodedUser); // Establecer el estado con el usuario decodificado
                console.log("User decoded from token:", decodedUser);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        } else {
            console.log("No token found in cookies.");
        }
    }, []);

    const login = (userData) => {
        const token = userData.token; // Asegúrate de tener el token aquí al hacer login
        setUser(userData);
        setCookie('auth_token', token, 7); // Guardar el token en cookies
        console.log("User logged in:", userData);
    };

    const logout = () => {
        setUser(null);
        deleteCookie('auth_token'); 
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
