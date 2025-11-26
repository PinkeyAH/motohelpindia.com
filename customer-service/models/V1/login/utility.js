const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported


// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');


exports.loginDB = (username , password ) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('username', sql.NVarChar(255), username);
                request.input('password', sql.NVarChar(255), password);
            
                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('userDetails', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('VendorLogin'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    userDetails: result.output.userDetails
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};





exports.logoutDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('token', sql.NVarChar(sql.MAX), data.token);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Remove token from the database
                return request.execute('LogoutUser'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                };

                if (output.errorCode) {
                    return reject(output);
                }

                resolve({ message: 'Logout successful' });
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

