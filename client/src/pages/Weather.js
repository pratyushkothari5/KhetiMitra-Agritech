import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api';
export default function Weather() {
  const [w, setW] = useState(null), [alerts, setAlerts] = useState([]);
  useEffect(() => { api.get('/weather').then(r => setW(r.data)); api.get('/weather/alerts').then(r => setAlerts(r.data)); }, []);
  if (!w) return <p>Loading forecast…</p>;
  return (<>
    <div className="card p-3 mb-3"><h3 className="h5">☀️ 7-day forecast <span className="badge bg-secondary">{w.source}</span></h3>
      <div className="d-flex gap-2 overflow-auto mb-3">{w.days.map(d => <div key={d.date} className="border rounded p-2 text-center" style={{ minWidth: 90 }}><div className="small">{d.date.slice(5)}</div><b>{Math.round(d.tempC)}°C</b><div className="small text-muted">💧{d.rainProb}%</div></div>)}</div>
      <ResponsiveContainer width="100%" height={200}><LineChart data={w.days}><XAxis dataKey="date" tickFormatter={d => d.slice(5)} /><YAxis /><Tooltip /><Line dataKey="tempC" stroke="#e8a317" strokeWidth={3} /><Line dataKey="rainProb" stroke="#2f6b3a" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
    <div className="card p-3"><h3 className="h5">🐛 Pest &amp; weather alerts</h3>
      {alerts.map((a, i) => <div key={i} className="d-flex justify-content-between border-bottom py-2"><div><b>{a.title}</b> <span className="text-muted small">{a.date}</span><div className="small">{a.action}</div></div><span className={`badge align-self-start bg-${a.level === 'high' ? 'danger' : 'warning'}`}>{a.level}</span></div>)}
      {!alerts.length && <p className="text-muted mb-0">No alerts in the forecast.</p>}</div></>);
}
