const express = require('express');
const morgan = require('morgan');
const app = express();

const bodyParser = require('body-parser');

// Db connection


// Settings 
const port = process.env.PORT || 3000;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get('/users', (req, res) => {
    res.json('get usuarios');
})

app.post('/users', (req, res) => {
    
    const body = req.body;
    res.json(body)
})

app.put('/users/:id', (req, res) => {

    const id = req.params.id;

    res.json({
        id
    });
})

app.delete('/users', (req, res) => {
    res.json('delete usuarios');
})

// Static Files


// Starting the server
app.listen(port, () => {
    console.log(`restserver listen on port ${port}`)
})