import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';

const Admin = () => {
    const { user, loading, isAdmin } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAdmin) {
            navigate('/');
        }
    }, [loading, isAdmin, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="ml-64">
                <AdminNavbar />
                <main className="pt-20 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Admin;
