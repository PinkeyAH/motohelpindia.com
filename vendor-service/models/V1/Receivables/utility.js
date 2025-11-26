const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.createReceivablesDB = async (data ,ReceivablesID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                const query = `
                    INSERT INTO Receivables ( ReceivablesID,	Receivables,	name,	email_id,	contact_no, insert_date) 
                    VALUES (@ReceivablesID, @Receivables,	@name,	@email_id,	@contact_no,  GETDATE());
                `;
                // Input Parameters
                request.input('ReceivablesID', sql.NVarChar(255), ReceivablesID);
                request.input('Receivables', sql.NVarChar(255), data.Receivables);
                request.input('name', sql.NVarChar(255), data.name);
                request.input('email_id', sql.NVarChar(255), data.email_id);
                request.input('contact_no', sql.NVarChar(255), data.contact_no);

                return request.query(query);
            })
            .then(result => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "Receivables Add Successfully"
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

exports.updateReceivablesDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                const query = `
                    UPDATE Receivables 
                    SET Receivables = @Receivables,
                        name = @name,
                        email_id = @email_id,
                        contact_no = @contact_no,
                        update_date = GETDATE()
                    WHERE ReceivablesID = @ReceivablesID
                `;

                // Input Parameters
                request.input('ReceivablesID', sql.NVarChar(255), data.ReceivablesID);
                request.input('Receivables', sql.NVarChar(255), data.Receivables);
                request.input('name', sql.NVarChar(255), data.name);
                request.input('email_id', sql.NVarChar(255), data.email_id);
                request.input('contact_no', sql.NVarChar(255), data.contact_no);


                return request.query(query);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    resolve({
                        status: "00",
                        message: "Receivables Updated Successfully"
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

exports.deleteReceivablesDB = (ReceivablesID) => {
    console.log(`[INFO]: Deleting Receivables  for ReceivablesID: ${ReceivablesID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('ReceivablesID', sql.NVarChar(255), ReceivablesID); // Bind ReceivablesID
                console.log(`[INFO]: Executing Query - DELETE FROM Receivables  WHERE ReceivablesID = ${ReceivablesID}`);
                return request.query('DELETE FROM Receivables WHERE ReceivablesID = @ReceivablesID');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Receivables deleted successfully for ReceivablesID: ${ReceivablesID}`);
                    resolve({ message: `Receivables deleted successfully for ReceivablesID: ${ReceivablesID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for ReceivablesID: ${ReceivablesID}`);
                    resolve({ message: `No records found for ReceivablesID: ${ReceivablesID}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getReceivablesDB = (ReceivablesID) => {
    console.log(`[INFO]: Fetching Receivables for ReceivablesID: ${ReceivablesID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('ReceivablesID', sql.NVarChar(255), ReceivablesID); // Bind ReceivablesID
                console.log(`[INFO]: Executing Query - SELECT * FROM Receivables  WHERE ReceivablesID = ${JSON.stringify(ReceivablesID)}`);
                if (!ReceivablesID) {
                    return request.query('SELECT * FROM Receivables');

                } else {
                    return request.query('SELECT * FROM Receivables WHERE ReceivablesID = @ReceivablesID');
                }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    
                    console.log(`[SUCCESS]: Receivables found for ReceivablesID: ${ReceivablesID}`);
                    resolve({  message: `Receivables records found for ReceivablesID: ${ReceivablesID}`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for ReceivablesID: ${ReceivablesID}`);
                    resolve({ message: `No records found for ReceivablesID: ${ReceivablesID}`, data: result.recordset, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Receivables Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

