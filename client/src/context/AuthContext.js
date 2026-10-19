import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const Ctx = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null), [loading, setLoading] = useState(!!localStorage.getItem('token'));
  useEffect(() => { if (localStorage.getItem('token')) api.get('/auth/me').then(r => setUser(r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false)); }, []);
  const authenticate = async (path, body) => { const { data } = await api.post(path, body); localStorage.setItem('token', data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem('token'); setUser(null); };
  return <Ctx.Provider value={{ user, loading, login: b => authenticate('/auth/login', b), register: b => authenticate('/auth/register', b), logout }}>{children}</Ctx.Provider>;
};
export const useAuth = () => useContext(Ctx);
