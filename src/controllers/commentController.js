const { Comment, User } = require('../models');

/**
 * Get all comments
 */
const getAllComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
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
            data: comments,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get single comment
 */
const getComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
        });

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        res.json({
            success: true,
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Create comment
 */
const createComment = async (req, res, next) => {
    try {
        const { content, relatedTo, relatedId } = req.body;

        const comment = await Comment.create({
            content,
            relatedTo,
            relatedId,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: 'Comment created successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update comment
 */
const updateComment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        await comment.update({ content });

        res.json({
            success: true,
            message: 'Comment updated successfully',
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete comment
 */
const deleteComment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found',
            });
        }

        await comment.destroy();

        res.json({
            success: true,
            message: 'Comment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllComments,
    getComment,
    createComment,
    updateComment,
    deleteComment,
};
