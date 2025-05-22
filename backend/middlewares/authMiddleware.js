// authMiddleware.js

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // JANGAN verify token dengan jwt.verify()
  // Cukup setel req.user_id dari token (contoh sederhana)
  // Atau hapus middleware ini sepenuhnya → biarkan RLS di Postgre yang kontrol

  req.token = token;
  next();
}

module.exports = authMiddleware;
