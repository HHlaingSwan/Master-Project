import { create } from "zustand";
import axiosInstance from "../api";

interface User {
  _id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  lastPasswordChange?: string;
  lastProfileUpdate?: string;
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
  updateNameAndEmail: (credentials: {
    name?: string;
    email?: string;
  }) => Promise<void>;
  changePassword: (credentials: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  authUser: null,
  isAdmin: false,
  isLoading: false,
  error: null,

  // Login a user
  login: async (credentials: { email: string; password: string }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<{
        data: { user: User; token: string };
      }>("/log-in", credentials);
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
  // Register a new user
  register: async (credentials: {
    name: string;
    email: string;
    password: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<any>("/register", credentials);
      if (response.data.success) {
        window.location.href = "/login";
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  // Logout a user
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
  // Initialize the auth state
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
  // Update user name and email
  updateNameAndEmail: async (credentials: {
    name?: string;
    email?: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<{ data: { user: User } }>(
        "/update",
        credentials
      );
      if (response.data.data) {
        // Update local storage with the new user data
        localStorage.setItem(
          "authUser",
          JSON.stringify(response.data.data.user)
        );
        // Update the auth state with the new user data
        set({
          authUser: response.data.data.user,
          isLoading: false,
          isAdmin: response.data.data.user.isAdmin || false,
        });
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message || "Update failed. Please try again.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
  // Change password
  changePassword: async (credentials: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<{ data: { user: User } }>(
        "/change-password",
        credentials
      );
      if (response.data.data) {
        // Update local storage with the new user data
        localStorage.setItem(
          "authUser",
          JSON.stringify(response.data.data.user)
        );
        // Update the auth state with the new user data
        set({
          authUser: response.data.data.user,
          isLoading: false,
          isAdmin: response.data.data.user.isAdmin || false,
        });
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      const message =
        err.response?.data?.message ||
        "Password change failed. Please try again.";
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
