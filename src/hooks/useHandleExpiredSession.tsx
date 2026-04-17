import { useAuth } from "@contexts/AuthProvider";
import { toast } from "react-toastify";

function useHandleExpiredSession() {
  const { logout } = useAuth();

  const redirectIfSessionExpired = async () => {
    toast.info("Your session has expired. Please log in again.");
    await logout();
  };
  return redirectIfSessionExpired;
}

export default useHandleExpiredSession;
