import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import { Payment } from '../models/Payment.js';
import User from '../models/User.js';
import EducatorApplication from '../models/EducatorApplication.js';

// Apply to become educator
export const applyForEducator = async (req, res) => {

    try {

        const userId = req.userId
        const { message } = req.body

        if (!message || message.trim().length < 20) {
            return res.json({ success: false, message: 'Please provide a detailed message (minimum 20 characters)' })
        }

        // Check if user already has an application
        const existingApplication = await EducatorApplication.findOne({ userId, status: 'pending' })
        if (existingApplication) {
            return res.json({ success: false, message: 'You already have a pending application' })
        }

        // Check if user is already an educator
        const user = await User.findById(userId)
        if (user.role === 'educator' || user.role === 'admin') {
            return res.json({ success: false, message: 'You are already an educator' })
        }

        // Create application
        await EducatorApplication.create({
            userId,
            message,
            status: 'pending'
        })

        res.json({ success: true, message: 'Application submitted successfully. Please wait for admin approval.' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Check educator application status
export const getEducatorApplicationStatus = async (req, res) => {
    try {
        const userId = req.userId

        const application = await EducatorApplication.findOne({ userId }).sort({ createdAt: -1 })

        if (!application) {
            return res.json({ success: true, status: 'none', message: 'No application found' })
        }

        res.json({
            success: true,
            status: application.status,
            application
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Add New Course
export const addCourse = async (req, res) => {

    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = req.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)

        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    try {

        const educator = req.userId

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    try {
        const educator = req.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from payments (Razorpay)
        const payments = await Payment.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Payment Data
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const educator = req.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch payments with user and course data
        const payments = await Payment.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = payments.map(payment => ({
            student: payment.userId,
            courseTitle: payment.courseId.courseTitle,
            purchaseDate: payment.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};
