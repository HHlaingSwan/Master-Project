import { Router } from "express";
import {
  getAllProducts,
  getProductById,
} from "../controllers/product.controller.js";
import authorize from "../middleware/auth.middleware.js";

const productRouter = Router();
productRouter.use(authorize);

productRouter.get("/products", getAllProducts);
productRouter.get("/products/:id", getProductById);

export default productRouter;
