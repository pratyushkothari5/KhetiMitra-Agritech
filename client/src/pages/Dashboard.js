import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
export default function Dashboard() {
  const { user } = useAuth(), { t } = useLang(), [d, setD] = useState(null), [alerts, setAlerts] = useState([]);
  useEffect(() => { api.get('/dashboard').then(r => setD(r.data)); api.get('/weather/alerts').then(r => setAlerts(r.data)).catch(() => {}); }, []);
  if (!d) return <p>Loading…</p>;
  return (<>
    <div className="hero mb-4"><h2>{t('namaste')}, {user.name}!</h2><p className="mb-0 text-muted">{t('sub')}</p></div>
    <div className="row g-3 mb-4">
      {[['farmsN', d.farms], ['cropsN', d.crops], ['ordersN', d.orders]].map(([k, v]) => <div className="col-4" key={k}><div className="card p-3"><div className="text-muted small">{t(k)}</div><div className="stat">{v}</div></div></div>)}
    </div>
    <div className="row g-3">
      <div className="col-md-7"><div className="card p-3"><h3 className="h5">{t('yield')}</h3>
        <ResponsiveContainer width="100%" height={240}><BarChart data={d.yieldByCrop}><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="yield" fill="#2f6b3a" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
      <div className="col-md-5"><div className="card p-3"><h3 className="h5">⚠️ Alerts</h3>
        {alerts.slice(0, 4).map((a, i) => <div key={i} className="border-bottom py-1"><span className={`badge bg-${a.level === 'high' ? 'danger' : 'warning'} me-2`}>{a.level}</span><b>{a.title}</b><div className="small text-muted">{a.date}</div></div>)}
        {!alerts.length && <p className="text-muted mb-0">No alerts this week 🎉</p>}</div></div>
    </div></>);
}
