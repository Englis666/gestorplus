/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

// App.js o donde tengas tu root
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/hook/AuthContext";
import AdminNavigator from "./src/navigation/AdminNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AdminNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
