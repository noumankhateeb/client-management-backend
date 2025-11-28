const { Client, User } = require('../models');

/**
 * Get all clients
 */
const getAllClients = async (req, res, next) => {
    try {
        const clients = await Client.findAll({
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
            data: clients,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single client
 */
const getClient = async (req, res, next) => {
    try {
        const { id } = req.params;

        const client = await Client.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found',
            });
        }

        res.json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create client
 */
const createClient = async (req, res, next) => {
    try {
        const { firstName, lastName, email, phone, address, city, country, notes } = req.body;

        const client = await Client.create({
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            country,
            notes,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: 'Client created successfully',
            data: client,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update client
 */
const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone, address, city, country, notes } = req.body;

        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found',
            });
        }

        await client.update({
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            country,
            notes,
        });

        res.json({
            success: true,
            message: 'Client updated successfully',
            data: client,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete client
 */
const deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params;

        const client = await Client.findByPk(id);

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found',
            });
        }

        await client.destroy();

        res.json({
            success: true,
            message: 'Client deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllClients,
    getClient,
    createClient,
    updateClient,
    deleteClient,
};
