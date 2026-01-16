import Product from "../model/product.model.js";

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

    const stats = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          inStock: {
            $sum: { $cond: [{ $gt: ["$stock", 0] }, 1, 0] },
          },
          outOfStock: {
            $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] },
          },
          totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
        },
      },
    ]);

    const productStats = stats[0] || {
      totalProducts: 0,
      inStock: 0,
      outOfStock: 0,
      totalValue: 0,
    };

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
      stats: {
        totalProducts: productStats.totalProducts,
        inStock: productStats.inStock,
        outOfStock: productStats.outOfStock,
        totalValue: productStats.totalValue,
      },
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

    if (!image || typeof image !== "string" || image.trim() === "") {
      return res.status(400).send({ message: "Valid image URL is required" });
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
    const { image, variants, sizes, ...rest } = req.body;

    const product = await Product.findOne({ productId: id });
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    if (image !== undefined) {
      if (image === "") {
        product.image = "";
      } else if (typeof image === "string" && image.trim().length > 0) {
        product.image = image;
      }
    }

    if (variants !== undefined) {
      product.variants = variants;
    }

    if (sizes !== undefined) {
      product.sizes = sizes;
    }

    Object.keys(rest).forEach((key) => {
      if (rest[key] !== undefined) {
        product[key] = rest[key];
      }
    });

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
