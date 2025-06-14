import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "material-design-icons/iconfont/material-icons.css";
import "animate.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { UserProvider } from "./context/userContext";
import RoleRoute from "./context/RoleRoute";
import publicRoutes from "./routes/PublicRoutes";
import empleadoRoutes from "./routes/EmpleadoRoutes";
import aspiranteRoutes from "./routes/AspiranteRoutes";

import "./App.css";

// Hooks
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const AuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = getCookie("auth_token");
    const publicPaths = [
      "/",
      "/Login",
      "/Registro",
      "/RecuperarPassword",
      "/RestablecerPassword",
    ];
    if (!token || isTokenExpired(token)) {
      if (!publicPaths.includes(location.pathname)) {
        navigate("/Login", { replace: true });
      }
    }
  }, [navigate, location]);

  return null;
};

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AuthCheck />
        <div className="App">
          <ToastContainer position="top-right" autoClose={3000} />
          <Routes>
            {publicRoutes}
            <Route element={<RoleRoute allowedRoles={[1, 2, 3]} />}>
              {empleadoRoutes}
            </Route>
            <Route element={<RoleRoute allowedRoles={[4]} />}>
              {aspiranteRoutes}
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
