import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

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
  variants?: Array<{
    color: string;
    colorCode: string;
    size?: string;
  }>;
  sizes?: string[];
}

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
  stats: {
    totalProducts: number;
    inStock: number;
    outOfStock: number;
    totalValue: number;
  };
  paginationLoading: boolean;
  loading: boolean;
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPageChange: (page: number) => void;
  onCreate: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const StatCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => (
  <Card className="border-slate-200 shadow-sm">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      </div>
    </CardContent>
  </Card>
);

const ProductsTable: React.FC<{
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  loading: boolean;
}> = memo(function ProductsTable({ products, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                ID
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Colors
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Price
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Stock
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate max-w-48">
                        {product.name}
                      </p>
                      <p className="text-sm text-slate-500 truncate max-w-48">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {product.productId}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {product.category}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-1 flex-wrap">
                    {product.variants?.slice(0, 4).map((variant, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-slate-200"
                        style={{ backgroundColor: variant.colorCode }}
                        title={variant.color}
                      />
                    ))}
                    {(product.variants?.length || 0) > 4 && (
                      <span className="text-xs text-slate-500 ml-1">
                        +{(product.variants?.length || 0) - 4}
                      </span>
                    )}
                    {(product.variants?.length || 0) === 0 && (
                      <span className="text-sm text-slate-400">-</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div>
                    <span className="font-semibold text-slate-900">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="block text-xs text-slate-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`font-medium ${
                      (product.stock || 0) > 10
                        ? "text-green-600"
                        : (product.stock || 0) > 0
                        ? "text-amber-600"
                        : "text-red-600"
                    }`}
                  >
                    {product.stock || 0}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  {(product.stock || 0) > 10 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      In Stock
                    </span>
                  ) : (product.stock || 0) > 0 ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                      Low Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Out of Stock
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  searchTerm,
  pagination,
  stats,
  paginationLoading,
  loading,
  onSearch,
  onPageChange,
  onCreate,
  onEdit,
  onDelete,
}) => {
  const { totalProducts, inStock, outOfStock, totalValue } = stats;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-5 h-5 text-white" />}
          color="bg-primary"
        />
        <StatCard
          title="In Stock"
          value={inStock}
          icon={<TrendingUp className="w-5 h-5 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStock}
          icon={<AlertCircle className="w-5 h-5 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="Total Value"
          value={`$${totalValue.toLocaleString()}`}
          icon={<Package className="w-5 h-5 text-white" />}
          color="bg-amber-500"
        />
      </div>

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
            Add Product
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

        <ProductsTable
          products={products}
          onEdit={onEdit}
          onDelete={onDelete}
          loading={loading}
        />

        {pagination.totalPages > 1 && (
          <div
            className={`flex items-center justify-center gap-2 mt-6 ${
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
