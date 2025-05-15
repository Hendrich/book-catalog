const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "secret";

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    await pool.query("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashed,
    ]);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    res.status(400).json({ error: "Username might already exist" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await pool.query("SELECT * FROM users WHERE username = ?", [
    username,
  ]);
  const user = rows[0];

  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  //console.log("User found:", user); // setelah dapat user dari DB
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });

  // console.log("Response being sent:", {
  //   token,
  //   user: {
  //     id: user.id,
  //     username: user.username,
  //   },
  // });
});

module.exports = router;
