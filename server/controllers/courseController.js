import Course from "../models/Course.js"
import User from "../models/User.js"
import { v2 as cloudinary } from 'cloudinary'


// Get All Courses
export const getAllCourse = async (req, res) => {
    try {

        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator', select: '-password' })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

// Create Course
export const createCourse = async (req, res) => {
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

        res.json({ success: true, message: 'Course Added Successfully', courseId: newCourse._id })

    } catch (error) {
        console.error('Error creating course:', error)
        res.json({ success: false, message: error.message })
    }
}

// Update Course
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params
        const { courseData } = req.body
        const imageFile = req.file
        const educatorId = req.userId

        const course = await Course.findById(id)

        if (!course) {
            return res.json({ success: false, message: 'Course not found' })
        }

        // Check if the educator owns this course
        if (course.educator.toString() !== educatorId) {
            return res.json({ success: false, message: 'Unauthorized: You can only edit your own courses' })
        }

        const parsedCourseData = JSON.parse(courseData)

        // Update course fields
        course.courseTitle = parsedCourseData.courseTitle
        course.courseDescription = parsedCourseData.courseDescription
        course.coursePrice = parsedCourseData.coursePrice
        course.discount = parsedCourseData.discount
        course.courseContent = parsedCourseData.courseContent
        course.courseCategory = parsedCourseData.courseCategory

        // Update thumbnail if new image is provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path)
            course.courseThumbnail = imageUpload.secure_url
        }

        // Handle video updates - similar to create
        const files = req.files
        if (files) {
            for (const chapter of parsedCourseData.courseContent) {
                for (const lecture of chapter.chapterContent) {
                    if (lecture.videoType === 'upload') {
                        const videoFieldName = `video_${chapter.chapterId}_${lecture.lectureId}`
                        const videoFile = files?.find(file => file.fieldname === videoFieldName)

                        if (videoFile) {
                            console.log(`Uploading updated video for lecture: ${lecture.lectureTitle}`)

                            const videoUpload = await cloudinary.uploader.upload(videoFile.path, {
                                resource_type: 'video',
                                folder: 'lms-videos',
                                chunk_size: 6000000,
                                eager: [
                                    { width: 1280, height: 720, crop: 'limit', format: 'mp4' }
                                ],
                                eager_async: true
                            })

                            lecture.lectureUrl = videoUpload.secure_url
                            console.log(`Video updated successfully: ${videoUpload.secure_url}`)
                        }
                    }
                }
            }
        }

        await course.save()

        res.json({ success: true, message: 'Course updated successfully' })

    } catch (error) {
        console.error('Error updating course:', error)
        res.json({ success: false, message: error.message })
    }
}

// Delete Course
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params
        const educatorId = req.userId

        const course = await Course.findById(id)

        if (!course) {
            return res.json({ success: false, message: 'Course not found' })
        }

        // Check if the educator owns this course
        if (course.educator.toString() !== educatorId) {
            return res.json({ success: false, message: 'Unauthorized: You can only delete your own courses' })
        }

        // Check if students are enrolled
        if (course.enrolledStudents && course.enrolledStudents.length > 0) {
            return res.json({
                success: false,
                message: `Cannot delete course: ${course.enrolledStudents.length} student(s) are enrolled. Please contact admin for assistance.`
            })
        }

        await Course.findByIdAndDelete(id)

        res.json({ success: true, message: 'Course deleted successfully' })

    } catch (error) {
        console.error('Error deleting course:', error)
        res.json({ success: false, message: error.message })
    }
}

// Get Course by Id
export const getCourseId = async (req, res) => {

    const { id } = req.params

    try {

        const courseData = await Course.findById(id)
            .populate({ path: 'educator'})

        // Remove lectureUrl if isPreviewFree is false
        courseData.courseContent.forEach(chapter => {
            chapter.chapterContent.forEach(lecture => {
                if (!lecture.isPreviewFree) {
                    lecture.lectureUrl = "";
                }
            });
        });

        res.json({ success: true, courseData })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

} 