const { validationResult } = require("express-validator")
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports = {
    signupController: async (req, res) => {
        const errors = validationResult(req)
        // any validation error in email or password
        // have atleast one error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'invalid input fields', errors: errors.array() })
        }
        else {
            const { name, email, password } = req.body
            // checking email or name is already exist?
            const user = await userModel.findOne({ email }) || await userModel.findOne({ name })

            if (user) {
                return res.status(200).json({ success: false, message: 'user already exist' })
            }
            else {
                bcrypt.hash(password, 10).then(async (hashPassword) => {
                    const newUser = await userModel.create({ name, email, password: hashPassword })
                    return res.status(201).json({ success: true, message: "User created successfully", user: newUser })
                })
            }
        }
    },
    loginController: (req, res) => {
        res.send('loginController')
    }
}