require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const seedAdminUser = async () => {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: "admin@findit.com" });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin@123", 10);

    // Create admin user
    const admin = await Admin.create({
      name: "FindIt Admin",
      email: "admin@findit.com",
      password: hashedPassword,
      role: "super_admin",
      permissions: {
        canManageUsers: true,
        canManageItems: true,
        canManageClaims: true,
        canViewAnalytics: true,
      },
      isActive: true,
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@findit.com");
    console.log("🔑 Password: admin@123");
    console.log("\n⚠️  IMPORTANT: Change the default password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

seedAdminUser();
