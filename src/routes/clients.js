const express = require('express');
const { body } = require('express-validator');
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

// Validation rules
const clientValidation = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', checkPermission('clients', 'view'), clientController.getAllClients);
router.get('/:id', checkPermission('clients', 'view'), clientController.getClient);
router.post('/', checkPermission('clients', 'create'), clientValidation, handleValidationErrors, clientController.createClient);
router.put('/:id', checkPermission('clients', 'update'), clientValidation, handleValidationErrors, clientController.updateClient);
router.delete('/:id', checkPermission('clients', 'delete'), clientController.deleteClient);

module.exports = router;
