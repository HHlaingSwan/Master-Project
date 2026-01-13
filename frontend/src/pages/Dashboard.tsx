import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Search,
  Package,
  Star,
  X,
  Hash,
  Tag,
  Box,
  DollarSign,
  AlignLeft,
  Upload,
  Camera,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import axiosInstance from "@/api";
import { toast } from "@/lib/toast";

interface ProductVariant {
  color: string;
  colorCode: string;
  size?: string;
  images: string[];
}

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
  variants?: ProductVariant[];
  sizes?: string[];
}

const CATEGORIES = ["Watch", "Mac", "Phone", "Earphone", "iPad", "Accessories"];

const BADGES = ["", "Sale", "New", "Popular"];

const FormInput = ({
  label,
  icon: Icon,
  ...props
}: {
  label: string;
  icon?: React.ElementType;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4 text-slate-400" />}
      {label}
    </Label>
    <Input
      className="h-11 bg-slate-50 border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      {...props}
    />
  </div>
);

const FormSelect = ({
  label,
  options,
  ...props
}: {
  label: string;
  options: string[];
} & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
      <Tag className="w-4 h-4 text-slate-400" />
      {label}
    </Label>
    <select
      className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      {...props}
    >
      <option value="">Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt || "None"}
        </option>
      ))}
    </select>
  </div>
);

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <Star className="w-4 h-4 text-slate-400" />
        Rating
      </Label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 transition-transform hover:scale-110"
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(null)}
            onClick={() => onChange(star)}
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredStar ?? value)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500">
          {value > 0 ? `${value}/5` : "Select rating"}
        </span>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
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
  const [formData, setFormData] = useState({
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
    variants: [] as {
      color: string;
      colorCode: string;
      size?: string;
      images: string[];
    }[],
    sizes: [] as string[],
  });
  const [, setOriginalImage] = useState("");
  const [imageRemoved, setImageRemoved] = useState(false);
  const [newColor, setNewColor] = useState({ name: "", colorCode: "#000000" });
  const [newSize, setNewSize] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts(1, searchTerm);
  }, []);

  const fetchProducts = async (page = 1, search = "") => {
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
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchProducts(1, value);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProducts(newPage, searchTerm);
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
        formData.append("file", file);
        formData.append("upload_preset", "products_unsigned");
        formData.append(
          "cloud_name",
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ""
        );

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/" +
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME +
            "/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await response.json();

        if (data.secure_url) {
          setFormData((prev) => ({ ...prev, image: data.secure_url }));
          toast.success("Image uploaded successfully");
        } else {
          throw new Error(data.error?.message || "Upload failed");
        }
      } catch {
        toast.error("Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const price = Number(formData.price);
      const stockValue = Number(formData.stock);
      const originalPriceValue = formData.originalPrice
        ? Number(formData.originalPrice)
        : undefined;

      if (price <= 0) {
        toast.error("Price must be greater than 0");
        return;
      }

      if (!selectedProduct && !formData.image) {
        toast.error("Product image is required");
        return;
      }

      if (stockValue < 0) {
        toast.error("Stock cannot be negative");
        return;
      }

      if (originalPriceValue && originalPriceValue <= price) {
        toast.error(
          "Original price must be greater than current price for discounts"
        );
        return;
      }

      const payload: Record<string, unknown> = {
        productId: formData.productId,
        name: formData.name,
        description: formData.description,
        price: price,
        originalPrice: originalPriceValue,
        rating: formData.rating,
        badge: formData.badge || undefined,
        category: formData.category,
        stock: stockValue,
        variants: formData.variants.map((v) => ({
          color: v.color,
          colorCode: v.colorCode,
          ...(v.images?.length > 0 && { images: v.images }),
        })),
        sizes: formData.sizes,
      };

      if (selectedProduct) {
        console.log(
          "Updating product, image value:",
          formData.image,
          "removed:",
          imageRemoved
        );
        if (imageRemoved) {
          payload.image = "";
          console.log("Image removed, sending empty string");
        } else if (formData.image && formData.image.trim() !== "") {
          payload.image = formData.image;
          console.log("Adding new image to payload");
        }
      } else {
        payload.image = formData.image;
      }

      console.log("Payload being sent:", JSON.stringify(payload, null, 2));

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
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Failed to save product");
    }
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
          { color: newColor.name, colorCode: newColor.colorCode, images: [] },
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Store
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-slate-500">Manage your products</p>
              </div>
            </div>
            <Button
              onClick={openCreateSheet}
              className="h-11 px-6 bg-primary hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6">
          <div className="relative max-w-sm sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-9 sm:pl-10 h-10 sm:h-11 bg-white border-slate-200 shadow-sm"
            />
          </div>
        </div>

        <div className="mb-4 text-sm text-slate-600">
          Showing {products.length} of {pagination.total} products
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Card
              key={product._id}
              className="overflow-hidden border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="aspect-video relative overflow-hidden bg-slate-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-300 text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="text-white text-sm ml-1">
                      ({product.rating})
                    </span>
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
                      onClick={() => openEditSheet(product)}
                      className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(product)}
                      className="h-8 w-8 text-slate-500 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              No products found
            </h3>
            <p className="text-slate-500 mb-4">
              {searchTerm
                ? "Try a different search term"
                : "Add your first product to get started"}
            </p>
            {!searchTerm && (
              <Button onClick={openCreateSheet}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            )}
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrevPage}
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
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNextPage}
              className="h-10 w-10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </main>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full h-full sm:h-auto sm:max-w-xl sm:w-full s md:max-w-2xl lg:max-w-xl bg-white shadow-xl flex flex-col ">
          <SheetHeader className="shrink-0 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold text-slate-900">
                {selectedProduct ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </div>
            <p className="text-sm text-slate-500">
              {selectedProduct
                ? "Update the product information below"
                : "Fill in the product information to create a new product"}
            </p>
          </SheetHeader>

          <form onSubmit={handleSubmit} className="flex-1 p-4 overflow-y-auto">
            <div className="py-6 space-y-6">
              <div
                className={`flex items-center justify-center py-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-primary transition-colors relative overflow-hidden ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {isUploading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-slate-500">
                      Uploading to Cloudinary...
                    </p>
                  </div>
                ) : formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="max-w-xs max-h-48 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <Camera className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-sm">Click to change</span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white shadow-md hover:bg-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, image: "" });
                        setImageRemoved(true);
                      }}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-sm text-slate-500">
                      Click to upload product image
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>

              <FormInput
                label="Product ID"
                icon={Hash}
                placeholder="ABC123"
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Stock"
                  icon={Box}
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      stock: Math.max(0, Number(e.target.value)).toString(),
                    })
                  }
                />
                <FormSelect
                  label="Badge"
                  options={BADGES}
                  value={formData.badge}
                  onChange={(e) =>
                    setFormData({ ...formData, badge: e.target.value })
                  }
                />
              </div>

              <FormInput
                label="Product Name"
                icon={Tag}
                placeholder="Enter product name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-slate-400" />
                  Description
                </Label>
                <textarea
                  className="w-full h-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                  placeholder="Enter product description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Price"
                  icon={DollarSign}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
                <FormInput
                  label="Original Price"
                  icon={DollarSign}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.originalPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, originalPrice: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <StarRating
                  value={formData.rating}
                  onChange={(value) =>
                    setFormData({ ...formData, rating: value })
                  }
                />
                <FormSelect
                  label="Category"
                  options={CATEGORIES}
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">
                  Colors
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Color name (e.g., Red)"
                    value={newColor.name}
                    onChange={(e) =>
                      setNewColor({ ...newColor, name: e.target.value })
                    }
                    className="flex-1"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newColor.colorCode}
                      onChange={(e) =>
                        setNewColor({ ...newColor, colorCode: e.target.value })
                      }
                      className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                    />
                    <Button type="button" onClick={addColor} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.variants.map((variant) => (
                    <div
                      key={variant.color}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full"
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-slate-300"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                      <span className="text-sm">{variant.color}</span>
                      <button
                        type="button"
                        onClick={() => removeColor(variant.color)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium text-slate-700">
                  Sizes
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Size (e.g., S, M, L, XL)"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSize();
                      }
                    }}
                  />
                  <Button type="button" onClick={addSize} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sizes.map((size) => (
                    <div
                      key={size}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full"
                    >
                      <span className="text-sm">{size}</span>
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-4 border-t border-slate-100 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSheetOpen(false)}
                className="flex-1 h-11"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUploading}
                className="flex-1 h-11 bg-primary hover:bg-primary/90"
              >
                {selectedProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-lg">Delete Product</DialogTitle>
                <p className="text-sm text-slate-500">
                  This action cannot be undone
                </p>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-900">
                {selectedProduct?.name}
              </span>
              ? This will permanently remove the product from your store.
            </p>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
