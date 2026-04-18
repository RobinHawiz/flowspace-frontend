import { useAuth } from "@contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const { isLoggedIn, isCheckingToken } = useAuth();
  if (isCheckingToken) {
    return null;
  }
  return isLoggedIn ? (
    <main>
      <Outlet />
    </main>
  ) : (
    <Navigate to="/" />
  );
}

export default PrivateRoutes;
