# 🛡️ FindIt Campus - Admin Dashboard Setup & Guide

## Admin Credentials

### Default Login
- **Email**: `admin@findit.com`
- **Password**: `admin@123`

⚠️ **IMPORTANT**: Change the default password immediately after the first login!

---

## 📋 Features Overview

### 1. **Dashboard Statistics**
   - Total users count
   - Total items (lost & found)
   - Active items, claimed items, returned items
   - Total claims and pending claims
   - Items by category (top 5)
   - Recent items and claims list
   - Visual charts and progress bars

### 2. **User Management**
   - View all registered users
   - Search users by name or email
   - Block/Unblock user accounts
   - Pagination support
   - Track user registration dates

### 3. **Item Management**
   - View all reported items
   - Filter by type (Lost/Found)
   - Filter by status (Active/Claimed/Returned)
   - Search items by title or description
   - Update item status
   - Delete inappropriate items
   - Pagination support

### 4. **Claim Management**
   - View all user claims
   - Filter by status (Pending/Approved/Rejected)
   - Approve or reject pending claims
   - View claim details with claimant info
   - Pagination support

---

## 🚀 Quick Start

### 1. Seed the Admin Account

Run this command in the server directory:

```bash
cd Server
node seedAdmin.js
```

You should see:
```
✅ Admin user created successfully!
📧 Email: admin@findit.com
🔑 Password: admin@123

⚠️  IMPORTANT: Change the default password after first login!
```

### 2. Start the Servers

**Terminal 1 - Backend:**
```bash
cd Server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Client
npm run dev
```

### 3. Access the Admin Panel

1. Navigate to `http://localhost:5173/admin/login`
2. Enter credentials:
   - Email: `admin@findit.com`
   - Password: `admin@123`
3. Click "Sign In to Admin Panel"

---

## 🎯 Backend Implementation

### Models
- **Admin Model** (`Server/models/Admin.js`)
  - Email, password, name, role
  - Permissions (canManageUsers, canManageItems, canManageClaims, canViewAnalytics)
  - LastLogin tracking
  - isActive status

### Controllers
- **Admin Controller** (`Server/controllers/adminController.js`)
  - `adminLogin` - Authenticate admin users
  - `getDashboardStats` - Fetch all statistics
  - `getAllUsers` - List users with pagination
  - `toggleUserStatus` - Block/unblock users
  - `getAllItems` - List items with filters
  - `updateItemStatus` - Change item status
  - `deleteItem` - Remove inappropriate items
  - `getAllClaims` - List claims with pagination
  - `updateClaimStatus` - Approve/reject claims
  - `getAdminProfile` - Get current admin info

### Middleware
- **Admin Protection** (`Server/middleware/adminMiddleware.js`)
  - Verifies JWT token for admin access
  - Checks admin account is active
  - Protects all admin routes

### Routes
- **Admin Routes** (`Server/routes/adminRoutes.js`)
  - `POST /api/admin/login` - Admin login
  - `GET /api/admin/profile` - Get admin profile
  - `GET /api/admin/dashboard/stats` - Fetch statistics
  - `GET /api/admin/users` - List users
  - `PATCH /api/admin/users/:userId/toggle-status` - Block/unblock user
  - `GET /api/admin/items` - List items
  - `PATCH /api/admin/items/:itemId/status` - Update item status
  - `DELETE /api/admin/items/:itemId` - Delete item
  - `GET /api/admin/claims` - List claims
  - `PATCH /api/admin/claims/:claimId/status` - Update claim status

### Database Seeding
- **Seed File** (`Server/seedAdmin.js`)
  - Automatically creates default admin account
  - Uses bcrypt for password hashing
  - Prevents duplicate admins

---

## 🎨 Frontend Implementation

### Components

#### **AdminLogin** (`Client/src/AdminLogin.jsx`)
- Login form with email and password
- Error handling and validation
- Demo credentials display
- Features overview
- Stores JWT token in localStorage

#### **AdminDashboard** (`Client/src/AdminDashboard.jsx`)
- Main dashboard layout with sidebar
- Tab-based navigation (Dashboard, Users, Items, Claims)
- Responsive design with mobile menu
- Admin profile display
- Logout functionality

#### **AdminDashboardStats** (`Client/src/AdminDashboardStats.jsx`)
- Key metrics cards with icons
- Item status overview
- Top categories with progress bars
- Recent items table
- Recent claims table

#### **AdminUserManagement** (`Client/src/AdminUserManagement.jsx`)
- User list with search
- Block/Unblock user buttons
- Pagination
- User status display
- Joined date tracking

#### **AdminItemManagement** (`Client/src/AdminItemManagement.jsx`)
- Item list with filtering (type, status, search)
- Edit item status dropdown
- Delete item functionality
- Item details display
- Posted by information

#### **AdminClaimManagement** (`Client/src/AdminClaimManagement.jsx`)
- Claims list with status filtering
- Approve/Reject buttons for pending claims
- Claimant and item details
- Status badges
- Pagination

### Styles
- **Admin Styles** (`Client/src/admin-styles.css`)
  - Complete admin panel styling
  - Responsive design (mobile, tablet, desktop)
  - Color-coded badges and status indicators
  - Smooth animations and transitions
  - Dark sidebar with accent colors

### Integration
- Routes added to `App.jsx`
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)
- Token stored in localStorage for persistence

---

## 🔐 Security Features

1. **JWT Authentication**
   - 7-day token expiration
   - Token type verification (admin vs student)

2. **Password Security**
   - bcryptjs for hashing
   - Minimum 6 character requirement
   - Default password should be changed

3. **Route Protection**
   - Admin middleware on all protected routes
   - Active account status verification
   - Token validation on each request

4. **User Management**
   - Block/Unblock users capability
   - Track last login time
   - View all user activities

---

## 📊 Admin Functions Summary

| Feature | Route | Method | Purpose |
|---------|-------|--------|---------|
| Admin Login | `/admin/login` | POST | Authenticate admin |
| Dashboard Stats | `/admin/dashboard/stats` | GET | View system statistics |
| Get Users | `/admin/users` | GET | List all users |
| Block/Unblock User | `/admin/users/:id/toggle-status` | PATCH | Change user status |
| Get Items | `/admin/items` | GET | List all items |
| Update Item Status | `/admin/items/:id/status` | PATCH | Change item status |
| Delete Item | `/admin/items/:id` | DELETE | Remove item |
| Get Claims | `/admin/claims` | GET | List all claims |
| Update Claim Status | `/admin/claims/:id/status` | PATCH | Approve/reject claims |

---

## 🛠️ Customization

### Change Default Admin Password
In `Server/seedAdmin.js`, modify this line:
```javascript
const hashedPassword = await bcrypt.hash("admin@123", 10);  // Change password here
```

### Add More Admin Accounts
Run seedAdmin.js multiple times or modify it to accept command-line arguments:
```bash
node seedAdmin.js email@example.com mypassword
```

### Adjust Pagination
Update in respective component files (default is 10 items per page):
```javascript
const response = await request(`/admin/users?page=${page}&limit=10&search=${search}`, ...)
```

### Customize Color Scheme
Modify variables in CSS:
```css
--coral: #f07b5c;      /* Primary action color */
--navy: #09253e;       /* Sidebar background */
--success: #0dac6c;    /* Approve/Success */
--error: #e63946;      /* Reject/Block */
```

---

## 🐛 Troubleshooting

### Can't Login
- Check credentials: `admin@findit.com` / `admin@123`
- Run `node seedAdmin.js` to create admin account
- Ensure backend is running on port 5000

### Data Not Showing
- Check network tab for API errors
- Verify JWT token in localStorage
- Ensure admin token has "type": "admin" field

### Styling Issues
- Ensure `admin-styles.css` is imported in App.jsx
- Check CSS file is in correct location (`Client/src/`)
- Clear browser cache and reload

### Admin Account Already Exists
- The seedAdmin.js script checks for duplicates
- To reset, delete the admin from MongoDB:
  ```bash
  db.admins.deleteOne({ email: "admin@findit.com" })
  ```

---

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation with all features visible
- **Tablet**: Collapsible sidebar, touch-friendly buttons
- **Mobile**: Hamburger menu, full-width tables with horizontal scroll

---

## 🎓 Next Steps

1. **Change Default Password**: Log in and update admin password
2. **Create Additional Admins**: Database insert for moderators
3. **Monitor Dashboard**: Track system health and user activity
4. **Manage Content**: Review and approve/reject inappropriate items
5. **User Support**: Block problematic users if needed

---

## 📞 Support

For issues or questions:
- Check browser console for errors
- Review network requests in DevTools
- Verify all files are created in correct locations
- Ensure MongoDB connection is working

---

**Admin Dashboard v1.0** - Ready for production use! 🚀
