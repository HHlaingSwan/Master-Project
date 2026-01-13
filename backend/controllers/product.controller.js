import Product from "../model/product.model.js";
import { CLOUDINARY_CLOUD_NAME } from "../config/env.js";

const isValidCloudinaryUrl = (url) => {
  if (!url) return true;
  const cloudinaryRegex = new RegExp(
    `https://res\\.cloudinary\\.com/${CLOUDINARY_CLOUD_NAME}/image/upload/`,
    "i"
  );
  return cloudinaryRegex.test(url);
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).send({ message: "Error fetching products", error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ productId: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    res.status(200).send({
      success: true,
      data: product,
    });
  } catch (error) {
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
      return res.status(409).send({ message: "Product with this ID already exists" });
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

    if (image && !isValidCloudinaryUrl(image)) {
      return res.status(400).send({ message: "Invalid image URL" });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { productId: id },
      { ...updateData, ...(image && { image }) },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
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
