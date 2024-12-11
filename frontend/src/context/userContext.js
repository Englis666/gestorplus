import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

const getTokenFromCookie = () => {
    const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
    return match ? match[2] : null;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = getTokenFromCookie();
        if (token) {
            const decodedToken = decodeToken(token);
            setUser(decodedToken?.data); 
        }
    }, []);

    const login = (token) => {
        const decodedToken = decodeToken(token);
        setUser(decodedToken?.data);  
        document.cookie = `auth_token=${token}; path=/;`;  
    };

    const logout = () => {
        setUser(null);
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";  
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

const decodeToken = (token) => {
    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload)); 
        return decoded;
    } catch (e) {
        console.error("Error al decodificar el token:", e);
        return null;
    }
};
