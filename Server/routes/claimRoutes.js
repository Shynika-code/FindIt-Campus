const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
  createClaim
} = require("../controllers/claimController");

const router = express.Router();

// Submit a claim - Login required
router.post("/", protect, createClaim);

module.exports = router;