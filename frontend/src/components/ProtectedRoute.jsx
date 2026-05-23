import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userEmail, children }) => {
    // Check if the user is authenticated (has an email set from local storage or context)
    if (!userEmail) {
        // Redirect them to the home page if not authenticated
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
