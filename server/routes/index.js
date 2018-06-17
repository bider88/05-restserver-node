const express = require('express');

const app = express();

app.get('/user', (req, res) => {
    res.json('get usuarios');
})

app.post('/user', (req, res) => {
    
    const body = req.body;

    console.log(body)

    if (body.name === undefined) {

        res.status(400).json({
            ok: false,
            msg: 'Nombre requerido'
        });

    } else {
        res.json(body);
    }
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