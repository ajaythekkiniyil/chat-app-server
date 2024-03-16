const userModel = require('../models/userModel')
const chatModel = require('../models/chatModel')

module.exports = {
    getAllUsers: async (req, res) => {
        const userId = req.user.id
        const allUsers = await userModel.find({ _id: { $ne: userId } }).select('-password')
        const totalUsers = await userModel.find({ _id: { $ne: userId } }).countDocuments()
        res.status(200).json({ totalUsers, allUsers })
    },
    searchUsers: async (req, res) => {
        const { searchKey } = req.body
        const regexPattern = new RegExp(searchKey, 'i')

        const users = await userModel.find({ name: regexPattern })
        res.status(200).json(users)
    },
    createConversation: async (req, res) => {
        const { sender, receiver } = req.body

        // if already these two person have started conversation
        const conversationExist = await chatModel.find({
            $and: [
                {
                    users: { $elemMatch: { $eq: sender } }
                },
                {
                    users: { $elemMatch: { $eq: receiver } }
                }
            ]
        })

        if (conversationExist.length === 1) {
            return res.status(403).json('conversation already started')
        }

        const converationData = {
            users: [sender, receiver]
        }

        try {
            const newConversation = await chatModel.create(converationData)
            res.send(newConversation)
        }
        catch (err) {
            res.send(err)
        }
    },
    getAllConversations: (req, res) => {
        const userId = req.user.id

        chatModel.find({
            users: userId
        })
            .then(resp => {
                res.status(200).json(resp)
            })
            .catch(err => {
                res.status(401).json(err)
            })
    },
    getUserDetails: (req, res) => {
        const { userId } = req.body

        userModel.findOne({ _id: userId }).select('-password')
            .then(resp => {
                res.status(200).json(resp)
            }).catch(err => res.status(401).json(err))
    }
}