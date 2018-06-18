const express = require('express');

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const router = express.Router();

const { handleError } = require('../utils/errors');
const Category = require('../models/category');

const mongoose = require('mongoose');

router.all('/category*', verifyToken);

router.get('/category', (req, res) => {
    
    Category.find({})
        .exec((err, categoriesDB) => {
            if (err) {
                return handleError(res, 500, err);
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

    const { id } = req.params;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
        Category.findById(id, (err, categoryDB) => {
            if (err) {
                return handleError(res, 500, err);
            }

            if (!categoryDB) {
                return handleError(res, 400, { message: 'Categoría no encontrada'})
            }

            res.json({
                ok:true,
                categories: categoryDB
            })
        })
    }
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

        if (!categoryDB) {
            return handleError(res, 400, { message: 'Categoría no encontrada'})
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

router.delete('/category/:id', verifyAdminRole, (req, res) => {
    
    const { id } = req.params;

    if (mongoose.Types.ObjectId.isValid(id)) {
        Category.findByIdAndRemove( id, (err, categoryDeleted) => {
            if (err) {
                return handleError(res, 500, err);
            }
    
            if (!categoryDeleted) {
                return handleError(res, 400, { message: 'Categoría no encontrada'})
            }
    
            res.json({
                ok: true,
                message: 'Categoría eliminada',
                category: categoryDeleted
            })
        })
    } else {
        handleError(res, 400, { message: 'ID de categoría no válida'})
    }

})

module.exports = router;