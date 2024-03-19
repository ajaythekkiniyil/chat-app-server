const mongoose = require('mongoose')
const { Schema } = mongoose

const chatSchema = new Schema(
    {
        chatName: {
            type: String,
            default: 'personal'
        },
        isGroupChat: {
            type: Boolean,
            default: false,
        },
        groupImage: {
            type: String,
            default: 'https://voheroes.com/wp-content/plugins/buddyboss-platform/bp-core/images/group-avatar-buddyboss.png'
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        latestMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message',
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
)

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat