const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  validateBook,
  validateId,
  validateBookUpdate,
} = require("../middlewares/validation");
const { authLimiter } = require("../middlewares/rateLimiter");
const { securityLogger } = require("../middlewares/logger");
const { AppError } = require("../middlewares/errorHandler");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Apply rate limiting to sensitive operations
router.use(authLimiter);

// =============================================================================
// BOOK ROUTES
// =============================================================================

/**
 * @route   GET /api/books
 * @desc    Get all books for the authenticated user
 * @access  Private
 */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user_id;

    // Add basic query parameters support (future enhancement)
    const { page = 1, limit = 50, search } = req.query;
    const offset = (page - 1) * limit;

    let query = "SELECT * FROM books WHERE user_id = $1";
    let queryParams = [userId];

    // Add search functionality if search parameter is provided
    if (search) {
      query += " AND (title ILIKE $2 OR author ILIKE $2)";
      queryParams.push(`%${search}%`);
    }

    // Add ordering and pagination
    query +=
      " ORDER BY created_at DESC LIMIT $" +
      (queryParams.length + 1) +
      " OFFSET $" +
      (queryParams.length + 2);
    queryParams.push(limit, offset);

    const { rows } = await pool.query(query, queryParams);

    // Get total count for pagination
    let countQuery = "SELECT COUNT(*) FROM books WHERE user_id = $1";
    let countParams = [userId];

    if (search) {
      countQuery += " AND (title ILIKE $2 OR author ILIKE $2)";
      countParams.push(`%${search}%`);
    }

    const { rows: countRows } = await pool.query(countQuery, countParams);
    const totalBooks = parseInt(countRows[0].count);

    res.json({
      success: true,
      data: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalBooks,
        totalPages: Math.ceil(totalBooks / limit),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    next(new AppError("Failed to fetch books", 500));
  }
});

/**
 * @route   GET /api/books/:id
 * @desc    Get a specific book by ID
 * @access  Private
 */
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const bookId = req.params.id;
    const userId = req.user_id;

    const { rows } = await pool.query(
      "SELECT * FROM books WHERE id = $1 AND user_id = $2",
      [bookId, userId]
    );

    if (rows.length === 0) {
      return next(new AppError("Book not found", 404));
    }

    res.json({
      success: true,
      data: rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Error fetching book:", err.message);
    next(new AppError("Failed to fetch book", 500));
  }
});

/**
 * @route   POST /api/books
 * @desc    Add a new book
 * @access  Private
 */
router.post(
  "/",
  validateBook,
  securityLogger("CREATE_BOOK"),
  async (req, res, next) => {
    try {
      const { title, author } = req.body;
      const userId = req.user_id;

      // Check for duplicate books (same title and author for the same user)
      const { rows: existingBooks } = await pool.query(
        "SELECT id FROM books WHERE title = $1 AND author = $2 AND user_id = $3",
        [title, author, userId]
      );

      if (existingBooks.length > 0) {
        return next(
          new AppError("Book with this title and author already exists", 409)
        );
      }

      const { rows } = await pool.query(
        "INSERT INTO books (title, author, user_id, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *",
        [title, author, userId]
      );

      res.status(201).json({
        success: true,
        data: rows[0],
        message: "Book added successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error adding book:", err.message);
      next(new AppError("Failed to add book", 500));
    }
  }
);

/**
 * @route   PUT /api/books/:id
 * @desc    Update a book
 * @access  Private
 */
router.put(
  "/:id",
  validateId,
  validateBookUpdate,
  securityLogger("UPDATE_BOOK"),
  async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const userId = req.user_id;
      const updateFields = req.body;

      // Build dynamic update query
      const setClauses = [];
      const values = [];
      let paramCount = 1;

      Object.keys(updateFields).forEach((key) => {
        setClauses.push(`${key} = $${paramCount}`);
        values.push(updateFields[key]);
        paramCount++;
      });

      // Add updated_at timestamp
      setClauses.push(`updated_at = NOW()`);

      // Add WHERE conditions
      values.push(bookId, userId);

      const query = `
      UPDATE books 
      SET ${setClauses.join(", ")} 
      WHERE id = $${values.length - 1} AND user_id = $${values.length}
      RETURNING *
    `;

      const { rows } = await pool.query(query, values);

      if (rows.length === 0) {
        return next(new AppError("Book not found or unauthorized", 404));
      }

      res.json({
        success: true,
        data: rows[0],
        message: "Book updated successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error updating book:", err.message);
      next(new AppError("Failed to update book", 500));
    }
  }
);

/**
 * @route   DELETE /api/books/:id
 * @desc    Delete a book
 * @access  Private
 */
router.delete(
  "/:id",
  validateId,
  securityLogger("DELETE_BOOK"),
  async (req, res, next) => {
    try {
      const bookId = req.params.id;
      const userId = req.user_id;

      const { rows } = await pool.query(
        "DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING *",
        [bookId, userId]
      );

      if (rows.length === 0) {
        return next(new AppError("Book not found or unauthorized", 404));
      }

      res.json({
        success: true,
        data: { id: bookId },
        message: "Book deleted successfully",
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error("❌ Error deleting book:", err.message);
      next(new AppError("Failed to delete book", 500));
    }
  }
);

module.exports = router;
