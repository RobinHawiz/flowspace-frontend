import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthProvider";

function useRedirectIfAuthenticated() {
  const { isLoggedIn, isCheckingToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && !isCheckingToken) {
      navigate("/workspaces");
    }
  }, [isLoggedIn, isCheckingToken, navigate]);
}

export default useRedirectIfAuthenticated;
