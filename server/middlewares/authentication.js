// Verify token
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {

    const token = req.get('token');

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

const verifyAdminRole = (req, res,next) => {
    
    const { role } = req.user;

    if (role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'User is not Admin'
            }
        })
    }
}

module.exports = {
    verifyToken,
    verifyAdminRole
}