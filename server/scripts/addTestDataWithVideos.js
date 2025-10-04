import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Course from '../models/Course.js';
import EducatorApplication from '../models/EducatorApplication.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms-database';

// Test data
const testUsers = [
  {
    name: 'Test Educator',
    email: 'educator@test.com',
    password: 'educator123',
    role: 'educator',
    phone: '+1234567890'
  },
  {
    name: 'Test Student',
    email: 'student@test.com',
    password: 'student123',
    role: 'user',
    phone: '+1234567891'
  },
  {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1234567892'
  }
];

const testCourses = [
  {
    courseTitle: 'Complete Web Development Bootcamp',
    courseDescription: '<p>Learn web development from scratch with HTML, CSS, JavaScript, React, Node.js, and MongoDB.</p><p>This comprehensive course covers everything you need to become a full-stack developer.</p>',
    courseCategory: 'Web Development',
    coursePrice: 99.99,
    discount: 20,
    courseThumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
    courseContent: [
      {
        chapterId: 'ch1',
        chapterTitle: 'Introduction to Web Development',
        chapterOrder: 1,
        chapterContent: [
          {
            lectureId: 'lec1',
            lectureTitle: 'What is Web Development?',
            lectureUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
            lectureDuration: 15,
            lectureOrder: 1,
            isPreviewFree: true
          },
          {
            lectureId: 'lec2',
            lectureTitle: 'Setting Up Your Development Environment',
            lectureUrl: 'https://www.youtube.com/watch?v=pQN-pnXPaVg',
            lectureDuration: 20,
            lectureOrder: 2,
            isPreviewFree: true
          }
        ]
      },
      {
        chapterId: 'ch2',
        chapterTitle: 'HTML Fundamentals',
        chapterOrder: 2,
        chapterContent: [
          {
            lectureId: 'lec3',
            lectureTitle: 'HTML Basics',
            lectureUrl: 'https://www.youtube.com/watch?v=qz0aGYrrlhU',
            lectureDuration: 25,
            lectureOrder: 1,
            isPreviewFree: false
          },
          {
            lectureId: 'lec4',
            lectureTitle: 'HTML Forms and Input',
            lectureUrl: 'https://www.youtube.com/watch?v=fNcJuPIZ2WE',
            lectureDuration: 30,
            lectureOrder: 2,
            isPreviewFree: false
          }
        ]
      },
      {
        chapterId: 'ch3',
        chapterTitle: 'CSS Styling',
        chapterOrder: 3,
        chapterContent: [
          {
            lectureId: 'lec5',
            lectureTitle: 'CSS Basics',
            lectureUrl: 'https://www.youtube.com/watch?v=1Rs2ND1ryYc',
            lectureDuration: 28,
            lectureOrder: 1,
            isPreviewFree: false
          }
        ]
      }
    ],
    courseRatings: []
  },
  {
    courseTitle: 'Python for Data Science',
    courseDescription: '<p>Master Python programming and data science libraries including NumPy, Pandas, and Matplotlib.</p><p>Perfect for beginners and intermediate learners.</p>',
    courseCategory: 'Data Science',
    coursePrice: 79.99,
    discount: 15,
    courseThumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    courseContent: [
      {
        chapterId: 'ch1',
        chapterTitle: 'Python Basics',
        chapterOrder: 1,
        chapterContent: [
          {
            lectureId: 'lec1',
            lectureTitle: 'Introduction to Python',
            lectureUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
            lectureDuration: 18,
            lectureOrder: 1,
            isPreviewFree: true
          },
          {
            lectureId: 'lec2',
            lectureTitle: 'Variables and Data Types',
            lectureUrl: 'https://www.youtube.com/watch?v=Z1Yd7upQsXY',
            lectureDuration: 22,
            lectureOrder: 2,
            isPreviewFree: false
          }
        ]
      },
      {
        chapterId: 'ch2',
        chapterTitle: 'Data Analysis with Pandas',
        chapterOrder: 2,
        chapterContent: [
          {
            lectureId: 'lec3',
            lectureTitle: 'Introduction to Pandas',
            lectureUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
            lectureDuration: 35,
            lectureOrder: 1,
            isPreviewFree: false
          }
        ]
      }
    ],
    courseRatings: []
  },
  {
    courseTitle: 'React.js - The Complete Guide',
    courseDescription: '<p>Build modern, reactive web applications with React.js, Redux, and React Router.</p><p>Includes hooks, context API, and best practices.</p>',
    courseCategory: 'Web Development',
    coursePrice: 89.99,
    discount: 25,
    courseThumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    courseContent: [
      {
        chapterId: 'ch1',
        chapterTitle: 'Getting Started with React',
        chapterOrder: 1,
        chapterContent: [
          {
            lectureId: 'lec1',
            lectureTitle: 'What is React?',
            lectureUrl: 'https://www.youtube.com/watch?v=Tn6-PIqc4UM',
            lectureDuration: 12,
            lectureOrder: 1,
            isPreviewFree: true
          },
          {
            lectureId: 'lec2',
            lectureTitle: 'Creating Your First React App',
            lectureUrl: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
            lectureDuration: 20,
            lectureOrder: 2,
            isPreviewFree: true
          }
        ]
      }
    ],
    courseRatings: []
  }
];

async function addTestData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing test data
    console.log('\n🗑️  Clearing existing test data...');
    await User.deleteMany({ email: { $in: testUsers.map(u => u.email) } });
    await Course.deleteMany({ courseTitle: { $in: testCourses.map(c => c.courseTitle) } });
    console.log('✅ Cleared existing test data');

    // Create test users
    console.log('\n👥 Creating test users...');
    const createdUsers = [];
    
    for (const userData of testUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        ...userData,
        password: hashedPassword
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    }

    // Find educator
    const educator = createdUsers.find(u => u.role === 'educator');
    
    if (!educator) {
      console.log('❌ No educator found');
      return;
    }

    // Create educator application (approved)
    console.log('\n📝 Creating educator application...');
    await EducatorApplication.create({
      userId: educator._id,
      message: 'I have 5 years of experience in web development and want to share my knowledge.',
      status: 'approved'
    });
    console.log('✅ Created approved educator application');

    // Create test courses
    console.log('\n📚 Creating test courses with REAL YouTube videos...');
    const createdCourses = [];
    
    for (const courseData of testCourses) {
      const course = await Course.create({
        ...courseData,
        educator: educator._id
      });
      createdCourses.push(course);
      console.log(`✅ Created course: ${course.courseTitle}`);
      console.log(`   📹 Videos: ${course.courseContent.reduce((sum, ch) => sum + ch.chapterContent.length, 0)} lectures`);
    }

    // Enroll student in first course (for deletion testing)
    const student = createdUsers.find(u => u.role === 'user');
    if (student && createdCourses.length > 0) {
      console.log('\n🎓 Enrolling student in first course...');
      const firstCourse = createdCourses[0];
      firstCourse.enrolledStudents.push(student._id);
      await firstCourse.save();
      
      student.enrolledCourses.push(firstCourse._id);
      await student.save();
      
      console.log(`✅ Enrolled ${student.email} in "${firstCourse.courseTitle}"`);
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 TEST DATA ADDED SUCCESSFULLY WITH REAL VIDEOS!');
    console.log('='.repeat(60));
    console.log('\n📋 Test Accounts Created:');
    console.log('─'.repeat(60));
    
    testUsers.forEach(user => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
    });
    
    console.log('\n📚 Courses Created:');
    console.log('─'.repeat(60));
    createdCourses.forEach((course, index) => {
      const totalLectures = course.courseContent.reduce((sum, ch) => sum + ch.chapterContent.length, 0);
      console.log(`\n${index + 1}. ${course.courseTitle}`);
      console.log(`   Price: $${course.coursePrice}`);
      console.log(`   Discount: ${course.discount}%`);
      console.log(`   Chapters: ${course.courseContent.length}`);
      console.log(`   📹 Video Lectures: ${totalLectures}`);
      console.log(`   Enrolled Students: ${course.enrolledStudents.length}`);
    });
    
    console.log('\n📹 Video URLs Included:');
    console.log('─'.repeat(60));
    console.log('  ✅ HTML Tutorial - Learn HTML in 30 Minutes');
    console.log('  ✅ CSS Tutorial - Zero to Hero');
    console.log('  ✅ Python Programming Tutorial');
    console.log('  ✅ Pandas Data Analysis Tutorial');
    console.log('  ✅ React JS Tutorial for Beginners');
    console.log('  ✅ And more educational content!');
    
    console.log('\n' + '='.repeat(60));
    console.log('🚀 You can now test the application!');
    console.log('='.repeat(60));
    console.log('\n📝 Next Steps:');
    console.log('  1. Start the backend: cd server && npm run server');
    console.log('  2. Start the frontend: cd client && npm run dev');
    console.log('  3. Open http://localhost:5173');
    console.log('  4. Login with educator@test.com / educator123');
    console.log('  5. Navigate to My Courses to test edit/delete');
    console.log('  6. 📹 Test video playback in course player!');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error adding test data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
addTestData();
