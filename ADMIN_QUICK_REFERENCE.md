# ⚡ FindIt Campus Admin - Quick Reference Card

## 🚀 FASTEST START (< 5 minutes)

```bash
# Terminal 1: Create Admin & Start Backend
cd Server
node seedAdmin.js
npm start

# Terminal 2: Start Frontend  
cd Client
npm run dev

# Browser: Navigate to
http://localhost:5173/admin/login
```

**Login Credentials:**
- 📧 Email: `admin@findit.com`
- 🔑 Password: `admin@123`

---

## 📍 Important URLs

| Route | URL | Purpose |
|-------|-----|---------|
| **Admin Login** | `/admin/login` | Login to admin panel |
| **Admin Dashboard** | `/admin/dashboard` | Main admin page |
| **User Browse** | `/items` | Browse items |
| **Report Item** | `/report` | Report lost/found |

---

## 🎯 Main Admin Features

### 📊 Dashboard Tab
- Real-time statistics
- Key metrics cards
- Category breakdown
- Recent items & claims

### 👥 Users Tab
- Search users
- Block/Unblock accounts
- View user status
- Joined date tracking

### 📦 Items Tab
- Search items
- Filter by type (Lost/Found)
- Filter by status (Active/Claimed/Returned)
- Edit status
- Delete items

### ✅ Claims Tab
- Filter by status (Pending/Approved/Rejected)
- Approve claims
- Reject claims
- View claim details

---

## 🔑 Key Credentials

```
🏢 Admin Login
  Email: admin@findit.com
  Password: admin@123
```

⚠️ **Change password after first login!**

---

## 📁 Important Files Locations

**Backend:**
- Models: `Server/models/Admin.js`
- Controllers: `Server/controllers/adminController.js`
- Routes: `Server/routes/adminRoutes.js`
- Seeder: `Server/seedAdmin.js`

**Frontend:**
- Components: `Client/src/Admin*.jsx` (6 files)
- Styling: `Client/src/admin-styles.css`
- Main App: `Client/src/App.jsx`

**Documentation:**
- Setup Guide: `ADMIN_SETUP_GUIDE.md`
- Full Reference: `ADMIN_IMPLEMENTATION_GUIDE.md`
- Completion Summary: `COMPLETION_SUMMARY.md`

---

## 🔐 Security Checklist

- ✅ JWT authentication enabled
- ✅ Password hashing (bcryptjs)
- ✅ Token expiration (7 days)
- ✅ Admin-only routes protected
- ✅ Account status validation
- ✅ Permission-based access

---

## ⚙️ API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/profile` | Get admin info |
| GET | `/api/admin/dashboard/stats` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| PATCH | `/api/admin/users/:id/toggle-status` | Block/Unblock |
| GET | `/api/admin/items` | List items |
| PATCH | `/api/admin/items/:id/status` | Update item |
| DELETE | `/api/admin/items/:id` | Delete item |
| GET | `/api/admin/claims` | List claims |
| PATCH | `/api/admin/claims/:id/status` | Approve/Reject |

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't login | Run `node seedAdmin.js` in Server folder |
| No data showing | Check JWT token in browser localStorage |
| Styling broken | Clear cache, check admin-styles.css imported |
| Port in use | Change port in .env file |
| Database error | Ensure MongoDB running locally |

---

## 💻 System Requirements

- Node.js 14+
- MongoDB (local or connection string in .env)
- npm or yarn
- Modern browser (Chrome, Firefox, Safari, Edge)

---

## 📦 Ports

- **Backend:** `http://localhost:5000`
- **Frontend:** `http://localhost:5173` (default Vite)
- **MongoDB:** `mongodb://localhost:27017/findit` (local)

---

## 🎨 Color Scheme

| Color | Usage | Hex |
|-------|-------|-----|
| 🟢 Green | Success, Approve, Active | `#0dac6c` |
| 🔴 Red | Error, Reject, Block | `#e63946` |
| 🟠 Orange | Warning, Pending | `#ff9800` |
| 🔵 Navy | Header, Sidebar | `#09253e` |
| ⚪ Cream | Background, Light | `#fafbf8` |

---

## 📊 Statistics Available

The dashboard displays:
- **Users:** Total, Active, Blocked
- **Items:** Total, Lost, Found, Active, Claimed, Returned
- **Claims:** Total, Pending, Approved, Rejected
- **Categories:** Top 5 with item count and percentages

---

## 🔄 User Workflows

### Block a User
1. Go to Users tab
2. Search for user
3. Click "Block" button
4. Confirm action

### Update Item Status
1. Go to Items tab
2. Find item
3. Click Edit icon
4. Select new status
5. Save changes

### Approve a Claim
1. Go to Claims tab
2. Filter by "Pending"
3. Click "Approve" button
4. Claim moves to Approved

### Delete an Item
1. Go to Items tab
2. Find item
3. Click Delete icon
4. Confirm deletion

---

## 📱 Responsive Breakpoints

- **Desktop:** 1024px+ (Full features)
- **Tablet:** 768px-1023px (Adjusted layout)
- **Mobile:** < 768px (Hamburger menu)

---

## 🔐 JWT Token Info

- **Stored in:** localStorage as `findit_admin_token`
- **Expires:** 7 days
- **Contains:** Admin ID, email, role, type
- **Used for:** Authorization on all protected routes

---

## 📞 Getting Help

1. Check `ADMIN_SETUP_GUIDE.md` for detailed steps
2. See `ADMIN_IMPLEMENTATION_GUIDE.md` for complete reference
3. Review browser console for error messages
4. Check MongoDB connection
5. Verify all files are in correct locations

---

## 🚀 Production Checklist

- [ ] Change default admin password
- [ ] Update JWT_SECRET in .env
- [ ] Configure MongoDB Atlas connection
- [ ] Enable HTTPS
- [ ] Set up backups
- [ ] Configure logging
- [ ] Test all features
- [ ] Document any customizations

---

## ✨ Version Info
- **Version:** 1.0.0 Production Ready
- **Last Updated:** December 2024
- **Status:** ✅ Fully Implemented

---

**Happy Managing! 🎉**

Keep this card handy for quick reference while using the admin dashboard.
