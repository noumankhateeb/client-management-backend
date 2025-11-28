const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

// Validation rules
const orderValidation = [
    body('clientId').isUUID().withMessage('Valid client ID is required'),
    body('items').isArray({ min: 1 }).withMessage('Order must have at least one item'),
    body('items.*.productId').isUUID().withMessage('Valid product ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('items.*.unitPrice').isFloat({ min: 0 }).withMessage('Unit price must be positive'),
    body('paymentMethod1').isIn(['cash', 'credit_card', 'debit_card', 'bank_transfer']).withMessage('Invalid payment method'),
    body('paymentAmount1').isFloat({ min: 0 }).withMessage('Payment amount must be positive'),
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', checkPermission('orders', 'view'), orderController.getAllOrders);
router.get('/:id', checkPermission('orders', 'view'), orderController.getOrder);
router.post('/', checkPermission('orders', 'create'), orderValidation, handleValidationErrors, orderController.createOrder);
router.put('/:id', checkPermission('orders', 'update'), orderController.updateOrder);
router.delete('/:id', checkPermission('orders', 'delete'), orderController.deleteOrder);

module.exports = router;
