import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, BarChart3, Users, Package, CheckCircle, Menu, X, Home } from 'lucide-react'
import { request } from './api'
import AdminDashboardStats from './AdminDashboardStats'
import AdminUserManagement from './AdminUserManagement'
import AdminItemManagement from './AdminItemManagement'
import AdminClaimManagement from './AdminClaimManagement'

export default function AdminDashboard() {
  const nav = useNavigate()
  const [admin, setAdmin] = useState(null)
  const [activeTab, setActiveTab] = useState('stats')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('findit_admin')
    if (!adminData) {
      nav('/admin/login')
      return
    }

    try {
      setAdmin(JSON.parse(adminData))
      setLoading(false)
    } catch (error) {
      localStorage.removeItem('findit_admin_token')
      localStorage.removeItem('findit_admin')
      nav('/admin/login')
    }
  }, [nav])

  const handleLogout = () => {
    localStorage.removeItem('findit_admin_token')
    localStorage.removeItem('findit_admin')
    nav('/admin/login')
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loader"></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'claims', label: 'Claims', icon: CheckCircle },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return <AdminDashboardStats />
      case 'users':
        return <AdminUserManagement />
      case 'items':
        return <AdminItemManagement />
      case 'claims':
        return <AdminClaimManagement />
      default:
        return <AdminDashboardStats />
    }
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <BarChart3 size={28} />
            <span>FindIt Admin</span>
          </div>
          <button
            className="admin-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="admin-nav">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setMobileMenuOpen(false)
                }}
                className={`admin-nav-item ${activeTab === tab.id ? 'is-active' : ''}`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {admin.name.charAt(0).toUpperCase()}
            </div>
            <div className="admin-user-details">
              <p className="admin-user-name">{admin.name}</p>
              <p className="admin-user-role">{admin.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <button
            className="admin-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="admin-header-title">
            <h1>{tabs.find(t => t.id === activeTab)?.label}</h1>
          </div>

          <button
            onClick={() => nav('/')}
            className="admin-header-link"
            title="Back to main site"
          >
            <Home size={20} />
          </button>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-overlay"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}
