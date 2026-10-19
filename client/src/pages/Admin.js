import { useEffect, useState } from 'react';
import api from '../api';
import Crud from '../components/Crud';
export default function Admin() {
  const [s, setS] = useState({}), [users, setUsers] = useState([]), [orders, setOrders] = useState([]);
  const load = () => { api.get('/admin/stats').then(r => setS(r.data)); api.get('/admin/users').then(r => setUsers(r.data)); api.get('/orders').then(r => setOrders(r.data)); };
  useEffect(load, []);
  const setStatus = async (id, status) => { await api.put(`/orders/${id}/status`, { status }); load(); };
  const delUser = async id => { if (window.confirm('Delete user?')) { await api.delete('/admin/users/' + id).catch(e => alert(e.response?.data?.message)); load(); } };
  return (<>
    <div className="row g-3 mb-4">{Object.entries(s).map(([k, v]) => <div className="col-md-2 col-4" key={k}><div className="card p-3"><div className="small text-muted">{k}</div><div className="stat">{v}</div></div></div>)}</div>
    <div className="card p-3 mb-4"><h3 className="h5">📦 Order approvals</h3><div className="table-responsive"><table className="table table-sm"><tbody>
      {orders.map(o => <tr key={o._id}><td>{o.user?.name}</td><td>₹{o.total}</td><td><select className="form-select form-select-sm" value={o.status} onChange={e => setStatus(o._id, e.target.value)}>{['pending', 'approved', 'shipped', 'delivered', 'rejected'].map(x => <option key={x}>{x}</option>)}</select></td></tr>)}</tbody></table></div></div>
    <div className="card p-3 mb-4"><h3 className="h5">👥 Users</h3><table className="table table-sm"><tbody>
      {users.map(u => <tr key={u._id}><td>{u.name}</td><td>{u.email}</td><td><span className="badge bg-secondary">{u.role}</span></td><td className="text-end"><button className="btn btn-sm btn-outline-danger" onClick={() => delUser(u._id)}>✕</button></td></tr>)}</tbody></table></div>
    <Crud title="🛍️ Manage products" endpoint="/products"
      fields={[{ name: 'name', label: 'Name' }, { name: 'category', label: 'Category' }, { name: 'price', label: 'Price', type: 'number' }, { name: 'unit', label: 'Unit' }, { name: 'emoji', label: 'Emoji' }]}
      columns={[['Name', r => r.emoji + ' ' + r.name], ['Category', r => r.category], ['Price', r => '₹' + r.price]]} />
  </>);
}
