const { User, Product, Category, Order, OrderItem } = require("../models");
const { sequelize } = require("../config/db");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
  getPagination,
  getPaginationData,
} = require("../utils/helpers");

//* User Management

// Gets all registered users with pagination
// Excludes sensitive info like passwords
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    const { count, rows: users } = await User.findAndCountAll({
      attributes: { exclude: ["password"] },
      limit: limitValue,
      offset,
      order: [["created_at", "DESC"]],
    });

    const formattedUsers = users.map((user) => formatModelResponse(user));
    const paginationData = getPaginationData(count, page, limitValue);

    res.status(200).json(
      successResponse("Users retrieved successfully", {
        users: formattedUsers,
        pagination: paginationData,
      })
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json(errorResponse("Failed to retrieve users"));
  }
};

// Updates a user's information
// Allows changing personal info and admin status
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, address, phone, is_admin } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    // Update fields if provided
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (address) user.address = address;
    if (phone) user.phone = phone;
    if (typeof is_admin === "boolean") user.is_admin = is_admin;

    await user.save();

    res.status(200).json(
      successResponse("User updated successfully", {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        address: user.address,
        phone: user.phone,
        isAdmin: user.is_admin,
      })
    );
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json(errorResponse("Failed to update user"));
  }
};

// Deletes a user account
// Prevents admins from deleting their own account
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    // Don't allow deleting your own account
    if (parseInt(id) === req.user.user_id) {
      return res
        .status(400)
        .json(errorResponse("Cannot delete your own account"));
    }

    await user.destroy();

    res.status(200).json(successResponse("User deleted successfully"));
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json(errorResponse("Failed to delete user"));
  }
};

//* Product Management

// Creates a new product in the database
// Validates required fields and category existence
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      category_id,
      image_url,
      weight,
      weight_unit,
      ingredients,
      featured,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !stock_quantity || !category_id) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Name, description, price, stock quantity, and category are required"
          )
        );
    }

    // Check if category exists
    const category = await Category.findByPk(category_id);
    if (!category) {
      return res.status(404).json(errorResponse("Category not found"));
    }

    // Create product
    const product = await Product.create({
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      category_id,
      image_url,
      weight,
      weight_unit,
      ingredients,
      featured: featured || false,
    });

    res
      .status(201)
      .json(
        successResponse(
          "Product created successfully",
          formatModelResponse(product)
        )
      );
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json(errorResponse("Failed to create product"));
  }
};

// Updates an existing product's information
// Allows partial updates to any product field
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discount_price,
      stock_quantity,
      category_id,
      image_url,
      weight,
      weight_unit,
      ingredients,
      featured,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Check if category exists if provided
    if (category_id) {
      const category = await Category.findByPk(category_id);
      if (!category) {
        return res.status(404).json(errorResponse("Category not found"));
      }
    }

    // Update fields if provided
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (discount_price !== undefined) product.discount_price = discount_price;
    if (stock_quantity !== undefined) product.stock_quantity = stock_quantity;
    if (category_id) product.category_id = category_id;
    if (image_url) product.image_url = image_url;
    if (weight) product.weight = weight;
    if (weight_unit) product.weight_unit = weight_unit;
    if (ingredients) product.ingredients = ingredients;
    if (featured !== undefined) product.featured = featured;

    await product.save();

    res
      .status(200)
      .json(
        successResponse(
          "Product updated successfully",
          formatModelResponse(product)
        )
      );
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json(errorResponse("Failed to update product"));
  }
};

// Removes a product from the database
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    await product.destroy();

    res.status(200).json(successResponse("Product deleted successfully"));
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json(errorResponse("Failed to delete product"));
  }
};

// Order Management

// Gets all orders with optional status filtering
// Includes basic user info with each order
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    // Build query conditions
    const whereConditions = {};
    if (status) {
      whereConditions.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email"],
        },
      ],
      limit: limitValue,
      offset,
      order: [["created_at", "DESC"]],
      distinct: true,
    });

    const formattedOrders = orders.map((order) => formatModelResponse(order));
    const paginationData = getPaginationData(count, page, limitValue);

    res.status(200).json(
      successResponse("Orders retrieved successfully", {
        orders: formattedOrders,
        pagination: paginationData,
      })
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json(errorResponse("Failed to retrieve orders"));
  }
};

// Updates an order's status and tracking info
// Validates status values against allowed statuses
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, tracking_number } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json(errorResponse("Order not found"));
    }

    // Validate status
    const validStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (status && !validStatuses.includes(status)) {
      return res
        .status(400)
        .json(
          errorResponse(
            `Invalid status. Must be one of: ${validStatuses.join(", ")}`
          )
        );
    }

    // Update fields
    if (status) order.status = status;
    if (tracking_number) order.tracking_number = tracking_number;

    await order.save();

    res
      .status(200)
      .json(
        successResponse(
          "Order status updated successfully",
          formatModelResponse(order)
        )
      );
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json(errorResponse("Failed to update order status"));
  }
};

// Category Management

// Creates a new product category
// Only requires a name, description and image are optional
const createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;

    if (!name) {
      return res.status(400).json(errorResponse("Category name is required"));
    }

    const category = await Category.create({
      name,
      description,
      image_url,
    });

    res
      .status(201)
      .json(
        successResponse(
          "Category created successfully",
          formatModelResponse(category)
        )
      );
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json(errorResponse("Failed to create category"));
  }
};

// Updates an existing category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json(errorResponse("Category not found"));
    }

    // Update fields if provided
    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (image_url) category.image_url = image_url;

    await category.save();

    res
      .status(200)
      .json(
        successResponse(
          "Category updated successfully",
          formatModelResponse(category)
        )
      );
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json(errorResponse("Failed to update category"));
  }
};

// Deletes a category if no products are using it
// Prevents accidental removal of categories in use
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if any products are using this category
    const productsCount = await Product.count({ where: { category_id: id } });
    if (productsCount > 0) {
      return res
        .status(400)
        .json(
          errorResponse(
            `Cannot delete category. ${productsCount} products are using this category.`
          )
        );
    }

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json(errorResponse("Category not found"));
    }

    await category.destroy();

    res.status(200).json(successResponse("Category deleted successfully"));
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json(errorResponse("Failed to delete category"));
  }
};

// Dashboard Statistics

// Gets statistics for the admin dashboard
// Includes counts, sales data, and low stock warnings
const getDashboardStats = async (req, res) => {
  try {
    // Get total users count
    const usersCount = await User.count();

    // Get total products count
    const productsCount = await Product.count();

    // Get total orders and revenue
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum("total_amount", {
      where: { status: { [sequelize.Op.ne]: "cancelled" } },
    });

    // Get low stock products (less than 10 items)
    const lowStockProducts = await Product.findAll({
      where: { stock_quantity: { [sequelize.Op.lt]: 10 } },
      include: [Category],
      limit: 10,
    });

    // Get recent orders
    const recentOrders = await Order.findAll({
      include: [
        {
          model: User,
          attributes: ["user_id", "first_name", "last_name", "email"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: 5,
    });

    // Get order counts by status
    const ordersByStatus = await Order.findAll({
      attributes: [
        "status",
        [sequelize.fn("COUNT", sequelize.col("order_id")), "count"],
      ],
      group: ["status"],
    });

    const statusCounts = {};
    ordersByStatus.forEach((item) => {
      statusCounts[item.status] = parseInt(item.getDataValue("count"));
    });

    res.status(200).json(
      successResponse("Dashboard statistics retrieved successfully", {
        users: {
          total: usersCount,
        },
        products: {
          total: productsCount,
          lowStock: lowStockProducts.map((product) =>
            formatModelResponse(product)
          ),
        },
        orders: {
          total: totalOrders,
          byStatus: statusCounts,
          recent: recentOrders.map((order) => formatModelResponse(order)),
        },
        revenue: {
          total: parseFloat(totalRevenue || 0),
        },
      })
    );
  } catch (error) {
    console.error("Error getting dashboard statistics:", error);
    res
      .status(500)
      .json(errorResponse("Failed to retrieve dashboard statistics"));
  }
};

// GET /api/admin/users
// PUT /api/admin/users/:id
// DELETE /api/admin/users/:id

// POST /api/admin/products
// PUT /api/admin/products/:id
// DELETE /api/admin/products/:id

// GET /api/admin/orders
// PUT /api/admin/orders/:id

// POST /api/admin/categories
// PUT /api/admin/categories/:id
// DELETE /api/admin/categories/:id

// GET /api/admin/dashboard

module.exports = {
  // User management
  getAllUsers,
  updateUser,
  deleteUser,

  // Product management
  createProduct,
  updateProduct,
  deleteProduct,

  // Order management
  getAllOrders,
  updateOrderStatus,

  // Category management
  createCategory,
  updateCategory,
  deleteCategory,

  // Dashboard
  getDashboardStats,
};
