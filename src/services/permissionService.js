const { Permission } = require('../models');

/**
 * Get all permissions for a user
 */
const getUserPermissions = async (userId) => {
    const permissions = await Permission.findAll({
        where: { userId },
    });

    // Return array format for frontend
    return permissions;
};

/**
 * Update permissions for a user
 */
const updateUserPermissions = async (userId, permissionsData) => {
    const results = [];

    // Handle array format from frontend
    const permissionsArray = Array.isArray(permissionsData) ? permissionsData : Object.entries(permissionsData).map(([resource, perms]) => ({
        resource,
        ...perms,
    }));

    for (const permData of permissionsArray) {
        const [permission, created] = await Permission.findOrCreate({
            where: { userId, resource: permData.resource },
            defaults: {
                userId,
                resource: permData.resource,
                canView: permData.canView || false,
                canCreate: permData.canCreate || false,
                canUpdate: permData.canUpdate || false,
                canDelete: permData.canDelete || false,
            },
        });

        if (!created) {
            await permission.update({
                canView: permData.canView || false,
                canCreate: permData.canCreate || false,
                canUpdate: permData.canUpdate || false,
                canDelete: permData.canDelete || false,
            });
        }

        results.push(permission);
    }

    return results;
};

/**
 * Check if user has specific permission
 */
const hasPermission = async (userId, resource, action) => {
    const permission = await Permission.findOne({
        where: { userId, resource },
    });

    if (!permission) {
        return false;
    }

    const permissionField = `can${action.charAt(0).toUpperCase() + action.slice(1)}`;
    return permission[permissionField] || false;
};

module.exports = {
    getUserPermissions,
    updateUserPermissions,
    hasPermission,
};
