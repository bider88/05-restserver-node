const express = require('express')
const morgan = require('morgan')
const app = express()

// Db connection


// Settings 
const port = process.env.PORT || 3000

// Middlewares
app.use(morgan('dev'))

// Routes
app.get('/', (req, res) => {
    res.json('Hello word')
})

// Static Files


// Starting the server
app.listen(port, () => {
    console.log(`restserver listen on port 3000`)
})