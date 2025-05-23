const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middlewares/authMiddleware"); // pastikan path benar
const router = express.Router();

// Semua route di bawahnya akan memakai autentikasi
router.use(authMiddleware);

// Ambil semua buku milik user yang sedang login
router.get("/", async (req, res) => {
  try {
    const userId = req.user_id; // Didapat dari JWT via middleware
    const { rows } = await pool.query(
      "SELECT * FROM books WHERE user_id = $1",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Tambah buku baru, user_id diambil dari sesi, bukan dari body!
router.post("/", async (req, res) => {
  const { title, author } = req.body;
  const userId = req.user_id;

  if (!title || !author) {
    return res.status(400).json({
      message: "Title and author are required",
    });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO books (title, author, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, author, userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(
      "❌ Error adding book:",
      err.message,
      "\nRequest body:",
      req.body
    );
    res.status(500).json({ message: "Server error saat menambah buku" });
  }
});

// Edit buku (hanya milik sendiri)
router.put("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  const userId = req.user_id;

  if (!title || !author) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Pastikan hanya buku milik user yang bisa diedit
    const { rows } = await pool.query(
      "UPDATE books SET title = $1, author = $2 WHERE id = $3 AND user_id = $4 RETURNING *",
      [title, author, bookId, userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Book not found or unauthorized" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error updating book:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Hapus buku (hanya milik sendiri)
router.delete("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  const userId = req.user_id;

  try {
    // Pastikan hanya buku milik user yang bisa dihapus
    const { rows } = await pool.query(
      "DELETE FROM books WHERE id = $1 AND user_id = $2 RETURNING *",
      [bookId, userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Book not found or unauthorized" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting book:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
