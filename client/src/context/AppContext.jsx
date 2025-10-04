import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";
import { authAPI, userAPI } from "../utils/api";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const currency = import.meta.env.VITE_CURRENCY

    const navigate = useNavigate()

    const [showLogin, setShowLogin] = useState(false)
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [isEducator, setIsEducator] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [allCourses, setAllCourses] = useState([])
    const [userData, setUserData] = useState(null)
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [loading, setLoading] = useState(true)

    // Fetch All Courses
    const fetchAllCourses = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/course/all');

            if (data.success) {
                setAllCourses(data.courses)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }

    }

    // Login function
    const login = async (email, password) => {
        try {
            const { data } = await authAPI.login({ email, password });

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                setIsEducator(data.user.role === 'educator' || data.user.role === 'admin');
                setIsAdmin(data.user.role === 'admin');
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Register function
    const register = async (name, email, password) => {
        try {
            const { data } = await authAPI.register({ name, email, password });

            if (data.success) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                setIsEducator(data.user.role === 'educator' || data.user.role === 'admin');
                setIsAdmin(data.user.role === 'admin');
                toast.success(data.message);
                return true;
            } else {
                toast.error(data.message);
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
            setUserData(null);
            setIsEducator(false);
            setIsAdmin(false);
            setEnrolledCourses([]);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Fetch UserData
    const fetchUserData = async () => {
        try {
            const { data } = await userAPI.getUserData();

            if (data.success) {
                setUserData(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fetch User Enrolled Courses
    const fetchUserEnrolledCourses = async () => {
        try {
            const { data } = await userAPI.getEnrolledCourses();

            if (data.success) {
                setEnrolledCourses(data.enrolledCourses.reverse());
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
        }
    };

    // Get current user from token
    const getCurrentUser = async () => {
        try {
            setLoading(true);
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                setIsEducator(parsedUser.role === 'educator' || parsedUser.role === 'admin');
                setIsAdmin(parsedUser.role === 'admin');

                // Verify token is still valid
                const { data } = await authAPI.getMe();
                if (data.success) {
                    setUser(data.user);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    setIsEducator(data.user.role === 'educator' || data.user.role === 'admin');
                    setIsAdmin(data.user.role === 'admin');
                }
            }
        } catch (error) {
            // Token invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Function to Calculate Course Chapter Time
    const calculateChapterTime = (chapter) => {

        let time = 0

        chapter.chapterContent.map((lecture) => time += lecture.lectureDuration)

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })

    }

    // Function to Calculate Course Duration
    const calculateCourseDuration = (course) => {

        let time = 0

        course.courseContent.map(
            (chapter) => chapter.chapterContent.map(
                (lecture) => time += lecture.lectureDuration
            )
        )

        return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] })

    }

    const calculateRating = (course) => {

        if (course.courseRatings.length === 0) {
            return 0
        }

        let totalRating = 0
        course.courseRatings.forEach(rating => {
            totalRating += rating.rating
        })
        return Math.floor(totalRating / course.courseRatings.length)
    }

    const calculateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter => {
            if (Array.isArray(chapter.chapterContent)) {
                totalLectures += chapter.chapterContent.length;
            }
        });
        return totalLectures;
    }


    useEffect(() => {
        fetchAllCourses()
        getCurrentUser()
    }, [])

    // Fetch User's Data if User is Logged In
    useEffect(() => {
        if (user && token) {
            fetchUserData()
            fetchUserEnrolledCourses()
        }
    }, [user, token])

    const value = {
        showLogin, setShowLogin,
        backendUrl, currency, navigate,
        user, token, loading,
        login, register, logout,
        userData, setUserData,
        allCourses, fetchAllCourses,
        enrolledCourses, fetchUserEnrolledCourses,
        calculateChapterTime, calculateCourseDuration,
        calculateRating, calculateNoOfLectures,
        isEducator, setIsEducator,
        isAdmin, setIsAdmin
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}
