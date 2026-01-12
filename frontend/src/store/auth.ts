import { create } from "zustand";
import axiosInstance from "../api";

interface User {
  _id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  authUser: User | null;
  isAdmin: boolean;
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
  isAdmin: false,
  isLoading: false,
  error: null,

  login: async (credentials: { email: string; password: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<{ data: { user: User; token: string } }>("/log-in", credentials);
      if (response.data.data) {
        const data = response.data.data;
        localStorage.setItem("authUser", JSON.stringify(data.user));
        localStorage.setItem("token", data.token);
        set({
          isAuthenticated: true,
          authUser: data.user,
          isAdmin: data.user.isAdmin || false,
          isLoading: false,
        });
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
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
      const response = await axiosInstance.post<{ data: { user: User } }>("/register", credentials);
      if (response.data.data) {
        window.location.href = "/login";
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
        "Registration failed. Please try again.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("authUser");
    localStorage.removeItem("token");
    set({
      isAuthenticated: false,
      authUser: null,
      isAdmin: false,
      error: null,
    });
  },

  initializeAuth: () => {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({
          isAuthenticated: true,
          authUser: user,
          isAdmin: user.isAdmin || false,
        });
      } catch (e) {
        localStorage.removeItem("authUser");
        set({ isAuthenticated: false, authUser: null, isAdmin: false });
        console.error("Error in initializeAuth", e);
      }
    }
  },
}));
