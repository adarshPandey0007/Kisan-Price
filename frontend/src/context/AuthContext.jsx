import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("kp_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        localStorage.removeItem("kp_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function persistSession(nextToken, nextUser) {
    localStorage.setItem("kp_token", nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }

  async function login(email, password) {
    const { token, user } = await api.login({ email, password });
    persistSession(token, user);
    return user;
  }

  async function register(payload) {
    const { token, user } = await api.register(payload);
    persistSession(token, user);
    return user;
  }

  function logout() {
    localStorage.removeItem("kp_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
