const mongoose = require("mongoose")

const connectDb = async () => {
    try {
        const db = await mongoose.connect(process.env.DB_URL)
        console.log('database connected successfully')
    }
    catch (err) {
        console.error('database connection err', err.message)
    }
}

module.exports = connectDb