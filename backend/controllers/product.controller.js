import Product from "../model/product.model.js";
import { CLOUDINARY_CLOUD_NAME } from "../config/env.js";

const isValidCloudinaryUrl = (url) => {
  if (!url || url.trim() === "") return true;
  const cloudinaryRegex =
    /https:\/\/[a-z0-9]+\.cloudinary\.com\/image\/upload\//i;
  return cloudinaryRegex.test(url);
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;

    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(limit);

    res.status(200).send({
      success: true,
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching products", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching product:", id);
    const product = await Product.findOne({ productId: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).send({ message: "Error fetching product", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      productId,
      name,
      description,
      price,
      originalPrice,
      rating,
      image,
      badge,
      category,
      stock,
      features,
      variants,
      sizes,
    } = req.body;

    if (!isValidCloudinaryUrl(image)) {
      return res.status(400).send({ message: "Invalid image URL" });
    }

    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res
        .status(409)
        .send({ message: "Product with this ID already exists" });
    }

    const newProduct = new Product({
      productId,
      name,
      description,
      price,
      originalPrice,
      rating,
      image,
      badge,
      category,
      stock,
      features,
      variants,
      sizes,
    });

    await newProduct.save();

    res.status(201).send({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).send({ message: "Error creating product", error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { image, ...updateData } = req.body;

    const product = await Product.findOne({ productId: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (image !== undefined) {
      if (image === "") {
        product.image = "";
      } else if (image.trim() !== "" && isValidCloudinaryUrl(image)) {
        product.image = image;
      }
    }

    Object.assign(product, updateData);
    await product.save({ runValidators: false });

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ message: "Error updating product", error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findOneAndDelete({ productId: id });

    if (!deletedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).send({ message: "Error deleting product", error });
  }
};
