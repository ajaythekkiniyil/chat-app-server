const express = require('express')
const { createServer } = require('node:http')
const app = express()
const server = createServer(app)
const { Server } = require('socket.io')

const dotenv = require('dotenv')
const connectDb = require('./helper/connectDb')
const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const messageRoute = require('./routes/messageRoute')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')
const { addLiveUser, removeLiveUser } = require('./socket')


// configure .env
dotenv.config()
// db connection
connectDb()

const frontEndUrl = process.env.FRONT_END_URL

const corsOptions = {
    origin: frontEndUrl,
    methods: "GET,POST",
    credentials: true,
}

app.use(cors(corsOptions))

app.use(cookieParser())

// parse application/json
app.use(bodyParser.json())

// rate limiter added to protect login route
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.get('/', (req, res) => {
    res.send('welcome to chat api')
})

app.use('/api/user', limiter, userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

const port = process.env.PORT

// socket connection
const io = new Server(server, {
    cors: {
        origin: frontEndUrl
    },
    connectionStateRecovery: {}
})

io.on('connection', (socket) => {
    // if any user send new message to his friend or to group
    socket.on('chat message', (payload) => {
        io.emit('chat message', payload)
    })

    socket.on('live users', (user) => {
        // storing online user details
        let onlineUsers = addLiveUser(user, socket.id)
        io.emit('live users', onlineUsers)
    })

    socket.on('disconnect', () => {
        let onlineUsers = removeLiveUser(socket.id)
        io.emit('live users', onlineUsers)
    })
})

server.listen(port, console.log(`server started on: ${port}`))
