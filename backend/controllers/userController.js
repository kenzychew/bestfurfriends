const { User, Order } = require("../models");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
} = require("../utils/helpers");
const bcrypt = require("bcryptjs");

//* User profile management
// Get current user profile
// GET /api/users/profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    res
      .status(200)
      .json(
        successResponse(
          "User profile retrieved successfully",
          formatModelResponse(user)
        )
      );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json(errorResponse("Failed to retrieve user profile"));
  }
};

// Update user profile
// PUT /api/users/profile
const updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, address, phone, password } = req.body;
    const userId = req.user.user_id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    // Update fields if provided
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    // If password is provided, hash it before saving
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    res.status(200).json(
      successResponse("Profile updated successfully", {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        address: user.address,
        phone: user.phone,
      })
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json(errorResponse("Failed to update profile"));
  }
};

// Get user's order history
// GET /api/users/orders
const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.user_id },
      order: [["created_at", "DESC"]],
      include: [
        {
          association: "OrderItems",
          include: ["Product"],
        },
      ],
    });

    const formattedOrders = orders.map((order) => formatModelResponse(order));

    res
      .status(200)
      .json(
        successResponse("Order history retrieved successfully", formattedOrders)
      );
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json(errorResponse("Failed to retrieve order history"));
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getOrderHistory,
};
