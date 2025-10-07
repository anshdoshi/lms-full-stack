import express from 'express'
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, applyForEducator, getEducatorApplicationStatus, getCourseById, updateCourse, deleteCourse } from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { authenticate, isEducator } from '../middlewares/auth.js';


const educatorRouter = express.Router()

// All educator routes require authentication
educatorRouter.use(authenticate)

// Apply to become educator (for regular users)
educatorRouter.post('/apply', applyForEducator)

// Check application status
educatorRouter.get('/application-status', getEducatorApplicationStatus)

// Educator-only routes
educatorRouter.post('/add-course', upload.any(), isEducator, addCourse)
educatorRouter.get('/courses', isEducator, getEducatorCourses)
educatorRouter.get('/courses/:id', isEducator, getCourseById)
educatorRouter.put('/courses/:id', upload.any(), isEducator, updateCourse)
educatorRouter.delete('/courses/:id', isEducator, deleteCourse)
educatorRouter.get('/dashboard', isEducator, educatorDashboardData)
educatorRouter.get('/enrolled-students', isEducator, getEnrolledStudentsData)


export default educatorRouter;
