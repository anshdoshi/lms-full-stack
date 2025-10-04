import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading, isEducator, isAdmin } = useContext(AppContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role requirements
    if (requiredRole === 'admin' && !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Access Denied. Admin access required.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (requiredRole === 'educator' && !isEducator) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Access Denied. Educator access required.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
