import React, { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  LayoutDashboard,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

const Navbar: React.FC = () => {
  const { items, removeFromCart, updateQuantity } = useCartStore();
  const { isAuthenticated, authUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const cartTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowProfileMenu(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900">
              ShopZone
            </span>
          </Link>

          <div className="flex items-center gap-2 sm:space-x-3">
            {authUser?.isAdmin && (
              <Link to="/dashboard" className="hidden sm:block">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-1.5 sm:mr-2" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative h-9 w-9 sm:h-10 sm:w-10"
                >
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 bg-primary text-white text-[10px] sm:text-xs font-bold rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center">
                      {cartItemCount > 99 ? "99+" : cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col w-full sm:max-w-lg">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-lg">
                    <ShoppingCart className="w-5 h-5" />
                    Cart ({cartItemCount} items)
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-auto py-4">
                  {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-500">
                      <ShoppingCart className="w-16 h-16 sm:w-20 sm:h-20 mb-4 text-slate-200" />
                      <p className="text-base sm:text-lg font-medium">
                        Your cart is empty
                      </p>
                      <p className="text-sm text-slate-400">
                        Add items to get started
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-slate-200 shrink-0">
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
                            <p className="font-semibold text-slate-900 text-sm sm:text-base truncate">
                              {item.name}
                            </p>
                            <p className="text-xs sm:text-sm text-slate-500">
                              ${item.price.toFixed(2)}
                            </p>
                            <p className="font-bold text-primary text-sm">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1)
                                )
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 sm:w-8 text-center text-xs sm:text-sm font-semibold text-slate-700">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 sm:h-8 sm:w-8"
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
                            className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-lg font-semibold text-slate-700">
                        Subtotal
                      </span>
                      <span className="text-xl sm:text-2xl font-bold text-slate-900">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <Button className="w-full h-10 sm:h-12 text-sm sm:text-lg font-semibold">
                      Proceed to Checkout
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center justify-center h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                >
                  {getInitials(authUser?.name)}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="font-semibold text-slate-900">
                        {authUser?.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {authUser?.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>

                    <Link
                      to="/orders"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      My Orders
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs sm:text-sm h-9 sm:h-10 px-2 sm:px-3"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="text-xs sm:text-sm h-9 sm:h-10">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
