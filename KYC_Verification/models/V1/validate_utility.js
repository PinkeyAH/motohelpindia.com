const sql = require('mssql');
const pool = require('../../db/db');


exports.SendOTPDB = (mobile_number,otp) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();


                // Input Parameters
                request.input('mobile_number', sql.NVarChar(255), mobile_number);
                request.input('otp', sql.NVarChar(255), otp);
                // request.input('expiresAt', sql.DateTime, data.expiresAt);

                // Output Parameters
                request.output('bError_code', sql.NVarChar(50));
                request.output('b_error_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('SendOTP'); // Update with your SP name
            })
            .then(result => {
                const output = {
                    errorCode: result.output.bError_code,
                    errorDesc: result.output.b_error_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};



exports.validateOTPDB = (mobile_number,otp) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();


                // Input Parameters
                request.input('mobile_number', sql.NVarChar(255), mobile_number);
                request.input('otp', sql.NVarChar(255), otp);
                // request.input('expiresAt', sql.DateTime, data.expiresAt);

                // Output Parameters
                request.output('bError_code', sql.NVarChar(50));
                request.output('b_error_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('ValidateOTP'); // Update with your SP name
            })
            .then(result => {
                const output = {
                    errorCode: result.output.bError_code,
                    errorDesc: result.output.b_error_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};
