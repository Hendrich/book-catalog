// routes/bookRoutes.js
const express = require("express");
const pool = require("../db");
const router = express.Router();

// Regex validasi UUID (user_id)
const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Ambil semua buku
router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM books");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching books:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Tambah buku baru
router.post("/", async (req, res) => {
  const { title, author, user_id } = req.body;

  if (!title || !author || !user_id || !uuidRegex.test(user_id)) {
    return res.status(400).json({
      message: "Title, author, and valid user_id are required",
    });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO books (title, author, user_id) VALUES ($1, $2, $3) RETURNING *",
      [title, author, user_id]
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

// Edit buku
router.put("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { rows } = await pool.query(
      "UPDATE books SET title = $1, author = $2 WHERE id = $3 RETURNING *",
      [title, author, bookId]
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

// Hapus buku
router.delete("/:id", async (req, res) => {
  const bookId = parseInt(req.params.id);

  try {
    const { rows } = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [bookId]
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
