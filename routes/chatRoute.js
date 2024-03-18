const express = require('express')
const router = express.Router()
const verifyToken = require('../helper/verifyToken')
const { getAllUsers,
    searchUsers,
    createConversation,
    getAllConversations,
    getUserDetails,
    createGroup,
    getAllGroups,
    exitGroup
} = require('../controllers/chatController')

// all users in our apps
router.get('/get-all-users', verifyToken, getAllUsers)

// search users based on name
router.post('/search-users', verifyToken, searchUsers)

// create new one-to-one chat
router.post('/create-converation', verifyToken, createConversation)

// fetch all conversations list of mine
router.get('/get-all-conversations', verifyToken, getAllConversations)

// fetch single user details that is friend details
router.post('/get-user-details', verifyToken, getUserDetails)

// create group
router.post('/create-group', verifyToken, createGroup)

// fetch all groups
router.get('/get-all-group', verifyToken, getAllGroups)
// add me to group

// group exit
router.post('/exit-group', verifyToken, exitGroup)

module.exports = router