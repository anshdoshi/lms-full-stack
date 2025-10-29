import React from 'react';

const MaintenanceMode = ({ feature = 'AI Service' }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl shadow-lg p-8 text-center border-2 border-yellow-200">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Under Maintenance
        </h2>

        {/* Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Our <span className="font-semibold text-yellow-700">{feature}</span> is currently under maintenance. 
          We're working hard to bring you an amazing AI-powered learning experience!
        </p>

        {/* Info Box */}
        <div className="bg-white rounded-lg p-4 mb-6 border border-yellow-200">
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-semibold">Coming Soon:</span>
          </p>
          <ul className="text-sm text-gray-600 space-y-1 text-left">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>AI-generated practice tests tailored for CA students</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>Intelligent chat tutor for instant doubt resolution</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">•</span>
              <span>Personalized performance analysis and recommendations</span>
            </li>
          </ul>
        </div>

        {/* Action */}
        <div className="text-sm text-gray-500">
          <p>Please check back later or contact support for more information.</p>
        </div>

        {/* Decorative Element */}
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
