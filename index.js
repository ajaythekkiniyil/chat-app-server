const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./helper/connectDb')
const userRoute = require('./routes/userRoute')
const chatRoute = require('./routes/chatRoute')
const messageRoute = require('./routes/messageRoute')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')

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

app.get('/', (req, res) => {
    res.send('welcome to chat api')
})

app.use('/api/user', userRoute)
app.use('/api/chat', chatRoute)
app.use('/api/message', messageRoute)

const port = process.env.PORT
app.listen(port, console.log(`server started on: ${port}`))
