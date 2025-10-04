import jwt from 'jsonwebtoken';

// Authentication Middleware
export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;

        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired. Please login again.'
            });
        }
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Role-based middleware
export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        try {
            const User = (await import('../models/User.js')).default;
            const user = await User.findById(req.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Only ${roles.join(', ')} can access this resource.`
                });
            }

            req.user = user;
            next();

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};

// Specific role checks
export const isAdmin = authorizeRoles('admin');
export const isEducator = authorizeRoles('educator', 'admin');
export const isUser = authorizeRoles('user', 'educator', 'admin');
