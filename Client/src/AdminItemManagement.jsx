import React, { useState, useEffect } from 'react'
import { Search, Trash2, Edit, AlertCircle } from 'lucide-react'
import { request } from './api'

export default function AdminItemManagement() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editStatus, setEditStatus] = useState('')

  useEffect(() => {
    fetchItems()
  }, [page, search, typeFilter, statusFilter])

  const fetchItems = async () => {
    try {
      setLoading(true)
      setError('')
      const query = new URLSearchParams({
        page,
        limit: 10,
        search,
        type: typeFilter,
        status: statusFilter
      })

      const response = await request(`/admin/items?${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        setItems(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch items')
      }
    } catch (err) {
      setError(err.message || 'Error loading items')
    } finally {
      setLoading(false)
    }
  }

  const updateItemStatus = async (itemId, newStatus) => {
    try {
      const response = await request(`/admin/items/${itemId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        fetchItems()
        setEditingId(null)
      } else {
        setError(response.message || 'Failed to update item')
      }
    } catch (err) {
      setError(err.message || 'Error updating item')
    }
  }

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return

    try {
      const response = await request(`/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        fetchItems()
      } else {
        setError(response.message || 'Failed to delete item')
      }
    } catch (err) {
      setError(err.message || 'Error deleting item')
    }
  }

  const handleSearch = (value) => {
    setSearch(value)
    setPage(1)
  }

  if (loading && items.length === 0) {
    return <div className="admin-loading"><div className="admin-loader"></div></div>
  }

  return (
    <div className="admin-items-page">
      {/* Filters */}
      <div className="admin-filters-section">
        <div className="admin-search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search items by title or description..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value)
            setPage(1)
          }}
          className="admin-filter-select"
        >
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="admin-filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="claimed">Claimed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      {error && (
        <div className="admin-error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Items Table */}
      <div className="admin-table-container">
        {items.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Category</th>
                <th>Status</th>
                <th>Posted By</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td className="title-cell">
                    <div>
                      <p className="item-title">{item.title}</p>
                      <p className="item-description">{item.description}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${item.type}`}>
                      {item.type === 'lost' ? 'Lost' : 'Found'}
                    </span>
                  </td>
                  <td>{item.category}</td>
                  <td>
                    {editingId === item._id ? (
                      <select
                        value={editStatus}
                        onChange={(e) => {
                          setEditStatus(e.target.value)
                          updateItemStatus(item._id, e.target.value)
                        }}
                        className="admin-status-select"
                      >
                        <option value="active">Active</option>
                        <option value="claimed">Claimed</option>
                        <option value="returned">Returned</option>
                      </select>
                    ) : (
                      <span className={`status-badge ${item.status}`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                  <td>{item.postedBy?.name || 'Unknown'}</td>
                  <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-actions">
                      {editingId !== item._id ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingId(item._id)
                              setEditStatus(item.status)
                            }}
                            className="admin-icon-btn edit"
                            title="Edit status"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(item._id)}
                            className="admin-icon-btn delete"
                            title="Delete item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setEditingId(null)}
                          className="admin-icon-btn cancel"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <p>No items found</p>
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
        <p>Total Items: <strong>{pagination.total}</strong></p>
      </div>
    </div>
  )
}
