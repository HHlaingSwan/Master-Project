import { create } from "zustand";
import { toast } from "@/lib/toast";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
  image?: string;
  color?: string;
  size?: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number; maxQuantity?: number }) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addToCart: (item) =>
    set((state) => {
      const existingItem = state.items.find(
        (i) => i.id === item.id && i.color === item.color && i.size === item.size
      );
      const newQuantity = item.quantity || 1;
      const maxQuantity = item.maxQuantity || 999;

      if (existingItem) {
        const totalQuantity = existingItem.quantity + newQuantity;
        if (totalQuantity > maxQuantity) {
          toast.error(`Only ${maxQuantity} items available`);
          return state;
        }
        return {
          items: state.items.map((i) =>
            i.id === item.id && i.color === item.color && i.size === item.size
              ? { ...i, quantity: totalQuantity }
              : i
          ),
        };
      }
      if (newQuantity > maxQuantity) {
        toast.error(`Only ${maxQuantity} items available`);
        return state;
      }
      return {
        items: [...state.items, { ...item, quantity: newQuantity }],
      };
    }),
  removeFromCart: (itemId) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    })),
  updateQuantity: (itemId, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(0, quantity) } : i
      ),
    })),
  clearCart: () => set({ items: [] }),
}));
