import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthGuard = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <div className="p-8 text-center text-red-600">Access Denied: You do not have permission to view this page.</div>; // Or redirect
    }

    return <Outlet />;
};

export default AuthGuard;
