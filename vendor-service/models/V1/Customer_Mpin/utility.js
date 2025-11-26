const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.customer_Set_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('CustomerID', sql.NVarChar(255), payload.CustomerID);
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('Customer_MPIN', sql.NVarChar(255), payload.Customer_MPIN);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Customer_SetMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};
   
// Login function
exports.customer_login_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('CustomerID', sql.NVarChar(255), payload.CustomerID);
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('Customer_MPIN', sql.NVarChar(255), payload.Customer_MPIN);
            
                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Customer_loginMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// Change MPIN function
exports.customer_Change_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Input Parameters
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
                request.input('Old_Customer_MPIN', sql.NVarChar(255), payload.Old_Customer_MPIN);
                request.input('New_Customer_MPIN', sql.NVarChar(255), payload.New_Customer_MPIN);
                request.input('Confirm_Customer_MPIN', sql.NVarChar(255), payload.Confirm_Customer_MPIN);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Customer_ChangeMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// Forgot MPIN function
exports.customer_Forgot_MpinDB = async (payload) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('CustomerID', sql.NVarChar(255), payload.CustomerID);
                request.input('ContactNo', sql.NVarChar(255), payload.ContactNo);
            
                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Fetch user details from the database
                return request.execute('Customer_ForgotMPIN'); // Replace with actual stored procedure
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// Logout function

exports.customer_logout_MpinDB = async (payload) => {
    const { DepartmentID } = payload; // Extract DepartmentID from payload

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('DepartmentID', sql.NVarChar(255), DepartmentID); // Bind DepartmentID
                console.log(`[INFO]: Executing Query - DELETE FROM Departments  WHERE DepartmentID = ${DepartmentID}`);
                return request.query('DELETE FROM Departments WHERE DepartmentID = @DepartmentID');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Departments deleted successfully for DepartmentID: ${DepartmentID}`);
                    resolve({ message: `Departments deleted successfully for DepartmentID: ${DepartmentID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for DepartmentID: ${DepartmentID}`);
                    resolve({ message: `No records found for DepartmentID: ${DepartmentID}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
}

// logout function
// exports.customer_logout_MpinDB  = async (req) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();
//                 request.input('DepartmentID', sql.NVarChar(255), DepartmentID); // Bind DepartmentID
//                 console.log(`[INFO]: Executing Query - DELETE FROM Departments  WHERE DepartmentID = ${DepartmentID}`);
//                 return request.query('DELETE FROM Departments WHERE DepartmentID = @DepartmentID');
//             })
//             .then(result => {
//                 if (result.rowsAffected[0] > 0) {
//                     console.log(`[SUCCESS]: Departments deleted successfully for DepartmentID: ${DepartmentID}`);
//                     resolve({ message: `Departments deleted successfully for DepartmentID: ${DepartmentID}`, status: "00" });
//                 } else {
//                     console.log(`[INFO]: No records found to delete for DepartmentID: ${DepartmentID}`);
//                     resolve({ message: `No records found for DepartmentID: ${DepartmentID}`, status: "01" });
//                 }
//             })
//             .catch(error => {
//                 console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
//                 reject({ message: 'SQL Error: ' + error.message, status: "01" });
//             });
//     });
// };


