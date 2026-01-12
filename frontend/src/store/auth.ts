import { create } from "zustand";
import axiosInstance from "../api";

interface User {
  _id: string;
  email: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  authUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  authUser: null,
  isLoading: false,
  error: null,

  login: async (credentials: { email: string; password: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<any>("/log-in", credentials);
      if (response.data.data) {
        const data = response.data.data;
        localStorage.setItem("authUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        set({ isAuthenticated: true, authUser: data.user, isLoading: false });
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  register: async (credentials: {
    name: string;
    email: string;
    password: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<any>("/register", credentials);
      if (response.data.data) {
        const user = response.data.data.user;
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("token", response.data.data.token || "");
        set({ isAuthenticated: true, authUser: user, isLoading: false });
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    set({ isAuthenticated: false, authUser: null, error: null });
  },

  initializeAuth: () => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ isAuthenticated: true, authUser: user });
      } catch (e) {
        localStorage.removeItem("authUser");
        set({ isAuthenticated: false, authUser: null });
        console.error("Error in initializeAuth", e);
      }
    }
  },
}));
