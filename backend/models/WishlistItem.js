const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const WishlistItem = sequelize.define(
  "WishlistItem",
  {
    wishlist_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "product_id",
      },
    },
    added_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "wishlist_items",
    timestamps: false,
  }
);

module.exports = { WishlistItem };
