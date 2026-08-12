const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createItem,
  getItems,
  getItemById
} = require("../controllers/itemController");

const router = express.Router();

// Create an item - Login required 
router.post("/", protect, createItem);

// Get all items - Public
router.get("/", getItems);

//Get a single item by ID - Public 
router.get("/:id", getItemById);

module.exports = router;