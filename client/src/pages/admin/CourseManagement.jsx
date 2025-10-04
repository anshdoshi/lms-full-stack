import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, [currentPage]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: 10,
                ...(searchTerm && { search: searchTerm })
            };

            const { data } = await adminAPI.getCourses(params);

            if (data.success) {
                setCourses(data.courses);
                setTotalPages(data.totalPages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            toast.error(error.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchCourses();
    };

    const handleDeleteCourse = async () => {
        try {
            const { data } = await adminAPI.deleteCourse(selectedCourse._id);

            if (data.success) {
                toast.success('Course deleted successfully');
                setShowDeleteModal(false);
                setSelectedCourse(null);
                fetchCourses();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete course');
        }
    };

    const calculateTotalLectures = (course) => {
        let total = 0;
        course.courseContent?.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                total += chapter.chapterContent.length;
            }
        });
        return total;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                <p className="text-gray-600 mt-2">Manage all courses on the platform</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search courses by title or educator..."
                            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Courses Grid */}
            {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                </div>
            ) : courses.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <span className="text-6xl mb-4 block">📚</span>
                    <p className="text-gray-500 text-lg">No courses found</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {courses.map((course) => (
                            <div
                                key={course._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                            >
                                {/* Course Image */}
                                <div className="relative h-48 bg-gray-200">
                                    {course.courseThumbnail ? (
                                        <img
                                            src={course.courseThumbnail}
                                            alt={course.courseTitle}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-secondary-400">
                                            <span className="text-6xl">📚</span>
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3">
                                        <span className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-900 shadow-md">
                                            ₹{course.coursePrice}
                                        </span>
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                                        {course.courseTitle}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-semibold flex items-center justify-center text-sm">
                                            {course.educatorId?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600 truncate">
                                                {course.educatorId?.name}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <span className="flex items-center gap-1">
                                            📖 {course.courseContent?.length || 0} chapters
                                        </span>
                                        <span className="flex items-center gap-1">
                                            🎥 {calculateTotalLectures(course)} lectures
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <span>⭐ {course.courseRatings?.length || 0} ratings</span>
                                        <span>•</span>
                                        <span>👥 {course.enrolledStudents?.length || 0} students</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setShowDetailsModal(true);
                                            }}
                                            className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium"
                                        >
                                            View Details
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setShowDeleteModal(true);
                                            }}
                                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Course Details Modal */}
            {showDetailsModal && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full my-8">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <h3 className="text-2xl font-bold text-gray-900">{selectedCourse.courseTitle}</h3>
                                <button
                                    onClick={() => {
                                        setShowDetailsModal(false);
                                        setSelectedCourse(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {/* Course Image */}
                            {selectedCourse.courseThumbnail && (
                                <img
                                    src={selectedCourse.courseThumbnail}
                                    alt={selectedCourse.courseTitle}
                                    className="w-full h-64 object-cover rounded-lg mb-6"
                                />
                            )}

                            {/* Course Info */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                                    <p className="text-gray-700">{selectedCourse.courseDescription}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Educator</h4>
                                        <p className="text-gray-700">{selectedCourse.educatorId?.name}</p>
                                        <p className="text-sm text-gray-500">{selectedCourse.educatorId?.email}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Price</h4>
                                        <p className="text-2xl font-bold text-primary-600">₹{selectedCourse.coursePrice}</p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
                                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                                        {selectedCourse.courseCategory}
                                    </span>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-2">Course Content</h4>
                                    <div className="space-y-2">
                                        {selectedCourse.courseContent?.map((chapter, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-3">
                                                <p className="font-medium text-gray-900">
                                                    Chapter {index + 1}: {chapter.chapterTitle}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {chapter.chapterContent?.length || 0} lectures
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {selectedCourse.enrolledStudents?.length || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">Students</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {selectedCourse.courseRatings?.length || 0}
                                        </p>
                                        <p className="text-sm text-gray-600">Ratings</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-bold text-gray-900">
                                            {calculateTotalLectures(selectedCourse)}
                                        </p>
                                        <p className="text-sm text-gray-600">Lectures</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowDetailsModal(false);
                                    setSelectedCourse(null);
                                }}
                                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Course</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete <strong>{selectedCourse.courseTitle}</strong>? 
                            This action cannot be undone and will affect {selectedCourse.enrolledStudents?.length || 0} enrolled students.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setSelectedCourse(null);
                                }}
                                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteCourse}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
