import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/assets';

const AdminSidebar = () => {
    const menuItems = [
        {
            path: '/admin',
            icon: '📊',
            label: 'Dashboard',
            end: true
        },
        {
            path: '/admin/users',
            icon: '👥',
            label: 'User Management'
        },
        {
            path: '/admin/applications',
            icon: '📝',
            label: 'Educator Applications'
        },
        {
            path: '/admin/courses',
            icon: '📚',
            label: 'Course Management'
        }
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen fixed left-0 top-0 overflow-y-auto">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <img 
                    src={assets.yunay_logo}
                    alt="Yunay-CA Academy"
                    className="w-40 mx-auto"
                />
                <p className="text-center text-sm text-gray-600 mt-2 font-medium">
                    Admin Portal
                </p>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                        isActive
                                            ? 'bg-primary-600 text-white shadow-md'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`
                                }
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
                <p className="text-xs text-gray-500 text-center">
                    © 2025 Yunay-CA Academy
                </p>
            </div>
        </div>
    );
};

export default AdminSidebar;
