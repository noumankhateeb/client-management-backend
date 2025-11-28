const express = require('express');
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');
const handleValidationErrors = require('../middleware/validation');

const router = express.Router();

// Validation rules
const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
    body('sku').notEmpty().withMessage('SKU is required'),
];

// All routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', checkPermission('products', 'view'), productController.getAllProducts);
router.get('/:id', checkPermission('products', 'view'), productController.getProduct);
router.post('/', checkPermission('products', 'create'), productValidation, handleValidationErrors, productController.createProduct);
router.put('/:id', checkPermission('products', 'update'), productValidation, handleValidationErrors, productController.updateProduct);
router.delete('/:id', checkPermission('products', 'delete'), productController.deleteProduct);

module.exports = router;
