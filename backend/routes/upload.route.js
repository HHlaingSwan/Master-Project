import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import arcjetMiddleware from "../middleware/arcjet.middleware.js";

const uploadRouter = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 7 * 1024 * 1024, // 7MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

uploadRouter.post(
  "/upload",
  authorize,
  isAdmin,
  arcjetMiddleware,
  upload.single("image"),
  uploadImage
);

export default uploadRouter;
