import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

// Register User
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        // Validate password length
        if (password.length < 6) {
            return res.json({ success: false, message: 'Password must be at least 6 characters' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            status: 'active'
        });

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' });
        }

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.json({ success: false, message: 'Invalid email or password' });
        }

        // Check if user is active
        if (user.status !== 'active') {
            return res.json({ success: false, message: 'Your account is inactive. Please contact support.' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                imageUrl: user.imageUrl
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Current User (Me)
export const getMe = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                imageUrl: user.imageUrl,
                bio: user.bio,
                phone: user.phone
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Logout (client-side mainly, this is just for consistency)
export const logout = async (req, res) => {
    try {
        // In JWT-based auth, logout is mainly handled on client by removing token
        // But we can add token blacklisting here if needed in future
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
