import express from 'express';
import {
    getAdminDashboard,
    getAllUsers,
    createUser,
    updateUser,
    getUserById,
    updateUserRole,
    deleteUser,
    getEducatorApplications,
    approveEducatorApplication,
    rejectEducatorApplication,
    createEducatorApplication,
    updateEducatorApplication,
    deleteEducatorApplication,
    getAllCourses,
    createCourse,
    updateCourse,
    getCourseById,
    deleteCourse,
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
} from '../controllers/adminController.js';
import { authenticate, isAdmin } from '../middlewares/auth.js';
import upload from '../configs/multer.js';

const adminRouter = express.Router();

// All admin routes require authentication and admin role
adminRouter.use(authenticate, isAdmin);

// Dashboard
adminRouter.get('/dashboard', getAdminDashboard);

// User Management
adminRouter.get('/users', getAllUsers);
adminRouter.post('/users', createUser);
adminRouter.get('/users/:userId', getUserById);
adminRouter.put('/users/:userId', updateUser);
adminRouter.put('/users/:userId/role', updateUserRole);
adminRouter.delete('/users/:userId', deleteUser);

// Educator Applications
adminRouter.get('/educator-applications', getEducatorApplications);
adminRouter.post('/educator-applications', createEducatorApplication);
adminRouter.put('/educator-applications/:applicationId', updateEducatorApplication);
adminRouter.put('/educator-applications/:applicationId/approve', approveEducatorApplication);
adminRouter.put('/educator-applications/:applicationId/reject', rejectEducatorApplication);
adminRouter.delete('/educator-applications/:applicationId', deleteEducatorApplication);

// Course Management
adminRouter.get('/courses', getAllCourses);
adminRouter.post('/courses', upload.any(), createCourse);
adminRouter.get('/courses/:courseId', getCourseById);
adminRouter.put('/courses/:courseId', upload.any(), updateCourse);
adminRouter.delete('/courses/:courseId', deleteCourse);

// Category Management
adminRouter.get('/categories', getAllCategories);
adminRouter.post('/categories', createCategory);
adminRouter.put('/categories/:categoryId', updateCategory);
adminRouter.delete('/categories/:categoryId', deleteCategory);

export default adminRouter;
