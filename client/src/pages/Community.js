import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../i18n';
const experts = [['Dr. Meera Rao', 'Agronomist', '🟢'], ['S. Patel', 'Soil scientist', '🟢'], ['Dr. A. Khan', 'Plant pathologist', '🟡']];
export default function Community() {
  const { user } = useAuth(), { t } = useLang(), [posts, setPosts] = useState([]), [text, setText] = useState('');
  const load = () => api.get('/posts').then(r => setPosts(r.data));
  useEffect(() => { load(); }, []);
  const post = async e => { e.preventDefault(); if (!text.trim()) return; await api.post('/posts', { text }); setText(''); load(); };
  const del = async id => { await api.delete('/posts/' + id); load(); };
  return (<div className="row g-3">
    <div className="col-md-4"><div className="card p-3"><h3 className="h5">👩‍🔬 Expert consultation</h3>{experts.map(e => <div key={e[0]} className="border-bottom py-2">{e[2]} <b>{e[0]}</b><div className="small text-muted">{e[1]}</div></div>)}</div></div>
    <div className="col-md-8"><div className="card p-3"><h3 className="h5">💬 Community forum</h3>
      <form className="d-flex gap-2 mb-3" onSubmit={post}><input className="form-control" placeholder="Ask a question or share a tip…" value={text} onChange={e => setText(e.target.value)} maxLength={500} /><button className="btn btn-primary">{t('ask')}</button></form>
      {posts.map(p => <div key={p._id} className="border-bottom py-2 d-flex justify-content-between"><div><b>{p.authorName}</b> <span className="small text-muted">{new Date(p.createdAt).toLocaleDateString()}</span><div>{p.text}</div></div>{user.role === 'admin' && <button className="btn btn-sm btn-outline-danger align-self-start" onClick={() => del(p._id)}>Remove</button>}</div>)}</div></div>
  </div>);
}
