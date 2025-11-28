const { User, Permission } = require('../models');

/**
 * Get all users
 */
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            data: users,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single user
 */
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Permission,
                    as: 'permissions',
                },
            ],
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            data: user,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create user (admin only)
 */
const createUser = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, isAdmin } = req.body;

        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            isAdmin: isAdmin || false,
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user
 */
const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, isActive, isAdmin } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.update({
            firstName,
            lastName,
            email,
            isActive,
            isAdmin,
        });

        res.json({
            success: true,
            message: 'User updated successfully',
            data: user.toJSON(),
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete user
 */
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own account',
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.destroy();

        res.json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
};
