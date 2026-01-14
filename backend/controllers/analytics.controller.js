import Product from "../model/product.model.js";

export const getAnalytics = async (req, res) => {
  try {
    const products = await Product.find();

    const popularProducts = products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        rating: p.rating || 0,
        sales: Math.floor(Math.random() * 100) + 10,
      }));

    const mostBuyingProducts = products
      .sort((a, b) => (b.stock || 0) - (a.stock || 0))
      .slice(0, 5)
      .map((p) => ({
        name: p.name,
        sold: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 10000) + 1000,
      }));

    res.status(200).send({
      success: true,
      data: {
        popularProducts,
        mostBuyingProducts,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error in getAnalytics", error });
  }
};
