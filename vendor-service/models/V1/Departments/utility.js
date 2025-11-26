const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');

exports.createDepartmentDB = async (data ,DepartmentID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                const query = `
                    INSERT INTO Departments ( departmentID,	department,	name,	email_id,	contact_no,	designation, insert_date) 
                    VALUES (@departmentID, @department,	@name,	@email_id,	@contact_no, @designation,  GETDATE());
                `;
                // Input Parameters
                request.input('departmentID', sql.NVarChar(255), DepartmentID);
                request.input('department', sql.NVarChar(255), data.department);
                request.input('name', sql.NVarChar(255), data.name);
                request.input('email_id', sql.NVarChar(255), data.email_id);
                request.input('contact_no', sql.NVarChar(255), data.contact_no);
                request.input('designation', sql.NVarChar(255), data.designation);

                return request.query(query);
            })
            .then(result => {
                resolve({
                    bstatus_code: "00",
                    bmessage_desc: "Department Add Successfully"
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

exports.updateDepartmentDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                const query = `
                    UPDATE Departments 
                    SET department = @department,
                        name = @name,
                        email_id = @email_id,
                        contact_no = @contact_no,
                        designation = @designation,
                        update_date = GETDATE()
                    WHERE departmentID = @departmentID
                `;

                // Input Parameters
                request.input('departmentID', sql.NVarChar(255), data.DepartmentID);
                request.input('department', sql.NVarChar(255), data.department);
                request.input('name', sql.NVarChar(255), data.name);
                request.input('email_id', sql.NVarChar(255), data.email_id);
                request.input('contact_no', sql.NVarChar(255), data.contact_no);
                request.input('designation', sql.NVarChar(255), data.designation);


                return request.query(query);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    resolve({
                        status: "00",
                        message: "Department Updated Successfully"
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

exports.deleteDepartmentDB = (DepartmentID) => {
    console.log(`[INFO]: Deleting Department  for DepartmentID: ${DepartmentID}`);
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
};

exports.getDepartmentDB = (DepartmentID) => {
    console.log(`[INFO]: Fetching Department for DepartmentID: ${DepartmentID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('DepartmentID', sql.NVarChar(255), DepartmentID); // Bind DepartmentID
                console.log(`[INFO]: Executing Query - SELECT * FROM Departments  WHERE DepartmentID = ${JSON.stringify(DepartmentID)}`);
                if (!DepartmentID) {
                    return request.query('SELECT * FROM Departments');

                } else {
                    return request.query('SELECT * FROM Departments WHERE DepartmentID = @DepartmentID');
                }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    
                    console.log(`[SUCCESS]: Departments found for DepartmentID: ${DepartmentID}`);
                    resolve({  message: `Departments records found for DepartmentID: ${DepartmentID}`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for DepartmentID: ${DepartmentID}`);
                    resolve({ message: `No records found for DepartmentID: ${DepartmentID}`, data: result.recordset, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Departments Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

