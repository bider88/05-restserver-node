require('./config')
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')

const morgan = require('morgan');

const app = express();

const bodyParser = require('body-parser');

// enable public folder
app.use( express.static( path.resolve( __dirname, '../public' ) ) );

// Settings 
const port = process.env.PORT;

// Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use(require('./routes'));

// Static Files


// Db connection
mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw new err;

    console.log('Online database');
});

// Starting the server
app.listen(port, () => {
    console.log(`restserver listen on port ${port}`)
})