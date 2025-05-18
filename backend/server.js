const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes.js");
const bookRoutes = require("./routes/bookRoutes.js");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
// app.use(
//   cors({
//     origin: "*", // Atau lebih aman: origin: 'https://namafrontend.vercel.app'
//   })
// );
app.use(bodyParser.json());

// === API routes dulu ===
app.use("/api", authRoutes);
app.use("/api/books", bookRoutes);

// === Static files terakhir ===
app.use(express.static(path.join(__dirname, "../frontend")));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
