import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/upload.controller.js";
import authorize from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const uploadRouter = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
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
  upload.single("image"),
  uploadImage
);

export default uploadRouter;
