import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Plus, X, Hash, Tag, Box, DollarSign, AlignLeft, Upload, Camera } from "lucide-react";

interface ProductVariant {
  color: string;
  colorCode: string;
  size?: string;
  images: string[];
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
  variants: ProductVariant[];
  sizes: string[];
}

interface ProductFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEditing: boolean;
  formData: ProductFormData;
  isUploading: boolean;
  newColor: { name: string; colorCode: string };
  newSize: string;
  onFormDataChange: (data: Partial<ProductFormData>) => void;
  onNewColorChange: (color: { name: string; colorCode: string }) => void;
  onNewSizeChange: (size: string) => void;
  onAddColor: () => void;
  onRemoveColor: (colorName: string) => void;
  onAddSize: () => void;
  onRemoveSize: (size: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const CATEGORIES = ["Watch", "Mac", "Phone", "Earphone", "iPad", "Accessories"];
const BADGES = ["", "Sale", "New", "Popular"];

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  const [hoveredStar, setHoveredStar] = React.useState<number | null>(null);

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
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
            <svg
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredStar ?? value)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-slate-200 text-slate-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm text-slate-500">
          {value > 0 ? `${value}/5` : "Select rating"}
        </span>
      </div>
    </div>
  );
};

const ProductFormSheet: React.FC<ProductFormSheetProps> = ({
  open,
  onOpenChange,
  isEditing,
  formData,
  isUploading,
  newColor,
  newSize,
  onFormDataChange,
  onNewColorChange,
  onNewSizeChange,
  onAddColor,
  onRemoveColor,
  onAddSize,
  onRemoveSize,
  onImageUpload,
  onRemoveImage,
  onSubmit,
  fileInputRef,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full h-full sm:h-auto sm:max-w-xl sm:w-full s md:max-w-2xl lg:max-w-xl bg-white shadow-xl flex flex-col">
        <SheetHeader className="shrink-0 pb-4 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-slate-900">
            {isEditing ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </div>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update the product information below"
              : "Fill in the product information to create a new product"}
          </p>
        </SheetHeader>

        <form onSubmit={onSubmit} className="flex-1 p-4 overflow-y-auto">
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
                  <p className="text-sm text-slate-500">Uploading to Cloudinary...</p>
                </div>
              ) : formData.image ? (
                <>
                  <img
                    src={formData.image}
                    alt="Product preview"
                    className="max-w-xs max-h-48 object-contain pointer-events-none"
                  />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
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
                      onRemoveImage();
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Click to upload product image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onImageUpload}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" />
                Product ID
              </Label>
              <Input
                name="productId"
                placeholder="ABC123"
                value={formData.productId}
                onChange={handleInputChange}
                required
                className="h-11 bg-slate-50 border-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Box className="w-4 h-4 text-slate-400" />
                  Stock
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  name="stock"
                  value={formData.stock}
                  onChange={(e) =>
                    onFormDataChange({
                      stock: Math.max(0, Number(e.target.value)).toString(),
                    })
                  }
                  className="h-11 bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Badge
                </Label>
                <select
                  name="badge"
                  value={formData.badge}
                  onChange={handleInputChange}
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <option value="">Select badge</option>
                  {BADGES.filter((b) => b).map((badge) => (
                    <option key={badge} value={badge}>
                      {badge}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400" />
                Product Name
              </Label>
              <Input
                name="name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="h-11 bg-slate-50 border-slate-200"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-slate-400" />
                Description
              </Label>
              <textarea
                name="description"
                className="w-full h-24 px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none text-sm"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  Price
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="h-11 bg-slate-50 border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  Original Price
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className="h-11 bg-slate-50 border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <StarRating
                value={formData.rating}
                onChange={(value) => onFormDataChange({ rating: value })}
              />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Category
                </Label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-md"
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Colors</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Color name (e.g., Red)"
                  value={newColor.name}
                  onChange={(e) => onNewColorChange({ ...newColor, name: e.target.value })}
                  className="flex-1 h-11 bg-slate-50 border-slate-200"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newColor.colorCode}
                    onChange={(e) => onNewColorChange({ ...newColor, colorCode: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <Button type="button" onClick={onAddColor} size="sm">
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
                      onClick={() => onRemoveColor(variant.color)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Sizes</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Size (e.g., S, M, L, XL)"
                  value={newSize}
                  onChange={(e) => onNewSizeChange(e.target.value)}
                  className="flex-1 h-11 bg-slate-50 border-slate-200"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onAddSize();
                    }
                  }}
                />
                <Button type="button" onClick={onAddSize} size="sm">
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
                      onClick={() => onRemoveSize(size)}
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
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="flex-1 h-11 bg-primary hover:bg-primary/90">
              {isEditing ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default ProductFormSheet;
