const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(401).json({ message: "Invalid token" });
    // Ambil user_id dari payload.userId (sesuai JWT backend)
    req.user_id = payload.userId;
    req.user_email = payload.email;
    next();
  });
};
