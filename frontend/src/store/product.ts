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

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  isPaginationLoading: boolean;
  error: string | null;
  pagination: Pagination;
  currentPage: number;
  fetchProducts: (
    page?: number,
    category?: Category,
    search?: string
  ) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearSelectedProduct: () => void;
  setPage: (page: number) => void;
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

interface ApiResponse {
  data: ApiProduct[];
  pagination: Pagination;
}

const transformProduct = (product: ApiProduct): Product => ({
  ...product,
  id: product.productId,
  category: product.category as Category,
});

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  isPaginationLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  currentPage: 1,

  fetchProducts: async (page = 1, category: Category = "All", search = "") => {
    const isPageChange = page !== get().currentPage;
    set({ 
      isLoading: !isPageChange, 
      isPaginationLoading: isPageChange, 
      error: null, 
      currentPage: page 
    });
    try {
      const response = await axiosInstance.get<ApiResponse>("/products", {
        params: {
          page,
          limit: get().pagination.limit,
          category: category === "All" ? undefined : category,
          search: search || undefined,
        },
      });
      const products = response.data.data.map(transformProduct);
      set({
        products,
        pagination: response.data.pagination,
        isLoading: false,
        isPaginationLoading: false,
      });
    } catch {
      set({ error: "Failed to fetch products", isLoading: false, isPaginationLoading: false });
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

  setPage: (page: number) => {
    get().fetchProducts(page);
  },
}));
