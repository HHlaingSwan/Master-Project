import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { type Product } from "@/store/product";
import { toast } from "@/lib/toast";
import { Heart, Star } from "lucide-react";
import {
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RefreshCw,
  Check,
} from "lucide-react";

interface ProductDetailProps {
  product: Product;
  onBack?: () => void;
  onAddToCart?: (
    product: Product,
    color: string,
    size: string,
    quantity: number,
    image: string
  ) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  product: selectedProduct,
  onBack,
  onAddToCart,
}) => {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const stock = selectedProduct.stock || 0;
  const isOutOfStock = stock === 0;
  const canIncrease = quantity < stock;
  const canDecrease = quantity > 1;

  const handleIncrement = () => {
    if (canIncrease) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (canDecrease) {
      setQuantity(quantity - 1);
    }
  };

  const availableColors = useMemo(() => {
    if (!selectedProduct?.variants) return [];
    const seen = new Set<string>();
    return selectedProduct.variants
      .map((v) => ({
        name: v.color,
        code: v.colorCode,
      }))
      .filter((color) => {
        if (seen.has(color.name)) return false;
        seen.add(color.name);
        return true;
      });
  }, [selectedProduct?.variants]);
  const availableSizes = selectedProduct?.sizes || [];

  const [selectedColor, setSelectedColor] = useState<{
    name: string;
    code: string;
  }>(() =>
    availableColors.length > 0
      ? availableColors[0]
      : { name: "Default", code: "#000000" }
  );
  const [selectedSize, setSelectedSize] = useState<string>(() =>
    availableSizes.length > 0 ? availableSizes[0] : ""
  );

  useEffect(() => {
    if (availableColors.length > 0) {
      setSelectedColor(availableColors[0]);
    }
  }, [selectedProduct?.variants]);

  useEffect(() => {
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  }, [selectedProduct?.sizes]);

  useEffect(() => {
  }, [selectedProduct]);

  const currentImage = selectedProduct.image;

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const stock = selectedProduct.stock || 0;
    if (quantity > stock) {
      toast.error(`Only ${stock} items available in stock`);
      return;
    }

    if (onAddToCart) {
      onAddToCart(
        selectedProduct,
        selectedColor.name,
        selectedSize,
        quantity,
        currentImage
      );
    } else {
      addToCart({
        id: selectedProduct.id as unknown as number,
        name: selectedProduct.name,
        price: selectedProduct.price,
        image: currentImage,
      });
    }
    setQuantity(1);
    toast.success(
      `${selectedProduct.name} (${selectedColor.name}, ${selectedSize}) added to cart!`
    );
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden max-h-[85vh]">
      <div className="flex flex-col md:flex-row h-[85vh]">
        <div className="hidden md:flex w-1/2 h-full p-4 sm:p-6 bg-slate-50 items-center justify-center">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-100 max-w-125">
            <img
              src={currentImage}
              alt={selectedProduct.name}
              className="w-full h-full object-cover"
            />
            {selectedProduct.badge && (
              <span
                className={`absolute top-3 left-3 px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                  selectedProduct.badge === "Sale"
                    ? "bg-red-500 text-white"
                    : selectedProduct.badge === "New"
                    ? "bg-green-500 text-white"
                    : "bg-primary text-white"
                }`}
              >
                {selectedProduct.badge}
              </span>
            )}
            <button className="absolute top-3 right-3 p-2 sm:p-3 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 overflow-y-auto h-full">
          <div>
            <p className="text-xs sm:text-sm text-primary font-medium mb-1 sm:mb-2">
              {selectedProduct.category}
            </p>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
              {selectedProduct.name}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 sm:gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      star <= Math.round(selectedProduct.rating)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-slate-500">
                {selectedProduct.rating.toFixed(1)} ({stock} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 sm:gap-3">
            <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
              ${selectedProduct.price.toFixed(2)}
            </span>
            {selectedProduct.originalPrice && (
              <span className="text-sm sm:text-xl text-slate-400 line-through">
                ${selectedProduct.originalPrice.toFixed(2)}
              </span>
            )}
            {selectedProduct.originalPrice && (
              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-600 text-xs sm:text-sm font-semibold rounded">
                {Math.round(
                  (1 - selectedProduct.price / selectedProduct.originalPrice) *
                    100
                )}
                % OFF
              </span>
            )}
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {selectedProduct.description}
          </p>

          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3">
                Color:{" "}
                <span className="font-normal text-slate-600">
                  {selectedColor.name}
                </span>
              </h3>
              <div className="flex gap-2 sm:gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color);
                    }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-all ${
                      selectedColor.name === color.name
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-transparent hover:scale-110"
                    }`}
                    style={{ backgroundColor: color.code }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check
                        className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto ${
                          color.name === "White" || color.name === "Silver"
                            ? "text-slate-900"
                            : "text-white"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct.sizes && availableSizes.length > 0 && (
              <div>
                <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-2 sm:mb-3">
                  Size:{" "}
                  <span className="font-normal text-slate-600">
                    {selectedSize}
                  </span>
                </h3>
                <div className="flex gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-slate-200 text-slate-700 hover:border-slate-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 sm:pt-4">
            <div className="flex items-center border border-slate-200 rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-r-none disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDecrement}
                disabled={!canDecrease || isOutOfStock}
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <span className="w-8 sm:w-12 text-center text-sm sm:text-base font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-l-none disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleIncrement}
                disabled={!canIncrease || isOutOfStock}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <span className={`text-xs sm:text-sm ${isOutOfStock ? "text-red-500 font-medium" : "text-slate-500"}`}>
              {isOutOfStock ? "Out of stock" : `${stock} in stock`}
            </span>
          </div>

          <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
            <Button
              className="flex-1 h-10 sm:h-12 text-sm sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isOutOfStock}
            >
              Buy Now
            </Button>
          </div>

          {selectedProduct.features && (
            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-semibold text-slate-900 mb-2 sm:mb-3 text-sm sm:text-base">
                Features
              </h3>
              <ul className="space-y-1 sm:space-y-2">
                {selectedProduct.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600"
                  >
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-slate-200">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden sm:inline">Free Shipping</span>
              <span className="sm:hidden">Free Ship</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden sm:inline">Secure Payment</span>
              <span className="sm:hidden">Secure</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="hidden sm:inline">30-Day Returns</span>
              <span className="sm:hidden">Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
