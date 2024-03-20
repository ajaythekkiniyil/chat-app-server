const express = require('express')
const verifyToken = require('../helper/verifyToken')
const router = express.Router()
const { sendMessage, getAllMessage } = require('../controllers/messageController')

// send message
router.post('/send-message', verifyToken, sendMessage)

// get all messages
router.post('/get-messages', verifyToken, getAllMessage)

module.exports = router