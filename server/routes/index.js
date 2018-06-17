const express = require('express');

const bcrypt = require('bcrypt');

const User = require('../models/user');

const app = express();

app.get('/user', (req, res) => {
    res.json('get usuarios');
})

app.post('/user', (req, res) => {
    
    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        //userDB.password = null;

        res.json({
            ok: true,
            user: userDB
        })
    });
})

app.put('/user/:id', (req, res) => {

    const id = req.params.id;

    res.json({
        id
    });
})

app.delete('/user', (req, res) => {
    res.json('delete usuarios');
})

module.exports = app;