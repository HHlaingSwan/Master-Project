import React from "react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { Search, ShoppingCart, Trash2, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const cartTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">ShopZone</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-10 h-10 bg-slate-100 border-0 rounded-full focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Your Cart ({cartItemCount} items)
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-auto py-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <ShoppingCart className="w-20 h-20 mb-4 text-slate-200" />
                      <p className="text-lg font-medium">Your cart is empty</p>
                      <p className="text-sm text-slate-400">
                        Add items to get started
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                            <img
                              src={
                                item.image ||
                                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
                              }
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              ${item.price.toFixed(2)} each
                            </p>
                            <p className="font-bold text-primary mt-1">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-semibold text-slate-700">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t   border-slate-200 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-slate-700">
                        Subtotal
                      </span>
                      <span className="text-2xl font-bold text-slate-900">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <Button
                      className="w-full h-12 text-lg font-semibold"
                      size="lg"
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            <Link to="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden px-4 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 h-10 bg-slate-100 border-0 rounded-full"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
