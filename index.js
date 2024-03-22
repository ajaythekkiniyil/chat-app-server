const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./helper/connectDb')
const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const messageRoute = require('./routes/messageRoute')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const { rateLimit } = require('express-rate-limit')

const app = express()

// configure .env
dotenv.config()
// db connection
connectDb()

const corsOptions = {
    origin: "http://localhost:5173",
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
    max: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

app.get('/', (req, res) => {
    res.send('welcome to chat api')
})

app.use('/api/user', limiter, userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

const port = process.env.PORT
app.listen(port, console.log(`server started on: ${port}`))
