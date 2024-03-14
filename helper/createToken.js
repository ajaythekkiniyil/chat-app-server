const jwt = require('jsonwebtoken')

const createToken = async (id) => {
    return jwt.sign({ id }, process.env.JWT_SCECRET, {expiresIn: '30s'})
}

module.exports = createToken