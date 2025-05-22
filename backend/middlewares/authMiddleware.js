// routes/authRoutes.js
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mysecretpostgres";

// Middleware untuk memverifikasi token JWT dari Supabase
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token JWT (pastikan sesuai dengan secret di frontend/backend)
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Simpan data user dari token
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = authMiddleware;
