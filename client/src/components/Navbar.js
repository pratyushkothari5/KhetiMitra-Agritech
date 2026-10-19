import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
export default function Navbar() {
  const { user, logout } = useAuth(), { t, lang, setLang } = useLang(), nav = useNavigate();
  const links = [['/', 'dashboard'], ['/farms', 'farms'], ['/soil', 'soil'], ['/weather', 'weather'], ['/market', 'market'], ['/community', 'community']];
  if (user?.role === 'admin') links.push(['/admin', 'admin']);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-3">
      <span className="navbar-brand brand">🌾 KhetiMitra</span>
      <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv"><span className="navbar-toggler-icon" /></button>
      <div className="collapse navbar-collapse" id="nv">
        <ul className="navbar-nav me-auto">
          {user && links.map(([to, k]) => <li className="nav-item" key={to}><NavLink end className="nav-link" to={to}>{t(k)}</NavLink></li>)}
        </ul>
        <select className="form-select form-select-sm w-auto me-2" value={lang} onChange={e => setLang(e.target.value)} aria-label="Language">
          <option value="en">English</option><option value="hi">हिन्दी</option>
        </select>
        {user && <button className="btn btn-sm btn-light" onClick={() => { logout(); nav('/login'); }}>{t('logout')}</button>}
      </div>
    </nav>);
}
