"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authApi, usersApi, type User, type UserRole } from "./api";

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
    avatarUrl?: string;
  }) => Promise<{
    success: boolean;
    message?: string;
  }>;
  updateProfile: (data: {
    name?: string;
    password?: string;
    avatarUrl?: string;
  }) => Promise<{
    success: boolean;
    message?: string;
  }>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("crm_user");
        const token = localStorage.getItem("crm_token");
        
        if (storedUser && token) {
          // Verify token is still valid
          try {
            const response = await authApi.getMe();
            if (response.success) {
              setUser(response.user);
            } else {
              // Token invalid, clear storage
              authApi.logout();
              setUser(null);
            }
          } catch {
            // Token expired or invalid
            authApi.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch users when authenticated (for admin)
  useEffect(() => {
    if (user?.role === "admin") {
      refreshUsers();
    }
  }, [user?.role]);

  const refreshUsers = async () => {
    try {
      const response = await usersApi.getAll();
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password);
      if (response.success && response.user) {
        setUser(response.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => {
    try {
      const response = await authApi.register(data);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return {
        success: false,
        message: "Registration failed",
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      };
    }
  };

  const updateProfile = async (data: {
    name?: string;
    password?: string;
    avatarUrl?: string;
  }) => {
    if (!user) {
      return { success: false, message: "Not authenticated" };
    }

    try {
      const response = await authApi.updateProfile(data);
      if (response.success && response.user) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: "Update failed" };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Update failed",
      };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setUsers([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        updateProfile,
        logout,
        isAuthenticated: !!user,
        isLoading,
        refreshUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
