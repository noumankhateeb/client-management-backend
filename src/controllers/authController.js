const authService = require('../services/authService');
const permissionService = require('../services/permissionService');

/**
 * Register a new user
 */
const register = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        const result = await authService.register({
            email,
            password,
            firstName,
            lastName,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: result,
        });
    } catch (error) {
        if (error.message === 'User with this email already exists') {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await authService.login(email, password);

        res.json({
            success: true,
            message: 'Login successful',
            data: result,
        });
    } catch (error) {
        if (error.message === 'Invalid credentials' || error.message === 'Account is inactive') {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
        next(error);
    }
};

/**
 * Get current user info
 */
const getMe = async (req, res, next) => {
    try {
        const permissions = await permissionService.getUserPermissions(req.user.id);

        res.json({
            success: true,
            data: {
                user: req.user,
                permissions,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
};
