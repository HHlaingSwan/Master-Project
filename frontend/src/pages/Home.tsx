import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useProductStore } from "@/store/product";
import {
  ShoppingCart,
  Star,
  Heart,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProductDetail from "./ProductDetail";
import FilterSheet, { type FilterState } from "./components/FilterSheet";

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
  const {
    products,
    isLoading,
    isPaginationLoading,
    pagination,
    fetchProducts,
  } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<Category>("All");
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 10000 },
  });

  useEffect(() => {
    fetchProducts(1, selectedCategory);
  }, [selectedCategory, fetchProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.colors.length > 0) {
      result = result.filter((product) =>
        product.variants?.some((variant) =>
          filters.colors.includes(variant.color)
        )
      );
    }

    if (filters.sizes.length > 0) {
      result = result.filter((product) => {
        const productSizes = product.sizes || [];
        return filters.sizes.some((size) => productSizes.includes(size));
      });
    }

    return result;
  }, [products, filters]);

  const totalFiltersCount = filters.colors.length + filters.sizes.length;

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, selectedCategory);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;

    if (totalPages <= 1) return null;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(1, totalPages - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-primary text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

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
                onClick={() => handleCategoryChange(category)}
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
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            {selectedCategory !== "All" && (
              <span className="font-medium">
                {" "}
                in <span className="text-primary">{selectedCategory}</span>
              </span>
            )}
            {totalFiltersCount > 0 && (
              <span className="font-medium">
                {" "}
                matching <span className="text-primary">{totalFiltersCount} filter{totalFiltersCount > 1 ? "s" : ""}</span>
              </span>
            )}
          </p>
          <div className="flex items-center gap-2">
            {totalFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ colors: [], sizes: [], priceRange: { min: 0, max: 10000 } });
                }}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear ({totalFiltersCount})
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen(true)}
              className={totalFiltersCount > 0 ? "border-primary text-primary" : ""}
            >
              <Filter className="w-4 h-4 mr-1" />
              Filters
              {totalFiltersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                  {totalFiltersCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {totalFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.colors.map((color) => (
              <span
                key={color}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
              >
                Color: {color}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      colors: prev.colors.filter((c) => c !== color),
                    }))
                  }
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {filters.sizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-full"
              >
                Size: {size}
                <button
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      sizes: prev.sizes.filter((s) => s !== size),
                    }))
                  }
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        {filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredProducts.map((product) => {
                return (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 group cursor-pointer"
                    onClick={() => setSelectedProductId(product.id)}
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
                            setSelectedProductId(product.id);
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
                              Choose Variant
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
                  </div>
                );
              })}
            </div>

            {pagination.totalPages > 1 && totalFiltersCount === 0 && (
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 sm:mt-12">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || isPaginationLoading}
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${
                    isPaginationLoading ? "opacity-50" : ""
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div
                  className={`flex gap-1 sm:gap-2 ${
                    isPaginationLoading ? "opacity-50" : ""
                  }`}
                >
                  {renderPaginationButtons()}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage || isPaginationLoading}
                  className={`h-9 w-9 sm:h-10 sm:w-10 ${
                    isPaginationLoading ? "opacity-50" : ""
                  }`}
                >
                  {isPaginationLoading ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 mb-4">
              {totalFiltersCount > 0
                ? "No products match your selected filters"
                : selectedCategory !== "All"
                ? `No products in the "${selectedCategory}" category`
                : "No products available"}
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("All");
                setFilters({ colors: [], sizes: [], priceRange: { min: 0, max: 10000 } });
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </main>

      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onClearAll={() => {
          setFilters({ colors: [], sizes: [], priceRange: { min: 0, max: 10000 } });
        }}
      />

      <Dialog
        open={!!selectedProductId}
        onOpenChange={(open) => !open && setSelectedProductId(null)}
      >
        <DialogContent className="p-0 min-w-6xl max-h-[90vh] overflow-y-auto">
          {selectedProductId && (
            <ProductDetail
              id={selectedProductId}
              onBack={() => setSelectedProductId(null)}
              onAddToCart={(product, color, size, quantity, image) => {
                addToCart({
                  id: product.id as unknown as number,
                  name: product.name,
                  price: product.price,
                  image: image || product.image || "",
                  color,
                  size,
                  quantity,
                  maxQuantity: product.stock,
                });
                setClickedProduct(product.id);
                setTimeout(() => setClickedProduct(null), 1500);
                setSelectedProductId(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
