// AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUserRole(decoded?.data?.rol);
          setIsAuthenticated(true);
        } catch (e) {
          setIsAuthenticated(false);
          setUserRole(null);
          await AsyncStorage.removeItem("auth_token");
        }
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        userRole,
        setUserRole,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
