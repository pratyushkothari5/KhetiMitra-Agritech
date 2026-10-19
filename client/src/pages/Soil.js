import { useState } from 'react';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';
export default function Soil() {
  const { t } = useLang(), [f, setF] = useState({ ph: 6.5, nitrogen: 190, moisture: 60 }), [res, setRes] = useState(null), [err, setErr] = useState('');
  const run = async e => { e.preventDefault(); setErr(''); try { setRes((await api.post('/crops/analyse-soil', f)).data); } catch (x) { setErr(errMsg(x)); } };
  return (
    <div className="row g-3">
      <div className="col-md-5"><form className="card p-3" onSubmit={run}><h3 className="h5">🧪 {t('analyse')}</h3>
        {[['ph', 'pH', 0.1], ['nitrogen', 'Nitrogen (kg/ha)', 1], ['moisture', 'Moisture (%)', 1]].map(([k, l, s]) => (
          <div key={k}><label className="form-label small mb-0">{l}</label><input className="form-control mb-2" type="number" step={s} value={f[k]} onChange={e => setF({ ...f, [k]: e.target.value })} /></div>))}
        <button className="btn btn-primary">{t('analyse')}</button></form></div>
      <div className="col-md-7">{err && <div className="alert alert-danger">{err}</div>}
        {res && <div className="card p-3"><div className="text-muted small">Soil health · {res.rating}</div><div className="stat">{res.score}/100</div>
          <div className="progress mb-3"><div className="progress-bar bg-success" style={{ width: res.score + '%' }} /></div>
          <ul className="mb-0">{res.advice.map((a, i) => <li key={i}>{a}</li>)}</ul></div>}</div>
    </div>);
}
