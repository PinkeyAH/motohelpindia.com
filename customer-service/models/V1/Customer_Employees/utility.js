const sql = require('mssql');
const pool = require('../../../db/db');
const logger = require('../../../log/logger');


// exports.InsertcustomeremployeeDB = (CustomerEmployeeDetails,employeeid) => {
// logger.info(`[INFO]: Inserting CustomerEmployeeDetails record for vendorid: ${CustomerEmployeeDetails.vendorid}`);
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();
//                 request.input('vendorid', sql.NVarChar(15), CustomerEmployeeDetails.CustomerID);
//                 request.input('employeeid', sql.NVarChar(15), CustomerEmployeeDetails.employeeid || employeeid || null);

//                 // Contact Details
//                 request.input('full_name', sql.NVarChar(255), CustomerEmployeeDetails.full_name);
//                 request.input('contact_No', sql.NVarChar(15), CustomerEmployeeDetails.contact_no);
//                 request.input('alternate_No', sql.NVarChar(15), CustomerEmployeeDetails.alternate_no || null);
//                 request.input('email_id', sql.NVarChar(255), CustomerEmployeeDetails.email_id || null);
//                 request.input('website', sql.NVarChar(255), CustomerEmployeeDetails.website || null);
//                 request.input('designation', sql.NVarChar(255), CustomerEmployeeDetails.designation || null);
//                 request.input('customDesignation', sql.NVarChar(255), CustomerEmployeeDetails.customDesignation || null);
//                 request.input('username', sql.NVarChar(255), CustomerEmployeeDetails.username || null);
//                 request.input('password', sql.NVarChar(255), CustomerEmployeeDetails.password || null);
//                 request.input('employee_count', sql.NVarChar(255), CustomerEmployeeDetails.employee_count || null);

//                 // Outputs 
//                 request.output('bstatus_code', sql.NVarChar(255));
//                 request.output('bmessage_desc', sql.NVarChar(255));
//                 // Call the stored procedure

//                 return request.execute('CustomerEmployeeInsert');
//             })
//             .then(result => {
//                 const output = {
//                     status: result.output.bstatus_code,
//                     message: result.output.bmessage_desc
//                 };
//                 resolve(output);
//             })
//             .catch(err => {
//                 reject('SQL Error: ' + err);
//             });
//     });
// };

exports.InsertcustomeremployeeDB = async (CustomerEmployeeDetails, CustomerID) => {
    logger.info(`[INFO]: Inserting ${CustomerEmployeeDetails.length} Customer Employee Records`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // CREATE TVP (must match SQL TYPE exactly)
                const tvp = new sql.Table();
                tvp.columns.add('full_name', sql.NVarChar(100));
                tvp.columns.add('contact_no', sql.NVarChar(15));
                tvp.columns.add('alternate_no', sql.NVarChar(15));
                tvp.columns.add('email_id', sql.NVarChar(255));
                tvp.columns.add('website', sql.NVarChar(255));
                tvp.columns.add('designation', sql.NVarChar(100));
                tvp.columns.add('customDesignation', sql.NVarChar(100));
                tvp.columns.add('username', sql.NVarChar(100));
                tvp.columns.add('password', sql.NVarChar(100));

                // FILL TVP ROWS
                CustomerEmployeeDetails.forEach(cd => {
                    tvp.rows.add(
                        cd.full_name,
                        cd.contact_no,
                        cd.alternate_no,
                        cd.email_id,
                        cd.website,
                        cd.designation,
                        cd.customDesignation,
                        cd.username,
                        cd.password
                    );
                });

                // INPUT PARAMETERS
                request.input('CustomerID', sql.NVarChar(50), CustomerID);
                request.input('CustomerEmployeeDetailsType', tvp);

                // OUTPUT PARAMETERS
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // CALL PROCEDURE
                return request.execute('CustomerEmployeeInsert');
            })
            .then(result => {
                resolve({
                    status_code: result.output.bstatus_code,
                    message: result.output.bmessage_desc
                });
            })
            .catch(err => {
                logger.error("[ERROR]: Insertcustomeremployee: " + err);
                reject('SQL Error: ' + err);
            });
    });
};

exports.updatecustomeremployeeDB = (CustomerEmployeeDetails) => {
    logger.info(`[INFO]: Updating CustomerEmployeeDetails record for CustomerID: ${CustomerEmployeeDetails.CustomerID}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(15), CustomerEmployeeDetails.CustomerID);
                request.input('employeeid', sql.NVarChar(15), CustomerEmployeeDetails.employeeid);

                // Contact Details
                request.input('full_name', sql.NVarChar(255), CustomerEmployeeDetails.full_name);
                request.input('contact_No', sql.NVarChar(15), CustomerEmployeeDetails.contact_no);
                request.input('alternate_No', sql.NVarChar(15), CustomerEmployeeDetails.alternate_no || null);
                request.input('email_id', sql.NVarChar(255), CustomerEmployeeDetails.email_id || null);
                request.input('website', sql.NVarChar(255), CustomerEmployeeDetails.website || null);
                request.input('designation', sql.NVarChar(255), CustomerEmployeeDetails.designation || null);
                request.input('customDesignation', sql.NVarChar(255), CustomerEmployeeDetails.customDesignation || null);
                request.input('username', sql.NVarChar(255), CustomerEmployeeDetails.username || null);
                request.input('password', sql.NVarChar(255), CustomerEmployeeDetails.password || null);
                // request.input('employee_count', sql.NVarChar(255), CustomerEmployeeDetails.employee_count || null);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('CustomerEmployeeInsert');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};


exports.deletecustomeremployeeDB = (data) => {
    logger.info(`[INFO]: Deleting customer employee record for vendorid: ${data.CustomerID}, employee_id: ${data.employeeid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(255), data.CustomerID); // Bind CustomerID
                request.input('employeeid', sql.NVarChar(50), data.employeeid);

                console.log(`[INFO]: Executing Query - DELETE FROM Customer_employeeDetails WHERE CustomerID = ${data.CustomerID} and employee_id = ${data.employeeid}`);
                return request.query('DELETE FROM Customer_employeeDetails WHERE CustomerID = @CustomerID and employee_id = @employeeid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Customer_employeeDetails record deleted successfully for CustomerID: ${data.CustomerID} and employee_id: ${data.employeeid}`);
                    resolve({ message: `Employee record deleted successfully for CustomerID: ${data.CustomerID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for CustomerID: ${data.CustomerID}`);
                    resolve({ message: `No records found for CustomerID: ${data.CustomerID}`, status: "01" });
                }
            })
            .catch(error => {
                logger.error(`[ERROR]: Customer_employeeDetails Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getcustomeremployeeDB = (data) => {
    logger.info(`[INFO]: Fetching CustomerEmployeeDetails for vendorid: ${data.CustomerID}, employee_id: ${data.employeeid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input bindings
                if (data.CustomerID) {
                    request.input('CustomerID', sql.NVarChar(sql.MAX), data.CustomerID);
                }
                if (data.employeeid) {
                    request.input('employeeid', sql.NVarChar(sql.MAX), data.employeeid);
                }

                // Queries
                const detailsQuery = data.employeeid
                    ? 'SELECT * FROM Customer_employeeDetails WHERE CustomerID = @CustomerID AND employeeid = @employeeid'
                    : 'SELECT * FROM Customer_employeeDetails WHERE CustomerID = @CustomerID';


                // Run both queries
                return Promise.all([
                    request.query(detailsQuery),
                ]);
            })
            .then(([detailsResult]) => {
                const details = detailsResult.recordset;

                const merged = details.map(detail => {
                    const { CustomerID, employeeid, ...employeeDetails } = detail;

                 
                    return {
                        CustomerID,
                        employeeid: detail.employeeid,
                        employeeDetails
                    };
                });

                resolve({
                    status: '00',
                    message: 'Fetched employee data',
                    data: merged
                });
            })
            .catch(error => {
                logger.error(`[ERROR]: Get Employee Error: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
            });
    });
};
