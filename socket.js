// online users arrary 
let onlineUsers = []

const addLiveUser = (userId, socketId) => {
    // Check if the user already exists
    const existingUserIndex = onlineUsers.findIndex(user => user.userId === userId);

    // If the user exists, update the socketId
    if (existingUserIndex !== -1) {
        onlineUsers[existingUserIndex].socketId = socketId;
    } else {
        // If the user doesn't exist, add a new entry
        onlineUsers.push({ userId, socketId });
    }
    return onlineUsers
}

const removeLiveUser = (socketId) => {
    const updatedOnlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
    onlineUsers = updatedOnlineUsers
    return onlineUsers
}

module.exports = { onlineUsers, addLiveUser, removeLiveUser }