"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { type User, type UserRole, mockUsers } from "./mock-data";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => {
    success: boolean;
    message?: string;
  };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem("crm_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedUsers = localStorage.getItem("crm_users");
    if (storedUsers) {
      const parsedUsers: User[] = JSON.parse(storedUsers).map((u: User) => ({
        ...u,
        createdAt: new Date(u.createdAt),
      }));
      setUsers(parsedUsers);
    }
  }, []);

  const persistUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem("crm_users", JSON.stringify(updatedUsers));
  };

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      const userWithoutPassword = { ...foundUser };
      setUser(userWithoutPassword);
      localStorage.setItem("crm_user", JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (data: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) => {
    const role = data.role ?? "sales_rep";
    const existing = users.find(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (existing) {
      return {
        success: false,
        message: "An account with this email already exists",
      };
    }

    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      role,
      password: data.password,
      createdAt: new Date(),
    };

    const updatedUsers = [...users, newUser];
    persistUsers(updatedUsers);
    const sessionUser = { ...newUser };
    setUser(sessionUser);
    localStorage.setItem("crm_user", JSON.stringify(sessionUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("crm_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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
