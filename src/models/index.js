const { sequelize } = require('../config/database');
const User = require('./User');
const Permission = require('./Permission');
const Product = require('./Product');
const Client = require('./Client');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Comment = require('./Comment');

// Define associations

// User associations
User.hasMany(Permission, { foreignKey: 'userId', as: 'permissions', onDelete: 'CASCADE' });
Permission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Product, { foreignKey: 'createdBy', as: 'products' });
Product.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Client, { foreignKey: 'createdBy', as: 'clients' });
Client.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Order, { foreignKey: 'createdBy', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

User.hasMany(Comment, { foreignKey: 'createdBy', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Client-Order associations
Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });

// Order-OrderItem associations
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Product-OrderItem associations
Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

// Sync database
const syncDatabase = async (force = false) => {
    try {
        await sequelize.sync({ force });
        console.log('✅ Database synchronized successfully.');
    } catch (error) {
        console.error('❌ Error synchronizing database:', error.message);
        throw error;
    }
};

module.exports = {
    sequelize,
    User,
    Permission,
    Product,
    Client,
    Order,
    OrderItem,
    Comment,
    syncDatabase,
};
