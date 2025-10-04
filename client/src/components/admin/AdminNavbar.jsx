import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const AdminNavbar = () => {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 ml-64 fixed top-0 right-0 left-64 z-10">
            <div className="flex items-center justify-between">
                {/* Page Title - will be updated by each page */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
                    <p className="text-sm text-gray-600">Manage your platform</p>
                </div>

                {/* User Menu */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                        <span className="text-xl">🔔</span>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-10 h-10 rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center hover:bg-primary-700 transition">
                                {user?.name?.charAt(0).toUpperCase()}
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="py-2">
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        🏠 Back to Home
                                    </button>
                                    <button
                                        onClick={() => navigate('/educator')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                                    >
                                        👨‍🏫 Educator Dashboard
                                    </button>
                                    <hr className="my-2 border-gray-200" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                                    >
                                        🚪 Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminNavbar;
