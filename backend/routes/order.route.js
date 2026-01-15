import { Router } from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/order.controller.js";
import { authorize, isAdmin } from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";

const orderRouter = Router();
orderRouter.use(arcjetMiddleware);

orderRouter.post("/", authorize, createOrder);

orderRouter.get("/", authorize, getUserOrders);

orderRouter.get("/all", authorize, isAdmin, getAllOrders);

orderRouter.get("/user/:userId", authorize, isAdmin, getOrdersByUserId);

orderRouter.get("/:id", authorize, getOrderById);

orderRouter.put("/:id/status", authorize, isAdmin, updateOrderStatus);

orderRouter.put("/:id/cancel", authorize, cancelOrder);

export default orderRouter;
