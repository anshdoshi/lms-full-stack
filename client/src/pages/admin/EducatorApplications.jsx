import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const EducatorApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('pending');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, [statusFilter]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const { data } = await adminAPI.getEducatorApplications(statusFilter);

            if (data.success) {
                setApplications(data.applications);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error(error.response?.data?.message || 'Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            const { data } = await adminAPI.approveApplication(selectedApplication._id);

            if (data.success) {
                toast.success('Application approved successfully');
                setShowApproveModal(false);
                setSelectedApplication(null);
                fetchApplications();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to approve application');
        }
    };

    const handleReject = async () => {
        try {
            const { data } = await adminAPI.rejectApplication(selectedApplication._id);

            if (data.success) {
                toast.success('Application rejected');
                setShowRejectModal(false);
                setSelectedApplication(null);
                fetchApplications();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reject application');
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'approved':
                return 'bg-green-100 text-green-700';
            case 'rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Educator Applications</h1>
                <p className="text-gray-600 mt-2">Review and manage educator applications</p>
            </div>

            {/* Status Filter */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex gap-3">
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${
                            statusFilter === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setStatusFilter('approved')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${
                            statusFilter === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${
                            statusFilter === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Rejected
                    </button>
                    <button
                        onClick={() => setStatusFilter('')}
                        className={`px-6 py-2 rounded-lg font-medium transition ${
                            statusFilter === ''
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        All
                    </button>
                </div>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                        <span className="text-6xl mb-4 block">📝</span>
                        <p className="text-gray-500 text-lg">No applications found</p>
                        <p className="text-gray-400 text-sm mt-2">
                            {statusFilter === 'pending' 
                                ? 'No pending applications at the moment'
                                : `No ${statusFilter} applications`
                            }
                        </p>
                    </div>
                ) : (
                    applications.map((application) => (
                        <div
                            key={application._id}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 font-bold text-xl flex items-center justify-center">
                                        {application.userId?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {application.userId?.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">{application.userId?.email}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(application.status)}`}>
                                    {application.status}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium text-gray-700 mb-2">Application Message:</p>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 whitespace-pre-wrap">{application.message}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>
                                    Applied: {new Date(application.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                                {application.updatedAt !== application.createdAt && (
                                    <span>
                                        Updated: {new Date(application.updatedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>

                            {application.status === 'pending' && (
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setShowApproveModal(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                                    >
                                        ✓ Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedApplication(application);
                                            setShowRejectModal(true);
                                        }}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                                    >
                                        ✗ Reject
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Approve Modal */}
            {showApproveModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✓</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Approve Application</h3>
                            <p className="text-gray-600">
                                Are you sure you want to approve <strong>{selectedApplication.userId?.name}</strong> as an educator?
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-blue-700">
                                ℹ️ This will grant educator privileges and allow them to create and manage courses.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowApproveModal(false);
                                    setSelectedApplication(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedApplication && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✗</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Application</h3>
                            <p className="text-gray-600">
                                Are you sure you want to reject <strong>{selectedApplication.userId?.name}</strong>'s application?
                            </p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-700">
                                ⚠️ The applicant will be notified of the rejection.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setSelectedApplication(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EducatorApplications;
