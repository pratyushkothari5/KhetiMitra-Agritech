import { useEffect, useState } from 'react';
import api, { errMsg } from '../api';
// Reusable CRUD table + form. fields: [{name,label,type,options,ref}], columns: [[label, row=>value]]
export default function Crud({ title, endpoint, fields, columns }) {
  const [rows, setRows] = useState([]), [form, setForm] = useState({}), [edit, setEdit] = useState(null), [refs, setRefs] = useState({}), [err, setErr] = useState('');
  const load = () => api.get(endpoint).then(r => setRows(r.data));
  useEffect(() => { load(); fields.filter(f => f.ref).forEach(f => api.get(f.ref).then(r => setRefs(p => ({ ...p, [f.name]: r.data })))); }, []); // eslint-disable-line
  const submit = async e => {
    e.preventDefault(); setErr('');
    try { edit ? await api.put(`${endpoint}/${edit}`, form) : await api.post(endpoint, form); setForm({}); setEdit(null); load(); }
    catch (x) { setErr(errMsg(x)); }
  };
  const remove = async id => { if (window.confirm('Delete this record?')) { await api.delete(`${endpoint}/${id}`); load(); } };
  const startEdit = r => { setEdit(r._id); setForm(Object.fromEntries(fields.map(f => [f.name, f.ref ? (r[f.name]?._id || r[f.name]) : r[f.name]]))); };
  return (
    <div className="card p-3 mb-4">
      <h3 className="h5">{title}</h3>
      {err && <div className="alert alert-danger py-1">{err}</div>}
      <form className="row g-2 mb-3" onSubmit={submit}>
        {fields.map(f => (
          <div className="col-md-3 col-6" key={f.name}>
            <label className="form-label small mb-0">{f.label}</label>
            {f.options || f.ref ? (
              <select className="form-select" value={form[f.name] || ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })}>
                <option value="">Select…</option>
                {f.ref ? (refs[f.name] || []).map(o => <option key={o._id} value={o._id}>{o.name}</option>) : f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            ) : <input className="form-control" type={f.type || 'text'} value={form[f.name] ?? ''} onChange={e => setForm({ ...form, [f.name]: e.target.value })} />}
          </div>))}
        <div className="col-12">
          <button className="btn btn-primary btn-sm">{edit ? 'Update' : 'Add'}</button>
          {edit && <button type="button" className="btn btn-link btn-sm" onClick={() => { setEdit(null); setForm({}); }}>Cancel</button>}
        </div>
      </form>
      <div className="table-responsive"><table className="table table-sm align-middle">
        <thead><tr>{columns.map(c => <th key={c[0]}>{c[0]}</th>)}<th /></tr></thead>
        <tbody>{rows.map(r => (
          <tr key={r._id}>{columns.map(c => <td key={c[0]}>{c[1](r)}</td>)}
            <td className="text-end"><button className="btn btn-sm btn-outline-secondary me-1" onClick={() => startEdit(r)}>Edit</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(r._id)}>✕</button></td></tr>))}
          {!rows.length && <tr><td colSpan={columns.length + 1} className="text-muted">No records yet.</td></tr>}</tbody>
      </table></div>
    </div>);
}
