import express from "express";
import { CLIENT_URL, PORT } from "./config/env.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import uploadRouter from "./routes/upload.route.js";
import analyticsRouter from "./routes/analytics.route.js";
import orderRouter from "./routes/order.route.js";
import connectDB from "./database/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Use routes
app.use("/api", authRouter);
app.use("/api", productRouter);
app.use("/api", uploadRouter);
app.use("/api/users", userRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/orders", orderRouter);

// Health check endpoint
app.use("/health", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});

export default app;
