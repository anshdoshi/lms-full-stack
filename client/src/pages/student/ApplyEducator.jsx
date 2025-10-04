import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { educatorAPI } from '../../utils/api';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const ApplyEducator = () => {
    const { user, navigate, isEducator } = useContext(AppContext);

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [applicationStatus, setApplicationStatus] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        if (isEducator) {
            navigate('/educator');
            return;
        }
        checkApplicationStatus();
    }, [isEducator]);

    const checkApplicationStatus = async () => {
        try {
            setCheckingStatus(true);
            const { data } = await educatorAPI.getApplicationStatus();

            if (data.success && data.status !== 'none') {
                setApplicationStatus(data.application);
            }
        } catch (error) {
            console.error('Error checking application status:', error);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (message.trim().length < 20) {
            toast.error('Please provide at least 20 characters explaining why you want to become an educator');
            return;
        }

        setLoading(true);
        try {
            const { data } = await educatorAPI.applyForEducator(message);

            if (data.success) {
                toast.success(data.message);
                setMessage('');
                checkApplicationStatus();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to apply as an educator</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (checkingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <img
                        src={assets.yunay_logo}
                        alt="Yunay-CA Academy"
                        className="w-24 mx-auto mb-4"
                    />
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Become an Educator
                    </h1>
                    <p className="text-lg text-gray-600">
                        Share your knowledge and inspire thousands of learners
                    </p>
                </div>

                {/* Application Status */}
                {applicationStatus ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Application Status
                        </h2>

                        <div className={`p-4 rounded-lg mb-4 ${
                            applicationStatus.status === 'pending' ? 'bg-yellow-50 border border-yellow-200' :
                            applicationStatus.status === 'approved' ? 'bg-green-50 border border-green-200' :
                            'bg-red-50 border border-red-200'
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                    applicationStatus.status === 'pending' ? 'bg-yellow-500' :
                                    applicationStatus.status === 'approved' ? 'bg-green-500' :
                                    'bg-red-500'
                                }`}></div>
                                <span className={`font-semibold ${
                                    applicationStatus.status === 'pending' ? 'text-yellow-700' :
                                    applicationStatus.status === 'approved' ? 'text-green-700' :
                                    'text-red-700'
                                }`}>
                                    {applicationStatus.status === 'pending' ? 'Under Review' :
                                     applicationStatus.status === 'approved' ? 'Approved' :
                                     'Rejected'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <span className="text-sm text-gray-500">Submitted:</span>
                                <p className="font-medium text-gray-700">
                                    {new Date(applicationStatus.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>

                            <div>
                                <span className="text-sm text-gray-500">Your Message:</span>
                                <p className="text-gray-700 mt-1 p-3 bg-gray-50 rounded-lg">
                                    {applicationStatus.message}
                                </p>
                            </div>

                            {applicationStatus.status === 'pending' && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-blue-700 text-sm">
                                        ⏳ Your application is being reviewed by our admin team.
                                        You'll receive an update once it's processed.
                                    </p>
                                </div>
                            )}

                            {applicationStatus.status === 'approved' && (
                                <div className="mt-6">
                                    <button
                                        onClick={() => navigate('/educator')}
                                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition"
                                    >
                                        Go to Educator Dashboard →
                                    </button>
                                </div>
                            )}

                            {applicationStatus.status === 'rejected' && (
                                <div className="mt-6 p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-700 text-sm">
                                        Your application was not approved. Please contact support for more information.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Benefits Section */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Why Become an Educator?
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">💡</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Share Your Expertise</h3>
                                        <p className="text-gray-600 text-sm">
                                            Transform your knowledge into impactful courses
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🌍</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Reach Global Audience</h3>
                                        <p className="text-gray-600 text-sm">
                                            Connect with learners from around the world
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">💰</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Earn Revenue</h3>
                                        <p className="text-gray-600 text-sm">
                                            Get paid for your courses and grow your income
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Track Progress</h3>
                                        <p className="text-gray-600 text-sm">
                                            Monitor student engagement and course performance
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Form */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Submit Your Application
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tell us about yourself <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Why do you want to become an educator? What topics would you teach? What experience do you have? (Minimum 20 characters)"
                                        required
                                        rows={8}
                                        minLength={20}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition resize-none"
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        {message.length} / 20 characters minimum
                                    </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                                        <span>ℹ️</span> What happens next?
                                    </h3>
                                    <ol className="text-sm text-blue-700 space-y-2 ml-6 list-decimal">
                                        <li>Submit your application with a detailed message</li>
                                        <li>Our admin team will review your application</li>
                                        <li>You'll be notified once approved</li>
                                        <li>Access your educator dashboard and start creating courses</li>
                                    </ol>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate('/')}
                                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || message.length < 20}
                                        className="flex-1 bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ApplyEducator;
