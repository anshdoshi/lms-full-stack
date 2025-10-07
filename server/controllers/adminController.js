import User from '../models/User.js';
import EducatorApplication from '../models/EducatorApplication.js';
import Course from '../models/Course.js';
import Category from '../models/Category.js';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

// Get Admin Dashboard Stats
export const getAdminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalEducators = await User.countDocuments({ role: 'educator' });
        const totalCourses = await Course.countDocuments();
        const pendingApplications = await EducatorApplication.countDocuments({ status: 'pending' });

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalEducators,
                totalCourses,
                pendingApplications
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Users (with pagination)
export const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', role = '' } = req.query;

        const query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (role) {
            query.role = role;
        }

        const users = await User.find(query)
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await User.countDocuments(query);

        res.json({
            success: true,
            users,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalUsers: count
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update User Role
export const updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!['user', 'educator', 'admin'].includes(role)) {
            return res.json({ success: false, message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User role updated successfully',
            user
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Educator Applications
export const getEducatorApplications = async (req, res) => {
    try {
        const { status = 'pending' } = req.query;

        const query = status ? { status } : {};

        const applications = await EducatorApplication.find(query)
            .populate('userId', 'name email imageUrl')
            .populate('reviewedBy', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            applications
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Approve Educator Application
export const approveEducatorApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const adminId = req.userId;

        const application = await EducatorApplication.findById(applicationId);

        if (!application) {
            return res.json({ success: false, message: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.json({ success: false, message: 'Application already processed' });
        }

        // Update application status
        application.status = 'approved';
        application.reviewedBy = adminId;
        application.reviewedAt = new Date();
        await application.save();

        // Update user role to educator
        await User.findByIdAndUpdate(application.userId, { role: 'educator' });

        res.json({
            success: true,
            message: 'Educator application approved successfully'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Reject Educator Application
export const rejectEducatorApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const adminId = req.userId;

        const application = await EducatorApplication.findById(applicationId);

        if (!application) {
            return res.json({ success: false, message: 'Application not found' });
        }

        if (application.status !== 'pending') {
            return res.json({ success: false, message: 'Application already processed' });
        }

        // Update application status
        application.status = 'rejected';
        application.reviewedBy = adminId;
        application.reviewedAt = new Date();
        await application.save();

        res.json({
            success: true,
            message: 'Educator application rejected'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Courses (Admin View)
export const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const query = search ? { courseTitle: { $regex: search, $options: 'i' } } : {};

        const courses = await Course.find(query)
            .populate('educator', 'name email')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await Course.countDocuments(query);

        res.json({
            success: true,
            courses,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalCourses: count
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Course (Admin)
export const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findByIdAndDelete(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create User (Admin)
export const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Name, email, and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Validate role
        const userRole = role || 'user';
        if (!['user', 'educator', 'admin'].includes(userRole)) {
            return res.json({ success: false, message: 'Invalid role' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: userRole,
            status: status || 'active'
        });

        res.json({
            success: true,
            message: 'User created successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update User (Admin)
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, role, status, password } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) {
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.json({ success: false, message: 'Email already in use' });
            }
            user.email = email;
        }
        if (role && ['user', 'educator', 'admin'].includes(role)) {
            user.role = role;
        }
        if (status && ['active', 'inactive'].includes(status)) {
            user.status = status;
        }
        if (password && password.length >= 6) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get User by ID (Admin)
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create Course (Admin)
export const createCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const files = req.files;

        // Find thumbnail image
        const imageFile = files?.find(file => file.fieldname === 'image');

        if (!imageFile) {
            return res.json({ success: false, message: 'Course thumbnail is required' });
        }

        const parsedCourseData = JSON.parse(courseData);

        // Validate required fields
        if (!parsedCourseData.courseTitle || !parsedCourseData.courseDescription || !parsedCourseData.educator) {
            return res.json({ success: false, message: 'Missing required course fields' });
        }

        // Upload thumbnail to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: 'image'
        });

        // Process video uploads if any
        if (parsedCourseData.courseContent && Array.isArray(parsedCourseData.courseContent)) {
            for (const chapter of parsedCourseData.courseContent) {
                if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
                    for (const lecture of chapter.chapterContent) {
                        if (lecture.videoType === 'upload') {
                            const videoFieldName = `video_${chapter.chapterId}_${lecture.lectureId}`;
                            const videoFile = files?.find(file => file.fieldname === videoFieldName);

                            if (videoFile) {
                                const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                                    resource_type: 'video',
                                    folder: 'lms-videos',
                                    chunk_size: 6000000,
                                    eager: [
                                        { width: 1280, height: 720, crop: 'limit', format: 'mp4' }
                                    ]
                                });
                                lecture.lectureUrl = videoUpload.secure_url;
                            }
                        }
                    }
                }
            }
        }

        // Create course
        const course = await Course.create({
            courseTitle: parsedCourseData.courseTitle,
            courseDescription: parsedCourseData.courseDescription,
            courseThumbnail: imageUpload.secure_url,
            coursePrice: parsedCourseData.coursePrice || 0,
            discount: parsedCourseData.discount || 0,
            courseCategory: parsedCourseData.courseCategory || null,
            courseContent: parsedCourseData.courseContent || [],
            educator: parsedCourseData.educator,
            isPublished: parsedCourseData.isPublished !== undefined ? parsedCourseData.isPublished : true
        });

        res.json({
            success: true,
            message: 'Course created successfully',
            course
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Course (Admin)
export const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { courseData } = req.body;
        const files = req.files;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        const parsedCourseData = JSON.parse(courseData);

        // Update course fields
        if (parsedCourseData.courseTitle) course.courseTitle = parsedCourseData.courseTitle;
        if (parsedCourseData.courseDescription) course.courseDescription = parsedCourseData.courseDescription;
        if (parsedCourseData.coursePrice !== undefined) course.coursePrice = parsedCourseData.coursePrice;
        if (parsedCourseData.discount !== undefined) course.discount = parsedCourseData.discount;
        if (parsedCourseData.courseCategory !== undefined) course.courseCategory = parsedCourseData.courseCategory;
        if (parsedCourseData.courseContent) course.courseContent = parsedCourseData.courseContent;
        if (parsedCourseData.isPublished !== undefined) course.isPublished = parsedCourseData.isPublished;
        if (parsedCourseData.educator) course.educator = parsedCourseData.educator;

        // Update thumbnail if new image is provided
        const imageFile = files?.find(file => file.fieldname === 'image');
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image'
            });
            course.courseThumbnail = imageUpload.secure_url;
        }

        // Process video uploads if any
        if (parsedCourseData.courseContent && Array.isArray(parsedCourseData.courseContent)) {
            for (const chapter of parsedCourseData.courseContent) {
                if (chapter.chapterContent && Array.isArray(chapter.chapterContent)) {
                    for (const lecture of chapter.chapterContent) {
                        if (lecture.videoType === 'upload') {
                            const videoFieldName = `video_${chapter.chapterId}_${lecture.lectureId}`;
                            const videoFile = files?.find(file => file.fieldname === videoFieldName);

                            if (videoFile) {
                                const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                                    resource_type: 'video',
                                    folder: 'lms-videos',
                                    chunk_size: 6000000,
                                    eager: [
                                        { width: 1280, height: 720, crop: 'limit', format: 'mp4' }
                                    ]
                                });
                                lecture.lectureUrl = videoUpload.secure_url;
                            }
                        }
                    }
                }
            }
        }

        await course.save();

        res.json({
            success: true,
            message: 'Course updated successfully',
            course
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Course by ID (Admin)
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate('educator', 'name email')
            .populate('courseCategory', 'name');

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        res.json({
            success: true,
            course
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// ============= CATEGORY MANAGEMENT =============

// Create Category
export const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || name.trim().length === 0) {
            return res.json({ success: false, message: 'Category name is required' });
        }

        // Check if category already exists
        const existingCategory = await Category.findOne({ name: name.trim() });
        if (existingCategory) {
            return res.json({ success: false, message: 'Category already exists' });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description || ''
        });

        res.json({
            success: true,
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Categories
export const getAllCategories = async (req, res) => {
    try {
        const { includeInactive } = req.query;

        const query = includeInactive === 'true' ? {} : { isActive: true };

        const categories = await Category.find(query).sort({ name: 1 });

        res.json({
            success: true,
            categories
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Category
export const updateCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, description, isActive } = req.body;

        const category = await Category.findById(categoryId);

        if (!category) {
            return res.json({ success: false, message: 'Category not found' });
        }

        // Check if new name already exists
        if (name && name !== category.name) {
            const existingCategory = await Category.findOne({ name: name.trim(), _id: { $ne: categoryId } });
            if (existingCategory) {
                return res.json({ success: false, message: 'Category name already exists' });
            }
            category.name = name.trim();
        }

        if (description !== undefined) category.description = description;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.json({
            success: true,
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Category
export const deleteCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Check if any courses are using this category
        const coursesWithCategory = await Course.countDocuments({ courseCategory: categoryId });

        if (coursesWithCategory > 0) {
            return res.json({
                success: false,
                message: `Cannot delete category: ${coursesWithCategory} course(s) are using it. Please reassign or delete those courses first.`
            });
        }

        const category = await Category.findByIdAndDelete(categoryId);

        if (!category) {
            return res.json({ success: false, message: 'Category not found' });
        }

        res.json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
