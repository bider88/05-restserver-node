const express = require('express');

const bcrypt = require('bcrypt');
const _= require('underscore');

const User = require('../models/user');

const app = express();

app.get('/user', (req, res) => {

    let from = req.query.from || 0;
    from =  Number(from);
    from = isNaN(from) ? 0 : from;

    let limit = req.query.limit || 5;
    limit =  Number(limit);
    limit = isNaN(limit) ? 5 : limit;

    console.log(limit)

    User.find({ state :true }, 'name  email role state role img')
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            User.count({ state :true }, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                })
            });
        })

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

        res.json({
            ok: true,
            user: userDB
        })
    });
})

app.put('/user/:id', (req, res) => {

    const id = req.params.id;

    const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        });
    })

    
})

app.delete('/user/:id', (req, res) => {
    
    const id = req.params.id;

    const changeState = { state: false };

    User.findByIdAndUpdate( id, changeState, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        });
    })

    // User.findByIdAndRemove(id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if ( !userDeleted ) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         user: userDeleted
    //     })
    // })

})

module.exports = app;