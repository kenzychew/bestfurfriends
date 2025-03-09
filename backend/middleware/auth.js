const passport = require("passport");
const jwt = require("jsonwebtoken");

//* Authentication middleware using Passport JWT strategy
const authenticateJWT = passport.authenticate("jwt", { session: false });

// Generate JWT token for authenticated users
const generateToken = (user) => {
  const payload = {
    id: user.user_id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    isAdmin: user.is_admin,
  };
  // Returns a JWT token object
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });
};

module.exports = {
  authenticateJWT,
  generateToken,
};
