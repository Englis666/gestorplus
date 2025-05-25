import { Navigate, Outlet } from "react-router-dom";
import { getCookie } from "../hook/useAuthCheck";

const PrivateRoute = () => {
  const token = getCookie("auth_token");
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
