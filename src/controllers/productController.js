const { Product, User } = require('../models');

/**
 * Get all products
 */
const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single product
 */
const getProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        res.json({
            success: true,
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create product
 */
const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, sku } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            stock,
            sku,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update product
 */
const updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, sku, isActive } = req.body;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        await product.update({
            name,
            description,
            price,
            stock,
            sku,
            isActive,
        });

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: product,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }

        await product.destroy();

        res.json({
            success: true,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
