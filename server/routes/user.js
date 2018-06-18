const express = require('express');

const bcrypt = require('bcrypt');
const _= require('underscore');

const { handleError } = require('../utils/errors');
const User = require('../models/user');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const router = express.Router();

router.get('/user', verifyToken , (req, res) => {

    let from = req.query.from || 0;
    from =  Number(from);
    from = isNaN(from) ? 0 : from;

    let limit = req.query.limit || 5;
    limit =  Number(limit);
    limit = isNaN(limit) ? 5 : limit;

    User.find({ state :true }, 'name  email role state role img')
        .skip(from)
        .limit(limit)
        .exec( (err, users) => {
            if (err) {
                return handleError(res, 400, err);
            }

            User.count({ state :true }, (err, count) => {
                
                if (err) {
                    return handleError(res, 400, err);
                }
                
                res.json({
                    ok: true,
                    count,
                    users
                })
            });
        })

})

router.post('/user', verifyToken, verifyAdminRole, (req, res) => {

    const body = req.body;

    const user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDB) => {
        if (err) {
            return handleError(res, 400, err);
        }

        res.json({
            ok: true,
            user: userDB
        })
    });
})

router.put('/user/:id', verifyToken, verifyAdminRole, (req, res) => {

    const id = req.params.id;

    const body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return handleError(res, 400, err);
        }

        res.json({
            ok: true,
            user: userDB
        });
    })

    
})

router.delete('/user/:id', verifyToken, verifyAdminRole, (req, res) => {
    
    const id = req.params.id;

    const changeState = { state: false };

    User.findByIdAndUpdate( id, changeState, { new: true }, (err, userDB) => {

        if (err) {
            return handleError(res, 400, err);
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

module.exports = router;