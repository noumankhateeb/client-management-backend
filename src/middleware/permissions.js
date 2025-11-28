const { Permission } = require('../models');

/**
 * Middleware to check if user has specific permission for a resource
 * @param {string} resource - The resource name (e.g., 'products', 'clients')
 * @param {string} action - The action type ('view', 'create', 'update', 'delete')
 */
const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            const user = req.user;

            // Admins bypass all permission checks
            if (user.isAdmin) {
                return next();
            }

            // Map action to permission field
            const permissionField = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;

            // Get user's permission for this resource
            const permission = await Permission.findOne({
                where: {
                    userId: user.id,
                    resource: resource,
                },
            });

            // Check if permission exists and user has the required action
            if (!permission || !permission[permissionField]) {
                return res.status(403).json({
                    success: false,
                    message: `You do not have permission to ${action} ${resource}.`,
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({
                success: false,
                message: 'Error checking permissions.',
            });
        }
    };
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.',
        });
    }
    next();
};

module.exports = {
    checkPermission,
    isAdmin,
};
