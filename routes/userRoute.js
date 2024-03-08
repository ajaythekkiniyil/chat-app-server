const express = require('express')
const router = express.Router()
const { signupController, loginController } = require('../controllers/userController')
const { body } = require('express-validator')

// input validation using express-validator
router.post('/signup',
    [
        body('email').isEmail().normalizeEmail(), 
        body('password')
            .isLength({ min: 4 }).withMessage("Password must be at least 4 characters long")
            .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
            .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
            .matches(/\d/).withMessage('Password must contain at least one number')
    ]
    , signupController)

router.post('/login', loginController)

module.exports = router