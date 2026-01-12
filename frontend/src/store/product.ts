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
  productId: string;
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

interface ApiProduct {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  originalPrice?: number;
  badge?: string;
  category: string;
  stock?: number;
  features?: string[];
  variants?: ProductVariant[];
  sizes?: string[];
}

const transformProduct = (product: ApiProduct): Product => ({
  ...product,
  id: product.productId,
  category: product.category as Category,
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
    } catch {
      set({ error: "Failed to fetch products", isLoading: false });
    }
  },

  fetchProductById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/products/${id}`);
      const product = transformProduct(response.data.data);
      set({ selectedProduct: product, isLoading: false });
    } catch {
      set({ error: "Failed to fetch product", isLoading: false });
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
