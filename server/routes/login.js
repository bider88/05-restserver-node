const express = require('express');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const User = require('../models/user');

const app = express();

app.post('/login', (req, res) => {

    const body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
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

        const token = jwt.sign({
            user: userDB
        }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN })

        res.json({
            ok: true,
            token,
            user: userDB
        })

    })

})

app.post('/google', async (req, res) => {

    const token = req.body.idtoken;

    let userGoogle;

    try {
        userGoogle = await verify( token );
    } catch(err) {
        return res.status(403).json({
            ok: false,
            err: {
                message: 'Token is not valid'
            }
        })
    }
            // .catch( err => {
            //     return res.status(403).json({
            //         ok: false,
            //         err
            //     })
            // });
    
    User.findOne({ email: userGoogle.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if (userDB) {
            if (!userDB.google) {
                if (err) {
                    return res.status(400).json({
                        ok:false,
                        err: {
                            message: 'Debe usar su autenticación normal'
                        }
                    })
                }
            } else {
                const token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN })

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
                    return res.status(400).json({
                        ok:false,
                        err: {
                            message: 'Debe usar su autenticación normal'
                        }
                    })
                }

                const token = jwt.sign({
                    user: userDB
                }, process.env.SEED, { expiresIn: process.env.EXP_TOKEN })

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

module.exports = app;