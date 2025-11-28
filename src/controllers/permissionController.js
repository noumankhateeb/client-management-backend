const permissionService = require('../services/permissionService');

/**
 * Get user permissions
 */
const getUserPermissions = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const permissions = await permissionService.getUserPermissions(userId);

        res.json({
            success: true,
            data: permissions,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user permissions
 */
const updateUserPermissions = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const permissionsData = req.body;

        const permissions = await permissionService.updateUserPermissions(userId, permissionsData);

        res.json({
            success: true,
            message: 'Permissions updated successfully',
            data: permissions,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getUserPermissions,
    updateUserPermissions,
};
