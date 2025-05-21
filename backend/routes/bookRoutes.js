// routes/bookRoutes.js
const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Middleware otentikasi
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Harus mengandung `id`
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

router.use(authMiddleware);

// Ambil semua buku milik user yang sedang login
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE user_id = $1",
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah buku baru
router.post("/", async (req, res) => {
  const { title, author, user_id } = req.body;

  if (!title || !author || !!user_id) {
    return res
      .status(400)
      .json({ message: "Title ,author, and user_id are required" });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO books (title, author, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, author, user_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("Error adding book:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Edit buku
router.put("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  const user_id = req.user.id;

  try {
    const { rows } = await pool.query(
      "UPDATE books SET title = $1, author = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, author, bookId, user_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Book not found or unauthorized" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus buku
router.delete("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  const user_id = req.user.id;

  try {
    const { rows } = await pool.query(
      "DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING *",
      [bookId, user_id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Book not found or unauthorized" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
