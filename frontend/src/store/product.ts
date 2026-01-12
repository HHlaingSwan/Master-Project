import { create } from "zustand";
import axiosInstance from "@/api";

export type Category =
  | "All"
  | "Watch"
  | "Mac"
  | "Phone"
  | "Earphone"
  | "iPad"
  | "Accessories";

export interface ProductVariant {
  color: string;
  colorCode: string;
  size?: string;
  images: string[];
}

export interface Product {
  id: string;
  productId?: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  originalPrice?: number;
  badge?: string;
  category: Category;
  stock?: number;
  features?: string[];
  variants?: ProductVariant[];
  sizes?: string[];
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearSelectedProduct: () => void;
}

const transformProduct = (product: any): Product => ({
  ...product,
  id: product.productId ? String(product.productId) : product._id || product.id,
});

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/products");
      const products = response.data.data.map(transformProduct);
      set({ products, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const product = transformProduct(response.data.data);
      set({ selectedProduct: product, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
