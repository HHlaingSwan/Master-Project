import User from "../model/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query).select("-password").skip(skip).limit(limit);

    res.status(200).send({
      success: true,
      message: "Users retrieved successfully",
      data: users,
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
    res.status(500).send({ message: "Error in getUsers", error });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAdmin } = req.body;

    if (req.user._id.toString() === id && isAdmin === false) {
      return res.status(403).send({
        message: "You cannot remove your own admin privileges",
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isAdmin },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).send({ message: "Error in updateUserRole", error });
  }
};
