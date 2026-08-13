import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, PackageSearch, ShieldCheck } from 'lucide-react'
import { request } from './api'

export default function AdminRegister() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', setupKey: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const update = key => event => setForm(current => ({ ...current, [key]: event.target.value }))
  const submit = async event => {
    event.preventDefault(); setBusy(true); setError('')
    try { await request('/admin/register', { method: 'POST', body: JSON.stringify(form) }); nav('/admin/login') }
    catch (requestError) { setError(requestError.message) }
    finally { setBusy(false) }
  }

  return <section className="auth-page"><div className="auth-aside"><p className="eyebrow">FINDIT CAMPUS</p><h1>Admin<br/><em>account setup.</em></h1><p>Create a secure administrator account for your campus team.</p></div><div className="auth-card"><Link className="brand auth-brand" to="/"><span className="brand-mark"><PackageSearch size={20}/></span>FindIt<span className="brand-accent">Campus</span></Link><div className="admin-register-heading"><ShieldCheck size={22}/><div><h2>Create an admin account</h2><p>Requires the private administrator setup key.</p></div></div><form onSubmit={submit}><label>Name<input required value={form.name} onChange={update('name')} placeholder="Administrator name"/></label><label>Email<input required type="email" value={form.email} onChange={update('email')} placeholder="admin@campus.edu"/></label><label>Password<input required type="password" minLength="12" value={form.password} onChange={update('password')} placeholder="At least 12 characters"/></label><label>Admin setup key<input required type="password" value={form.setupKey} onChange={update('setupKey')} placeholder="Provided by your system owner"/></label>{error && <div className="notice error">{error}</div>}<button className="button button-dark auth-submit" disabled={busy}>{busy ? 'Creating…' : 'Create admin account'} <ArrowRight size={17}/></button></form><p className="auth-switch">Already an administrator? <Link to="/admin/login">Sign in to the admin portal</Link></p></div></section>
}
