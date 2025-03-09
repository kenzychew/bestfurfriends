const { User } = require("../models");
const { generateToken, generateAdminToken } = require("../middleware/auth");
const { successResponse, errorResponse } = require("../utils/helpers");

//* User authentication
// Registers a new user account
// Checks for existing email to prevent duplicates
// Returns a JWT token for immediate login after registration
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json(errorResponse("User with this email already exists"));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      first_name,
      last_name,
      phone,
      address,
    });

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json(
      successResponse("User registered successfully", {
        token,
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdmin: user.is_admin,
        },
      })
    );
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json(errorResponse("Registration failed. Please try again later."));
  }
};

// Authenticates a user and returns a JWT token
// Verifies credentials against the database
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json(errorResponse("Invalid credentials"));
    }

    // Verify password
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json(errorResponse("Invalid credentials"));
    }

    // Generate JWT token
    const token = generateToken(user);

    res.status(200).json(
      successResponse("Login successful", {
        token,
        user: {
          id: user.user_id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isAdmin: user.is_admin,
        },
      })
    );
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json(errorResponse("Login failed. Please try again later."));
  }
};

// Sends a password reset email if the account exists
// Does not reveal if the email exists for security reasons
// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Still return success to prevent email enumeration
      return res
        .status(200)
        .json(
          successResponse(
            "If your email exists in our system, you will receive a reset link"
          )
        );
    }

    // Here you would generate a password reset token
    // and send an email to the user with a reset link
    // This is just a placeholder for now

    res
      .status(200)
      .json(
        successResponse(
          "If your email exists in our system, you will receive a reset link"
        )
      );
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json(
        errorResponse("Password reset request failed. Please try again later.")
      );
  }
};

// Sets a new password using a valid reset token
// Token verification logic would be implemented here
// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // This is a placeholder - in a real implementation
    // you would verify the token and update the user's password

    res
      .status(200)
      .json(successResponse("Password has been reset successfully"));
  } catch (error) {
    console.error("Reset password error:", error);
    res
      .status(500)
      .json(errorResponse("Password reset failed. Please try again later."));
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};
