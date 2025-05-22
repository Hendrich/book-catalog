// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// CORS policy - Lebih aman jika restrict ke domain tertentu
app.use(
  cors({
    origin: "https://book-catalog-app-z8p8.onrender.com", // Sesuaikan dengan URL frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes (tanpa middleware duplikat)
app.use("/api/books", bookRoutes); // bookRoutes sudah pakai authMiddleware internal

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, "../frontend")));

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
