const express = require('express')
const dotenv = require('dotenv')
const connectDb = require('./helper/connectDb')
const userRoute = require('./routes/userRoute')
const bodyParser = require('body-parser')

const app = express()

// configure .env
dotenv.config()

// db connection
connectDb()

// parse application/json
app.use(bodyParser.json())

app.get('/', (req, res) => {
    res.send('welcome to chat api')
})

app.use('/api/user', userRoute)

const port = process.env.PORT
app.listen(port, console.log(`server started on: ${port}`))
