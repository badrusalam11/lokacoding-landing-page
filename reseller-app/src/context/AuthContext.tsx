import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, type AuthUser } from "../api/client";

const STORAGE_KEY = "lokacoding_reseller_token";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEY),
  );
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .me(token)
      .then(setUser)
      .catch(() => {
        setToken(null);
        localStorage.removeItem(STORAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, [token]);

  function persistToken(t: string) {
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
  }

  async function login(email: string, password: string) {
    const res = await api.login({ email, password });
    setUser(res.user);
    persistToken(res.token);
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
  }) {
    const res = await api.register(data);
    setUser(res.user);
    persistToken(res.token);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
