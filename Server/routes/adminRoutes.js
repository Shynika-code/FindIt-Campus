const express = require("express");
const adminProtect = require("../middleware/adminMiddleware");

const {
  adminLogin,
  registerAdmin,
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  getAllItems,
  updateItemStatus,
  deleteItem,
  getAllClaims,
  updateClaimStatus,
  getAdminProfile,
} = require("../controllers/adminController");

const router = express.Router();

// Public routes
router.post("/login", adminLogin);
router.post("/register", registerAdmin);

// Protected admin routes
router.get("/profile", adminProtect, getAdminProfile);
router.get("/dashboard/stats", adminProtect, getDashboardStats);

// User management routes
router.get("/users", adminProtect, getAllUsers);
router.patch("/users/:userId/toggle-status", adminProtect, toggleUserStatus);

// Item management routes
router.get("/items", adminProtect, getAllItems);
router.patch("/items/:itemId/status", adminProtect, updateItemStatus);
router.delete("/items/:itemId", adminProtect, deleteItem);

// Claims management routes
router.get("/claims", adminProtect, getAllClaims);
router.patch("/claims/:claimId/status", adminProtect, updateClaimStatus);

module.exports = router;
