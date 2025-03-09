const { Order, OrderItem, Product, CartItem } = require("../models");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
} = require("../utils/helpers");
const { sequelize } = require("../config/db");
// Kept the Stripe import for future use, commented out for now
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

//* Order Processing
// Creates a new order with items from cart or directly provided items
// Uses a database transaction to ensure data consistency
// Updates product stock levels and clears cart when successful
// POST /api/orders
const createOrder = async (req, res) => {
  // Start a transaction to ensure all database operations succeed or fail together
  const transaction = await sequelize.transaction();

  try {
    const {
      shipping_address,
      billing_address,
      payment_method,
      items = [],
      // Remove payment_intent_id since we're not using Stripe for now
    } = req.body;
    const userId = req.user.user_id;

    // Validate required fields
    if (!shipping_address || !billing_address || !payment_method) {
      return res
        .status(400)
        .json(
          errorResponse(
            "Shipping address, billing address, and payment method are required"
          )
        );
    }

    let orderItems = [];
    let totalAmount = 0;

    // If items are provided directly, use them
    if (items.length > 0) {
      // Validate items format
      for (const item of items) {
        if (!item.product_id || !item.quantity) {
          await transaction.rollback();
          return res
            .status(400)
            .json(
              errorResponse("Each item must include product_id and quantity")
            );
        }

        // Get product details to calculate price
        const product = await Product.findByPk(item.product_id);
        if (!product) {
          await transaction.rollback();
          return res
            .status(404)
            .json(
              errorResponse(`Product with ID ${item.product_id} not found`)
            );
        }

        // Check stock availability
        if (product.stock_quantity < item.quantity) {
          await transaction.rollback();
          return res
            .status(400)
            .json(
              errorResponse(
                `Not enough stock for ${product.name}. Only ${product.stock_quantity} available.`
              )
            );
        }

        // Use discount price if available
        const price = product.discount_price || product.price;
        const subtotal = price * item.quantity;

        orderItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: parseFloat(price),
          subtotal: parseFloat(subtotal),
        });

        totalAmount += subtotal;

        // Update product stock
        product.stock_quantity -= item.quantity;
        await product.save({ transaction });
      }
    } else {
      // If no items provided, use items from the user's cart
      const cartItems = await CartItem.findAll({
        where: { user_id: userId },
        include: [Product],
        transaction,
      });

      if (cartItems.length === 0) {
        await transaction.rollback();
        return res.status(400).json(errorResponse("Cart is empty"));
      }

      // Process each cart item
      for (const cartItem of cartItems) {
        const product = cartItem.Product;

        // Check stock availability
        if (product.stock_quantity < cartItem.quantity) {
          await transaction.rollback();
          return res
            .status(400)
            .json(
              errorResponse(
                `Not enough stock for ${product.name}. Only ${product.stock_quantity} available.`
              )
            );
        }

        // Use discount price if available
        const price = product.discount_price || product.price;
        const subtotal = price * cartItem.quantity;

        orderItems.push({
          product_id: product.product_id,
          quantity: cartItem.quantity,
          price: parseFloat(price),
          subtotal: parseFloat(subtotal),
        });

        totalAmount += subtotal;

        // Update product stock
        product.stock_quantity -= cartItem.quantity;
        await product.save({ transaction });
      }
    }

    // Round total amount to 2 decimal places
    totalAmount = parseFloat(totalAmount.toFixed(2));

    // Create the order - set status to "confirmed" for the simplified flow
    const order = await Order.create(
      {
        user_id: userId,
        total_amount: totalAmount,
        shipping_address,
        billing_address,
        payment_method,
        status: "confirmed", // Changed from "pending" to "confirmed" for simplified checkout
      },
      { transaction }
    );

    // Create order items
    for (const item of orderItems) {
      await OrderItem.create(
        {
          order_id: order.order_id,
          ...item,
        },
        { transaction }
      );
    }

    // Remove Stripe payment processing code
    // When reimplementing payment later, we'll set status to "pending_payment"
    // and only change to "confirmed" after successful payment

    // Clear the user's cart if items weren't explicitly provided
    if (items.length === 0) {
      await CartItem.destroy({
        where: { user_id: userId },
        transaction,
      });
    }

    // Commit the transaction
    await transaction.commit();

    // Get the complete order with items
    const completeOrder = await Order.findByPk(order.order_id, {
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    });

    res
      .status(201)
      .json(
        successResponse(
          "Order created successfully",
          formatModelResponse(completeOrder)
        )
      );
  } catch (error) {
    // Rollback the transaction if anything fails
    await transaction.rollback();
    console.error("Error creating order:", error);
    res.status(500).json(errorResponse("Failed to create order"));
  }
};

// Gets order details by ID
// Only returns orders that belong to the requesting user (unless admin)
// Includes related order items and product information
// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const order = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          include: [
            {
              model: Product,
              attributes: ["product_id", "name", "image_url"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json(errorResponse("Order not found"));
    }

    // Check if user is authorized to view this order
    if (order.user_id !== userId && !req.user.is_admin) {
      return res
        .status(403)
        .json(errorResponse("Not authorized to view this order"));
    }

    res
      .status(200)
      .json(
        successResponse(
          "Order retrieved successfully",
          formatModelResponse(order)
        )
      );
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json(errorResponse("Failed to retrieve order"));
  }
};

// Confirms an order after payment has been processed
// This will be used when payment processing is implemented later
// PUT /api/orders/:id/confirm
const confirmOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    // Find the order
    const order = await Order.findOne({
      where: {
        order_id: id,
        user_id: userId,
      },
    });

    if (!order) {
      return res.status(404).json(errorResponse("Order not found"));
    }

    // Only orders with status "pending_payment" can be confirmed
    if (order.status !== "pending_payment") {
      return res
        .status(400)
        .json(
          errorResponse(
            "Only orders with pending payment status can be confirmed"
          )
        );
    }

    // Update the order status
    order.status = "confirmed";
    await order.save();

    res
      .status(200)
      .json(
        successResponse(
          "Order confirmed successfully",
          formatModelResponse(order)
        )
      );
  } catch (error) {
    console.error("Error confirming order:", error);
    res.status(500).json(errorResponse("Failed to confirm order"));
  }
};

// Gets all orders for the current user
// Includes pagination with limit and offset
// GET /api/orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { limit = 10, offset = 0, status } = req.query;

    // Prepare query options
    const options = {
      where: { user_id: userId },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["created_at", "DESC"]],
      include: [
        {
          model: OrderItem,
          include: [Product],
        },
      ],
    };

    // Add status filter if provided
    if (status) {
      options.where.status = status;
    }

    // Get orders
    const orders = await Order.findAll(options);

    // Count total orders for pagination
    const totalOrders = await Order.count({
      where: options.where,
    });

    res.status(200).json(
      successResponse("Orders retrieved successfully", {
        orders: orders.map((order) => formatModelResponse(order)),
        pagination: {
          total: totalOrders,
          limit: parseInt(limit),
          offset: parseInt(offset),
        },
      })
    );
  } catch (error) {
    console.error("Error retrieving user orders:", error);
    res.status(500).json(errorResponse("Failed to retrieve orders"));
  }
};

// Cancels an order by ID
// Only cancels orders in 'pending' or 'processing' status
// Restores stock quantities for all order items
// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  // Start a transaction
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const order = await Order.findByPk(id, {
      include: [OrderItem],
      transaction,
    });

    if (!order) {
      await transaction.rollback();
      return res.status(404).json(errorResponse("Order not found"));
    }

    // Check if user is authorized to cancel this order
    if (order.user_id !== userId && !req.user.is_admin) {
      await transaction.rollback();
      return res
        .status(403)
        .json(errorResponse("Not authorized to cancel this order"));
    }

    // Check if order can be cancelled (only pending or processing orders)
    if (!["pending", "processing"].includes(order.status)) {
      await transaction.rollback();
      return res
        .status(400)
        .json(errorResponse(`Cannot cancel order in ${order.status} status`));
    }

    // Update order status
    order.status = "cancelled";
    await order.save({ transaction });

    // Restore product stock
    for (const item of order.OrderItems) {
      const product = await Product.findByPk(item.product_id, { transaction });
      if (product) {
        product.stock_quantity += item.quantity;
        await product.save({ transaction });
      }
    }

    // If payment was processed with Stripe, handle refund here

    // Commit transaction
    await transaction.commit();

    res
      .status(200)
      .json(
        successResponse(
          "Order cancelled successfully",
          formatModelResponse(order)
        )
      );
  } catch (error) {
    await transaction.rollback();
    console.error("Error cancelling order:", error);
    res.status(500).json(errorResponse("Failed to cancel order"));
  }
};

module.exports = {
  createOrder,
  getOrderById,
  cancelOrder,
  confirmOrder,
  getUserOrders,
};
