import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@contexts/AuthProvider";

function useRedirectIfAuthenticated() {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/workspaces");
    }
  }, [token, navigate]);
}

export default useRedirectIfAuthenticated;
