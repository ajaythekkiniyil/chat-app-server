const { body } = require('express-validator')

// input validation using express-validator
const validateSignUp = [
    body('name').not().isEmpty().escape().withMessage("invalid name"),
    body('email').isEmail().normalizeEmail().withMessage("Invalid email"),
    // body('password')
    //     .isLength({ min: 4 }).withMessage("Password must be at least 4 characters long")
    //     .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    //     .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    //     .matches(/\d/).withMessage('Password must contain at least one number')
]

const validateLogin = [
    body('email').isEmail().normalizeEmail(),
    // body('password').isLength({ min: 4 })
]

module.exports = { validateSignUp, validateLogin }