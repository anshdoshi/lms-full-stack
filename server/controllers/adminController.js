import User from '../models/User.js';
import EducatorApplication from '../models/EducatorApplication.js';
import Course from '../models/Course.js';

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
            .populate('educatorId', 'name email')
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
