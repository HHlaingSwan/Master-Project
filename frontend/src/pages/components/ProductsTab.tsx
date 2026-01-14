import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  image: string;
  badge?: string;
  category: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = memo(function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="aspect-video relative overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-full ${
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
        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent p-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-slate-300 text-slate-300"
                }`}
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="text-white text-sm ml-1">({product.rating})</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                {product.productId}
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 line-clamp-1 text-lg">
              {product.name}
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 mt-1">
              {product.category}
            </span>
          </div>
          <div className="text-right ml-4">
            <span className="text-xl font-bold text-slate-900 block">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            {product.stock || 0} in stock
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(product)}
              className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/10"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(product)}
              className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

interface ProductsTabProps {
  products: Product[];
  searchTerm: string;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  paginationLoading: boolean;
  loading: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  searchTerm,
  pagination,
  paginationLoading,
  loading,
  onSearch,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      <div className="mb-4 sm:mb-6">
        <div className="relative max-w-sm sm:max-w-md flex gap-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={onSearch}
            className="pl-9 sm:pl-10 h-10 sm:h-11 bg-white border-slate-200 shadow-sm"
          />
          <Button onClick={onCreate} className="h-10 sm:h-11">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        {loading
          ? "Loading..."
          : `Showing ${products.length} of ${pagination.total} products`}
      </div>

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div
            className={`flex items-center justify-center gap-2 mt-8 ${
              paginationLoading ? "opacity-50" : ""
            }`}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage || paginationLoading}
              className="h-10 w-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-sm text-slate-600 px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>

            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage || paginationLoading}
              className="h-10 w-10"
            >
              {paginationLoading ? (
                <div className="w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full animate-spin" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsTab;
