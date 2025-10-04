# 🔐 Test Account Credentials

**Last Updated:** January 4, 2025

---

## 📋 Test Accounts

### 👨‍🏫 Educator Account
```
Email:    educator@test.com
Password: educator123
Role:     Educator
Status:   Approved
```

**Access:**
- Can create, edit, and delete courses
- Can view enrolled students
- Can access educator dashboard
- Has 3 test courses created

---

### 👨‍🎓 Student Account
```
Email:    student@test.com
Password: student123
Role:     User (Student)
Status:   Active
```

**Access:**
- Can browse and enroll in courses
- Can view enrolled courses
- Can track course progress
- Can rate courses
- Enrolled in: "Complete Web Development Bootcamp"

---

### 👨‍💼 Admin Account
```
Email:    admin@test.com
Password: admin123
Role:     Admin
Status:   Active
```

**Access:**
- Full system access
- Can manage users
- Can approve/reject educator applications
- Can manage all courses
- Can view analytics and dashboard

---

## 📚 Test Courses Available

### 1. Complete Web Development Bootcamp
- **Price:** $99.99
- **Discount:** 20%
- **Final Price:** $79.99
- **Chapters:** 3
- **📹 Video Lectures:** 5 (Real YouTube videos)
- **Enrolled Students:** 1 (student@test.com)
- **Educator:** educator@test.com
- **Preview Videos:** 2 free preview lectures

### 2. Python for Data Science
- **Price:** $79.99
- **Discount:** 15%
- **Final Price:** $67.99
- **Chapters:** 2
- **📹 Video Lectures:** 3 (Real YouTube videos)
- **Enrolled Students:** 0
- **Educator:** educator@test.com
- **Preview Videos:** 1 free preview lecture

### 3. React.js - The Complete Guide
- **Price:** $89.99
- **Discount:** 25%
- **Final Price:** $67.49
- **Chapters:** 1
- **📹 Video Lectures:** 2 (Real YouTube videos)
- **Enrolled Students:** 0
- **Educator:** educator@test.com
- **Preview Videos:** 2 free preview lectures

---

## 🚀 Quick Start

### For Educator Testing:
1. Login with: `educator@test.com` / `educator123`
2. Navigate to "My Courses"
3. Test Edit/Delete functionality

### For Student Testing:
1. Login with: `student@test.com` / `student123`
2. Browse courses
3. Test enrollment and course player

### For Admin Testing:
1. Login with: `admin@test.com` / `admin123`
2. Access Admin Portal
3. Test user management and course management

---

## 🔄 Reset Test Data

If you need to reset the test data:

```bash
# Clean database
cd server && node scripts/cleanDatabase.js

# Add fresh test data
node scripts/addTestData.js
```

---

## 🌐 Application URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5001
- **Clear Storage:** file:///path/to/clear-storage.html

---

## 📝 Notes

- All passwords are simple for testing purposes only
- Test data includes courses with and without enrolled students
- Educator application is pre-approved for educator@test.com
- Student is enrolled in first course for deletion testing
- **📹 All courses include REAL YouTube video URLs for testing**
- Total of 10 educational videos across all courses
- Videos include HTML, CSS, Python, Pandas, and React tutorials

---

## 📹 Video Testing

All test courses now include real, working YouTube videos:
- **10 total video lectures** across 3 courses
- **5 free preview videos** (can watch without enrollment)
- **5 locked videos** (require enrollment)
- Videos range from 12-35 minutes in duration
- All videos are educational programming tutorials

**To test video functionality:**
1. Browse course details to see preview videos
2. Enroll in a course to unlock all videos
3. Use course player to watch lectures
4. Test video controls (play, pause, fullscreen)
5. Verify progress tracking works

See **VIDEO-TESTING-GUIDE.md** for comprehensive video testing instructions.

---

**Security Note:** These are test credentials only. Never use simple passwords in production!
