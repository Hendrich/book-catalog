const express = require("express");
const { validateAuth } = require("../middlewares/validation");
const { authLimiter, strictLimiter } = require("../middlewares/rateLimiter");
const { securityLogger } = require("../middlewares/logger");
const { AppError } = require("../middlewares/errorHandler");

const router = express.Router();

// Apply strict rate limiting to auth endpoints
router.use(strictLimiter);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (handled by Supabase)
 * @access  Public
 * @note    This endpoint is primarily for documentation purposes
 *          as registration is handled client-side via Supabase
 */
router.post(
  "/register",
  validateAuth,
  securityLogger("USER_REGISTRATION"),
  async (req, res, next) => {
    try {
      // Since we're using Supabase for authentication,
      // this endpoint mainly serves as documentation
      // and for any future server-side registration logic

      res.status(200).json({
        success: true,
        message: "Registration should be handled via Supabase client-side",
        data: {
          note: "Use Supabase auth.signUp() method on the frontend",
          requiredFields: ["email", "password"],
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error in registration endpoint:", err.message);
      next(new AppError("Registration endpoint error", 500));
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (handled by Supabase)
 * @access  Public
 * @note    This endpoint is primarily for documentation purposes
 *          as login is handled client-side via Supabase
 */
router.post(
  "/login",
  validateAuth,
  securityLogger("USER_LOGIN"),
  async (req, res, next) => {
    try {
      // Since we're using Supabase for authentication,
      // this endpoint mainly serves as documentation
      // and for any future server-side login logic

      res.status(200).json({
        success: true,
        message: "Login should be handled via Supabase client-side",
        data: {
          note: "Use Supabase auth.signInWithPassword() method on the frontend",
          requiredFields: ["email", "password"],
          tokenUsage:
            "Include the access_token from Supabase session in Authorization header as 'Bearer <token>'",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error in login endpoint:", err.message);
      next(new AppError("Login endpoint error", 500));
    }
  }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (handled by Supabase)
 * @access  Public
 * @note    This endpoint is primarily for documentation purposes
 *          as logout is handled client-side via Supabase
 */
router.post(
  "/logout",
  securityLogger("USER_LOGOUT"),
  async (req, res, next) => {
    try {
      res.status(200).json({
        success: true,
        message: "Logout should be handled via Supabase client-side",
        data: {
          note: "Use Supabase auth.signOut() method on the frontend",
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error in logout endpoint:", err.message);
      next(new AppError("Logout endpoint error", 500));
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user info
 * @access  Private
 */
router.get(
  "/me",
  require("../middlewares/authMiddleware"),
  async (req, res, next) => {
    try {
      // Return basic user info from the JWT token
      res.status(200).json({
        success: true,
        data: {
          user_id: req.user_id,
          email: req.user_email || "N/A",
          authenticated: true,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error fetching user info:", err.message);
      next(new AppError("Failed to fetch user info", 500));
    }
  }
);

/**
 * @route   POST /api/auth/verify-token
 * @desc    Verify if a JWT token is valid
 * @access  Private
 */
router.post(
  "/verify-token",
  require("../middlewares/authMiddleware"),
  async (req, res, next) => {
    try {
      // If we reach here, the token is valid (thanks to authMiddleware)
      res.status(200).json({
        success: true,
        data: {
          valid: true,
          user_id: req.user_id,
          expires_at: req.token_expires || "N/A",
        },
        message: "Token is valid",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error verifying token:", err.message);
      next(new AppError("Token verification failed", 401));
    }
  }
);

module.exports = router;
