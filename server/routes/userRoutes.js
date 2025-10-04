import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses, verifyPayment } from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';

const userRouter = express.Router()

// All user routes require authentication
userRouter.use(authenticate)

// Get user Data
userRouter.get('/data', getUserData)
userRouter.post('/purchase', purchaseCourse)
userRouter.post('/verify-payment', verifyPayment)
userRouter.get('/enrolled-courses', userEnrolledCourses)
userRouter.post('/update-course-progress', updateUserCourseProgress)
userRouter.post('/get-course-progress', getUserCourseProgress)
userRouter.post('/add-rating', addUserRating)

export default userRouter;