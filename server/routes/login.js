const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const { handleError } = require('../utils/errors');
const User = require('../models/user');

const router = express.Router();

router.post('/login', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return handleError(res, 500, err);
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o contraseña incorrectos'
            })
        }

        if ( !bcrypt.compareSync( body.password, userDB.password )) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o contraseña incorrectos'
            })
        }

        const token = createToken(userDB);

        res.json({
            ok: true,
            token,
            user: userDB
        })

    })

})

router.post('/google', async (req, res) => {

    const token = req.body.idtoken;

    let userGoogle;

    try {
        userGoogle = await verify( token );
    } catch(err) {
        return handleError(res, 403, { message: 'Token is not valid' });
    }
    
    User.findOne({ email: userGoogle.email}, (err, userDB) => {
        if (err) {
            return handleError(res, 500, err);
        }

        if (userDB) {
            if (!userDB.google) {
                if (err) {
                    return handleError(res, 400, { message: 'Debe usar autenticación normal'});
                }
            } else {
                const token = createToken(userDB);

                return res.json({
                    ok: true,
                    token, 
                    user: userDB
                })
            }
        } else {
            // si el usuario n existe en la bd, se guarda con los datos de google
            const user = new User();

            user.name = userGoogle.name;
            user.email = userGoogle.email;
            user.img = userGoogle.picture;
            user.google = true;
            user.password = bcrypt.hashSync(':) supersecret', 10);

            user.save( (err, userDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                const token = createToken(userDB);

                return res.json({
                    ok: true,
                    token, 
                    user: userDB
                })
            })
        }
    })
})

// Google configurations
async function verify( token ) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

const createToken = (userDB) => {
    return jwt.sign({
        user: userDB
    }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN })
}

module.exports = router;