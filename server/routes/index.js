const express = require('express');

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
        password: body.password,
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

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