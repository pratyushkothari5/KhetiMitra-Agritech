import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
import { useLang } from '../i18n';
export default function Market() {
  const { t } = useLang(), [products, setP] = useState([]), [orders, setO] = useState([]), [cart, setCart] = useState({}), [msg, setMsg] = useState('');
  const load = () => { api.get('/products').then(r => setP(r.data)); api.get('/orders').then(r => setO(r.data)); };
  useEffect(load, []);
  const lines = Object.entries(cart).map(([id, qty]) => ({ product: id, qty }));
  const total = lines.reduce((s, l) => s + l.qty * (products.find(p => p._id === l.product)?.price || 0), 0);
  const place = async () => { try { await api.post('/orders', { items: lines }); setCart({}); setMsg('Order placed ✔'); load(); } catch (x) { setMsg(errMsg(x)); } };
  return (<div className="row g-3">
    <div className="col-lg-8"><div className="row g-3">{products.map(p => (
      <div className="col-sm-6" key={p._id}><div className="card p-3"><div className="fs-1">{p.emoji}</div><h3 className="h6">{p.name}</h3><div className="stat" style={{ fontSize: '1.4rem' }}>₹{p.price}<small className="text-muted fs-6"> / {p.unit}</small></div>
        <button className="btn btn-primary btn-sm mt-2" onClick={() => setCart({ ...cart, [p._id]: (cart[p._id] || 0) + 1 })}>{t('addCart')}</button></div></div>))}</div></div>
    <div className="col-lg-4">
      <div className="card p-3 mb-3"><h3 className="h5">🛒 Cart</h3>
        {lines.map(l => <div key={l.product} className="d-flex justify-content-between small"><span>{products.find(p => p._id === l.product)?.name} × {l.qty}</span><button className="btn btn-link btn-sm p-0" onClick={() => { const c = { ...cart }; delete c[l.product]; setCart(c); }}>remove</button></div>)}
        <div className="fw-bold my-2">Total: ₹{total}</div><button className="btn btn-primary" disabled={!lines.length} onClick={place}>{t('checkout')}</button>{msg && <div className="small mt-2">{msg}</div>}</div>
      <div className="card p-3"><h3 className="h5">📦 Orders</h3>{orders.map(o => <div key={o._id} className="d-flex justify-content-between small border-bottom py-1"><span>₹{o.total} · {o.items.length} item(s)</span><span className="badge bg-secondary">{o.status}</span></div>)}</div>
    </div></div>);
}
