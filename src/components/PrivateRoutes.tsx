import { useAuth } from "@contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const { token } = useAuth();
  return token ? <Outlet /> : <Navigate to="/log-in" />;
}

export default PrivateRoutes;
