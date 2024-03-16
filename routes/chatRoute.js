const express = require('express')
const router = express.Router()
const verifyToken = require('../helper/verifyToken')
const { getAllUsers, searchUsers, createConversation } = require('../controllers/chatController')

// all users in our apps
router.get('/get-all-users', verifyToken, getAllUsers)

// search users based on name
router.post('/search-users', verifyToken, searchUsers)

// create new one-to-one chat
router.post('/create-converation', verifyToken, createConversation)

// fetch all conversations list of mine

// create group

// fetch all groups

// add me to group

// group exit

module.exports = router