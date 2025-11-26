const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.createBillingTermsDB = async (data ,BillID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                const query = `
                    INSERT INTO Billing_Terms ( BillID, CreditPeriod, BillingPeriod, BillingAddress, insert_date) 
                    VALUES (@BillID, @CreditPeriod, @BillingPeriod, @BillingAddress, GETDATE());
                `;
                // Input Parameters
                request.input('BillID', sql.NVarChar(255), BillID);
                request.input('CreditPeriod', sql.NVarChar(255), data.CreditPeriod);
                request.input('BillingPeriod', sql.NVarChar(255), data.BillingAddress);
                request.input('BillingAddress', sql.NVarChar(255), data.BillingAddress);

                return request.query(query);
            })
            .then(result => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "BillingTerms Add Successfully"
                });
            })
            .catch(err => {
                logger.error('SQL Error: ' + err);
                reject({
                    bstatus_code: "03",
                    bmessage_desc: "SQL Error: " + err
                });
            });
    });
};

exports.updateBillingTermsDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                const query = `
                    UPDATE Billing_Terms 
                    SET 
                        CreditPeriod = @CreditPeriod,
                        BillingPeriod = @BillingPeriod,
                        BillingAddress = @BillingAddress,
                        update_date = GETDATE()
                    WHERE BillID = @BillID;
                `;

                // Input Parameters
                request.input('BillID', sql.NVarChar(255), data.BillID);
                request.input('CreditPeriod', sql.NVarChar(255), data.CreditPeriod);
                request.input('BillingPeriod', sql.NVarChar(255), data.BillingPeriod);
                request.input('BillingAddress', sql.NVarChar(255), data.BillingAddress);

                return request.query(query);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    resolve({
                        status: "00",
                        message: "BillingTerms Updated Successfully"
                    });
                } else {
                    resolve({
                        status: "01",
                        message: "No record found to update"
                    });
                }
            })
            .catch(err => {
                reject({
                    status: "500",
                    message: "SQL Error: " + err
                });
            });
    });
};

exports.deleteBillingTermsDB = (BillID) => {
    console.log(`[INFO]: Deleting BillingTerms  for BillID: ${BillID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('BillID', sql.NVarChar(255), BillID); // Bind BillID
                console.log(`[INFO]: Executing Query - DELETE FROM Billing_Terms  WHERE BillID = ${BillID}`);
                return request.query('DELETE FROM Billing_Terms WHERE BillID = @BillID');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Billing_Terms deleted successfully for BillID: ${BillID}`);
                    resolve({ message: `Billing_Terms deleted successfully for BillID: ${BillID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for BillID: ${BillID}`);
                    resolve({ message: `No records found for BillID: ${BillID}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getBillingTermsDB = (BillID) => {
    console.log(`[INFO]: Fetching BillingTerms for BillID: ${BillID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('BillID', sql.NVarChar(255), BillID); // Bind BillID
                console.log(`[INFO]: Executing Query - SELECT * FROM Billing_Terms  WHERE BillID = ${JSON.stringify(BillID)}`);
                if (!BillID) {
                    return request.query('SELECT * FROM Billing_Terms');

                } else {
                    return request.query('SELECT * FROM Billing_Terms WHERE BillID = @BillID');
                }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    
                    console.log(`[SUCCESS]: Billing_Terms found for BillID: ${BillID}`);
                    resolve({  message: `Billing_Terms records found for BillID: ${BillID}`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for BillID: ${BillID}`);
                    resolve({ message: `No records found for BillID: ${BillID}`, status: "01" ,data: result.recordset});
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Billing_Terms Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

