const { Category, Product, Review } = require("../models");
const {
  successResponse,
  errorResponse,
  formatModelResponse,
  getPagination,
  getPaginationData,
} = require("../utils/helpers");

//* Category management
// Get all product categories
// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();

    const formattedCategories = categories.map((category) =>
      formatModelResponse(category)
    );

    res
      .status(200)
      .json(
        successResponse(
          "Categories retrieved successfully",
          formattedCategories
        )
      );
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json(errorResponse("Failed to retrieve categories"));
  }
};

// Get a single category by ID
// GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json(errorResponse("Category not found"));
    }

    res
      .status(200)
      .json(
        successResponse(
          "Category retrieved successfully",
          formatModelResponse(category)
        )
      );
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json(errorResponse("Failed to retrieve category"));
  }
};

// Get all products in a category
// GET /api/categories/:id/products
const getCategoryProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);

    // Check if category exists
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json(errorResponse("Category not found"));
    }

    // Get products in this category
    const { count, rows: products } = await Product.findAndCountAll({
      where: { category_id: id },
      include: [
        {
          model: Review,
          attributes: ["rating"],
          required: false,
        },
      ],
      limit: limitValue,
      offset,
      distinct: true,
    });

    // Calculate average rating for each product
    const productsWithRating = products.map((product) => {
      const productData = formatModelResponse(product);

      // Calculate average rating
      const reviews = product.Reviews || [];
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        );
        productData.average_rating = totalRating / reviews.length;
      } else {
        productData.average_rating = 0;
      }

      productData.review_count = reviews.length;

      return productData;
    });

    const paginationData = getPaginationData(count, page, limitValue);

    res.status(200).json(
      successResponse("Category products retrieved successfully", {
        category: formatModelResponse(category),
        products: productsWithRating,
        pagination: paginationData,
      })
    );
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json(errorResponse("Failed to retrieve category products"));
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  getCategoryProducts,
};
