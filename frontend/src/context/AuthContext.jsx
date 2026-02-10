import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [sessionAccepted, setSessionAccepted] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = localStorage.getItem("eurecaToken");
      if (!token) {
        setLoadingAuth(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/profile");

        setUser((prev) => prev || data);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("eurecaToken");
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    }

    bootstrap();
  }, []);

  function setSession(loginResponse) {
    localStorage.setItem("eurecaToken", loginResponse.eurecaToken);
    setUser(loginResponse.user);
  }

  function logout() {
    localStorage.removeItem("eurecaToken");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, sessionAccepted, setSessionAccepted,setUser, setSession, logout, loadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
