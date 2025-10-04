import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getDashboard();
            
            if (data.success) {
                setStats(data.stats);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error(error.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: '👥',
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50',
            textColor: 'text-blue-600',
            link: '/admin/users'
        },
        {
            title: 'Total Educators',
            value: stats?.totalEducators || 0,
            icon: '👨‍🏫',
            color: 'bg-green-500',
            bgLight: 'bg-green-50',
            textColor: 'text-green-600',
            link: '/admin/users?role=educator'
        },
        {
            title: 'Total Courses',
            value: stats?.totalCourses || 0,
            icon: '📚',
            color: 'bg-purple-500',
            bgLight: 'bg-purple-50',
            textColor: 'text-purple-600',
            link: '/admin/courses'
        },
        {
            title: 'Pending Applications',
            value: stats?.pendingApplications || 0,
            icon: '📝',
            color: 'bg-yellow-500',
            bgLight: 'bg-yellow-50',
            textColor: 'text-yellow-600',
            link: '/admin/applications'
        },
        {
            title: 'Total Enrollments',
            value: stats?.totalEnrollments || 0,
            icon: '🎓',
            color: 'bg-indigo-500',
            bgLight: 'bg-indigo-50',
            textColor: 'text-indigo-600'
        },
        {
            title: 'Total Revenue',
            value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: '💰',
            color: 'bg-emerald-500',
            bgLight: 'bg-emerald-50',
            textColor: 'text-emerald-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your platform.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        onClick={() => stat.link && navigate(stat.link)}
                        className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
                            stat.link ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`w-16 h-16 ${stat.bgLight} rounded-full flex items-center justify-center`}>
                                <span className="text-3xl">{stat.icon}</span>
                            </div>
                        </div>
                        {stat.link && (
                            <div className="mt-4 flex items-center text-sm text-primary-600 font-medium">
                                View details →
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View all →
                        </button>
                    </div>
                    {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentUsers.slice(0, 5).map((user) => (
                                <div key={user._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-semibold flex items-center justify-center">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                        user.role === 'educator' ? 'bg-green-100 text-green-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {user.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No recent users</p>
                    )}
                </div>

                {/* Pending Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pending Applications</h2>
                        <button
                            onClick={() => navigate('/admin/applications')}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            View all →
                        </button>
                    </div>
                    {stats?.recentApplications && stats.recentApplications.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentApplications.slice(0, 5).map((application) => (
                                <div key={application._id} className="p-3 hover:bg-gray-50 rounded-lg transition">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-medium text-gray-900">{application.userId?.name}</p>
                                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                                            Pending
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{application.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">
                                        {new Date(application.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No pending applications</p>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate('/admin/users')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
                    >
                        <span className="text-2xl mb-2 block">👥</span>
                        <p className="font-semibold text-gray-900">Manage Users</p>
                        <p className="text-sm text-gray-600 mt-1">View and manage all users</p>
                    </button>
                    <button
                        onClick={() => navigate('/admin/applications')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
                    >
                        <span className="text-2xl mb-2 block">📝</span>
                        <p className="font-semibold text-gray-900">Review Applications</p>
                        <p className="text-sm text-gray-600 mt-1">Approve educator requests</p>
                    </button>
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
                    >
                        <span className="text-2xl mb-2 block">📚</span>
                        <p className="font-semibold text-gray-900">Manage Courses</p>
                        <p className="text-sm text-gray-600 mt-1">Oversee all courses</p>
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition text-left"
                    >
                        <span className="text-2xl mb-2 block">🏠</span>
                        <p className="font-semibold text-gray-900">View Platform</p>
                        <p className="text-sm text-gray-600 mt-1">See student view</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
