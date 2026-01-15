import Order from "../model/order.model.js";
import User from "../model/user.model.js";

export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const orderItems = items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      image: item.image,
    }));

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    await order.save();

    res.status(201).send({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({ message: "Error creating order", error });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).send({ message: "Error fetching orders", error });
  }
};

export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "name email");

    res.status(200).send({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).send({ message: "Error fetching orders", error });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("user", "name email");

    const total = await Order.countDocuments(query);

    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = {
      all: await Order.countDocuments(),
      pending: statusCounts.find((s) => s._id === "pending")?.count || 0,
      processing: statusCounts.find((s) => s._id === "processing")?.count || 0,
      shipped: statusCounts.find((s) => s._id === "shipped")?.count || 0,
      delivered: statusCounts.find((s) => s._id === "delivered")?.count || 0,
      cancelled: statusCounts.find((s) => s._id === "cancelled")?.count || 0,
    };

    res.status(200).send({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        hasNextPage: parseInt(page) * parseInt(limit) < total,
        hasPrevPage: parseInt(page) > 1,
      },
      statusCounts: counts,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).send({ message: "Error fetching orders", error });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    const order = await Order.findById(orderId).populate("user", "name email");

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (!isAdmin && order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ message: "Not authorized to view this order" });
    }

    res.status(200).send({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).send({ message: "Error fetching order", error });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).send({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    res.status(200).send({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send({ message: "Error updating order", error });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }

    if (!isAdmin && order.user.toString() !== userId.toString()) {
      return res
        .status(403)
        .send({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .send({ message: "Only pending orders can be cancelled" });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).send({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).send({ message: "Error cancelling order", error });
  }
};
