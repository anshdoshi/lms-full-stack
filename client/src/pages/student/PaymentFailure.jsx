import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const reason = searchParams.get('reason') || 'Payment was not completed';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Failure Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Failure Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          {reason}
        </p>

        {/* Failure Details */}
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <div className="text-left">
            <p className="text-sm text-gray-700 mb-2">
              <strong>What happened?</strong>
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Your payment could not be processed. This might be due to:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 ml-4">
              <li>• Insufficient funds</li>
              <li>• Payment gateway timeout</li>
              <li>• Cancelled by user</li>
              <li>• Network connectivity issues</li>
            </ul>
          </div>
        </div>

        {/* Support Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700">
            <strong>Need Help?</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Contact our support team at{' '}
            <a href="mailto:support@yunay-ca-academy.com" className="text-blue-600 hover:underline">
              support@yunay-ca-academy.com
            </a>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => courseId ? navigate(`/course/${courseId}`) : navigate('/course-list')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/course-list')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Browse Other Courses
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-blue-600 py-2 font-medium hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
