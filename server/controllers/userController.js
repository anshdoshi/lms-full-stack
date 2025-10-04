import Course from "../models/Course.js"
import { CourseProgress } from "../models/CourseProgress.js"
import { Purchase } from "../models/Purchase.js"
import { Payment } from "../models/Payment.js"
import User from "../models/User.js"
import Razorpay from "razorpay"
import crypto from "crypto"
import { v2 as cloudinary } from 'cloudinary'



// Get User Data
export const getUserData = async (req, res) => {
    try {

        const userId = req.userId

        const user = await User.findById(userId).select('-password')

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Purchase Course (Razorpay Integration)
export const purchaseCourse = async (req, res) => {

    try {
        // Check if Razorpay is configured
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            return res.json({
                success: false,
                message: 'Payment system under development. Please try again later.',
                paymentConfigured: false
            });
        }

        const { courseId } = req.body
        const userId = req.userId

        const courseData = await Course.findById(courseId)
        const userData = await User.findById(userId)

        if (!userData || !courseData) {
            return res.json({ success: false, message: 'Data Not Found' })
        }

        // Calculate final amount
        const amount = (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)

        // Initialize Razorpay
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })

        // Create Razorpay order
        const options = {
            amount: Math.floor(amount * 100), // Amount in paise
            currency: process.env.CURRENCY || 'INR',
            receipt: `receipt_${Date.now()}`
        }

        const order = await razorpayInstance.orders.create(options)

        // Save payment record
        const newPayment = await Payment.create({
            userId,
            courseId: courseData._id,
            amount: amount,
            razorpayOrderId: order.id,
            status: 'pending'
        })

        res.json({
            success: true,
            orderId: order.id,
            amount: amount,
            currency: options.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
            paymentId: newPayment._id
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Verify Razorpay Payment
export const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body
        const userId = req.userId

        // Verify signature
        const sign = razorpayOrderId + "|" + razorpayPaymentId
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex")

        if (razorpaySignature !== expectedSign) {
            return res.json({ success: false, message: 'Payment verification failed' })
        }

        // Update payment record
        const payment = await Payment.findById(paymentId)
        if (!payment) {
            return res.json({ success: false, message: 'Payment record not found' })
        }

        payment.razorpayPaymentId = razorpayPaymentId
        payment.razorpaySignature = razorpaySignature
        payment.status = 'completed'
        await payment.save()

        // Enroll user in course
        const courseData = await Course.findById(payment.courseId)
        const userData = await User.findById(userId)

        courseData.enrolledStudents.push(userData)
        await courseData.save()

        userData.enrolledCourses.push(courseData._id)
        await userData.save()

        res.json({
            success: true,
            message: 'Payment verified and enrollment successful'
        })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Users Enrolled Courses With Lecture Links
export const userEnrolledCourses = async (req, res) => {

    try {

        const userId = req.userId

        const userData = await User.findById(userId)
            .populate('enrolledCourses')

        res.json({ success: true, enrolledCourses: userData.enrolledCourses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Update User Course Progress
export const updateUserCourseProgress = async (req, res) => {

    try {

        const userId = req.userId

        const { courseId, lectureId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        if (progressData) {

            if (progressData.lectureCompleted.includes(lectureId)) {
                return res.json({ success: true, message: 'Lecture Already Completed' })
            }

            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        } else {

            await CourseProgress.create({
                userId,
                courseId,
                lectureCompleted: [lectureId]
            })

        }

        res.json({ success: true, message: 'Progress Updated' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {

    try {

        const userId = req.userId

        const { courseId } = req.body

        const progressData = await CourseProgress.findOne({ userId, courseId })

        res.json({ success: true, progressData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Add User Ratings to Course
export const addUserRating = async (req, res) => {

    const userId = req.userId;
    const { courseId, rating } = req.body;

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'InValid Details' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRatings.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRatings[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRatings.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, bio, phone } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Update basic fields
        if (name) user.name = name;
        if (bio !== undefined) user.bio = bio;
        if (phone !== undefined) user.phone = phone;

        // Handle image upload if provided
        if (req.file) {
            try {
                // Upload to cloudinary
                const imageUpload = await cloudinary.uploader.upload(req.file.path, {
                    resource_type: 'image',
                    folder: 'profile-images'
                });

                user.imageUrl = imageUpload.secure_url;
            } catch (uploadError) {
                return res.json({ success: false, message: 'Image upload failed' });
            }
        }

        await user.save();

        // Return updated user without password
        const updatedUser = await User.findById(userId).select('-password');

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: updatedUser
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
