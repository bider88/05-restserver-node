const express = require('express');

const bcrypt = require('bcrypt');

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
                message: '(Usuario) y/o contraseña incorrectos'
            })
        }

        if ( !bcrypt.compareSync( body.password, userDB.password )) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o (contraseña) incorrectos'
            })
        }

        res.json({
            ok: true,
            user: userDB,
            token: '123as'
        })

    })

})

module.exports = app;