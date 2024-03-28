const express = require('express')
const verifyToken = require('../helper/verifyToken')
const router = express.Router()
const { sendMessage, getAllMessage, sendGroupMessage, getAllGroupMessage } = require('../controllers/messageController')
// file updload setup
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// send message
router.post('/send-message', verifyToken, upload.single('file'), sendMessage)

// get all messages
router.post('/get-messages', verifyToken, getAllMessage)

// send group message
router.post('/send-group-message', verifyToken, upload.single('file'), sendGroupMessage)

// get all group messages
router.post('/get-group-messages', verifyToken, getAllGroupMessage)

module.exports = router
