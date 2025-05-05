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

router.get("/", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM books WHERE user_id = ?", [
    req.user.id,
  ]);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { title, author } = req.body;
  await pool.query(
    "INSERT INTO books (title, author, user_id) VALUES (?, ?, ?)",
    [title, author, req.user.id]
  );
  res.status(201).json({ message: "Book added" });
});

router.put("/:id", async (req, res) => {
  const { title, author } = req.body;
  await pool.query(
    "UPDATE books SET title = ?, author = ? WHERE id = ? AND user_id = ?",
    [title, author, req.params.id, req.user.id]
  );
  res.json({ message: "Book updated" });
});

router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM books WHERE id = ? AND user_id = ?", [
    req.params.id,
    req.user.id,
  ]);
  res.json({ message: "Book deleted" });
});

module.exports = router;
