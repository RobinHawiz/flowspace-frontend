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
import { loginUser } from "@api/appUser";

type AuthContextType = {
  token: string | null;
  login: (creds: AppUserCredentials) => Promise<void>;
  logout: () => void;
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
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const login = async (cred: AppUserCredentials) => {
    const token = await loginUser(cred);
    localStorage.setItem("token", token);
    setToken(token);
    await queryClient.fetchQuery(appUserQueryOptions());
  };

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    queryClient.invalidateQueries({ queryKey: ["currentAppUser"] });
  }, [queryClient]);

  const checkToken = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      await queryClient.fetchQuery(appUserQueryOptions());
    } catch {
      logout();
    }
  }, [token, queryClient, logout]);

  useEffect(() => {
    if (token) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      checkToken();
    }
  }, [token, checkToken]);

  /*
   * Revalidate the token on an interval and log out if it expires.
   */
  useEffect(() => {
    if (!token) {
      return;
    }

    const id = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["currentAppUser"] });
      checkToken();
    }, 3_600_000);

    return () => clearInterval(id);
  }, [token, queryClient, checkToken]);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
