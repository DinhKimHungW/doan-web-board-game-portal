const { body } = require('express-validator');

const VALID_MODES = ['vs_computer', 'solo'];

const createSession = [
  body('gameId')
    .notEmpty().withMessage('Game ID is required.')
    .isUUID().withMessage('Game ID must be a valid UUID.'),

  body('mode')
    .optional()
    .isIn(VALID_MODES).withMessage(`Mode must be one of: ${VALID_MODES.join(', ')}.`),

  body('timerSetting')
    .optional({ values: 'falsy' })
    .toInt()
    .isInt({ min: 0 }).withMessage('Timer setting must be a non-negative integer (seconds).'),

  body('boardRows')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('Board rows must be between 1 and 100.'),

  body('boardCols')
    .optional()
    .toInt()
    .isInt({ min: 1, max: 100 }).withMessage('Board columns must be between 1 and 100.'),
];

const updateState = [
  body('currentStateJson')
    .optional()
    .isObject().withMessage('Current state must be a JSON object.'),

  body('score')
    .optional()
    .isInt({ min: 0 }).withMessage('Score must be a non-negative integer.'),

  body('elapsedSeconds')
    .optional()
    .isInt({ min: 0 }).withMessage('Elapsed seconds must be a non-negative integer.'),
];

const saveGame = [
  body('slotName')
    .trim()
    .notEmpty().withMessage('Slot name is required.')
    .isLength({ min: 1, max: 100 }).withMessage('Slot name must be between 1 and 100 characters.'),
];

const completeSession = [
  body('score')
    .notEmpty().withMessage('Score is required.')
    .toInt()
    .isInt({ min: 0 }).withMessage('Score must be a non-negative integer.'),

  body('result')
    .notEmpty().withMessage('Result is required.')
    .isIn(['WIN', 'LOSE', 'DRAW']).withMessage('Result must be WIN, LOSE, or DRAW.'),
];

module.exports = { createSession, updateState, saveGame, completeSession };
