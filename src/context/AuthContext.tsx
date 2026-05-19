"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

interface AuthUser {
  uid: string;
  email: string | null;
  name?: string;
  role: "user" | "admin" | "service_provider";
  isProfileComplete?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginAsGuest?: (role?: "user" | "service_provider", email?: string, name?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: AuthUser = {
  uid: "mock-uid-123",
  email: "guest@fixly.com",
  name: "Guest User",
  role: "user",
  isProfileComplete: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to load user profile
  const loadUser = useCallback(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("fixly_mock_user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch {
          setUser(DEFAULT_USER);
        }
      } else {
        // Set default logged in user by default
        setUser(DEFAULT_USER);
        localStorage.setItem("fixly_mock_user", JSON.stringify(DEFAULT_USER));
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const refreshUser = useCallback(async () => {
    loadUser();
  }, [loadUser]);

  const logout = async () => {
    setUser(null);
    localStorage.removeItem("fixly_mock_user");
    // Clear cookie too so that everything stays clean
    document.cookie = "__session=; path=/; max-age=0; SameSite=Strict";
  };

  const loginAsGuest = (
    role: "user" | "service_provider" = "user",
    email = "guest@fixly.com",
    name = "Guest User"
  ) => {
    const newUser: AuthUser = {
      uid: "mock-uid-123",
      email,
      name,
      role,
      isProfileComplete: true,
    };
    setUser(newUser);
    localStorage.setItem("fixly_mock_user", JSON.stringify(newUser));
    document.cookie = `__session=mock-session-token; path=/; max-age=3600; SameSite=Strict`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser, loginAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

