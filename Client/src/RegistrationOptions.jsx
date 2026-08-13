import { Link } from 'react-router-dom'
import { CircleUserRound, ShieldCheck } from 'lucide-react'

export default function RegistrationOptions() {
  return <section className="auth-page"><div className="auth-aside"><p className="eyebrow">FINDIT CAMPUS</p><h1>Choose your<br/><em>account type.</em></h1><p>Set up an account for the campus lost-and-found community.</p></div><div className="auth-card"><h2>Create your account</h2><p>Select the type of account you want to create.</p><div className="account-type-options"><Link className="account-type-card" to="/register/student"><CircleUserRound/><span><strong>Campus member</strong><small>Report items and send claims.</small></span></Link><Link className="account-type-card admin" to="/register/admin"><ShieldCheck/><span><strong>Administrator</strong><small>Manage users, items, and claims. Requires a setup key.</small></span></Link></div><p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p></div></section>
}
