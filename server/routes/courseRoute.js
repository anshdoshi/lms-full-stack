import express from 'express'
import { createCourse, deleteCourse, getAllCourse, getCourseId, updateCourse } from '../controllers/courseController.js';
import { getAllCategories } from '../controllers/adminController.js';
import { authenticate, isEducator } from '../middlewares/auth.js';
import upload from '../configs/multer.js';


const courseRouter = express.Router()

// Get All Course
courseRouter.get('/all', getAllCourse)

// Get Course Data By Id
courseRouter.get('/:id', getCourseId)

// Get All Categories (public route for course creation/filtering)
courseRouter.get('/categories/all', getAllCategories)

// Create Course (Educator only)
courseRouter.post('/create', authenticate, isEducator, upload.any(), createCourse)

// Update Course (Educator only, ownership check)
courseRouter.put('/:id', authenticate, isEducator, upload.single('image'), updateCourse)

// Delete Course (Educator only, ownership check)
courseRouter.delete('/:id', authenticate, isEducator, deleteCourse)


export default courseRouter;
