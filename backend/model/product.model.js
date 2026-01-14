import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    image: {
      type: String,
      default: "",
    },
    badge: {
      type: String,
      enum: ["Sale", "New", "Popular", null],
      default: null,
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: ["Watch", "Mac", "Phone", "Earphone", "iPad", "Accessories"],
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    features: [
      {
        type: String,
      },
    ],
    variants: [
      {
        color: String,
        colorCode: String,
        size: String,
      },
    ],
    sizes: [String],
  },
  {
    timestamps: true,
  }
);

// Index Create For Better Search Performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ badge: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
