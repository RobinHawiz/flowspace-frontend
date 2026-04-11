import { useAuth } from "@contexts/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";

function App() {
  const { isLoggedIn, isCheckingToken } = useAuth();
  if (isCheckingToken) {
    return null;
  }
  return isLoggedIn ? (
    <Navigate to="/workspaces" />
  ) : (
    <main className="bg-gradient min-h-svh">
      <Outlet />
    </main>
  );
}

export default App;
