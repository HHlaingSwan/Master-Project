import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/product.model.js";
import bcrypt from "bcryptjs";
import User from "./model/user.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/subscribe-tracker";

const TECH_PRODUCTS = [
  {
    productId: "WATCH-001",
    name: "Apple Watch Series 9",
    description: "Advanced smartwatch with health features, GPS, and always-on display.",
    price: 399.99,
    originalPrice: 429.99,
    rating: 4.8,
    badge: "New",
    category: "Watch",
    stock: 50,
    features: ["Always-on Retina Display", "Blood Oxygen Sensor", "ECG App", "GPS + Cellular", "Water Resistant 50m"],
    variants: [
      { color: "Midnight", colorCode: "#1f2937" },
      { color: "Starlight", colorCode: "#f5f5f4" },
      { color: "Blue", colorCode: "#3b82f6" },
      { color: "Green", colorCode: "#22c55e" },
      { color: "Pink", colorCode: "#ec4899" },
    ],
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop",
  },
  {
    productId: "WATCH-002",
    name: "Samsung Galaxy Watch 6",
    description: "Premium smartwatch with advanced sleep coaching and body composition.",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.5,
    badge: "Popular",
    category: "Watch",
    stock: 35,
    features: ["Super AMOLED Display", "BioActive Sensor", "Sleep Coaching", "Heart Rate Monitor", "Wireless Charging"],
    variants: [
      { color: "Black", colorCode: "#1f2937" },
      { color: "Silver", colorCode: "#e5e7eb" },
      { color: "Gold", colorCode: "#f59e0b" },
    ],
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&h=500&fit=crop",
  },
  {
    productId: "MAC-001",
    name: "MacBook Pro 14-inch M3",
    description: "Pro laptop with M3 chip, stunning Liquid Retina XDR display.",
    price: 1999.99,
    originalPrice: 2199.99,
    rating: 4.9,
    badge: null,
    category: "Mac",
    stock: 25,
    features: ["M3 Pro Chip", "14.2-inch Liquid Retina XDR", "18-hour Battery", "MagSafe 3", "HDMI Port"],
    variants: [
      { color: "Space Gray", colorCode: "#4b5563" },
      { color: "Silver", colorCode: "#e5e7eb" },
    ],
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=500&h=500&fit=crop",
  },
  {
    productId: "MAC-002",
    name: "iMac 24-inch M3",
    description: "All-in-one desktop with stunning 4.5K Retina display and vibrant colors.",
    price: 1499.99,
    originalPrice: 1699.99,
    rating: 4.7,
    badge: "New",
    category: "Mac",
    stock: 20,
    features: ["M3 Chip", "4.5K Retina Display", "1080p FaceTime HD Camera", "Six-speaker system", "Touch ID"],
    variants: [
      { color: "Blue", colorCode: "#3b82f6" },
      { color: "Green", colorCode: "#22c55e" },
      { color: "Pink", colorCode: "#ec4899" },
      { color: "Yellow", colorCode: "#eab308" },
      { color: "Orange", colorCode: "#f97316" },
      { color: "Purple", colorCode: "#a855f7" },
    ],
    image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&h=500&fit=crop",
  },
  {
    productId: "PHONE-001",
    name: "iPhone 15 Pro Max",
    description: "Titanium design, A17 Pro chip, revolutionary camera system.",
    price: 1199.99,
    originalPrice: 1299.99,
    rating: 4.9,
    badge: "Popular",
    category: "Phone",
    stock: 100,
    features: ["A17 Pro Chip", "Titanium Design", "5x Optical Zoom", "Action Button", "USB-C"],
    variants: [
      { color: "Natural Titanium", colorCode: "#9ca3af" },
      { color: "Blue Titanium", colorCode: "#60a5fa" },
      { color: "White Titanium", colorCode: "#f9fafb" },
      { color: "Black Titanium", colorCode: "#111827" },
    ],
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&h=500&fit=crop",
  },
  {
    productId: "PHONE-002",
    name: "Samsung Galaxy S24 Ultra",
    description: "AI-powered smartphone with S Pen and 200MP camera.",
    price: 1299.99,
    originalPrice: 1399.99,
    rating: 4.7,
    badge: "New",
    category: "Phone",
    stock: 75,
    features: ["Snapdragon 8 Gen 3", "200MP Camera", "Galaxy AI", "S Pen Included", "Titanium Frame"],
    variants: [
      { color: "Titanium Gray", colorCode: "#6b7280" },
      { color: "Titanium Black", colorCode: "#1f2937" },
      { color: "Titanium Violet", colorCode: "#a78bfa" },
      { color: "Titanium Yellow", colorCode: "#facc15" },
    ],
    image: "https://images.unsplash.com/photo-1701197887-8ee1302008c4?w=500&h=500&fit=crop",
  },
  {
    productId: "EARPHONE-001",
    name: "AirPods Pro 2nd Gen",
    description: "Active noise cancellation, adaptive audio, personalized spatial audio.",
    price: 249.99,
    originalPrice: 279.99,
    rating: 4.8,
    badge: "Popular",
    category: "Earphone",
    stock: 150,
    features: ["Active Noise Cancellation", "Adaptive Audio", "Personalized Spatial Audio", "H2 Chip", "USB-C Charging"],
    variants: [
      { color: "White", colorCode: "#f9fafb" },
    ],
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop",
  },
  {
    productId: "EARPHONE-002",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with exceptional sound.",
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.6,
    badge: "Sale",
    category: "Earphone",
    stock: 60,
    features: ["Industry-leading ANC", "30-hour Battery", "Multipoint Connection", "Crystal Clear Calls", "Touch Controls"],
    variants: [
      { color: "Black", colorCode: "#1f2937" },
      { color: "Silver", colorCode: "#e5e7eb" },
    ],
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&h=500&fit=crop",
  },
  {
    productId: "IPAD-001",
    name: "iPad Pro 12.9-inch M2",
    description: "Ultimate iPad experience with ProMotion, True Tone, and M2 chip.",
    price: 1099.99,
    originalPrice: 1199.99,
    rating: 4.8,
    badge: null,
    category: "iPad",
    stock: 40,
    features: ["M2 Chip", "12.9-inch Liquid Retina XDR", "ProMotion Technology", "Apple Pencil Hover", "Thunderbolt/USB 4"],
    variants: [
      { color: "Space Gray", colorCode: "#4b5563" },
      { color: "Silver", colorCode: "#e5e7eb" },
    ],
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
  },
  {
    productId: "IPAD-002",
    name: "iPad Air 5th Gen",
    description: "Powerful and versatile with M1 chip in stunning colors.",
    price: 599.99,
    originalPrice: 699.99,
    rating: 4.6,
    badge: "New",
    category: "iPad",
    stock: 55,
    features: ["M1 Chip", "10.9-inch Liquid Retina", "5G Capable", "Center Stage", "USB-C"],
    variants: [
      { color: "Space Gray", colorCode: "#4b5563" },
      { color: "Starlight", colorCode: "#f5f5f4" },
      { color: "Blue", colorCode: "#3b82f6" },
      { color: "Pink", colorCode: "#ec4899" },
      { color: "Purple", colorCode: "#a855f7" },
    ],
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
  },
  {
    productId: "ACCESS-001",
    name: "Apple Pencil Pro",
    description: "Advanced pencil with haptic feedback and barrel roll.",
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.7,
    badge: null,
    category: "Accessories",
    stock: 80,
    features: ["Haptic Feedback", "Barrel Roll", "Hover", "Double Tap", "Find My Support"],
    variants: [
      { color: "White", colorCode: "#f9fafb" },
    ],
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=500&h=500&fit=crop",
  },
  {
    productId: "ACCESS-002",
    name: "Magic Keyboard for iPad",
    description: "Backlit keyboard with trackpad and floating design.",
    price: 299.99,
    originalPrice: 349.99,
    rating: 4.5,
    badge: "Sale",
    category: "Accessories",
    stock: 45,
    features: ["Backlit Keys", "Trackpad", "Floating Design", "USB-C Pass-through", "Scissor Mechanism"],
    variants: [
      { color: "White", colorCode: "#f9fafb" },
      { color: "Black", colorCode: "#1f2937" },
    ],
    image: "https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&h=500&fit=crop",
  },
  {
    productId: "ACCESS-003",
    name: "AirTag 4-Pack",
    description: "Keep track of your items with precision finding.",
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.4,
    badge: null,
    category: "Accessories",
    stock: 120,
    features: ["Precision Finding", "Find My Network", "Replaceable Battery", "Water Resistant", "Privacy Built-in"],
    variants: [
      { color: "White", colorCode: "#f9fafb" },
    ],
    image: "https://images.unsplash.com/photo-1587826537324-9fc7e1c20560?w=500&h=500&fit=crop",
  },
  {
    productId: "ACCESS-004",
    name: "MagSafe Charger",
    description: "Wireless charging made effortless with perfect alignment.",
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.6,
    badge: "Popular",
    category: "Accessories",
    stock: 200,
    features: ["MagSafe Technology", "15W Fast Charging", "LED Indicator", "USB-C Cable Included", "Compatible with iPhone"],
    variants: [
      { color: "White", colorCode: "#f9fafb" },
    ],
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&h=500&fit=crop",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    for (const product of TECH_PRODUCTS) {
      await Product.create(product);
    }
    console.log(`Seeded ${TECH_PRODUCTS.length} tech products with colors`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    await User.findOneAndUpdate(
      { email: "admin@example.com" },
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
      },
      { upsert: true, new: true }
    );
    console.log("Created admin user (admin@example.com / password123)");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
