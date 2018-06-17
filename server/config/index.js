// Port
process.env.PORT = process.env.PORT || 3000;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/coffee';
} else { urlDB = 'mongodb://coffee-user:a123456@ds163300.mlab.com:63300/coffees' }

process.env.URLDB = urlDB;