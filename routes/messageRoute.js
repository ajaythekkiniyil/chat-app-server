const express = require('express')
const verifyToken = require('../helper/verifyToken')
const router = express.Router()
const { sendMessage, getAllMessage } = require('../controllers/messageController')
// file updload setup
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// send message
router.post('/send-message', verifyToken, upload.single('file'), sendMessage)

// get all messages
router.post('/get-messages', verifyToken, getAllMessage)

module.exports = router