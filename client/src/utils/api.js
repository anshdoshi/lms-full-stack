import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    logout: () => api.post('/api/auth/logout'),
    getMe: () => api.get('/api/auth/me'),
};

// User API calls
export const userAPI = {
    getUserData: () => api.get('/api/user/data'),
    purchaseCourse: (courseId) => api.post('/api/user/purchase', { courseId }),
    verifyPayment: (data) => api.post('/api/user/verify-payment', data),
    getEnrolledCourses: () => api.get('/api/user/enrolled-courses'),
    updateCourseProgress: (data) => api.post('/api/user/update-course-progress', data),
    getCourseProgress: (data) => api.post('/api/user/get-course-progress', data),
    addRating: (data) => api.post('/api/user/add-rating', data),
};

// Educator API calls
export const educatorAPI = {
    applyForEducator: (message) => api.post('/api/educator/apply', { message }),
    getApplicationStatus: () => api.get('/api/educator/application-status'),
    addCourse: (formData) => api.post('/api/educator/add-course', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getCourses: () => api.get('/api/educator/courses'),
    getDashboard: () => api.get('/api/educator/dashboard'),
    getEnrolledStudents: () => api.get('/api/educator/enrolled-students'),
};

// Admin API calls
export const adminAPI = {
    getDashboard: () => api.get('/api/admin/dashboard'),
    getUsers: (params) => api.get('/api/admin/users', { params }),
    updateUserRole: (userId, role) => api.put(`/api/admin/users/${userId}/role`, { role }),
    deleteUser: (userId) => api.delete(`/api/admin/users/${userId}`),
    getEducatorApplications: (status) => api.get('/api/admin/educator-applications', { params: { status } }),
    approveApplication: (applicationId) => api.put(`/api/admin/educator-applications/${applicationId}/approve`),
    rejectApplication: (applicationId) => api.put(`/api/admin/educator-applications/${applicationId}/reject`),
    getCourses: (params) => api.get('/api/admin/courses', { params }),
    deleteCourse: (courseId) => api.delete(`/api/admin/courses/${courseId}`),
};

// Course API calls (public)
export const courseAPI = {
    getAllCourses: () => api.get('/api/course'),
    getCourseById: (id) => api.get(`/api/course/${id}`),
};

export default api;
