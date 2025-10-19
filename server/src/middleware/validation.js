const { body, validationResult } = require('express-validator');

/**
 * Validation middleware for user registration
 */
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Username must be 3-20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Valid email required')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

/**
 * Validation middleware for login
 */
const validateLogin = [
  body('username').trim().notEmpty().withMessage('Username required'),
  body('password').notEmpty().withMessage('Password required'),
];

/**
 * Validation middleware for game submission
 */
const validateGameSubmission = [
  body('stateId').isInt().withMessage('Valid state ID required'),
  body('sessionId').notEmpty().withMessage('Session ID required'),
  body('isCorrect').isBoolean().withMessage('isCorrect must be boolean'),
];

/**
 * Validation middleware for game completion
 */
const validateGameCompletion = [
  body('gameMode').isIn([
    'full_usa', 'northeast', 'mid_atlantic', 'southeast',
    'midwest', 'southwest', 'west'
  ]).withMessage('Invalid game mode'),
  body('score').isInt({ min: 0 }).withMessage('Valid score required'),
  body('timeSeconds').isInt({ min: 0 }).withMessage('Valid time required'),
];

/**
 * Middleware to check validation results
 */
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateGameSubmission,
  validateGameCompletion,
  checkValidation
};
