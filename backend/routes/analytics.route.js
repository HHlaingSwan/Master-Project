import { Router } from "express";
import { getAnalytics } from "../controllers/analytics.controller.js";
import authorize from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";

const analyticsRouter = Router();
analyticsRouter.use(arcjetMiddleware);
analyticsRouter.use(authorize);
analyticsRouter.get("/", getAnalytics);

export default analyticsRouter;
