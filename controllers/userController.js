const { validationResult } = require("express-validator")
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const createToken = require('../helper/createToken')
const jwt = require('jsonwebtoken')
const verifyToken = require("../helper/verifyToken")

const options = {
    // maxAge: 1000 * 60 * 15, // expire after 15 minutes
    httpOnly: true, // Cookie will not be exposed to client side code
    sameSite: "none", // If client and server origins are different
    secure: true, // use with HTTPS only
}

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
                return res.status(409).json({ success: false, message: 'user already exist with this email or username' })
            }
            else {
                bcrypt.hash(password, 10).then(async (hashPassword) => {
                    const newUser = await userModel.create({ name, email, password: hashPassword })
                    // const token = await createToken(newUser._id)
                    // setting token in cookie
                    // res.cookie("token", token, options)
                    return res.status(201).json({ success: true, message: "User created successfully" })
                })
            }
        }
    },
    loginController: async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(404).json({ message: 'incorrect email or password' })
        }
        else {
            const { email, password } = req.body
            // checking email is exist?
            const user = await userModel.findOne({ email })

            if (!user) {
                return res.status(404).json({ success: false, message: 'incorrect email or password' })
            }
            else {
                bcrypt.compare(password, user.password).then(async (result) => {
                    if (result) {
                        // generating token
                        const token = await createToken(user._id)
                        // setting token in cookie
                        res.cookie("token", token, options)
                        return res.status(200).json({ success: true, message: "Login successfull", user: user._id })
                    }
                    else {
                        return res.status(404).json({ success: false, message: 'incorrect email or password' })
                    }
                })
            }
        }
    },
    getsomedata: (req, res) => {
        res.send('your data')
    }
}