const { Order, OrderItem, Client, Product, User, sequelize } = require('../models');

/**
 * Get all orders
 */
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'name', 'sku'],
                        },
                    ],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        res.json({
            success: true,
            data: orders,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single order
 */
const getOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        res.json({
            success: true,
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create order with items
 */
const createOrder = async (req, res, next) => {
    const transaction = await sequelize.transaction();

    try {
        const {
            clientId,
            items, // Array of { productId, quantity, unitPrice }
            paymentMethod1,
            paymentAmount1,
            paymentMethod2,
            paymentAmount2,
            notes,
        } = req.body;

        // Calculate total from items
        let totalAmount = 0;
        for (const item of items) {
            totalAmount += item.quantity * item.unitPrice;
        }

        // Create order
        const order = await Order.create(
            {
                clientId,
                totalAmount,
                paymentMethod1,
                paymentAmount1,
                paymentMethod2,
                paymentAmount2,
                notes,
                createdBy: req.user.id,
            },
            { transaction }
        );

        // Create order items and update product stock
        for (const item of items) {
            // Create order item
            await OrderItem.create(
                {
                    orderId: order.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                },
                { transaction }
            );

            // Update product stock
            const product = await Product.findByPk(item.productId, { transaction });
            if (product) {
                const newStock = product.stock - item.quantity;
                if (newStock < 0) {
                    throw new Error(`Insufficient stock for product: ${product.name}`);
                }
                await product.update({ stock: newStock }, { transaction });
            }
        }

        await transaction.commit();

        // Fetch complete order with relations
        const completeOrder = await Order.findByPk(order.id, {
            include: [
                {
                    model: Client,
                    as: 'client',
                },
                {
                    model: OrderItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                        },
                    ],
                },
            ],
        });

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: completeOrder,
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
};

/**
 * Update order
 */
const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        await order.update({
            status,
            notes,
        });

        res.json({
            success: true,
            message: 'Order updated successfully',
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete order
 */
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await Order.findByPk(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }

        await order.destroy();

        res.json({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder,
};
