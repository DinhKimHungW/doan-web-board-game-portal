const { body, query } = require('express-validator');

const createReview = [
  body('rating')
    .notEmpty().withMessage('Rating is required.')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),

  body('comment')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters.'),
];

const updateReview = [
  body('rating')
    .optional()
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),

  body('comment')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters.'),
];

const listReviews = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer.'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50.'),
];

module.exports = { createReview, updateReview, listReviews };
