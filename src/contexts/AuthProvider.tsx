import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { appUserQueryOptions } from "@hooks/queryOptions";
import type { AppUserCredentials } from "@customTypes/appUser";
import { loginUser, logoutUser } from "@api/appUser";

type AuthContextType = {
  isLoggedIn: boolean;
  isCheckingToken: boolean;
  login: (creds: AppUserCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkToken: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return authContext;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [initialAppLoad, setInitialAppLoad] = useState(true);

  const login = async (cred: AppUserCredentials) => {
    await loginUser(cred);
    await queryClient.fetchQuery(appUserQueryOptions());
    setIsLoggedIn(true);
  };

  const logout = useCallback(async () => {
    await logoutUser();
    queryClient.invalidateQueries({ queryKey: ["currentAppUser"] });
    queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    setIsLoggedIn(false);
  }, [queryClient]);

  const checkToken = useCallback(async () => {
    setIsCheckingToken(true);
    try {
      // This request both verifies the session and refreshes the cached current user.
      await queryClient.fetchQuery(appUserQueryOptions());
      setIsLoggedIn(true);
    } catch {
      await logout();
    } finally {
      setIsCheckingToken(false);
    }
  }, [queryClient, logout]);

  useEffect(() => {
    if (initialAppLoad) {
      checkToken();
      setInitialAppLoad(false);
    }
  }, [checkToken, initialAppLoad]);

  /*
   * Revalidate the token on an interval and log out if it expires.
   */
  useEffect(() => {
    const id = setInterval(() => {
      checkToken();
    }, 3_600_000);

    return () => clearInterval(id);
  }, [checkToken]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, isCheckingToken, login, logout, checkToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
