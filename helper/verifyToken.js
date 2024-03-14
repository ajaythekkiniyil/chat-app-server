const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.cookies.token
    
    if (!token) return res.status(401).json({ message: 'Authentication failed' });

    try {
        const result = jwt.verify(token, process.env.JWT_SCECRET)
        // jwt token verified
        next()
    }
    catch (err) {
        // jwt token not verified
        return res.status(401).json({ message: 'Authentication failed' })
    }
}

module.exports = verifyToken