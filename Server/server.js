require("dotenv").config();
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const authRoutes = require("./routes/authRoutes");
const claimRoutes = require("./routes/claimRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Home route
app.get("/", (req, res) => {
  res.send("FindIt Campus Backend Running");
});

// API routes
app.use("/api/items", itemRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
