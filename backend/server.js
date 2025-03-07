const app = require("./app");
const { sequelize } = require("./config/db");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

// Test database connection
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDbConnection();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
