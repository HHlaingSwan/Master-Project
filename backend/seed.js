import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/product.model.js";
import { MONGODB_URI } from "./config/env.js";

dotenv.config();

const products = [
  {
    productId: "WATCH001",
    name: "Apple Watch Series 9",
    description: "The most advanced Apple Watch yet with a brighter display, faster performance, and new health features.",
    price: 399.99,
    originalPrice: 429.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=800&fit=crop",
    badge: "Sale",
    category: "Watch",
    stock: 50,
    features: [
      "Always-On Retina display",
      "S9 SiP chip",
      "Double tap gesture",
      "Blood oxygen app",
      "ECG app"
    ]
  },
  {
    productId: "WATCH002",
    name: "Samsung Galaxy Watch 6",
    description: "Advanced sleep coaching and body composition for better wellness insights.",
    price: 299.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop",
    badge: "New",
    category: "Watch",
    stock: 35,
    features: [
      "Bigger AMOLED display",
      "Sleep coaching",
      "Body composition",
      "Heart rate monitor",
      "GPS tracking"
    ]
  },
  {
    productId: "MAC001",
    name: "MacBook Air M3",
    description: "Incredibly thin and light laptop with M3 chip for exceptional performance.",
    price: 1099.99,
    originalPrice: 1199.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=800&h=800&fit=crop",
    badge: "Sale",
    category: "Mac",
    stock: 25,
    features: [
      "M3 chip",
      "13.6-inch Liquid Retina display",
      "Up to 18 hours battery life",
      "Thin and light design",
      "MagSafe charging"
    ]
  },
  {
    productId: "MAC002",
    name: "iMac 24-inch M3",
    description: "The all-in-one desktop for work and play with a stunning 4.5K Retina display.",
    price: 1499.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1504221507738-5249c3f5488e?w=800&h=800&fit=crop",
    category: "Mac",
    stock: 15,
    features: [
      "M3 chip",
      "4.5K Retina display",
      "7 vibrant colors",
      "1080p FaceTime HD camera",
      "Six-speaker sound system"
    ]
  },
  {
    productId: "PHONE001",
    name: "iPhone 15 Pro Max",
    description: "The first iPhone with an aerospace-grade titanium design and A17 Pro chip.",
    price: 1199.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop",
    badge: "Popular",
    category: "Phone",
    stock: 100,
    features: [
      "Titanium design",
      "A17 Pro chip",
      "5x optical zoom",
      "Action button",
      "USB-C connector"
    ]
  },
  {
    productId: "PHONE002",
    name: "Samsung Galaxy S24 Ultra",
    description: "Experience the new era of mobile AI with Galaxy S24 Ultra.",
    price: 1299.99,
    originalPrice: 1399.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1610945265078-38587e1f1460?w=800&h=800&fit=crop",
    badge: "Sale",
    category: "Phone",
    stock: 75,
    features: [
      "Galaxy AI",
      "200MP camera",
      "Titanium frame",
      "S Pen included",
      "All-day battery"
    ]
  },
  {
    productId: "EARPHONE001",
    name: "AirPods Pro 2nd Gen",
    description: "Active noise cancellation, adaptive transparency, and personalized spatial audio.",
    price: 249.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=800&fit=crop",
    category: "Earphone",
    stock: 200,
    features: [
      "Active Noise Cancellation",
      "Adaptive Transparency",
      "Personalized Spatial Audio",
      "MagSafe charging case",
      "H2 chip"
    ]
  },
  {
    productId: "EARPHONE002",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation with exceptional sound quality.",
    price: 349.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=800&fit=crop",
    badge: "Popular",
    category: "Earphone",
    stock: 60,
    features: [
      "Industry-leading ANC",
      "30-hour battery",
      "Multipoint connection",
      "Crystal clear calls",
      "Ultra-comfortable"
    ]
  },
  {
    productId: "IPAD001",
    name: "iPad Pro M4",
    description: "Supercharged by M4 chip with stunning Ultra Retina XDR display.",
    price: 999.99,
    originalPrice: 1099.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=800&fit=crop",
    badge: "Sale",
    category: "iPad",
    stock: 40,
    features: [
      "M4 chip",
      "Ultra Retina XDR display",
      "Apple Pencil Pro support",
      "Thunderbolt/USB 4",
      "Face ID"
    ]
  },
  {
    productId: "IPAD002",
    name: "iPad Air 11-inch",
    description: "Incredibly powerful and versatile with M2 chip in an ultra-portable design.",
    price: 599.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1592840496011-a5202e19663c?w=800&h=800&fit=crop",
    category: "iPad",
    stock: 55,
    features: [
      "M2 chip",
      "11-inch Liquid Retina display",
      "Apple Pencil hover",
      "Landscape front camera",
      "Wi-Fi 6E"
    ]
  },
  {
    productId: "ACC001",
    name: "Apple 65W USB-C Charger",
    description: "Fast, efficient charging for all your USB-C devices.",
    price: 69.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
    category: "Accessories",
    stock: 300,
    features: [
      "65W power delivery",
      "Compact design",
      "GaN technology",
      "USB-C compatible",
      "Fast charging"
    ]
  },
  {
    productId: "ACC002",
    name: "Belkin 3-in-1 Wireless Charger",
    description: "Charge your iPhone, Apple Watch, and AirPods simultaneously.",
    price: 129.99,
    originalPrice: 149.99,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1586816879360-004f5b0c51e5?w=800&h=800&fit=crop",
    badge: "Sale",
    category: "Accessories",
    stock: 80,
    features: [
      "3-in-1 charging",
      "MagSafe compatible",
      "LED indicator",
      "Premium design",
      "Fast charging"
    ]
  },
  {
    productId: "PHONE003",
    name: "Google Pixel 8 Pro",
    description: "The most advanced Pixel yet with AI-powered features and incredible camera.",
    price: 999.99,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop",
    badge: "New",
    category: "Phone",
    stock: 45,
    features: [
      "Tensor G3 chip",
      "Super Actua display",
      "AI features",
      "7 years of updates",
      "Pro-level camera"
    ]
  },
  {
    productId: "WATCH003",
    name: "Apple Watch Ultra 2",
    description: "The most rugged and capable Apple Watch for adventurers.",
    price: 799.99,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&h=800&fit=crop",
    badge: "Popular",
    category: "Watch",
    stock: 20,
    features: [
      "Titanium case",
      "Precision dual-frequency GPS",
      "36 hours battery",
      "Action button",
      "S depth rating"
    ]
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({});
    console.log("Cleared existing products");

    const insertedProducts = await Product.insertMany(products);
    console.log(`Inserted ${insertedProducts.length} products`);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedProducts();
