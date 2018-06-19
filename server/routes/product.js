const express = require('express');

const { verifyToken } = require('../middlewares/authentication');

const router = express.Router();

const _= require('underscore');

const { handleError } = require('../utils/errors');

const Product = require('../models/product');

const mongoose = require('mongoose');

router.all('/product*', verifyToken);

router.get('/product', (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);
    from = isNaN(from) ? 0 : from;

    let limit = req.query.limit || 5;
    limit = Number(limit);
    limit = isNaN(limit) ? 5 : limit;

    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productsDB) => {
            if (err) {
                return handleError(res, 500, err)
            }

            Product.count({ available: true }, (err, count) => {
                if (err) {
                    return handleError(res, 500, err)
                }

                res.json({
                    ok: true,
                    count,
                    products: productsDB
                })
            })
        })

})

router.get('/product/:id', (req, res) => {

    const { id } = req.params;
    if (mongoose.Types.ObjectId.isValid(id)) {
        Product.findById(id)
            .populate('user', 'name email')
            .populate('category', 'name')
            .exec((err, productDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }
    
                if (!productDB) {
                    return handleError(res, 400, { message: 'Producto no encontrado' })
                }
    
                res.json({
                    ok: true,
                    product: productDB
                })
            })

    } else {
        handleError(res, 400, { message: 'ID de producto no válido'})
    }
})

router.get('/product/search/:key', (req, res) => {
    
    const { key } = req.params;

    const regex = new RegExp(key, 'i')

    Product.find({ name: regex })
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productsDB) => {
            if (err) {
                return handleError(res, 500, err);
            }

            res.json({
                ok: true,
                products: productsDB
            })
        })
})

router.post('/product', (req, res) => {
    const body = req.body;

    const product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        category: body.category,
        user: req.user._id
    })

    product.save((err, productDB) => {
        if (err) {
            return handleError(res, 500, err)
        }

        res.json({
            ok: true,
            product: productDB
        })
    })
})

router.put('/product/:id', (req, res) => {

    const { id } = req.params;

    const product = _.pick(req.body, ['name', 'price', 'category', 'available', 'description']);

    if (mongoose.Types.ObjectId.isValid(id)) {
        Product.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, productDB) => {
            if (err) {
                return handleError(res, 500, err);
            }
    
            if (!productDB) {
                return handleError(res, 400, { message: 'producto no encontrado' });
            }

            res.json({
                ok: true,
                product: productDB
            })
        })
    } else {
        handleError(res, 400, { message: 'ID de producto no válido'})
    }
})

router.delete('/product/:id', (req, res) => {

    const { id } = req.params;

    const product =  { available: false };

    if (mongoose.Types.ObjectId.isValid(id)) {
        Product.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, productDB) => {
            if (err) {
                return handleError(res, 500, err);
            }
    
            if (!productDB) {
                return handleError(res, 400, { message: 'producto no encontrado' });
            }

            res.json({
                ok: true,
                message: 'producto eliminado',
                product: productDB
            })
        })
    } else {
        handleError(res, 400, { message: 'ID de producto no válido'})
    }
})

module.exports = router;