# Admin CRUD Operations Guide

This guide documents all CRUD operations available to administrators in the LMS system.

## Table of Contents
1. [User Management](#user-management)
2. [Course Management](#course-management)
3. [Category Management](#category-management)
4. [Educator Applications](#educator-applications)

---

## User Management

### 1. Get All Users
**Endpoint:** `GET /api/admin/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (user, educator, admin)

**Example:**
```bash
curl -X GET "http://localhost:5001/api/admin/users?page=1&limit=10&search=john&role=user" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "users": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalUsers": 50
}
```

---

### 2. Create User
**Endpoint:** `POST /api/admin/users`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "status": "active"
}
```

**Roles:** `user`, `educator`, `admin`
**Status:** `active`, `inactive`

**Example:**
```bash
curl -X POST http://localhost:5001/api/admin/users \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user",
    "status": "active"
  }'
```

---

### 3. Get User by ID
**Endpoint:** `GET /api/admin/users/:userId`

**Example:**
```bash
curl -X GET http://localhost:5001/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 4. Update User
**Endpoint:** `PUT /api/admin/users/:userId`

**Body (all fields optional):**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123",
  "role": "educator",
  "status": "active"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5001/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "role": "educator"
  }'
```

---

### 5. Update User Role
**Endpoint:** `PUT /api/admin/users/:userId/role`

**Body:**
```json
{
  "role": "educator"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5001/api/admin/users/USER_ID/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role": "educator"}'
```

---

### 6. Delete User
**Endpoint:** `DELETE /api/admin/users/:userId`

**Example:**
```bash
curl -X DELETE http://localhost:5001/api/admin/users/USER_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Course Management

### 1. Get All Courses
**Endpoint:** `GET /api/admin/courses`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by course title

**Example:**
```bash
curl -X GET "http://localhost:5001/api/admin/courses?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 2. Create Course
**Endpoint:** `POST /api/admin/courses`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `courseData` (JSON string): Course details
- `image` (file): Course thumbnail
- `video_{chapterId}_{lectureId}` (file, optional): Video files for lectures

**Course Data Structure:**
```json
{
  "courseTitle": "Introduction to Python",
  "courseDescription": "<p>Learn Python programming</p>",
  "coursePrice": 99.99,
  "discount": 10,
  "courseCategory": "CATEGORY_ID",
  "educator": "EDUCATOR_USER_ID",
  "isPublished": true,
  "courseContent": [
    {
      "chapterId": "chapter1",
      "chapterOrder": 1,
      "chapterTitle": "Getting Started",
      "chapterContent": [
        {
          "lectureId": "lecture1",
          "lectureTitle": "Introduction",
          "lectureDuration": 10,
          "lectureUrl": "https://youtube.com/watch?v=...",
          "videoType": "youtube",
          "isPreviewFree": true,
          "lectureOrder": 1
        }
      ]
    }
  ]
}
```

**Example (using form-data):**
```bash
curl -X POST http://localhost:5001/api/admin/courses \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "courseData={\"courseTitle\":\"Python Course\",\"courseDescription\":\"Learn Python\",\"coursePrice\":99,\"discount\":10,\"educator\":\"EDUCATOR_ID\",\"courseContent\":[]}" \
  -F "image=@/path/to/thumbnail.jpg"
```

---

### 3. Get Course by ID
**Endpoint:** `GET /api/admin/courses/:courseId`

**Example:**
```bash
curl -X GET http://localhost:5001/api/admin/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 4. Update Course
**Endpoint:** `PUT /api/admin/courses/:courseId`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `courseData` (JSON string): Updated course details
- `image` (file, optional): New course thumbnail
- `video_{chapterId}_{lectureId}` (file, optional): New video files

**Example:**
```bash
curl -X PUT http://localhost:5001/api/admin/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -F "courseData={\"courseTitle\":\"Updated Python Course\",\"coursePrice\":79}" \
  -F "image=@/path/to/new-thumbnail.jpg"
```

---

### 5. Delete Course
**Endpoint:** `DELETE /api/admin/courses/:courseId`

**Example:**
```bash
curl -X DELETE http://localhost:5001/api/admin/courses/COURSE_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Category Management

### 1. Get All Categories
**Endpoint:** `GET /api/admin/categories`

**Query Parameters:**
- `includeInactive` (optional): Include inactive categories (true/false)

**Example:**
```bash
curl -X GET "http://localhost:5001/api/admin/categories?includeInactive=false" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Public Endpoint (no auth required):**
```bash
curl -X GET http://localhost:5001/api/course/categories/all
```

---

### 2. Create Category
**Endpoint:** `POST /api/admin/categories`

**Body:**
```json
{
  "name": "Web Development",
  "description": "Courses related to web development"
}
```

**Example:**
```bash
curl -X POST http://localhost:5001/api/admin/categories \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "description": "Courses related to web development"
  }'
```

---

### 3. Update Category
**Endpoint:** `PUT /api/admin/categories/:categoryId`

**Body (all fields optional):**
```json
{
  "name": "Advanced Web Development",
  "description": "Updated description",
  "isActive": true
}
```

**Example:**
```bash
curl -X PUT http://localhost:5001/api/admin/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Advanced Web Development",
    "isActive": true
  }'
```

---

### 4. Delete Category
**Endpoint:** `DELETE /api/admin/categories/:categoryId`

**Note:** Cannot delete if courses are using this category

**Example:**
```bash
curl -X DELETE http://localhost:5001/api/admin/categories/CATEGORY_ID \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Educator Applications

### 1. Get All Applications
**Endpoint:** `GET /api/admin/educator-applications`

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, rejected)

**Example:**
```bash
curl -X GET "http://localhost:5001/api/admin/educator-applications?status=pending" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 2. Approve Application
**Endpoint:** `PUT /api/admin/educator-applications/:applicationId/approve`

**Example:**
```bash
curl -X PUT http://localhost:5001/api/admin/educator-applications/APP_ID/approve \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

### 3. Reject Application
**Endpoint:** `PUT /api/admin/educator-applications/:applicationId/reject`

**Example:**
```bash
curl -X PUT http://localhost:5001/api/admin/educator-applications/APP_ID/reject \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Dashboard Stats

**Endpoint:** `GET /api/admin/dashboard`

**Example:**
```bash
curl -X GET http://localhost:5001/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 150,
    "totalEducators": 25,
    "totalCourses": 50,
    "pendingApplications": 5
  }
}
```

---

## Authentication

All admin endpoints require:
1. Valid JWT token in Authorization header
2. User must have `admin` role

**Header Format:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Error Responses

All endpoints return errors in this format:
```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden (not admin)
- `404`: Not Found
- `500`: Server Error

---

## Notes

1. **User Management:**
   - Cannot delete admin users
   - Email must be unique
   - Password must be at least 6 characters

2. **Course Management:**
   - Admin can create/edit courses for any educator
   - Must specify educator ID when creating
   - Video uploads support MP4, MOV, AVI, WebM (max 100MB)

3. **Category Management:**
   - Category names must be unique
   - Cannot delete categories in use by courses
   - Inactive categories hidden from public API

4. **Educator Applications:**
   - Approving changes user role to 'educator'
   - Applications can only be processed once

---

## Frontend Integration

### Example: Create User Form
```javascript
const createUser = async (userData) => {
  const response = await axios.post(
    `${backendUrl}/api/admin/users`,
    userData,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
```

### Example: Create Course with Video
```javascript
const createCourse = async (courseData, thumbnail, videos) => {
  const formData = new FormData();
  formData.append('courseData', JSON.stringify(courseData));
  formData.append('image', thumbnail);
  
  // Add video files
  videos.forEach(video => {
    formData.append(
      `video_${video.chapterId}_${video.lectureId}`,
      video.file
    );
  });
  
  const response = await axios.post(
    `${backendUrl}/api/admin/courses`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};
```

### Example: Manage Categories
```javascript
// Get all categories
const getCategories = async () => {
  const response = await axios.get(
    `${backendUrl}/api/course/categories/all`
  );
  return response.data.categories;
};

// Create category
const createCategory = async (name, description) => {
  const response = await axios.post(
    `${backendUrl}/api/admin/categories`,
    { name, description },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
```

---

## Testing

Use the provided test credentials:
- **Admin:** admin@test.com / admin123

Test the endpoints using curl, Postman, or your frontend application.

---

**Last Updated:** January 2025
**Version:** 1.0
