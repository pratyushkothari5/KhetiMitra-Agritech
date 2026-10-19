import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
// Code splitting: each page is loaded on demand
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Farms = lazy(() => import('./pages/Farms'));
const Soil = lazy(() => import('./pages/Soil'));
const Weather = lazy(() => import('./pages/Weather'));
const Market = lazy(() => import('./pages/Market'));
const Community = lazy(() => import('./pages/Community'));
const Admin = lazy(() => import('./pages/Admin'));

const Guard = ({ admin, children }) => {
  const { user, loading } = useAuth();
  if (loading) return <p className="p-4">Loading…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};
export default function App() {
  return (<>
    <Navbar />
    <div className="container py-4">
      <Suspense fallback={<p>Loading…</p>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login register />} />
          <Route path="/" element={<Guard><Dashboard /></Guard>} />
          <Route path="/farms" element={<Guard><Farms /></Guard>} />
          <Route path="/soil" element={<Guard><Soil /></Guard>} />
          <Route path="/weather" element={<Guard><Weather /></Guard>} />
          <Route path="/market" element={<Guard><Market /></Guard>} />
          <Route path="/community" element={<Guard><Community /></Guard>} />
          <Route path="/admin" element={<Guard admin><Admin /></Guard>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </div>
  </>);
}
