const userModel = require('../models/userModel')

module.exports = {
    getAllUsers: async (req, res) => {
        const allUsers = await userModel.find().select('-password')
        const totalUsers = await userModel.countDocuments()
        res.status(200).json({ totalUsers, allUsers })
    },
    searchUsers: async (req, res) => {
        const { searchKey } = req.body
        const regexPattern = new RegExp(searchKey, 'i')

        const users = await userModel.find({name: regexPattern})
        res.status(200).json(users)
    }
}