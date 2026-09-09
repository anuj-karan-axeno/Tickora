import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../hooks/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { userData, authLoading } = useContext(AuthContext);

    // If still checking session, show a loader
    if (authLoading) {
        return <div className="loader-screen">Loading...</div>;
    }

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
