import React, { useContext, useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { educatorAPI } from '../../utils/api';

const Navbar = () => {

  const location = useLocation();
  const isCoursesListPage = location.pathname.includes('/course-list');

  const { user, isEducator, isAdmin, navigate, logout } = useContext(AppContext);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const becomeEducator = async () => {
    try {
      if (isEducator) {
        navigate('/educator');
        return;
      }

      // Navigate to educator application page or open modal
      navigate('/apply-educator');

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCoursesListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className="w-28 lg:w-32 cursor-pointer" />

      {/* Desktop Navigation */}
      <div className="md:flex hidden items-center gap-5 text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              {isAdmin && (
                <Link to='/admin' className="hover:text-primary-600 transition">
                  Admin Portal
                </Link>
              )}
              <button onClick={becomeEducator} className="hover:text-primary-600 transition">
                {isEducator ? 'Educator Dashboard' : 'Become Educator'}
              </button>
              | <Link to='/my-enrollments' className="hover:text-primary-600 transition">
                My Enrollments
              </Link>
            </>
          )}
        </div>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition"
            >
              <img
                src={user.imageUrl || assets.user_icon}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="font-medium text-gray-700">{user.name}</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/my-enrollments"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  My Enrollments
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-gray-700 hover:text-primary-600 font-medium transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-primary-600 text-white px-5 py-2 rounded-full hover:bg-primary-700 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className="flex items-center gap-1 sm:gap-2 max-sm:text-xs">
          {user && (
            <>
              <button onClick={becomeEducator} className="hover:text-primary-600 transition">
                {isEducator ? 'Dashboard' : 'Educator'}
              </button>
              | <Link to='/my-enrollments' className="hover:text-primary-600 transition">
                Courses
              </Link>
            </>
          )}
        </div>

        {user ? (
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="relative"
          >
            <img
              src={user.imageUrl || assets.user_icon}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                  onClick={() => setShowUserMenu(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 text-sm"
                >
                  Logout
                </button>
              </div>
            )}
          </button>
        ) : (
          <Link to="/login">
            <img src={assets.user_icon} alt="Login" className="w-8 h-8" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;