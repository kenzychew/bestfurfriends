const { CartItem, Product } = require("../models");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
} = require("../utils/helpers");

//* Shopping cart functionality
// Gets the current user's shopping cart with product details
// Calculates item totals and cart total price
// GET /api/cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "name",
            "price",
            "discount_price",
            "image_url",
            "stock_quantity",
          ],
        },
      ],
    });

    // Calculate total price
    let totalPrice = 0;
    const formattedItems = cartItems.map((item) => {
      const formattedItem = formatModelResponse(item);
      const product = formattedItem.Product;

      // Use discount price if available, otherwise use regular price
      const priceToUse = product.discount_price || product.price;
      const itemTotal = priceToUse * item.quantity;

      totalPrice += itemTotal;
      formattedItem.item_total = parseFloat(itemTotal.toFixed(2));

      return formattedItem;
    });

    res.status(200).json(
      successResponse("Cart retrieved successfully", {
        items: formattedItems,
        total_price: parseFloat(totalPrice.toFixed(2)),
        item_count: cartItems.length,
      })
    );
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json(errorResponse("Failed to retrieve cart"));
  }
};

// Adds a product to the user's cart
// If item already exists, increases the quantity
// Checks stock availability before adding
// POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const userId = req.user.user_id;

    // Validate quantity
    if (quantity <= 0) {
      return res
        .status(400)
        .json(errorResponse("Quantity must be greater than 0"));
    }

    // Check if product exists and has enough stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    if (product.stock_quantity < quantity) {
      return res
        .status(400)
        .json(
          errorResponse(
            `Not enough stock available. Only ${product.stock_quantity} units left.`
          )
        );
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: { user_id: userId, product_id },
    });

    if (cartItem) {
      // Update quantity if already in cart
      const newQuantity = cartItem.quantity + quantity;

      // Check if the new quantity exceeds available stock
      if (newQuantity > product.stock_quantity) {
        return res
          .status(400)
          .json(
            errorResponse(
              `Cannot add more items. Only ${product.stock_quantity} units available.`
            )
          );
      }

      cartItem.quantity = newQuantity;
      await cartItem.save();
    } else {
      // Add new item to cart
      cartItem = await CartItem.create({
        user_id: userId,
        product_id,
        quantity,
      });
    }

    // Get updated cart with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.cart_item_id, {
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "name",
            "price",
            "discount_price",
            "image_url",
          ],
        },
      ],
    });

    res
      .status(200)
      .json(
        successResponse(
          "Item added to cart successfully",
          formatModelResponse(updatedCartItem)
        )
      );
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json(errorResponse("Failed to add item to cart"));
  }
};

// Updates the quantity of a cart item
// Checks for valid quantity and stock availability
// PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.user_id;

    // Validate quantity
    if (quantity <= 0) {
      return res
        .status(400)
        .json(errorResponse("Quantity must be greater than 0"));
    }

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { cart_item_id: itemId, user_id: userId },
      include: [Product],
    });

    if (!cartItem) {
      return res.status(404).json(errorResponse("Cart item not found"));
    }

    // Check if the new quantity exceeds available stock
    if (quantity > cartItem.Product.stock_quantity) {
      return res
        .status(400)
        .json(
          errorResponse(
            `Cannot add more items. Only ${cartItem.Product.stock_quantity} units available.`
          )
        );
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    // Get updated cart with product details
    const updatedCartItem = await CartItem.findByPk(cartItem.cart_item_id, {
      include: [
        {
          model: Product,
          attributes: [
            "product_id",
            "name",
            "price",
            "discount_price",
            "image_url",
          ],
        },
      ],
    });

    res
      .status(200)
      .json(
        successResponse(
          "Cart item updated successfully",
          formatModelResponse(updatedCartItem)
        )
      );
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json(errorResponse("Failed to update cart item"));
  }
};

// Removes a specific item from the cart
// DELETE /api/cart/:itemId
const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.user_id;

    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { cart_item_id: itemId, user_id: userId },
    });

    if (!cartItem) {
      return res.status(404).json(errorResponse("Cart item not found"));
    }

    // Delete the item
    await cartItem.destroy();

    res
      .status(200)
      .json(successResponse("Item removed from cart successfully"));
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json(errorResponse("Failed to remove item from cart"));
  }
};

// Removes all items from the cart (empty cart)
// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Delete all items in the user's cart
    await CartItem.destroy({
      where: { user_id: userId },
    });

    res.status(200).json(successResponse("Cart cleared successfully"));
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json(errorResponse("Failed to clear cart"));
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
