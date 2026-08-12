#!/bin/bash

# FindIt Campus Admin Dashboard - Quick Setup Script
# This script helps you set up the admin dashboard

echo "======================================"
echo "FindIt Campus - Admin Setup"
echo "======================================"
echo ""

# Check if we're in the right directory
if [ ! -f "Server/seedAdmin.js" ]; then
    echo "❌ Error: Run this script from the project root directory"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Step 1: Checking dependencies..."
if [ ! -d "Server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd Server
    npm install
    cd ..
fi

if [ ! -d "Client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd Client
    npm install
    cd ..
fi

echo "✅ Dependencies ready"
echo ""

# Step 2: Create admin account
echo "🔐 Step 2: Creating admin account..."
cd Server
node seedAdmin.js
cd ..
echo ""

# Step 3: Summary
echo "======================================"
echo "✅ Setup Complete!"
echo "======================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start the backend:"
echo "   cd Server && npm start"
echo ""
echo "2. In a new terminal, start the frontend:"
echo "   cd Client && npm run dev"
echo ""
echo "3. Access the admin panel:"
echo "   http://localhost:5173/admin/login"
echo ""
echo "🔑 Admin Credentials:"
echo "   Email: admin@findit.com"
echo "   Password: admin@123"
echo ""
echo "⚠️  IMPORTANT: Change the default password after first login!"
echo ""
echo "======================================"
