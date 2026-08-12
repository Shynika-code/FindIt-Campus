import React, { useState, useEffect } from 'react'
import { AlertCircle, Check, X } from 'lucide-react'
import { request } from './api'

export default function AdminClaimManagement() {
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})

  useEffect(() => {
    fetchClaims()
  }, [page, statusFilter])

  const fetchClaims = async () => {
    try {
      setLoading(true)
      setError('')
      const query = new URLSearchParams({
        page,
        limit: 10,
        status: statusFilter
      })

      const response = await request(`/admin/claims?${query}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        setClaims(response.data)
        setPagination(response.pagination)
      } else {
        setError(response.message || 'Failed to fetch claims')
      }
    } catch (err) {
      setError(err.message || 'Error loading claims')
    } finally {
      setLoading(false)
    }
  }

  const updateClaimStatus = async (claimId, newStatus) => {
    try {
      const response = await request(`/admin/claims/${claimId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('findit_admin_token')}`
        }
      })

      if (response.success) {
        fetchClaims()
      } else {
        setError(response.message || 'Failed to update claim')
      }
    } catch (err) {
      setError(err.message || 'Error updating claim')
    }
  }

  if (loading && claims.length === 0) {
    return <div className="admin-loading"><div className="admin-loader"></div></div>
  }

  return (
    <div className="admin-claims-page">
      {/* Status Filter */}
      <div className="admin-filters-section">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="admin-filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="admin-error-banner">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Claims Table */}
      <div className="admin-table-container">
        {claims.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Claimant</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {claims.map(claim => (
                <tr key={claim._id}>
                  <td className="title-cell">
                    <p className="item-title">{claim.itemId?.title || 'Unknown Item'}</p>
                  </td>
                  <td>
                    <div>
                      <p className="user-name">{claim.userId?.name || 'Unknown'}</p>
                      <p className="user-email">{claim.userId?.email}</p>
                    </div>
                  </td>
                  <td className="message-cell">
                    <p className="claim-message">{claim.message || 'No message'}</p>
                  </td>
                  <td>
                    <span className={`status-badge ${claim.status}`}>
                      {claim.status}
                    </span>
                  </td>
                  <td>{new Date(claim.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="admin-claim-actions">
                      {claim.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateClaimStatus(claim._id, 'approved')}
                            className="admin-action-btn approve"
                            title="Approve claim"
                          >
                            <Check size={16} />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => updateClaimStatus(claim._id, 'rejected')}
                            className="admin-action-btn reject"
                            title="Reject claim"
                          >
                            <X size={16} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {claim.status !== 'pending' && (
                        <span className="action-locked">
                          {claim.status === 'approved' ? 'Approved ✓' : 'Rejected ✕'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="admin-empty-state">
            <p>No claims found</p>
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
        <p>Total Claims: <strong>{pagination.total}</strong></p>
      </div>
    </div>
  )
}
