// Verify token
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const token = req.get('token');

    console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.user = decoded.user;

        next();
    })

}

module.exports = {
    verifyToken
}