const messageModel = require('../models/messageModel')
const chatModel = require('../models/chatModel')

module.exports = {
    sendMessage: async (req, res) => {
        const sender = req.user.id
        const { receiver, message } = req.body

        if (!receiver || !message || !sender) {
            return res.status(500).json('please send all fields')
        }

        const conversation = await chatModel.find(
            {
                $and: [{ users: sender }, { users: receiver }]
            }
        )

        if (conversation.length === 0) {
            return res.status(401).json('conversation not exist')
        }

        const conversationId = conversation[0]._id


        messageModel.create({
            conversationId: conversationId,
            sender: sender,
            receiver: receiver,
            message: message
        }).then(resp => {
            res.status(200).json('message send successfull')
        }).catch(err => {
            res.status(500).json('error while sending message')
        })
    },
    getAllMessage: (req, res) => {
        const { conversationId } = req.body

        if (!conversationId) {
            return res.status(500).json('please send all fields')
        }

        messageModel.find({ conversationId: conversationId }).then(resp => {
            res.status(200).json(resp)
        })
            .catch(err => {
                res.status(500).json('error while get all messages')
            })
    }
}