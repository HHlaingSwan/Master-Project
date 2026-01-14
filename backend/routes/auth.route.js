import { Router } from "express";
import {
  login,
  logout,
  register,
  updateNameAndEmail,
  changePassword,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";
import authorize from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/log-in", login);

authRouter.post("/log-out", logout);

authRouter.put("/update", authorize, updateNameAndEmail);

authRouter.put("/change-password", authorize, changePassword);

authRouter.post("/forgot-password", forgotPassword);

authRouter.post("/reset-password", resetPassword);

export default authRouter;
