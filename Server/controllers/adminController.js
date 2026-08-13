const Admin = require("../models/Admin");
const User = require("../models/User");
const Item = require("../models/Item");
const Claim = require("../models/Claim");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Admin JWT token
const generateAdminToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      role: admin.role,
      type: "admin",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: "Admin account is inactive",
      });
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateAdminToken(admin);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin login failed",
      error: error.message,
    });
  }
};

// Create an administrator account.
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();

    if (!name?.trim() || !normalizedEmail || !password) {
      return res.status(400).json({ success: false, message: "Name, email, and password are required" });
    }

    if (password.length < 12) {
      return res.status(400).json({ success: false, message: "Admin password must be at least 12 characters long" });
    }

    const existingAdmin = await Admin.findOne({ email: normalizedEmail });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "An admin account with this email already exists" });
    }

    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: "super_admin",
      permissions: { canManageUsers: true, canManageItems: true, canManageClaims: true, canViewAnalytics: true },
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Admin account created. You can now sign in.",
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to create admin account" });
  }
};

// Get Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "student" });
    const totalItems = await Item.countDocuments();
    const activeItems = await Item.countDocuments({ status: "active" });
    const claimedItems = await Item.countDocuments({ status: "claimed" });
    const returnedItems = await Item.countDocuments({ status: "returned" });
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: "pending" });

    // Items by type
    const lostItems = await Item.countDocuments({ type: "lost" });
    const foundItems = await Item.countDocuments({ type: "found" });

    // Items by category (top 5)
    const itemsByCategory = await Item.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Recent items
    const recentItems = await Item.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("postedBy", "name email");

    // Recent claims
    const recentClaims = await Claim.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("claimantId", "name email")
      .populate("itemId", "title");

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalItems,
        activeItems,
        claimedItems,
        returnedItems,
        totalClaims,
        pendingClaims,
        lostItems,
        foundItems,
        itemsByCategory,
        recentItems,
        recentClaims,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {
      role: "student",
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .select("-password");

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

// Block/Unblock user
const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.blocked = !user.blocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: user.blocked ? "User blocked successfully" : "User unblocked successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update user status",
      error: error.message,
    });
  }
};

// Get all items with filters
const getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, type = "", status = "", search = "" } = req.query;

    const query = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };

    if (type) query.type = type;
    if (status) query.status = status;

    const items = await Item.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: error.message,
    });
  }
};

// Update item status
const updateItemStatus = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { status } = req.body;

    const validStatuses = ["active", "claimed", "returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      { status },
      { new: true }
    ).populate("postedBy", "name email");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item status updated successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update item status",
      error: error.message,
    });
  }
};

// Delete item
const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Item.findByIdAndDelete(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: error.message,
    });
  }
};

// Get all claims
const getAllClaims = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "" } = req.query;

    const query = {};
    if (status) query.status = status;

    const claims = await Claim.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("claimantId", "name email")
      .populate("itemId", "title type category")
      .sort({ createdAt: -1 });

    const total = await Claim.countDocuments(query);

    res.status(200).json({
      success: true,
      data: claims,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch claims",
      error: error.message,
    });
  }
};

// Approve/Reject claim
const updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const claim = await Claim.findByIdAndUpdate(
      claimId,
      { status },
      { new: true }
    )
      .populate("claimantId", "name email")
      .populate("itemId", "title");

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: "Claim not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Claim status updated successfully",
      claim,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update claim status",
      error: error.message,
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch admin profile",
      error: error.message,
    });
  }
};

module.exports = {
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
};
