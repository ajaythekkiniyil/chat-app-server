const express = require('express')
const router = express.Router()
const { signupController, loginController, getsomedata } = require('../controllers/userController')
const { validateSignUp, validateLogin } = require('../helper/inputValidate')
const verifyToken = require('../helper/verifyToken')

// validateSignUp is for input sanitization
router.post('/signup', validateSignUp, signupController)
router.post('/login', validateLogin, loginController)
router.get('/data', verifyToken, getsomedata)


module.exports = router