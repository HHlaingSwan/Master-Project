import { create } from "zustand";
import axiosInstance from "@/api";
import { toast } from "@/lib/toast";

export interface OrderItem {
  id: number;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
  image?: string;
  color?: string;
  size?: string;
}

export interface Order {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  statusCounts: {
    all: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };

  createOrder: (items: OrderItem[], totalAmount: number, shippingAddress: any) => Promise<void>;
  fetchUserOrders: () => Promise<void>;
  fetchAllOrders: (page?: number, status?: string) => Promise<{
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  } | undefined>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  clearCurrentOrder: () => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  statusCounts: {
    all: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  },

  createOrder: async (items, totalAmount, shippingAddress) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/orders", {
        items,
        totalAmount,
        shippingAddress,
      });
      set({ currentOrder: response.data.data, isLoading: false });
      toast.success("Order placed successfully!");
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create order";
      set({ error: message, isLoading: false });
      toast.error(message);
      throw error;
    }
  },

  fetchUserOrders: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/orders");
      set({ orders: response.data.data, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch orders";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchAllOrders: async (page = 1, status = "all") => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/orders/all", {
        params: { page, limit: 10, status },
      });
      set({
        orders: response.data.data,
        statusCounts: response.data.statusCounts,
        isLoading: false,
      });
      return response.data.pagination;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch orders";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      set({ currentOrder: response.data.data, isLoading: false });
      return response.data.data;
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to fetch order";
      set({ error: message, isLoading: false });
      toast.error(message);
      return null;
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/orders/${orderId}/status`, { status });
      toast.success("Order status updated");
      get().fetchAllOrders();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to update order";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  cancelOrder: async (orderId) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.put(`/orders/${orderId}/cancel`);
      toast.success("Order cancelled");
      get().fetchUserOrders();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to cancel order";
      set({ error: message, isLoading: false });
      toast.error(message);
    }
  },

  clearCurrentOrder: () => set({ currentOrder: null }),
}));
