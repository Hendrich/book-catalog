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

// Semua route setelah ini harus login
router.use(authMiddleware);

// Ambil semua buku milik user yang sedang login
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const [result] = await pool.query("SELECT * FROM books WHERE user_id = ?", [
      userId,
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Tambah buku baru
router.post("/", async (req, res) => {
  const { title, author } = req.body;
  const user_id = req.user.id; // dari JWT payload

  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO books (title, author, user_id) VALUES (?, ?, ?)",
      [title, author, user_id]
    );
    res.status(201).json({
      message: "Book added",
      id: result.insertId,
      title,
      author,
      user_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Edit buku
router.put("/:id", async (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  const user_id = req.user.id;

  try {
    const [result] = await pool.query(
      "UPDATE books SET title = ?, author = ? WHERE id = ? AND user_id = ?",
      [title, author, bookId, user_id]
    );
    res.json({ message: "Book updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hapus buku
router.delete("/:id", async (req, res) => {
  const bookId = req.params.id;
  const user_id = req.user.id;

  try {
    const [result] = await pool.query(
      "DELETE FROM books WHERE id = ? AND user_id = ?",
      [bookId, user_id]
    );
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
