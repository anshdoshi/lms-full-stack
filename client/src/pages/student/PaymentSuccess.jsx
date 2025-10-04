import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { assets } from '../../assets/assets';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      if (courseId) {
        navigate(`/player/${courseId}`);
      } else {
        navigate('/my-enrollments');
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [courseId, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Payment Successful!
        </h1>
        <p className="text-gray-600 mb-2">
          Your enrollment has been confirmed.
        </p>
        {paymentId && (
          <p className="text-sm text-gray-500 mb-6">
            Payment ID: {paymentId}
          </p>
        )}

        {/* Success Details */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <img src={assets.blue_tick_icon} alt="tick" className="w-5 h-5 mt-0.5" />
            <div className="text-left">
              <p className="text-sm text-gray-700 mb-1">
                ✓ Payment processed successfully
              </p>
              <p className="text-sm text-gray-700 mb-1">
                ✓ Course access granted
              </p>
              <p className="text-sm text-gray-700">
                ✓ Confirmation email sent
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => courseId ? navigate(`/player/${courseId}`) : navigate('/my-enrollments')}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Learning Now
          </button>
          <button
            onClick={() => navigate('/my-enrollments')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            View My Enrollments
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full text-blue-600 py-2 font-medium hover:underline"
          >
            Back to Home
          </button>
        </div>

        {/* Auto Redirect Notice */}
        <p className="text-xs text-gray-500 mt-6">
          Redirecting to course player in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
