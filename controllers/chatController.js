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
                    users: sender
                },
                {
                    users: receiver
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
            res.status(400).json("create conversation error", err)
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
    getUserDetails: async(req, res) => {
        const { userId } = req.body

        if (!userId) return res.status(401).json("missing field")

        const userDetails = await userModel.findOne({ _id: userId }).select('-password')
        if(userDetails){
            res.send(userDetails)
        }
        else{
            // check if group chat
            const groupDetails = await chatModel.findOne({ _id: userId })
            res.send(groupDetails)
        }
        
    },
    createGroup: (req, res) => {
        // userId is logged in user id
        const userId = req.user.id
        const { chatName, members } = req.body

        if (!chatName) {
            return res.status(500).json('please send chatName')
        }

        if (members.length === 0) {
            return res.status(500).json('members list empty')
        }

        // group members list (id's)
        const membersList = [...members, userId]

        const newGroup = {
            chatName: chatName,
            isGroupChat: true,
            users: membersList,
            groupAdmin: userId,
        }

        chatModel.create(newGroup)
            .then(resp => {
                res.status(200).json('group created')
            })
            .catch(err => {
                res.status(500).json('group creation error')
            })
    },
    getAllGroups: (req, res) => {
        // userId is logged in user id
        const userId = req.user.id

        chatModel.find({ $and: [{ isGroupChat: true }, { users: userId }] })
            .then(resp => {
                res.status(200).json(resp)
            })
            .catch(err => {
                res.status(500).json('error while getting all groups list')
            })
    },
    exitGroup: (req, res) => {
        // userId of person want to exit from group
        const { groupId, userId } = req.body
        chatModel.updateOne(
            { _id: groupId },
            {
                $pull: {
                    users: userId
                }
            }
        ).then(resp => {
            res.status(200).json('user removed from group')
        }).catch(err => {
            res.status(500).json('error while removing user from groups')
        })
    },
    AddToGroup: (req, res) => {
        const { groupId, userId } = req.body
        chatModel.updateOne(
            {
                _id: groupId
            },
            {
                $addToSet: {
                    users: userId
                }
            }
        ).then(resp => {
            res.status(200).json('user added to group')
        }).catch(err => {
            res.status(500).json('error while adding user to groups')
        })
    }
}