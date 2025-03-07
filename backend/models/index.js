const { User } = require("./User");
const { Product } = require("./Product");
const { Category } = require("./Category");
const { Order } = require("./Order");
const { OrderItem } = require("./OrderItem");
const { Review } = require("./Review");
const { CartItem } = require("./CartItem");
const { WishlistItem } = require("./WishlistItem");

// Define associations between models

// Product <-> Category (Many-to-One)
Product.belongsTo(Category, { foreignKey: "category_id" });
Category.hasMany(Product, { foreignKey: "category_id" });

// Order <-> User (Many-to-One)
Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

// OrderItem <-> Order (Many-to-One)
OrderItem.belongsTo(Order, { foreignKey: "order_id" });
Order.hasMany(OrderItem, { foreignKey: "order_id" });

// OrderItem <-> Product (Many-to-One)
OrderItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(OrderItem, { foreignKey: "product_id" });

// Review <-> Product (Many-to-One)
Review.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Review, { foreignKey: "product_id" });

// Review <-> User (Many-to-One)
Review.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Review, { foreignKey: "user_id" });

// CartItem <-> User (Many-to-One)
CartItem.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(CartItem, { foreignKey: "user_id" });

// CartItem <-> Product (Many-to-One)
CartItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(CartItem, { foreignKey: "product_id" });

// WishlistItem <-> User (Many-to-One)
WishlistItem.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(WishlistItem, { foreignKey: "user_id" });

// WishlistItem <-> Product (Many-to-One)
WishlistItem.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(WishlistItem, { foreignKey: "product_id" });

module.exports = {
  User,
  Product,
  Category,
  Order,
  OrderItem,
  Review,
  CartItem,
  WishlistItem,
};
