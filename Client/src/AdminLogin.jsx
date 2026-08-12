import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, AlertCircle, Loader } from 'lucide-react'
import { request } from './api'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const nav = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')

    try {
      const response = await request('/admin/login', {
        method: 'POST',
        body: JSON.stringify(form)
      })

      if (response.success) {
        localStorage.setItem('findit_admin_token', response.token)
        localStorage.setItem('findit_admin', JSON.stringify(response.admin))
        nav('/admin/dashboard')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <div className="admin-logo-circle">
              <LogIn size={32} />
            </div>
            <h1>Admin Portal</h1>
            <p>FindIt Campus Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="admin-error-message">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <div className="admin-form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="admin@findit.com"
                value={form.email}
                onChange={handleChange}
                required
                disabled={busy}
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                minLength="6"
                disabled={busy}
              />
            </div>

            <button
              type="submit"
              className="admin-submit-btn"
              disabled={busy}
            >
              {busy ? (
                <>
                  <Loader size={18} className="spinner" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          <div className="admin-login-footer">
            <p className="demo-credentials">
              <strong>Demo Credentials:</strong><br />
              Email: admin@findit.com<br />
              Password: admin@123
            </p>
          </div>
        </div>

        <div className="admin-login-info">
          <h2>Admin Features</h2>
          <ul>
            <li>📊 View system statistics and analytics</li>
            <li>👥 Manage user accounts and permissions</li>
            <li>📦 Monitor and manage lost & found items</li>
            <li>✅ Review and approve claims</li>
            <li>🔒 Full system access and control</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
