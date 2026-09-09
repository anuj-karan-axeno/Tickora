import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { userData, authLoading } = useContext(AuthContext);

    // If still checking session, show a loader
    if (authLoading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--text-primary)', backgroundColor: 'var(--color-3)' }}>Loading...</div>;
    }

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
