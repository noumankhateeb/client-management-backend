const express = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const { isAdmin } = require('../middleware/permissions');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

// Validation rules
const userValidation = [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
];

const createUserValidation = [
    ...userValidation,
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(isAdmin);

// Routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/', createUserValidation, handleValidationErrors, userController.createUser);
router.put('/:id', userValidation, handleValidationErrors, userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
