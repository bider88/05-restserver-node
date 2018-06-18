const express = require('express');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const router = express.Router();

const { handleError } = require('../utils/errors');
const Category = require('../models/category');

router.all('/category*', verifyToken);

router.get('/category', (req, res) => {
    
    Category.find({})
        .exec((err, categoriesDB) => {
            if (err) {
                return handleError(res, 400, err);
            }

            Category.count({}, (err, count) => {
                if (err) {
                    return handleError(res, 400, err);
                }

                res.json({
                    ok: true,
                    count,
                    categories: categoriesDB
                })
            })

            
        })
})

router.get('/category/:id', (req, res) => {
    
})

router.post('/category', (req, res) => {
    const { name } = req.body;
    const category = new Category({
        name,
        user: req.user._id
    })

    category.save((err, categoryDB) => {
        if (err) {
            return handleError(res, 500, err);
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    })
})

router.put('/category/:id', verifyAdminRole, (req, res) => {
    
    const { id } = req.params;
    const { name } = req.body;
    Category.findByIdAndUpdate( id, { name }, { new: true, runValidators: true }, (err, categoryDB) => {
        if (err) {
            return handleError(res, 500, err);
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

router.put('/category/:id', (req, res) => {
    
})

module.exports = router;