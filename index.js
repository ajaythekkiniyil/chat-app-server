const express = require('express')
const dotenv = require('dotenv')

const app = express()

// configure .env
dotenv.config()

app.get('/', (req,res)=>{
    res.send('...')
})

const port = process.env.PORT
app.listen(port, console.log(`server started on: ${port}`))
