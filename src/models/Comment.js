const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    relatedTo: {
        type: DataTypes.ENUM('product', 'client', 'order', 'general'),
        allowNull: false,
        defaultValue: 'general',
    },
    relatedId: {
        type: DataTypes.UUID,
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
    tableName: 'comments',
    timestamps: true,
});

module.exports = Comment;
