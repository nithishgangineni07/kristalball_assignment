import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Purchases from './pages/Purchases';
import Transfers from './pages/Transfers';
import Assignments from './pages/Assignments';
import Layout from './components/Layout';
import AuthGuard from './components/AuthGuard';

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AuthGuard />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route element={<AuthGuard allowedRoles={['admin', 'logistics']} />}>
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/transfers" element={<Transfers />} />
          </Route>

          <Route element={<AuthGuard allowedRoles={['admin', 'commander']} />}>
            <Route path="/assignments" element={<Assignments />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
