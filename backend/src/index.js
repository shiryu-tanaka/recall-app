const { testConnection, syncDatabase } = require("./models");

(async () => {
  await testConnection();
  await syncDatabase();
})();

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// Test route
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is runnning" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
