const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["super_admin", "moderator"],
      default: "moderator",
    },

    permissions: {
      canManageUsers: {
        type: Boolean,
        default: true,
      },
      canManageItems: {
        type: Boolean,
        default: true,
      },
      canManageClaims: {
        type: Boolean,
        default: true,
      },
      canViewAnalytics: {
        type: Boolean,
        default: true,
      },
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
