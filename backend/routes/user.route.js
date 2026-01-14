import { Router } from "express";
import { getUserById, getUsers, updateUserRole } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";

const userRouter = Router();
userRouter.use(arcjetMiddleware);

userRouter.use(authorize);

userRouter.get("/", getUsers);

userRouter.get("/:id", getUserById);

userRouter.put("/:id/role", updateUserRole);

userRouter.post("/", (req, res) => {
  res.send({ title: "User created successfully" });
});

userRouter.put("/:id", (req, res) => {
  res.send({ title: "User updated successfully" });
});

userRouter.delete("/:id", (req, res) => {
  res.send({ title: "User deleted successfully" });
});

export default userRouter;
