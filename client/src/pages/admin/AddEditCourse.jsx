import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminAPI } from '../../utils/api';
import { toast } from 'react-toastify';

const AddEditCourse = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const isEditMode = Boolean(courseId);

    const [loading, setLoading] = useState(false);
    const [loadingCourse, setLoadingCourse] = useState(isEditMode);
    const [educators, setEducators] = useState([]);
    const [categories, setCategories] = useState([]);
    
    const [formData, setFormData] = useState({
        courseTitle: '',
        courseDescription: '',
        coursePrice: '',
        discount: 0,
        educator: '',
        courseCategory: '',
        courseContent: []
    });

    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [videoFiles, setVideoFiles] = useState({});

    useEffect(() => {
        fetchEducators();
        fetchCategories();
        if (isEditMode) {
            fetchCourseData();
        }
    }, [courseId]);

    const fetchEducators = async () => {
        try {
            const { data } = await adminAPI.getUsers({ role: 'educator', limit: 100 });
            if (data.success) {
                setEducators(data.users);
            }
        } catch (error) {
            console.error('Error fetching educators:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await adminAPI.getCategories();
            if (data.success) {
                setCategories(data.categories.filter(cat => cat.isActive));
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchCourseData = async () => {
        try {
            setLoadingCourse(true);
            const { data } = await adminAPI.getCourseById(courseId);
            
            if (data.success) {
                const course = data.course;
                setFormData({
                    courseTitle: course.courseTitle || '',
                    courseDescription: course.courseDescription || '',
                    coursePrice: course.coursePrice || '',
                    discount: course.discount || 0,
                    educator: course.educator?._id || course.educator || '',
                    courseCategory: course.courseCategory?._id || course.courseCategory || '',
                    courseContent: course.courseContent || []
                });
                setThumbnailPreview(course.courseThumbnail || '');
            } else {
                toast.error(data.message);
                navigate('/admin/courses');
            }
        } catch (error) {
            toast.error('Failed to load course data');
            navigate('/admin/courses');
        } finally {
            setLoadingCourse(false);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setThumbnailFile(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const addChapter = () => {
        setFormData({
            ...formData,
            courseContent: [
                ...formData.courseContent,
                {
                    chapterId: `chapter_${Date.now()}`,
                    chapterOrder: formData.courseContent.length + 1,
                    chapterTitle: '',
                    chapterContent: []
                }
            ]
        });
    };

    const removeChapter = (chapterIndex) => {
        const updatedContent = formData.courseContent.filter((_, index) => index !== chapterIndex);
        setFormData({ ...formData, courseContent: updatedContent });
    };

    const updateChapter = (chapterIndex, field, value) => {
        const updatedContent = [...formData.courseContent];
        updatedContent[chapterIndex][field] = value;
        setFormData({ ...formData, courseContent: updatedContent });
    };

    const addLecture = (chapterIndex) => {
        const updatedContent = [...formData.courseContent];
        updatedContent[chapterIndex].chapterContent.push({
            lectureId: `lecture_${Date.now()}`,
            lectureTitle: '',
            lectureDuration: 0,
            lectureUrl: '',
            videoType: 'youtube', // 'youtube' or 'upload'
            isPreviewFree: false,
            lectureOrder: updatedContent[chapterIndex].chapterContent.length + 1
        });
        setFormData({ ...formData, courseContent: updatedContent });
    };

    const removeLecture = (chapterIndex, lectureIndex) => {
        const updatedContent = [...formData.courseContent];
        updatedContent[chapterIndex].chapterContent = updatedContent[chapterIndex].chapterContent.filter(
            (_, index) => index !== lectureIndex
        );
        setFormData({ ...formData, courseContent: updatedContent });
    };

    const updateLecture = (chapterIndex, lectureIndex, field, value) => {
        const updatedContent = [...formData.courseContent];
        updatedContent[chapterIndex].chapterContent[lectureIndex][field] = value;
        
        // If changing video type, clear the URL/file
        if (field === 'videoType') {
            updatedContent[chapterIndex].chapterContent[lectureIndex].lectureUrl = '';
            const videoKey = `${updatedContent[chapterIndex].chapterId}_${updatedContent[chapterIndex].chapterContent[lectureIndex].lectureId}`;
            const newVideoFiles = { ...videoFiles };
            delete newVideoFiles[videoKey];
            setVideoFiles(newVideoFiles);
        }
        
        setFormData({ ...formData, courseContent: updatedContent });
    };

    const handleVideoFileChange = (chapterIndex, lectureIndex, file) => {
        if (file) {
            // Check file size (max 100MB)
            if (file.size > 100 * 1024 * 1024) {
                toast.error('Video file size should be less than 100MB');
                return;
            }

            const chapter = formData.courseContent[chapterIndex];
            const lecture = chapter.chapterContent[lectureIndex];
            const videoKey = `${chapter.chapterId}_${lecture.lectureId}`;
            
            setVideoFiles({
                ...videoFiles,
                [videoKey]: file
            });

            toast.success(`Video file "${file.name}" selected`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.educator) {
            toast.error('Please select an educator');
            return;
        }

        if (!isEditMode && !thumbnailFile) {
            toast.error('Please upload a course thumbnail');
            return;
        }

        try {
            setLoading(true);

            const submitData = new FormData();
            submitData.append('courseData', JSON.stringify({
                courseTitle: formData.courseTitle,
                courseDescription: formData.courseDescription,
                coursePrice: parseFloat(formData.coursePrice),
                discount: parseInt(formData.discount),
                educator: formData.educator,
                courseCategory: formData.courseCategory,
                courseContent: formData.courseContent
            }));

            if (thumbnailFile) {
                submitData.append('image', thumbnailFile);
            }

            // Append video files
            Object.entries(videoFiles).forEach(([key, file]) => {
                submitData.append(`video_${key}`, file);
            });

            const { data } = isEditMode
                ? await adminAPI.updateCourse(courseId, submitData)
                : await adminAPI.createCourse(submitData);

            if (data.success) {
                toast.success(isEditMode ? 'Course updated successfully' : 'Course created successfully');
                navigate('/admin/courses');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error saving course:', error);
            toast.error(error.response?.data?.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    if (loadingCourse) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Course' : 'Create New Course'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isEditMode ? 'Update course details and content' : 'Add a new course to the platform'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/admin/courses')}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    ← Back
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Course Title *
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.courseTitle}
                                onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                placeholder="Enter course title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Course Description *
                            </label>
                            <textarea
                                required
                                value={formData.courseDescription}
                                onChange={(e) => setFormData({ ...formData, courseDescription: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                placeholder="Enter course description"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Educator *
                                </label>
                                <select
                                    required
                                    value={formData.educator}
                                    onChange={(e) => setFormData({ ...formData, educator: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select Educator</option>
                                    {educators.map((educator) => (
                                        <option key={educator._id} value={educator._id}>
                                            {educator.name} ({educator.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.courseCategory}
                                    onChange={(e) => setFormData({ ...formData, courseCategory: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category._id} value={category._id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (₹) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.coursePrice}
                                    onChange={(e) => setFormData({ ...formData, coursePrice: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Discount (%) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Course Thumbnail {!isEditMode && '*'}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                            />
                            {thumbnailPreview && (
                                <div className="mt-2">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Course Content</h2>
                        <button
                            type="button"
                            onClick={addChapter}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                        >
                            + Add Chapter
                        </button>
                    </div>

                    {formData.courseContent.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No chapters added yet. Click "Add Chapter" to get started.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {formData.courseContent.map((chapter, chapterIndex) => (
                                <div key={chapterIndex} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={chapter.chapterTitle}
                                                onChange={(e) => updateChapter(chapterIndex, 'chapterTitle', e.target.value)}
                                                placeholder="Chapter Title"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeChapter(chapterIndex)}
                                            className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                                        >
                                            Remove Chapter
                                        </button>
                                    </div>

                                    <div className="ml-4 space-y-2">
                                        {chapter.chapterContent.map((lecture, lectureIndex) => (
                                            <div key={lectureIndex} className="bg-gray-50 rounded-lg p-3">
                                                <div className="space-y-3 mb-2">
                                                    <input
                                                        type="text"
                                                        value={lecture.lectureTitle}
                                                        onChange={(e) => updateLecture(chapterIndex, lectureIndex, 'lectureTitle', e.target.value)}
                                                        placeholder="Lecture Title"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                                    />
                                                    
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => updateLecture(chapterIndex, lectureIndex, 'videoType', 'youtube')}
                                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                                lecture.videoType === 'youtube'
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            YouTube URL
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => updateLecture(chapterIndex, lectureIndex, 'videoType', 'upload')}
                                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                                                                lecture.videoType === 'upload'
                                                                    ? 'bg-primary-600 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Upload Video
                                                        </button>
                                                    </div>

                                                    {lecture.videoType === 'youtube' ? (
                                                        <input
                                                            type="text"
                                                            value={lecture.lectureUrl}
                                                            onChange={(e) => updateLecture(chapterIndex, lectureIndex, 'lectureUrl', e.target.value)}
                                                            placeholder="YouTube URL or Video ID (e.g., dQw4w9WgXcQ)"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                                        />
                                                    ) : (
                                                        <div>
                                                            <input
                                                                type="file"
                                                                accept="video/*"
                                                                onChange={(e) => handleVideoFileChange(chapterIndex, lectureIndex, e.target.files[0])}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                                            />
                                                            {videoFiles[`${chapter.chapterId}_${lecture.lectureId}`] && (
                                                                <p className="text-xs text-green-600 mt-1">
                                                                    ✓ {videoFiles[`${chapter.chapterId}_${lecture.lectureId}`].name}
                                                                </p>
                                                            )}
                                                            {lecture.lectureUrl && !videoFiles[`${chapter.chapterId}_${lecture.lectureId}`] && (
                                                                <p className="text-xs text-blue-600 mt-1">
                                                                    Current: {lecture.lectureUrl.split('/').pop()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="number"
                                                        value={lecture.lectureDuration}
                                                        onChange={(e) => updateLecture(chapterIndex, lectureIndex, 'lectureDuration', parseInt(e.target.value))}
                                                        placeholder="Duration (minutes)"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                                                    />
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="checkbox"
                                                            checked={lecture.isPreviewFree}
                                                            onChange={(e) => updateLecture(chapterIndex, lectureIndex, 'isPreviewFree', e.target.checked)}
                                                            className="rounded"
                                                        />
                                                        Free Preview
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLecture(chapterIndex, lectureIndex)}
                                                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addLecture(chapterIndex)}
                                            className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                                        >
                                            + Add Lecture
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/courses')}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : isEditMode ? 'Update Course' : 'Create Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditCourse;
