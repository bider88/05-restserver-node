const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');

const { handleError } = require('../utils/errors');

app.use(fileUpload());

app.put('/upload/:type/:id', (req, res) => {

    const { type, id } = req.params;

    if (!req.files) {
        return handleError(res, 400, { message: 'No files were uploaded.' });
    }

    if (!req.files.file) {
        return handleError(res, 400, { message: 'File is not valid' });
    }

    let typeValids = ['product', 'user'];
    if ( typeValids.indexOf( type ) < 0 ) {
        return handleError(res, 400, { message: 'Type alloweds are product or user' });
    }
    
    let file = req.files.file;
    let nameFile = file.name.split('.');
    const ext = nameFile[nameFile.length - 1];
    // allow extensions
    const extValids = ['png', 'jpg', 'jpeg', 'gif'];

    if (extValids.indexOf( ext ) < 0) {
        return handleError(res, 400, { 
            message: 'Extension alloweds ' + extValids.join(', '),
            ext 
        });
    }

    const name = id + '-' + Date.now() + '.png';

    file.mv(`uploads/${type}/${name}`, (err) => {
        if (err)
            return handleError(res, 400, err);
        
        type === 'user' ? imageUser(res, id, name) : imageProduct(res, id, name);
    });
})

const imageUser = (res, id, name) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        User.findById(id, (err, userDB) => {
            if (err) {
                deleteImage('user', name);
                return handleError(res, 500, err);
            }

            if (!userDB) {
                deleteImage('user', name);
                return handleError(res, 400, { message: 'User not found'});
            }

            deleteImage('user', userDB.img);

            userDB.img = name;

            userDB.save((err, userSavedDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                res.json({
                    ok: true,
                    user: userSavedDB,
                    img: name
                })
            })
        })
    } else {
        handleError(res, 400, { message: 'User Id not valid'});
    }
}

const imageProduct = (res, id, name) => {

    if (mongoose.Types.ObjectId.isValid(id)) {
        Product.findById(id, (err, productDB) => {
            if (err) {
                deleteImage('product', name);
                return handleError(res, 500, err);
            }

            if (!productDB) {
                deleteImage('product', name);
                return handleError(res, 400, { message: 'Product not found'});
            }

            deleteImage('product', productDB.img);

            productDB.img = name;

            productDB.save((err, productSavedDB) => {
                if (err) {
                    return handleError(res, 500, err);
                }

                res.json({
                    ok: true,
                    product: productSavedDB,
                    img: name
                })
            })
        })
    } else {
        handleError(res, 400, { message: 'User Id not valid'});
    }
}

const deleteImage = (type, name) => {
    const pathImage = path.resolve(__dirname, `../../uploads/${type}/${name}`);
    if ( fs.existsSync(pathImage) ) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;