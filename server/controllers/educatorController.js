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
        const files = req.files
        const educatorId = req.userId

        // Find thumbnail image
        const imageFile = files?.find(file => file.fieldname === 'image')

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = JSON.parse(courseData)
        parsedCourseData.educator = educatorId

        // Upload thumbnail to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            folder: 'lms-thumbnails'
        })

        parsedCourseData.courseThumbnail = imageUpload.secure_url

        // Process video uploads
        for (const chapter of parsedCourseData.courseContent) {
            for (const lecture of chapter.chapterContent) {
                if (lecture.videoType === 'upload') {
                    // Find the corresponding video file
                    const videoFieldName = `video_${chapter.chapterId}_${lecture.lectureId}`
                    const videoFile = files?.find(file => file.fieldname === videoFieldName)

                    if (videoFile) {
                        console.log(`Uploading video for lecture: ${lecture.lectureTitle}`)
                        
                        // Upload video to Cloudinary
                        const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                            resource_type: 'video',
                            folder: 'lms-videos',
                            chunk_size: 6000000, // 6MB chunks for large files
                            eager: [
                                { width: 1280, height: 720, crop: 'limit', format: 'mp4' }
                            ],
                            eager_async: true
                        })

                        // Store the Cloudinary video URL
                        lecture.lectureUrl = videoUpload.secure_url
                        console.log(`Video uploaded successfully: ${videoUpload.secure_url}`)
                    }
                }
            }
        }

        // Create course with all data
        const newCourse = await Course.create(parsedCourseData)

        res.json({ success: true, message: 'Course Added Successfully' })

    } catch (error) {
        console.error('Error adding course:', error)
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

// Get Single Course by ID (for editing)
export const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const educator = req.userId;

        const course = await Course.findById(id);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Check if the educator owns this course
        if (course.educator.toString() !== educator) {
            return res.json({ success: false, message: 'Unauthorized: You can only edit your own courses' });
        }

        res.json({ success: true, course });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseData } = req.body;
        const files = req.files;
        const educator = req.userId;

        const course = await Course.findById(id);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Check if the educator owns this course
        if (course.educator.toString() !== educator) {
            return res.json({ success: false, message: 'Unauthorized: You can only edit your own courses' });
        }

        const parsedCourseData = JSON.parse(courseData);

        // Update course fields
        course.courseTitle = parsedCourseData.courseTitle;
        course.courseDescription = parsedCourseData.courseDescription;
        course.coursePrice = parsedCourseData.coursePrice;
        course.discount = parsedCourseData.discount;
        course.courseContent = parsedCourseData.courseContent;
        course.courseCategory = parsedCourseData.courseCategory;

        // Update thumbnail if new image is provided
        const imageFile = files?.find(file => file.fieldname === 'image');
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                folder: 'lms-thumbnails'
            });
            course.courseThumbnail = imageUpload.secure_url;
        }

        // Handle video updates - similar to addCourse
        for (const chapter of parsedCourseData.courseContent) {
            for (const lecture of chapter.chapterContent) {
                if (lecture.videoType === 'upload') {
                    const videoFieldName = `video_${chapter.chapterId}_${lecture.lectureId}`;
                    const videoFile = files?.find(file => file.fieldname === videoFieldName);

                    if (videoFile) {
                        console.log(`Uploading updated video for lecture: ${lecture.lectureTitle}`);

                        const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                            resource_type: 'video',
                            folder: 'lms-videos',
                            chunk_size: 6000000,
                            eager: [
                                { width: 1280, height: 720, crop: 'limit', format: 'mp4' }
                            ],
                            eager_async: true
                        });

                        lecture.lectureUrl = videoUpload.secure_url;
                        console.log(`Video updated successfully: ${videoUpload.secure_url}`);
                    }
                }
            }
        }

        await course.save();

        res.json({ success: true, message: 'Course updated successfully' });

    } catch (error) {
        console.error('Error updating course:', error);
        res.json({ success: false, message: error.message });
    }
};

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const educator = req.userId;

        const course = await Course.findById(id);

        if (!course) {
            return res.json({ success: false, message: 'Course not found' });
        }

        // Check if the educator owns this course
        if (course.educator.toString() !== educator) {
            return res.json({ success: false, message: 'Unauthorized: You can only delete your own courses' });
        }

        // Check if students are enrolled
        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            return res.json({ 
                success: false, 
                message: `Cannot delete course: ${course.enrolledStudents.length} student(s) are enrolled. Please contact admin for assistance.` 
            });
        }

        await Course.findByIdAndDelete(id);

        res.json({ success: true, message: 'Course deleted successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
