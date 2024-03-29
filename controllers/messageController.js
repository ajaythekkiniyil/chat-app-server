const messageModel = require('../models/messageModel')
const chatModel = require('../models/chatModel')
const userModel = require('../models/userModel')
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3")
const crypto = require('crypto')
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

module.exports = {
    sendMessage: async (req, res) => {
        const sender = req.user.id
        const { receiver, message } = req.body
        const file = req.file

        if (!receiver) {
            return res.status(500).json('please send receiver')
        }

        if (!message && !file) {
            return res.status(500).json('please send message or file')
        }

        // if conversation exist or chat started
        const conversation = await chatModel.find(
            {
                $and: [{ users: sender }, { users: receiver }]
            }
        )

        if (conversation.length === 0) {
            return res.status(401).json('conversation not exist')
        }

        // if there is file send to s3 bucket
        const randomImageName = crypto.randomBytes(32).toString('hex')

        if (file) {
            const s3 = new S3Client({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: process.env.AWS_REGION
            })

            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: randomImageName,
                Body: file.buffer,
                ContentType: file.mimetype,
            }

            const command = new PutObjectCommand(params)

            await s3.send(command)
        }

        const conversationId = conversation[0]._id

        const senderInfo = await userModel.findOne({ _id: sender }).select('_id -password -createdAt -updatedAt -email')
        const receiverInfo = await userModel.findOne({ _id: receiver }).select('_id -password -createdAt -updatedAt -email')

        const newMessage = await messageModel.create({
            conversationId: conversationId,
            sender: sender,
            receiver: receiver,
            message: message,
            file: file ? randomImageName : '',
            senderInfo: senderInfo,
            receiverInfo: receiverInfo
        });

        res.status(200).json('message send successfully');
    },
    getAllMessage: async (req, res) => {
        const { conversationId } = req.body

        if (!conversationId) {
            return res.status(500).json('please send conversationId')
        }

        try {
            const allMessages = await messageModel.find({ conversationId: conversationId })

            const s3 = new S3Client({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: process.env.AWS_REGION
            })

            const updatedAllMessages = await Promise.all(
                allMessages.map(async (message) => {
                    if (message.file) {
                        const getObjectParams = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: message.file,
                        }
                        const command = new GetObjectCommand(getObjectParams)
                        const fileUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
                        return { ...message._doc, fileUrl }
                    }
                    return message;
                })
            )

            res.send(updatedAllMessages)
        }
        catch (err) {
            res.status(500).json({ "error during get all messages, conversation not exist": err })
        }
    },
    sendGroupMessage: async (req, res) => {
        const sender = req.user.id
        const { groupId, message } = req.body
        const file = req.file

        if (!groupId) {
            return res.status(500).json('please send groupId')
        }

        if (!message && !file) {
            return res.status(500).json('please send message or file')
        }

        // if groupExist exist or chat started
        const groupExist = await chatModel.find({ _id: groupId })

        if (groupExist.length === 0) {
            return res.status(401).json('group not exist')
        }

        // if there is file send to s3 bucket
        const randomImageName = crypto.randomBytes(32).toString('hex')

        if (file) {
            const s3 = new S3Client({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: process.env.AWS_REGION
            })

            const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: randomImageName,
                Body: file.buffer,
                ContentType: file.mimetype,
            }

            const command = new PutObjectCommand(params)

            await s3.send(command)
        }

        const conversationId = groupExist[0]._id

        const senderInfo = await userModel.findOne({ _id: sender }).select('_id -password -createdAt -updatedAt -email')

        const newMessage = await messageModel.create({
            conversationId: conversationId,
            sender: sender,
            message: message,
            file: file ? randomImageName : '',
            senderInfo: senderInfo,
        });

        res.status(200).json('message send successfully');
    },
    getAllGroupMessage: async (req, res) => {
        const { conversationId } = req.body

        if (!conversationId) {
            return res.status(500).json('please send conversationId')
        }

        try {
            const allMessages = await messageModel.find({ conversationId: conversationId })

            const s3 = new S3Client({
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
                region: process.env.AWS_REGION
            })

            const updatedAllMessages = await Promise.all(
                allMessages.map(async (message) => {
                    if (message.file) {
                        const getObjectParams = {
                            Bucket: process.env.AWS_BUCKET,
                            Key: message.file,
                        }
                        const command = new GetObjectCommand(getObjectParams)
                        const fileUrl = await getSignedUrl(s3, command, { expiresIn: 3600 })
                        return { ...message._doc, fileUrl }
                    }
                    return message;
                })
            )

            res.send(updatedAllMessages)
        }
        catch (err) {
            res.status(500).json({ "error during get all group messages": err })
        }
    }
}