const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

// Validation rules
const commentValidation = [
    body('content').notEmpty().withMessage('Comment content is required'),
    body('relatedTo').isIn(['product', 'client', 'order', 'general']).withMessage('Invalid relatedTo value'),
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', checkPermission('comments', 'view'), commentController.getAllComments);
router.get('/:id', checkPermission('comments', 'view'), commentController.getComment);
router.post('/', checkPermission('comments', 'create'), commentValidation, handleValidationErrors, commentController.createComment);
router.put('/:id', checkPermission('comments', 'update'), commentValidation, handleValidationErrors, commentController.updateComment);
router.delete('/:id', checkPermission('comments', 'delete'), commentController.deleteComment);

module.exports = router;
