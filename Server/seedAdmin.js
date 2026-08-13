require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Admin = require("./models/Admin");

const adminEmail = (process.env.ADMIN_EMAIL || process.argv[2] || "").trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || process.argv[3] || "";
const adminName = (process.env.ADMIN_NAME || "FindIt Admin").trim();

const seedAdminUser = async () => {
  try {
    if (!adminEmail || !adminPassword) {
      console.error("Admin email and password are required.");
      console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in Server/.env, or run:");
      console.error("node seedAdmin.js admin@example.com a-strong-password");
      process.exit(1);
    }

    if (adminPassword.length < 12) {
      console.error("Admin password must be at least 12 characters long.");
      process.exit(1);
    }

    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
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
    console.log(`Email: ${adminEmail}`);
    console.log("Password: the value configured as ADMIN_PASSWORD in Server/.env");

    console.clear();
    console.log("Admin user created successfully!");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: the value of ADMIN_PASSWORD in Server/.env");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

seedAdminUser();
