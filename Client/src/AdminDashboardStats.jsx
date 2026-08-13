import React, { useState, useEffect } from 'react'
import { Users, Package, CheckCircle, TrendingUp, Eye, Calendar } from 'lucide-react'
import { request } from './api'

export default function AdminDashboardStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await request('/admin/dashboard/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.message || 'Failed to fetch statistics')
      }
    } catch (err) {
      setError(err.message || 'Error loading statistics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="admin-loading"><div className="admin-loader"></div></div>
  }

  if (error) {
    return <div className="admin-error">{error}</div>
  }

  if (!stats) {
    return <div className="admin-error">No data available</div>
  }

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className={`stat-card stat-${color}`}>
      <div className="stat-icon">
        <Icon size={28} />
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  )

  return (
    <div className="admin-stats-page">
      {/* Key Metrics */}
      <section className="admin-metrics">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          <StatCard
            icon={Users}
            label="Total Users"
            value={stats.totalUsers}
            color="blue"
          />
          <StatCard
            icon={Package}
            label="Total Items"
            value={stats.totalItems}
            color="purple"
          />
          <StatCard
            icon={Eye}
            label="Active Items"
            value={stats.activeItems}
            color="green"
          />
          <StatCard
            icon={CheckCircle}
            label="Total Claims"
            value={stats.totalClaims}
            color="coral"
          />
        </div>
      </section>

      {/* Item Status Overview */}
      <section className="admin-overview">
        <div className="overview-card">
          <h3>Item Status Overview</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <span className="overview-label">Lost Items</span>
              <span className="overview-value">{stats.lostItems}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Found Items</span>
              <span className="overview-value">{stats.foundItems}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Claimed Items</span>
              <span className="overview-value">{stats.claimedItems}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Returned Items</span>
              <span className="overview-value">{stats.returnedItems}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Pending Claims</span>
              <span className="overview-value">{stats.pendingClaims}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Items by Category */}
      <section className="admin-categories">
        <div className="category-card">
          <h3>Top Item Categories</h3>
          <div className="category-list">
            {stats.itemsByCategory && stats.itemsByCategory.length > 0 ? (
              stats.itemsByCategory.map((cat, idx) => (
                <div key={idx} className="category-item">
                  <span className="category-name">{cat._id}</span>
                  <div className="category-bar">
                    <div
                      className="category-progress"
                      style={{
                        width: `${(cat.count / Math.max(...stats.itemsByCategory.map(c => c.count))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="category-count">{cat.count}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No category data available</p>
            )}
          </div>
        </div>
      </section>

      {/* Recent Items */}
      <section className="admin-recent">
        <div className="recent-card">
          <h3>Recent Items</h3>
          {stats.recentItems && stats.recentItems.length > 0 ? (
            <div className="recent-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Posted By</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentItems.map(item => (
                    <tr key={item._id}>
                      <td>{item.title}</td>
                      <td>
                        <span className={`badge ${item.type}`}>
                          {item.type === 'lost' ? 'Lost' : 'Found'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${item.status}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>{item.postedBy?.name || 'Unknown'}</td>
                      <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No recent items</p>
          )}
        </div>
      </section>

      {/* Recent Claims */}
      <section className="admin-recent-claims">
        <div className="recent-card">
          <h3>Recent Claims</h3>
          {stats.recentClaims && stats.recentClaims.length > 0 ? (
            <div className="recent-table">
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentClaims.map(claim => (
                    <tr key={claim._id}>
                      <td>{claim.itemId?.title || 'Unknown Item'}</td>
                      <td>{claim.claimantId?.name || 'Unknown'}</td>
                      <td>
                        <span className={`status-badge ${claim.status}`}>
                          {claim.status}
                        </span>
                      </td>
                      <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No recent claims</p>
          )}
        </div>
      </section>
    </div>
  )
}
