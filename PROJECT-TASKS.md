# Yunay-CA Academy - Project Migration Tasks

> **IMPORTANT**: Always refer to [UI-UX-RULES.md](./UI-UX-RULES.md) for all UI/UX implementation guidelines.

## Project Overview
Migrating Edemy LMS to Yunay-CA Academy with custom authentication, TypeScript, Razorpay payments, and role-based access control.

---

## 1. Branding & Theme Changes

### 1.1 Text & Title Updates
- [x] Replace all "Edemy" references with "Yunay-CA Academy" in frontend
- [x] Replace all "Edemy" references with "Yunay-CA Academy" in backend
- [x] Update page titles and meta tags
- [ ] Update email templates with new branding
- [ ] Update error messages and notifications

### 1.2 Visual Identity
- [ ] Update logo files (header, footer, favicon)
- [x] Update theme colors in Tailwind config
- [x] Update primary/secondary/accent colors
- [ ] Update CSS variables with new brand colors
- [ ] Update loading screens and splash screens
- [x] Ensure all color changes follow UI-UX-RULES.md contrast guidelines

### 1.3 Assets
- [ ] Replace logo images in `/client/public`
- [ ] Update favicon
- [ ] Update social media preview images (og:image)
- [ ] Update app icons/PWA icons if applicable

---

## 2. Payment System Migration

### 2.1 Remove Stripe
- [x] Remove Stripe dependencies from package.json (frontend)
- [x] Remove Stripe dependencies from package.json (backend)
- [ ] Delete all Stripe-related components (frontend)
- [x] Delete all Stripe-related API routes (backend)
- [x] Remove Stripe configuration files
- [ ] Remove Stripe environment variables from .env files
- [x] Update database schema to remove Stripe-specific fields

### 2.2 Implement Razorpay
- [x] Install Razorpay SDK in backend (`razorpay` npm package)
- [ ] Install Razorpay SDK in frontend (if needed)
- [x] Create Razorpay configuration service (backend)
- [x] Create payment initialization endpoint (backend)
- [x] Create payment verification endpoint (backend)
- [ ] Create payment webhook handler (backend)
- [ ] Create Razorpay checkout component (frontend)
- [ ] Add Razorpay environment variables (KEY_ID, KEY_SECRET)
- [ ] Implement payment success/failure pages
- [x] Add payment history tracking in database
- [ ] Ensure payment UI follows UI-UX-RULES.md guidelines

### 2.3 Placeholder Handling
- [x] Create fallback UI when Razorpay keys are missing
- [x] Display "Payment system under development" message
- [ ] Ensure placeholder follows UI-UX-RULES.md empty state guidelines
- [x] Add configuration check on app startup
- [ ] Log warnings when payment system is not configured

---

## 3. TypeScript Migration

### 3.1 Backend Migration
- [x] Install TypeScript and @types packages
- [x] Create tsconfig.json for backend
- [ ] Convert server.js to server.ts
- [ ] Convert all route files to TypeScript
- [ ] Convert all controller files to TypeScript
- [ ] Convert all middleware files to TypeScript
- [ ] Convert all model files to TypeScript
- [ ] Create interfaces for all database models
- [ ] Create types for API requests/responses
- [ ] Create utility types and shared interfaces
- [ ] Update build scripts in package.json
- [ ] Configure nodemon for TypeScript
- [ ] Fix all TypeScript errors and warnings

### 3.2 Frontend Migration
- [x] Install TypeScript and @types packages
- [x] Create tsconfig.json for frontend
- [ ] Rename .jsx files to .tsx
- [ ] Rename .js files to .ts
- [ ] Convert all components to TypeScript
- [ ] Create interfaces for props and state
- [ ] Create types for API responses
- [ ] Create types for Redux/Context state (if applicable)
- [ ] Convert utility functions to TypeScript
- [ ] Update Vite config for TypeScript
- [ ] Fix all TypeScript errors and warnings

### 3.3 Shared Types
- [ ] Create shared types folder/package
- [ ] Define User interface
- [ ] Define Course interface
- [ ] Define Educator interface
- [ ] Define Admin interface
- [ ] Define Payment interface
- [ ] Define API response types
- [ ] Export all shared types for frontend/backend use

---

## 4. Authentication System Overhaul

### 4.1 Remove Clerk
- [x] Remove Clerk dependencies from package.json (frontend)
- [x] Remove Clerk dependencies from package.json (backend)
- [ ] Delete all Clerk-related components
- [x] Remove Clerk middleware
- [x] Remove Clerk configuration
- [ ] Remove Clerk environment variables

### 4.2 Database Setup
- [x] Create Users table/collection schema
- [x] Add fields: id, email, password (hashed), name, role, status, createdAt, updatedAt
- [x] Add fields for profile: avatar, bio, phone, etc.
- [x] Create indexes for email (unique)
- [ ] Create Sessions/Tokens table for auth tokens
- [x] Create Educator Applications table
- [ ] Run migrations/create collections

### 4.3 Backend Authentication
- [x] Install bcrypt for password hashing
- [x] Install jsonwebtoken for JWT tokens
- [x] Create auth middleware for protected routes
- [x] Create role-based middleware (checkRole)
- [x] Implement POST /api/auth/register endpoint
- [x] Implement POST /api/auth/login endpoint
- [x] Implement POST /api/auth/logout endpoint
- [x] Implement GET /api/auth/me endpoint (get current user)
- [ ] Implement POST /api/auth/refresh-token endpoint
- [x] Implement password validation (min length, complexity)
- [ ] Implement rate limiting for auth endpoints
- [ ] Add email verification (optional)
- [ ] Add password reset functionality

### 4.4 Frontend Authentication
- [x] Create auth context/state management
- [x] Create Register component (follow UI-UX-RULES.md form guidelines)
- [x] Create Login component (follow UI-UX-RULES.md form guidelines)
- [x] Create logout functionality
- [x] Create protected route wrapper component
- [x] Store JWT token in httpOnly cookies or localStorage
- [ ] Implement auto-refresh token logic
- [x] Add loading states for auth operations
- [x] Add error handling and validation messages
- [x] Update navigation to show login/logout based on auth state
- [x] Ensure all forms follow UI-UX-RULES.md accessibility guidelines

---

## 5. Role-Based Access Control (RBAC)

### 5.1 Database Schema
- [ ] Add `role` field to Users table (enum: 'user', 'educator', 'admin')
- [ ] Add `status` field to Users table (enum: 'active', 'inactive', 'pending')
- [ ] Create EducatorApplications table with fields: userId, status, message, appliedAt, approvedAt, approvedBy

### 5.2 Backend RBAC
- [ ] Create role checking middleware (`isAdmin`, `isEducator`, `isUser`)
- [ ] Protect admin routes with `isAdmin` middleware
- [ ] Protect educator routes with `isEducator` middleware
- [ ] Create endpoint GET /api/admin/users (admin only)
- [ ] Create endpoint PUT /api/admin/users/:id/role (admin only)
- [ ] Create endpoint GET /api/admin/educator-applications (admin only)
- [ ] Create endpoint PUT /api/admin/educator-applications/:id/approve (admin only)
- [ ] Create endpoint PUT /api/admin/educator-applications/:id/reject (admin only)
- [ ] Create endpoint POST /api/educator/apply (user only)
- [ ] Add authorization checks in all relevant endpoints

### 5.3 Frontend RBAC
- [ ] Create role-based route guards
- [ ] Hide/show UI elements based on user role
- [ ] Create admin-only navigation items
- [ ] Create educator-only navigation items
- [ ] Add role checking utility functions
- [ ] Display appropriate dashboard based on role

---

## 6. Admin Portal

### 6.1 Backend - Admin API
- [ ] Create GET /api/admin/dashboard endpoint (stats)
- [ ] Create GET /api/admin/users endpoint (list all users)
- [ ] Create PUT /api/admin/users/:id endpoint (update user)
- [ ] Create DELETE /api/admin/users/:id endpoint (delete user)
- [ ] Create GET /api/admin/educator-applications endpoint
- [ ] Create PUT /api/admin/educator-applications/:id/approve endpoint
- [ ] Create PUT /api/admin/educator-applications/:id/reject endpoint
- [ ] Create GET /api/admin/courses endpoint (all courses)
- [ ] Create PUT /api/admin/courses/:id/approve endpoint (if approval needed)
- [ ] Create DELETE /api/admin/courses/:id endpoint
- [ ] Add pagination to all list endpoints
- [ ] Add search/filter capabilities

### 6.2 Frontend - Admin Portal UI
- [ ] Create /admin route (protected, admin only)
- [ ] Create AdminLayout component (follow UI-UX-RULES.md layout guidelines)
- [ ] Create AdminDashboard component (stats overview)
- [ ] Create UserManagement component (list, search, filter users)
- [ ] Create RoleAssignment component (assign roles to users)
- [ ] Create EducatorApplications component (list pending applications)
- [ ] Create ApplicationApproval component (approve/reject with feedback)
- [ ] Create CourseManagement component (view/manage all courses)
- [ ] Add confirmation modals for destructive actions
- [ ] Ensure all tables follow UI-UX-RULES.md table guidelines
- [ ] Add loading states and error handling
- [ ] Ensure accessibility compliance per UI-UX-RULES.md

### 6.3 Admin Authentication
- [ ] Create first admin user via seed script or manual DB entry
- [ ] Add admin role check on /admin route access
- [ ] Redirect non-admins to homepage with error message
- [ ] Add admin-specific navigation sidebar

---

## 7. Educator Functionality

### 7.1 Educator Application System
- [ ] Create application form for users to request educator role
- [ ] Add textarea for user to explain why they want to be educator
- [ ] Submit application to admin for review
- [ ] Send notification to admin when new application received
- [ ] Update user role after admin approval
- [ ] Send email/notification to user on approval/rejection

### 7.2 Backend - Educator API
- [ ] Create POST /api/educator/apply endpoint
- [ ] Create GET /api/educator/my-courses endpoint
- [ ] Create POST /api/educator/courses endpoint (create course)
- [ ] Create PUT /api/educator/courses/:id endpoint (update course)
- [ ] Create DELETE /api/educator/courses/:id endpoint
- [ ] Create POST /api/educator/courses/:id/videos endpoint (add video)
- [ ] Create PUT /api/educator/courses/:courseId/videos/:videoId endpoint
- [ ] Create DELETE /api/educator/courses/:courseId/videos/:videoId endpoint
- [ ] Create GET /api/educator/earnings endpoint (if applicable)
- [ ] Add authorization: educators can only edit their own courses

### 7.3 Frontend - Educator Portal
- [ ] Create /educator route (protected, educator only)
- [ ] Create EducatorLayout component (follow UI-UX-RULES.md)
- [ ] Create EducatorDashboard component (educator stats)
- [ ] Create MyCourses component (list educator's courses)
- [ ] Create CreateCourse component (course creation form)
- [ ] Create EditCourse component (course editing form)
- [ ] Create VideoManager component (upload/manage videos)
- [ ] Create VideoUpload component (video upload with progress)
- [ ] Add drag-and-drop video reordering
- [ ] Add course preview functionality
- [ ] Ensure all forms follow UI-UX-RULES.md form guidelines
- [ ] Add loading states for video uploads
- [ ] Implement progress indicators per UI-UX-RULES.md

### 7.4 Educator Application Flow (Frontend)
- [ ] Add "Become an Educator" button for regular users
- [ ] Create EducatorApplicationForm component
- [ ] Show application status (pending/approved/rejected)
- [ ] Disable reapplication if already pending
- [ ] Show success message after application submission
- [ ] Ensure UI follows UI-UX-RULES.md feedback guidelines

---

## 8. User Role & Experience

### 8.1 User Features
- [ ] Users can browse all courses
- [ ] Users can view course details
- [ ] Users can enroll in courses (free or paid)
- [ ] Users can view their enrolled courses
- [ ] Users can track their progress
- [ ] Users can access course content after enrollment
- [ ] Users can view their profile
- [ ] Users can edit their profile

### 8.2 User Dashboard
- [ ] Create /dashboard route (user dashboard)
- [ ] Show enrolled courses
- [ ] Show course progress
- [ ] Show recommended courses
- [ ] Show recently viewed courses
- [ ] Follow UI-UX-RULES.md dashboard guidelines

### 8.3 Course Enrollment & Payment
- [ ] Add "Enroll Now" button on course pages
- [ ] For paid courses, redirect to Razorpay checkout
- [ ] On successful payment, enroll user in course
- [ ] Save payment details in database
- [ ] Send confirmation email after enrollment
- [ ] Show placeholder if Razorpay not configured
- [ ] Ensure checkout flow follows UI-UX-RULES.md

---

## 9. Video Management

### 9.1 Backend Video Handling
- [ ] Create videos schema/table (id, courseId, title, description, url, order, duration)
- [ ] Create endpoint for video upload (if self-hosted) or URL input
- [ ] Support for external video URLs (YouTube, Vimeo, S3, etc.)
- [ ] Create endpoint to reorder videos
- [ ] Add video access control (only enrolled users can watch)

### 9.2 Frontend Video Player
- [ ] Create VideoPlayer component
- [ ] Integrate video player library (video.js, plyr, or custom)
- [ ] Add playback controls per UI-UX-RULES.md LMS guidelines
- [ ] Add progress tracking
- [ ] Save watch progress to database
- [ ] Resume from last watched position
- [ ] Add keyboard shortcuts
- [ ] Ensure responsive video player

---

## 10. Database & Models

### 10.1 Database Schema
- [ ] Users table (id, email, password, name, role, status, avatar, bio, phone, createdAt, updatedAt)
- [ ] Sessions/Tokens table (id, userId, token, expiresAt)
- [ ] Courses table (id, educatorId, title, description, thumbnail, price, category, status, createdAt)
- [ ] Videos table (id, courseId, title, description, url, order, duration, createdAt)
- [ ] Enrollments table (id, userId, courseId, progress, enrolledAt, completedAt)
- [ ] Payments table (id, userId, courseId, amount, razorpayOrderId, razorpayPaymentId, status, createdAt)
- [ ] EducatorApplications table (id, userId, message, status, appliedAt, reviewedAt, reviewedBy)
- [ ] Create all necessary indexes
- [ ] Set up foreign key constraints

### 10.2 ORM/Database Setup
- [ ] Configure database connection
- [ ] Set up Prisma/Sequelize/Mongoose (depending on choice)
- [ ] Create all model files with TypeScript types
- [ ] Create migration files
- [ ] Run migrations
- [ ] Create seed file for initial data (admin user)

---

## 11. Security & Best Practices

### 11.1 Security
- [ ] Hash all passwords with bcrypt (salt rounds: 10+)
- [ ] Use httpOnly cookies for JWT tokens
- [ ] Implement CSRF protection
- [ ] Add rate limiting on auth endpoints
- [ ] Validate all user inputs (backend)
- [ ] Sanitize user inputs to prevent XSS
- [ ] Use prepared statements/parameterized queries
- [ ] Add helmet.js for security headers
- [ ] Enable CORS with proper origin restrictions
- [ ] Implement session timeout and refresh logic
- [ ] Add logging for security events (failed logins, role changes)

### 11.2 Environment Variables
- [ ] Create .env.example files for frontend and backend
- [ ] Document all required environment variables
- [ ] Add .env to .gitignore
- [ ] Use different .env files for dev/staging/prod

### 11.3 Error Handling
- [ ] Create global error handler middleware (backend)
- [ ] Create custom error classes
- [ ] Return appropriate HTTP status codes
- [ ] Don't expose sensitive error details in production
- [ ] Add error boundaries in React (frontend)
- [ ] Log errors to monitoring service (optional)

---

## 12. Testing & Quality Assurance

### 12.1 Manual Testing
- [ ] Test user registration and login
- [ ] Test educator application flow
- [ ] Test admin approval of educator applications
- [ ] Test course creation by educators
- [ ] Test video upload/management
- [ ] Test user enrollment (free courses)
- [ ] Test user enrollment (paid courses with Razorpay)
- [ ] Test payment placeholder when keys missing
- [ ] Test role-based access control (try accessing unauthorized routes)
- [ ] Test all CRUD operations
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test responsive design at all breakpoints
- [ ] Verify accessibility with screen reader
- [ ] Run Lighthouse audit

### 12.2 Automated Testing (Optional but Recommended)
- [ ] Set up Jest for unit tests
- [ ] Write unit tests for utility functions
- [ ] Write tests for authentication logic
- [ ] Write tests for API endpoints
- [ ] Set up React Testing Library
- [ ] Write component tests
- [ ] Set up E2E testing (Playwright/Cypress)
- [ ] Write E2E tests for critical user flows

---

## 13. Documentation

### 13.1 Code Documentation
- [ ] Add JSDoc/TSDoc comments to all functions
- [ ] Document all API endpoints (or use Swagger)
- [ ] Document database schema
- [ ] Add README for frontend
- [ ] Add README for backend
- [ ] Document environment variables

### 13.2 User Documentation (Optional)
- [ ] Create user guide for students
- [ ] Create guide for educators
- [ ] Create guide for admins
- [ ] Add FAQ section

---

## 14. Deployment Preparation

### 14.1 Build & Optimization
- [ ] Run production build for frontend
- [ ] Run production build for backend
- [ ] Optimize images and assets
- [ ] Enable gzip compression
- [ ] Set up CDN for static assets (optional)
- [ ] Configure caching strategies
- [ ] Run bundle analyzer and optimize

### 14.2 Deployment
- [ ] Set up production database
- [ ] Run database migrations in production
- [ ] Create initial admin user in production
- [ ] Deploy backend to hosting (Railway, Render, AWS, etc.)
- [ ] Deploy frontend to hosting (Vercel, Netlify, etc.)
- [ ] Configure domain and SSL certificates
- [ ] Set up environment variables in production
- [ ] Test production deployment

### 14.3 Monitoring (Optional)
- [ ] Set up error tracking (Sentry)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Set up uptime monitoring
- [ ] Set up performance monitoring

---

## 15. Post-Launch

### 15.1 Verification
- [ ] Verify all functionality works in production
- [ ] Test payment flow with real Razorpay keys
- [ ] Monitor error logs for any issues
- [ ] Get feedback from test users

### 15.2 Improvements
- [ ] Gather user feedback
- [ ] Fix reported bugs
- [ ] Plan feature enhancements
- [ ] Optimize performance based on metrics

---

## Notes & Reminders

- **Always refer to [UI-UX-RULES.md](./UI-UX-RULES.md)** when building any UI component
- Follow TypeScript best practices (strict mode, proper typing)
- Test role-based access control thoroughly
- Keep security as top priority
- Document as you code
- Commit regularly with meaningful messages
- Create feature branches for major changes

---

## Task Status Legend
- [ ] Not Started
- [x] Completed
- [~] In Progress (mark with ~)

---

**Last Updated:** 2025-10-04
**Project:** Yunay-CA Academy (formerly Edemy)
**Tech Stack:** React + TypeScript (Frontend), Node.js + TypeScript (Backend), Razorpay (Payments)
