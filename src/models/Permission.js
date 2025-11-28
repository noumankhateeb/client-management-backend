const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE',
    },
    resource: {
        type: DataTypes.ENUM('products', 'clients', 'orders', 'comments', 'users'),
        allowNull: false,
    },
    canView: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    canCreate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    canUpdate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    canDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'permissions',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['userId', 'resource'],
        },
    ],
});

module.exports = Permission;
