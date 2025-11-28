const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    orderNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    clientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id',
        },
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    paymentMethod1: {
        type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer'),
        allowNull: false,
    },
    paymentAmount1: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0,
        },
    },
    paymentMethod2: {
        type: DataTypes.ENUM('cash', 'credit_card', 'debit_card', 'bank_transfer'),
        allowNull: true,
    },
    paymentAmount2: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: 0,
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    createdBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
}, {
    tableName: 'orders',
    timestamps: true,
    validate: {
        paymentAmountsMatchTotal() {
            const amount1 = parseFloat(this.paymentAmount1) || 0;
            const amount2 = parseFloat(this.paymentAmount2) || 0;
            const total = parseFloat(this.totalAmount) || 0;

            if (Math.abs((amount1 + amount2) - total) > 0.01) {
                throw new Error('Payment amounts must equal total amount');
            }
        },
    },
    hooks: {
        beforeValidate: (order) => {
            // Generate order number if not provided
            if (!order.orderNumber) {
                const timestamp = Date.now();
                const random = Math.floor(Math.random() * 1000);
                order.orderNumber = `ORD-${timestamp}-${random}`;
            }
        },
    },
});

module.exports = Order;
