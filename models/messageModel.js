const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat'
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        message: {
            type: String,
        },
        file: {
            type: String,
        },
        senderInfo: {
            type: Object,
        },
        receiverInfo: {
            type: Object,
        }
    },
    {
        timestamps: true,
    }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message