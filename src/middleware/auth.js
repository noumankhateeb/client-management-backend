const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Authorization denied.',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Get user from database
        const user = await User.findByPk(decoded.userId, {
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Authorization denied.',
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is inactive.',
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.',
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired.',
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication.',
        });
    }
};

module.exports = authMiddleware;
