import React, { useState, useEffect } from 'react'
import { Search, Lock, Unlock, AlertCircle } from 'lucide-react'
import { request } from './api'

export default function AdminUserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchUsers()
  }, [page, search])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await request(`/admin/users?page=${page}&limit=10&search=${search}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        setUsers(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch users')
      }
    } catch (err) {
      setError(err.message || 'Error loading users')
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId) => {
    try {
      const response = await request(`/admin/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        fetchUsers()
      } else {
        setError(response.message || 'Failed to update user status')
      }
    } catch (err) {
      setError(err.message || 'Error updating user status')
    }
  }

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  if (loading && users.length === 0) {
    return <div className="admin-loading"><div className="admin-loader"></div></div>
  }

  return (
    <div className="admin-users-page">
      {/* Search Bar */}
      <div className="admin-search-section">
        <div className="admin-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="admin-error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="admin-table-container">
        {users.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className={user.blocked ? 'is-blocked' : ''}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                      {user.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => toggleUserStatus(user._id)}
                      className={`admin-action-btn ${user.blocked ? 'unblock' : 'block'}`}
                      title={user.blocked ? 'Unblock user' : 'Block user'}
                    >
                      {user.blocked ? (
                        <>
                          <Unlock size={16} />
                          <span>Unblock</span>
                        </>
                      ) : (
                        <>
                          <Lock size={16} />
                          <span>Block</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <p>No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="admin-pagination">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => setPage(Math.min(pagination.pages, page + 1))}
            disabled={page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}

      <div className="admin-stats-summary">
        <p>Total Users: <strong>{pagination.total}</strong></p>
      </div>
    </div>
  )
}
