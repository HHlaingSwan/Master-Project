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

const Home: React.FC = () => {
  const { addToCart } = useCartStore();
  const { products, isLoading, fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const displayProducts = useMemo(() => {
    return products;
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Discover Amazing Products
          </h1>
          <p className="text-slate-600 text-sm sm:text-lg mb-4 sm:mb-6">
            Shop the latest trends with unbeatable prices
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`rounded-full px-3 sm:px-4 text-xs sm:text-sm ${
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

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
          <p className="text-sm sm:text-base text-slate-600">
            {filteredProducts.length} product
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
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredProducts.map((product) => {
              const productIdForUrl = product.id.startsWith("#")
                ? product.id.slice(1)
                : product.id;
              return (
                <Link
                  to={`/product/${productIdForUrl}`}
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
              );
            })}
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
              We couldn't find any products in the "{selectedCategory}"
              category.
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
