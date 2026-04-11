import { useAuth } from "@contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function PrivateRoutes() {
  const { isLoggedIn, isCheckingToken } = useAuth();
  if (isCheckingToken) {
    return null;
  }
  return isLoggedIn ? (
    <main className="bg-gradient min-h-svh">
      <Outlet />
    </main>
  ) : (
    <Navigate to="/log-in" />
  );
}

export default PrivateRoutes;
