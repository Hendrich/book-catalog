const express = require("express");
const pool = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

router.use(authMiddleware);

// Ambil semua buku
router.get("/", (req, res) => {
  db.query("SELECT * FROM books", (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Tambah buku baru
router.post("/", (req, res) => {
  const { title, author } = req.body;
  db.query(
    "INSERT INTO books (title, author) VALUES (?, ?)",
    [title, author],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Book added", id: result.insertId });
    }
  );
});

// Edit (Update) buku
router.put("/:id", (req, res) => {
  const bookId = req.params.id;
  const { title, author } = req.body;
  db.query(
    "UPDATE books SET title = ?, author = ? WHERE id = ?",
    [title, author, bookId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Book updated" });
    }
  );
});

// Hapus buku
router.delete("/:id", (req, res) => {
  const bookId = req.params.id;
  db.query("DELETE FROM books WHERE id = ?", [bookId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Book deleted" });
  });
});

module.exports = router;
