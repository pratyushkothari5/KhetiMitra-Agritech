import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
import { errMsg } from '../api';
export default function Login({ register }) {
  const { login, register: reg } = useAuth(), { t } = useLang(), nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', location: 'Bhopal', language: 'en' }), [err, setErr] = useState('');
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => { e.preventDefault(); setErr(''); try { await (register ? reg(f) : login(f)); nav('/'); } catch (x) { setErr(errMsg(x)); } };
  return (
    <div className="card p-4 mx-auto" style={{ maxWidth: 420 }}>
      <div className="text-center fs-1">🌾</div><h2 className="text-center">{register ? t('register') : t('login')}</h2>
      {err && <div className="alert alert-danger py-1">{err}</div>}
      <form onSubmit={submit}>
        {register && <input className="form-control mb-2" placeholder="Name" value={f.name} onChange={set('name')} required />}
        <input className="form-control mb-2" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input className="form-control mb-2" type="password" placeholder="Password" value={f.password} onChange={set('password')} required minLength={6} />
        {register && <input className="form-control mb-2" placeholder="Village / City" value={f.location} onChange={set('location')} />}
        <button className="btn btn-primary w-100">{register ? t('register') : t('login')}</button>
      </form>
      <p className="text-center mt-3 mb-0 small">{register ? <Link to="/login">{t('login')}</Link> : <Link to="/register">{t('register')}</Link>}</p>
    </div>);
}
