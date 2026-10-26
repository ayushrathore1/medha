"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  university: string;
  branch: string;
  year: string;
  avatar: string;
  avatarIndex: number;
  isAdmin: boolean;
  role: "user" | "team" | "admin";
  emailVerified: boolean;
  karma: number;
  rank: string;
  charchaUsername?: string;
  streak: number;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  college?: string;
  university?: string;
  branch?: string;
  year?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("medha_token");
    const savedUser = localStorage.getItem("medha_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("medha_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("medha_token", data.token);
    localStorage.setItem("medha_user", JSON.stringify(data.user));
  }, []);

  const register = useCallback(async (formData: RegisterData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("medha_token", data.token);
    localStorage.setItem("medha_user", JSON.stringify(data.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("medha_token");
    localStorage.removeItem("medha_user");
  }, []);

  const updateUser = useCallback(
    (updates: Partial<User>) => {
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, ...updates };
        localStorage.setItem("medha_user", JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
