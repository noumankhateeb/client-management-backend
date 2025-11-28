const express = require('express');
const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/permissions');

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(isAdmin);

// Routes
router.get('/:userId', permissionController.getUserPermissions);
router.put('/:userId', permissionController.updateUserPermissions);

module.exports = router;
