import { Router } from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { authorize, isAdmin } from "../middleware/auth.middleware.js";

const productRouter = Router();

productRouter.get("/products", authorize, getAllProducts);
productRouter.get("/products/:id", authorize, getProductById);
productRouter.post("/products", authorize, isAdmin, createProduct);
productRouter.put("/products/:id", authorize, isAdmin, updateProduct);
productRouter.delete("/products/:id", authorize, isAdmin, deleteProduct);

export default productRouter;
