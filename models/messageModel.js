const mongoose = require('mongoose')
const { Schema } = mongoose

const messageSchema = new Schema(
    {
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
        }
    },
    {
        timestamps: true,
    }
)

const Message = mongoose.model('Message', messageSchema)

module.exports = Message