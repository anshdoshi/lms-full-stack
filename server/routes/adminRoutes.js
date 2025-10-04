import express from 'express';
import {
    getAdminDashboard,
    getAllUsers,
    updateUserRole,
    deleteUser,
    getEducatorApplications,
    approveEducatorApplication,
    rejectEducatorApplication,
    getAllCourses,
    deleteCourse
} from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';

const adminRouter = express.Router();

// All admin routes require authentication and admin role
adminRouter.use(authenticate, isAdmin);

// Dashboard
adminRouter.get('/dashboard', getAdminDashboard);

// User Management
adminRouter.get('/users', getAllUsers);
adminRouter.put('/users/:userId/role', updateUserRole);
adminRouter.delete('/users/:userId', deleteUser);

// Educator Applications
adminRouter.get('/educator-applications', getEducatorApplications);
adminRouter.put('/educator-applications/:applicationId/approve', approveEducatorApplication);
adminRouter.put('/educator-applications/:applicationId/reject', rejectEducatorApplication);

// Course Management
adminRouter.get('/courses', getAllCourses);
adminRouter.delete('/courses/:courseId', deleteCourse);

export default adminRouter;
