const jwt = require('jsonwebtoken');
const config = require('../config/env');
const { User } = require('../models');

/**
 * Generate JWT token for user
 */
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
    );
};

/**
 * Register a new user
 */
const register = async (userData) => {
    const { email, password, firstName, lastName } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }

    // Create user
    const user = await User.create({
        email,
        password,
        firstName,
        lastName,
    });

    // Generate token
    const token = generateToken(user.id);

    return {
        user: user.toJSON(),
        token,
    };
};

/**
 * Login user
 */
const login = async (email, password) => {
    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
        throw new Error('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    return {
        user: user.toJSON(),
        token,
    };
};

module.exports = {
    generateToken,
    register,
    login,
};
