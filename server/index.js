require('./config')
const express = require('express');
const morgan = require('morgan');
const app = express();

const bodyParser = require('body-parser');

// Db connection


// Settings 
const port = process.env.PORT;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/user', (req, res) => {
    res.json('get usuarios');
})

app.post('/user', (req, res) => {
    
    const body = req.body;

    if (body.nombre === undefined) {

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

// Static Files


// Starting the server
app.listen(port, () => {
    console.log(`restserver listen on port ${port}`)
})