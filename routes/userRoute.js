const express = require('express')
const router = express.Router()
const { signupController, loginController } = require('../controllers/userController')
const { validateSignUp, validateLogin } = require('../helper/inputValidate')

// validateSignUp is for input sanitization
router.post('/signup', validateSignUp, signupController)
router.post('/login', validateLogin, loginController)

module.exports = router