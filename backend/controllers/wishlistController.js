const { WishlistItem, Product, Category } = require("../models");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
} = require("../utils/helpers");

// Get user's wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const wishlistItems = await WishlistItem.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          include: [Category],
        },
      ],
    });

    const formattedItems = wishlistItems.map((item) =>
      formatModelResponse(item)
    );

    res
      .status(200)
      .json(successResponse("Wishlist retrieved successfully", formattedItems));
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json(errorResponse("Failed to retrieve wishlist"));
  }
};

// Add item to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { product_id } = req.body;
    const userId = req.user.user_id;

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json(errorResponse("Product not found"));
    }

    // Check if item already exists in wishlist
    const existingItem = await WishlistItem.findOne({
      where: { user_id: userId, product_id },
    });

    if (existingItem) {
      return res.status(400).json(errorResponse("Item already in wishlist"));
    }

    // Add to wishlist
    const wishlistItem = await WishlistItem.create({
      user_id: userId,
      product_id,
    });

    // Get the item with product details
    const savedItem = await WishlistItem.findByPk(
      wishlistItem.wishlist_item_id,
      {
        include: [
          {
            model: Product,
            include: [Category],
          },
        ],
      }
    );

    res
      .status(201)
      .json(
        successResponse(
          "Item added to wishlist successfully",
          formatModelResponse(savedItem)
        )
      );
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json(errorResponse("Failed to add item to wishlist"));
  }
};

// Remove item from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.user_id;

    // Find wishlist item
    const wishlistItem = await WishlistItem.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (!wishlistItem) {
      return res.status(404).json(errorResponse("Item not found in wishlist"));
    }

    // Remove from wishlist
    await wishlistItem.destroy();

    res
      .status(200)
      .json(successResponse("Item removed from wishlist successfully"));
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    res.status(500).json(errorResponse("Failed to remove item from wishlist"));
  }
};

// GET /api/wishlist
// POST /api/wishlist
// DELETE /api/wishlist/:productId
module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

