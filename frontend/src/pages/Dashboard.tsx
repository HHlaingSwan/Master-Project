import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api";
import { toast } from "@/lib/toast";
import { Package, Users, BarChart3 } from "lucide-react";
import ProductsTab from "./components/ProductsTab";
import UsersTab from "./components/UsersTab";
import AnalyticsTab from "./components/AnalyticsTab";
import ProductFormSheet from "./components/ProductFormSheet";
import DeleteDialog from "./components/DeleteDialog";

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
  features?: string[];
  variants?: {
    color: string;
    colorCode: string;
  }[];
  sizes?: string[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
}

interface PopularProduct {
  name: string;
  rating: number;
  sales: number;
}

interface MostBuyingProduct {
  name: string;
  sold: number;
  revenue: number;
}

interface AnalyticsData {
  popularProducts: PopularProduct[];
  mostBuyingProducts: MostBuyingProduct[];
}

interface ProductFormData {
  productId: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  rating: number;
  image: string;
  badge: string;
  category: string;
  stock: string;
  variants: {
    color: string;
    colorCode: string;
  }[];
  sizes: string[];
}

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "products" | "users" | "analytics"
  >("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [productsLoading, setProductsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [formData, setFormData] = useState<ProductFormData>({
    productId: "",
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    rating: 0,
    image: "",
    badge: "",
    category: "",
    stock: "",
    variants: [],
    sizes: [],
  });
  const [, setOriginalImage] = useState("");
  const [imageRemoved, setImageRemoved] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", colorCode: "#000000" });
  const [newSize, setNewSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (activeTab === "products") {
      fetchProducts(1, searchTerm);
    } else if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "analytics") {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchProducts = async (page = 1, search = "", isPagination = false) => {
    if (isPagination) {
      setPaginationLoading(true);
    } else {
      setProductsLoading(true);
    }
    try {
      const response = await axiosInstance.get("/products", {
        params: {
          page,
          limit: 12,
          search: search || undefined,
        },
      });
      setProducts(response.data.data);
      setPagination(response.data.pagination);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      if (isPagination) {
        setPaginationLoading(false);
      } else {
        setProductsLoading(false);
      }
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data.data);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const response = await axiosInstance.get("/analytics");
      setAnalytics(response.data.data);
    } catch {
      toast.error("Failed to fetch analytics");
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const handleToggleAdminRole = async (
    userId: string,
    currentRole: boolean
  ) => {
    try {
      await axiosInstance.put(`/users/${userId}/role`, {
        isAdmin: !currentRole,
      });
      toast.success(
        `User ${!currentRole ? "promoted to" : "demoted from"} admin`
      );
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response.data.message || "Failed to update user role");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchProducts(1, value);
    }, 300);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, searchTerm, true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openCreateSheet = () => {
    setSelectedProduct(null);
    setFormData({
      productId: "",
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      rating: 0,
      image: "",
      badge: "",
      category: "",
      stock: "",
      variants: [],
      sizes: [],
    });
    setNewColor({ name: "", colorCode: "#000000" });
    setNewSize("");
    setIsSheetOpen(true);
  };

  const openEditSheet = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      productId: product.productId,
      name: product.name,
      description: product.description,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : "",
      rating: product.rating || 0,
      image: product.image,
      badge: product.badge || "",
      category: product.category,
      stock: product.stock ? String(product.stock) : "",
      variants: product.variants || [],
      sizes: product.sizes || [],
    });
    setOriginalImage(product.image);
    setImageRemoved(false);
    setNewColor({ name: "", colorCode: "#000000" });
    setNewSize("");
    setIsSheetOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await axiosInstance.post("/upload", formData);

        if (response.data.data?.url) {
          setFormData((prev) => ({ ...prev, image: response.data.data.url }));
          toast.success("Image uploaded successfully");
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const price = Number(formData.price);
    const stockValue = Number(formData.stock);
    const originalPriceValue = formData.originalPrice
      ? Number(formData.originalPrice)
      : undefined;

    try {
      validateForm({
        price,
        stockValue,
        originalPriceValue,
        formData,
        selectedProduct,
      });

      const payload = buildPayload({ formData, selectedProduct, imageRemoved });

      if (selectedProduct) {
        await axiosInstance.put(
          `/products/${selectedProduct.productId}`,
          payload
        );
        toast.success("Product updated successfully");
      } else {
        await axiosInstance.post("/products", payload);
        toast.success("Product created successfully");
      }

      setIsSheetOpen(false);
      fetchProducts(1, searchTerm);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      if (err.response?.data?.message) {
        throw err;
      }
      toast.error("Failed to save product");
    }
  };

  const validateForm = ({
    price,
    stockValue,
    originalPriceValue,
    formData,
    selectedProduct,
  }: {
    price: number;
    stockValue: number;
    originalPriceValue?: number;
    formData: ProductFormData;
    selectedProduct: Product | null;
  }) => {
    if (price <= 0) {
      toast.error("Price must be greater than 0");
      throw new Error("Validation failed");
    }

    if (!selectedProduct && !formData.image) {
      toast.error("Product image is required");
      throw new Error("Validation failed");
    }

    if (stockValue < 0) {
      toast.error("Stock cannot be negative");
      throw new Error("Validation failed");
    }

    if (originalPriceValue && originalPriceValue <= price) {
      toast.error(
        "Original price must be greater than current price for discounts"
      );
      throw new Error("Validation failed");
    }
  };

  const buildPayload = ({
    formData,
    selectedProduct,
    imageRemoved,
  }: {
    formData: ProductFormData;
    selectedProduct: Product | null;
    imageRemoved: boolean;
  }) => {
    const price = Number(formData.price);
    const stockValue = Number(formData.stock);
    const originalPriceValue = formData.originalPrice
      ? Number(formData.originalPrice)
      : undefined;

    const payload: Record<string, unknown> = {
      productId: formData.productId,
      name: formData.name,
      description: formData.description,
      price,
      originalPrice: originalPriceValue,
      rating: formData.rating,
      badge: formData.badge || undefined,
      category: formData.category,
      stock: stockValue,
      variants: formData.variants.map((v) => ({
        color: v.color,
        colorCode: v.colorCode,
      })),
      sizes: formData.sizes,
    };

    if (selectedProduct) {
      if (imageRemoved) {
        payload.image = "";
      } else if (formData.image) {
        payload.image = formData.image;
      }
    } else {
      payload.image = formData.image;
    }

    return payload;
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await axiosInstance.delete(`/products/${selectedProduct.productId}`);
      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false);
      fetchProducts(pagination.page, searchTerm);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to delete product");
      setIsDeleteDialogOpen(false);
    }
  };

  const addColor = () => {
    if (newColor.name && newColor.colorCode) {
      const exists = formData.variants.some(
        (v) => v.color.toLowerCase() === newColor.name.toLowerCase()
      );
      if (exists) {
        toast.error("Color already exists");
        return;
      }
      setFormData({
        ...formData,
        variants: [
          ...formData.variants,
          { color: newColor.name, colorCode: newColor.colorCode },
        ],
      });
      setNewColor({ name: "", colorCode: "#000000" });
    }
  };

  const removeColor = (colorName: string) => {
    setFormData({
      ...formData,
      variants: formData.variants.filter((v) => v.color !== colorName),
    });
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize.toUpperCase())) {
      setFormData({
        ...formData,
        sizes: [...formData.sizes, newSize.toUpperCase()],
      });
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setFormData({
      ...formData,
      sizes: formData.sizes.filter((s) => s !== size),
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Store
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500">Manage your store</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === "products" ? "default" : "outline"}
                onClick={() => setActiveTab("products")}
                className="gap-2"
              >
                <Package className="w-4 h-4" />
                Products
              </Button>
              <Button
                variant={activeTab === "users" ? "default" : "outline"}
                onClick={() => setActiveTab("users")}
                className="gap-2"
              >
                <Users className="w-4 h-4" />
                Users
              </Button>
              <Button
                variant={activeTab === "analytics" ? "default" : "outline"}
                onClick={() => setActiveTab("analytics")}
                className="gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {activeTab === "products" && (
          <ProductsTab
            products={products}
            searchTerm={searchTerm}
            pagination={pagination}
            paginationLoading={paginationLoading}
            loading={productsLoading}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onCreate={openCreateSheet}
            onEdit={openEditSheet}
            onDelete={openDeleteDialog}
          />
        )}
        {activeTab === "users" && (
          <UsersTab
            users={users}
            loading={usersLoading}
            onToggleRole={handleToggleAdminRole}
          />
        )}
        {activeTab === "analytics" && (
          <AnalyticsTab analytics={analytics} loading={analyticsLoading} />
        )}
      </main>

      <ProductFormSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        isEditing={!!selectedProduct}
        formData={formData}
        isUploading={isUploading}
        newColor={newColor}
        newSize={newSize}
        onFormDataChange={(data) =>
          setFormData((prev) => ({ ...prev, ...data }))
        }
        onNewColorChange={setNewColor}
        onNewSizeChange={setNewSize}
        onAddColor={addColor}
        onRemoveColor={removeColor}
        onAddSize={addSize}
        onRemoveSize={removeSize}
        onImageUpload={handleImageUpload}
        onRemoveImage={() => {
          setFormData({ ...formData, image: "" });
          setImageRemoved(true);
        }}
        onSubmit={handleSubmit}
        fileInputRef={fileInputRef}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        productName={selectedProduct?.name}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Dashboard;
