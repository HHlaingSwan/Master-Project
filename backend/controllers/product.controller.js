import Product from "../model/product.model.js";

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
    const productId = Number(id);
    const product = await Product.findOne({ productId });
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
