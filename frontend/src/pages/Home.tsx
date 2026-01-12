import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useProductStore } from "@/store/product";
import { ShoppingCart, Star, Heart, X, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/lib/toast";

export type Category =
  | "All"
  | "Watch"
  | "Mac"
  | "Phone"
  | "Earphone"
  | "iPad"
  | "Accessories";

const CATEGORIES: Category[] = [
  "All",
  "Watch",
  "Mac",
  "Phone",
  "Earphone",
  "iPad",
  "Accessories",
];

const MOCK_PRODUCTS: Omit<import("@/store/product").Product, "id">[] = [
  {
    name: "Wireless Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life.",
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.5,
    badge: "Sale",
    category: "Earphone",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
  },
  {
    name: "Smart Watch Pro",
    description:
      "Feature-rich smartwatch with health tracking and GPS functionality.",
    price: 299.99,
    rating: 4.8,
    badge: "New",
    category: "Watch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
  },
  {
    name: 'MacBook Pro 14"',
    description: "Powerful laptop with M3 chip for professional workflows.",
    price: 1999.99,
    originalPrice: 2299.99,
    rating: 4.9,
    badge: "Sale",
    category: "Mac",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&h=500&fit=crop",
  },
  {
    name: "iPhone 15 Pro",
    description:
      "The most advanced iPhone with titanium design and A17 Pro chip.",
    price: 999.99,
    rating: 4.8,
    category: "Phone",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
  },
  {
    name: "AirPods Pro 2",
    description: "Active noise cancellation earbuds with spatial audio.",
    price: 249.99,
    rating: 4.7,
    badge: "Popular",
    category: "Earphone",
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
  },
  {
    name: 'iPad Pro 12.9"',
    description: "Ultimate iPad experience with M2 chip and ProMotion display.",
    price: 1099.99,
    originalPrice: 1199.99,
    rating: 4.6,
    badge: "Sale",
    category: "iPad",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
  },
  {
    name: 'iMac 24"',
    description: "Stunning 4.5K Retina display with M3 chip.",
    price: 1499.99,
    rating: 4.8,
    category: "Mac",
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&h=500&fit=crop",
  },
  {
    name: "Apple Watch Ultra 2",
    description: "Rugged smartwatch for extreme adventures.",
    price: 799.99,
    rating: 4.9,
    badge: "New",
    category: "Watch",
    image:
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
  },
  {
    name: "USB-C Hub",
    description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
    price: 59.99,
    rating: 4.5,
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1612363228621-9731d53c6492?w=500&h=500&fit=crop",
  },
  {
    name: "iPhone 15",
    description: "Dynamic Island, 48MP camera, A16 chip.",
    price: 799.99,
    rating: 4.7,
    category: "Phone",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
  },
  {
    name: "iPad Air",
    description: "Powerful and versatile tablet with M1 chip.",
    price: 599.99,
    rating: 4.6,
    category: "iPad",
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
  },
  {
    name: "AirPods Max",
    description: "High-fidelity over-ear headphones with spatial audio.",
    price: 549.99,
    originalPrice: 599.99,
    rating: 4.4,
    badge: "Sale",
    category: "Earphone",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
  },
];

const Home: React.FC = () => {
  const { addToCart } = useCartStore();
  const { products, isLoading, fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayProducts = useMemo(() => {
    if (products.length > 0) {
      return products;
    }
    return MOCK_PRODUCTS.map((p, index) => ({ ...p, id: String(index + 1) }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return displayProducts;
    return displayProducts.filter((p) => p.category === selectedCategory);
  }, [displayProducts, selectedCategory]);

  const handleAddToCart = (product: (typeof displayProducts)[0]) => {
    addToCart({
      id: product.id as unknown as number,
      name: product.name,
      price: product.price,
      image: product.image || "",
    });
    setClickedProduct(product.id);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setClickedProduct(null), 1500);
  };

  // const cartItemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">
          Discover Amazing Products
        </h1>
        <p className="text-slate-600 text-lg mb-6">
          Shop the latest trends with unbeatable prices
        </p>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`rounded-full px-4 ${
                selectedCategory === category
                  ? ""
                  : "border-slate-300 text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <p className="text-slate-600">
          Showing {filteredProducts.length} product
          {filteredProducts.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" && (
            <span className="font-medium">
              {" "}
              in <span className="text-primary">{selectedCategory}</span>
            </span>
          )}
        </p>
        {selectedCategory !== "All" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedCategory("All")}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="w-4 h-4 mr-1" />
            Clear filter
          </Button>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group block"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.badge && (
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        product.badge === "Sale"
                          ? "bg-red-500 text-white"
                          : product.badge === "New"
                          ? "bg-green-500 text-white"
                          : "bg-primary text-white"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                <div
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                  onClick={(e) => e.preventDefault()}
                >
                  <Heart className="w-4 h-4 text-slate-600" />
                </div>

                <div
                  className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={(e) => e.preventDefault()}
                >
                  <Button
                    className={`w-full transition-all duration-200 ${
                      clickedProduct === product.id
                        ? "bg-green-500 text-white scale-95"
                        : "bg-white text-slate-900 hover:bg-slate-100"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    {clickedProduct === product.id ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium text-slate-700">
                    {product.rating.toFixed(1)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({product.category})
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                  {product.description}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-slate-900">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No products found
          </h3>
          <p className="text-slate-500 mb-4">
            We couldn't find any products in the "{selectedCategory}" category.
          </p>
          <Button onClick={() => setSelectedCategory("All")}>
            View All Products
          </Button>
        </div>
      )}
    </main>
  </div>
  );
};

export default Home;
