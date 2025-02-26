const jwt = require('jsonwebtoken')

const AuthMiddleware = (req, res, next) => {
    const AuthHeader = req.headers['authorization']
    console.log(AuthHeader);
    const token = AuthHeader && AuthHeader.split(" ")[1]

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'access denied. please login first'
        })
    }

    try {
        const DecodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log(DecodeToken)

        req.UserInfo = DecodeToken
        next()
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'invalid token. please login again'
        })
    }
}

module.exports = AuthMiddleware
