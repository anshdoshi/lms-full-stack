import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import Navbar from './components/student/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/student/Home'
import CourseDetails from './pages/student/CourseDetails'
import CoursesList from './pages/student/CoursesList'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import EditCourse from './pages/educator/EditCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Educator from './pages/educator/Educator'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ApplyEducator from './pages/student/ApplyEducator'
import Admin from './pages/admin/Admin'
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import EducatorApplications from './pages/admin/EducatorApplications'
import CourseManagement from './pages/admin/CourseManagement'
import AddEditCourse from './pages/admin/AddEditCourse'
import 'quill/dist/quill.snow.css'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Player from './pages/student/Player'
import MyEnrollments from './pages/student/MyEnrollments'
import PaymentSuccess from './pages/student/PaymentSuccess'
import PaymentFailure from './pages/student/PaymentFailure'
import Profile from './pages/student/Profile'
import Loading from './components/student/Loading'
import AITest from './pages/student/AITest'
import TakeTest from './pages/student/TakeTest'
import TestResult from './pages/student/TestResult'
import AIChat from './pages/student/AIChat'

const App = () => {
  // All hooks must be called at the top level, unconditionally
  const isEducatorRoute = useMatch('/educator/*');
  const isAdminRoute = useMatch('/admin/*');
  const isLoginRoute = useMatch('/login');
  const isRegisterRoute = useMatch('/register');
  
  const isAuthRoute = isLoginRoute || isRegisterRoute;

  return (
    <div className="text-default min-h-screen bg-white">
      <ToastContainer />
      {/* Render Student Navbar only if not on educator, admin, or auth routes */}
      {!isEducatorRoute && !isAdminRoute && !isAuthRoute && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        
        {/* Payment Routes */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Student Routes */}
        <Route
          path="/my-enrollments"
          element={
            <ProtectedRoute>
              <MyEnrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/player/:courseId"
          element={
            <ProtectedRoute>
              <Player />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply-educator"
          element={
            <ProtectedRoute>
              <ApplyEducator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-test"
          element={
            <ProtectedRoute>
              <AITest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/take-test/:testId"
          element={
            <ProtectedRoute>
              <TakeTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-result/:resultId"
          element={
            <ProtectedRoute>
              <TestResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          }
        />
        <Route path="/loading/:path" element={<Loading />} />

        {/* Protected Educator Routes */}
        <Route
          path='/educator'
          element={
            <ProtectedRoute requiredRole="educator">
              <Educator />
            </ProtectedRoute>
          }
        >
          <Route path='/educator' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='edit-course/:id' element={<EditCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='student-enrolled' element={<StudentsEnrolled />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route
          path='/admin'
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route path='/admin' element={<AdminDashboard />} />
          <Route path='users' element={<UserManagement />} />
          <Route path='applications' element={<EducatorApplications />} />
          <Route path='courses' element={<CourseManagement />} />
          <Route path='courses/create' element={<AddEditCourse />} />
          <Route path='courses/edit/:courseId' element={<AddEditCourse />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App