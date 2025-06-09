/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

// App.js o donde tengas tu root
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/hook/AuthContext";
import AdminNavigator from "./src/navigation/AdminNavigator";
import Toast from "./src/components/Toast";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AdminNavigator />
        <Toast />
      </AuthProvider>
    </NavigationContainer>
  );
}
