// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Expiration token
// 60 seconds   60 minutes   24 hours   30 days
process.env.EXP_TOKEN = 60 * 60 * 24 * 30;

// SEED authentication
process.env.SEED = process.env.SEED || 'seed-dev';

// Database
let urlDB;

if ( process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/coffee';
} else { urlDB = process.env.MONGO_URI }

process.env.URLDB = urlDB;

// google client id

process.env.CLIENT_ID = process.env.CLIENT_ID || '1001739317960-4c86a4hnq1okg9qfiu6ak5q2ksqg980a.apps.googleusercontent.com';