import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useGet } from "@/hooks/useApi";
import {
  ShoppingCart,
  Star,
  Heart,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
  Check,
} from "lucide-react";

interface ProductVariant {
  color: string;
  colorCode: string;
  size?: string;
  images: string[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  originalPrice?: number;
  badge?: string;
  category?: string;
  stock?: number;
  features?: string[];
  variants?: ProductVariant[];
  sizes?: string[];
}

const MOCK_PRODUCT: Product = {
  id: 1,
  name: "Wireless Headphones",
  description:
    "Experience premium sound quality with our noise-cancelling wireless headphones. Featuring 30-hour battery life, comfortable over-ear design, and advanced active noise cancellation technology.",
  price: 199.99,
  originalPrice: 249.99,
  rating: 4.5,
  badge: "Sale",
  category: "Electronics",
  stock: 15,
  image:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
  features: [
    "30-hour battery life",
    "Active noise cancellation",
    "Bluetooth 5.0",
    "Premium drivers",
    "Comfortable memory foam ear cups",
    "Foldable design",
  ],
  sizes: ["One Size"],
  variants: [
    {
      color: "Black",
      colorCode: "#1a1a1a",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
      ],
    },
    {
      color: "White",
      colorCode: "#f5f5f5",
      images: [
        "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
      ],
    },
    {
      color: "Navy",
      colorCode: "#1e3a5f",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1515940175183-6798528b8c2b?w=800&h=800&fit=crop",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
      ],
    },
  ],
};

const COLORS = [
  { name: "Black", code: "#1a1a1a" },
  { name: "White", code: "#f5f5f5" },
  { name: "Navy", code: "#1e3a5f" },
  { name: "Red", code: "#dc2626" },
  { name: "Silver", code: "#9ca3af" },
];

const SIZES = ["S", "M", "L", "XL"];

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCartStore();
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[1]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const productId = id ? Number(id) : 0;

  const { data: product, isLoading } = useGet<Product>(
    id ? `/api/products/${id}` : "",
    id ? [id] : []
  );

  const displayProduct = product || { ...MOCK_PRODUCT, id: productId };

  const variantImages = displayProduct.variants?.find(
    (v) => v.color === selectedColor.name
  )?.images || [displayProduct.image];

  const currentImage = variantImages[activeImage] || displayProduct.image;

  const handleAddToCart = () => {
    addToCart({
      id: displayProduct.id,
      name: displayProduct.name,
      price: displayProduct.price,
      image: currentImage,
    });
    setQuantity(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src={currentImage}
                  alt={displayProduct.name}
                  className="w-full h-full object-cover"
                />
                {displayProduct.badge && (
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 text-sm font-semibold rounded-full ${
                      displayProduct.badge === "Sale"
                        ? "bg-red-500 text-white"
                        : displayProduct.badge === "New"
                        ? "bg-green-500 text-white"
                        : "bg-primary text-white"
                    }`}
                  >
                    {displayProduct.badge}
                  </span>
                )}
                <button className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors">
                  <Heart className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              {variantImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {variantImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === index
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${displayProduct.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-primary font-medium mb-2">
                  {displayProduct.category}
                </p>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {displayProduct.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(displayProduct.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">
                    {displayProduct.rating.toFixed(1)} (
                    {displayProduct.stock || 42} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900">
                  ${displayProduct.price.toFixed(2)}
                </span>
                {displayProduct.originalPrice && (
                  <span className="text-xl text-slate-400 line-through">
                    ${displayProduct.originalPrice.toFixed(2)}
                  </span>
                )}
                {displayProduct.originalPrice && (
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
                    {Math.round(
                      (1 -
                        displayProduct.price / displayProduct.originalPrice) *
                        100
                    )}
                    % OFF
                  </span>
                )}
              </div>

              <p className="text-slate-600 leading-relaxed">
                {displayProduct.description}
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">
                    Color:{" "}
                    <span className="font-normal text-slate-600">
                      {selectedColor.name}
                    </span>
                  </h3>
                  <div className="flex gap-3">
                    {COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => {
                          setSelectedColor(color);
                          setActiveImage(0);
                        }}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          selectedColor.name === color.name
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-transparent hover:scale-110"
                        }`}
                        style={{ backgroundColor: color.code }}
                        title={color.name}
                      >
                        {selectedColor.name === color.name && (
                          <Check
                            className={`w-5 h-5 mx-auto ${
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

                {displayProduct.sizes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3">
                      Size:{" "}
                      <span className="font-normal text-slate-600">
                        {selectedSize}
                      </span>
                    </h3>
                    <div className="flex gap-2">
                      {displayProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
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

              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center border border-slate-200 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-r-none"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-sm text-slate-500">
                  {displayProduct.stock || 15} in stock
                </span>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 h-12 text-lg font-semibold"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="h-12 px-6">
                  Buy Now
                </Button>
              </div>

              {displayProduct.features && (
                <div className="pt-4 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-3">
                    Features
                  </h3>
                  <ul className="space-y-2">
                    {displayProduct.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-slate-600"
                      >
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Truck className="w-5 h-5 text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Shield className="w-5 h-5 text-primary" />
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <RefreshCw className="w-5 h-5 text-primary" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
