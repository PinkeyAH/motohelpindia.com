const sql = require('mssql');
require('dotenv').config();

const pool = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: String(process.env.DB_HOST),  // Convert to string explicitly
    database: process.env.DB_NAME,
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Connect directly without using connection pool
sql.connect(pool)
    .then(() => {
        console.log('Connected to SQL Server');
    })
    .catch(err => {
        console.error('Database Connection Failed:', err);
    });

module.exports = pool;


// const sql = require('mssql');
// const logger = require('../log/logger'); // Import the logger
// const pool = {
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     server: String(process.env.DB_HOST),  // Convert to string explicitly
//     database: process.env.DB_NAME,
//     options: {
//         encrypt: true,
//         trustServerCertificate: true
//     }
// };

// console.log('DB Config:', pool); // Debugging Step
// logger.log('DB Config:', pool); // Debugging Step

// module.exports = pool;
