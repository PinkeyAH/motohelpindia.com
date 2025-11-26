const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.employeeInsertDB = (data,employee_id) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('vendorid', sql.NVarChar(50),data.vendorid); 
                request.input('employee_id', sql.NVarChar(50), employee_id);  
                request.input('first_name', sql.NVarChar(50), data.first_name);
                request.input('last_name', sql.NVarChar(50), data.last_name);  
                request.input('phone', sql.NVarChar(15), data.phone);
                request.input('aadhar_no', sql.NVarChar(15), data.aadhar_no);
                request.input('pancard_no', sql.NVarChar(15), data.pancard_no);
                request.input('email', sql.NVarChar(100), data.email);
                request.input('current_address', sql.NVarChar(255), data.current_address);
                request.input('permanent_address', sql.NVarChar(255), data.permanent_address);
                request.input('referred_person_name', sql.NVarChar(100), data.referred_person_name);
                request.input('referred_person_no', sql.NVarChar(15), data.referred_person_no);
 
                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('InsertEmployee');
            })
            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    message: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.employeeUpdateDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => { 
                const request = pool.request();

                request.input('vendorid', sql.NVarChar(50), data.vendorid);

                request.input('employee_id', sql.NVarChar(50), data.employee_id);
                request.input('first_name', sql.NVarChar(50), data.first_name);
                request.input('last_name', sql.NVarChar(50), data.last_name);
                request.input('phone', sql.NVarChar(15), data.phone);
                request.input('aadhar_no', sql.NVarChar(15), data.aadhar_no);
                request.input('pancard_no', sql.NVarChar(15), data.pancard_no);
                request.input('email', sql.NVarChar(100), data.email);
                request.input('current_address', sql.NVarChar(255), data.current_address);
                request.input('permanent_address', sql.NVarChar(255), data.permanent_address);
                request.input('referred_person_name', sql.NVarChar(100), data.referred_person_name);
                request.input('referred_person_no', sql.NVarChar(15), data.referred_person_no);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdateEmployee');
            })

            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    message: result.output.bmessage_desc
                };
                resolve(output);
            }
            )
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.deleteemployeeDB = (data) => {
    console.log(`[INFO]: Deleting employees record for vendorid: ${data.vendorid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), data.vendorid); // Bind vendorid
                request.input('employee_id', sql.NVarChar(50), data.employee_id);

                console.log(`[INFO]: Executing Query - DELETE FROM employees WHERE vendorid = ${data.vendorid} and employee_id = ${data.employee_id}`);

                return request.query('DELETE FROM employees WHERE vendorid = @vendorid and employee_id = @employee_id');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: employees record deleted successfully for vendorid: ${data.vendorid} and employee_id: ${data.employee_id}`);
                    resolve({ message: `Employee record deleted successfully for vendorid: ${data.vendorid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${data.vendorid}`);
                    resolve({ message: `No records found for vendorid: ${data.vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: employees Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getEmployeeDB = (data) => {
    console.log(`[INFO]: Fetching EmployeeDetails for vendorid: ${data.vendorid}, employee_id: ${data.employee_id}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input bindings
                if (data.vendorid) {
                    request.input('vendorid', sql.NVarChar(sql.MAX), data.vendorid);
                }
                if (data.employee_id) {
                    request.input('employee_id', sql.NVarChar(sql.MAX), data.employee_id);
                }

                // Queries
                const detailsQuery = data.employee_id
                    ? 'SELECT * FROM Employees WHERE vendorid = @vendorid AND employee_id = @employee_id'
                    : 'SELECT * FROM Employees WHERE vendorid = @vendorid';

                const photoQuery = data.employee_id
                    ? 'SELECT employee_id AS employee_id, photo_url, photo_type FROM employee_photos WHERE employee_id = @employee_id'
                    : 'SELECT employee_id AS employee_id, photo_url, photo_type FROM employee_photos';

                // Run both queries
                return Promise.all([
                    request.query(detailsQuery),
                    request.query(photoQuery)
                ]);
            })
            .then(([detailsResult, photoResult]) => {
                const details = detailsResult.recordset;
                const photos = photoResult.recordset || [];

                const merged = details.map(detail => {
                    const { vendorid, employee_id, ...employeeDetails } = detail;

                    // const photoMatch = photos.find(p => String(p.employee_id) === String(detail.employee_id));
                    // const employeePhotos = photoMatch
                    //     ? (({ employee_id, ...rest }) => rest)(photoMatch)
                    //     : {};

                    return {
                        vendorid,
                        employee_id: detail.employee_id,
                        employeeDetails,
                        photos
                    };
                });

                resolve({
                    status: '00',
                    message: 'Fetched employee data',
                    data: merged
                });
            })
            .catch(error => {
                console.error(`[ERROR]: Get Employee Error: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
            });
    });
};


exports.ImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        const query = `
            INSERT INTO employee_photos (employee_id,photo_id, photo_type, photo_url,name, insert_date) 
            VALUES (@employee_id,@photo_id, @photo_type, @photo_url,@name, GETDATE());
        `;
        request.input('employee_id', sql.NVarChar(50), data.employeesID);
        request.input('photo_id', sql.NVarChar(50), data.photo_id);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);
        request.input('photo_url', sql.NVarChar(500), data.photo_url);
        request.input('name', sql.NVarChar(255), data.name);
        await request.query(query);

        return {
            status: "00",
            message: "Image uploaded successfully"
        };
    } catch (err) {
        console.error(`[ERROR]: ImageUploadDB Error: ${err.message}`);
        return {
            status: "03",
            message: err.message.includes("Invalid photo type") ? "Invalid photo type" : "SQL Error: " + err.message
        };
    }
};

exports.UpdateImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        // Check if the photo_type for the vendor already exists
        const checkQuery = `
            SELECT COUNT(*) AS count 
            FROM employee_photos 
            WHERE employee_id = @employee_id AND photo_type = @photo_type;
        `;

        request.input('employee_id', sql.NVarChar(50), data.employee_id);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);

        const checkResult = await request.query(checkQuery);
        const recordExists = checkResult.recordset[0].count > 0;

        if (recordExists) {
            // Update existing record
            const updateRequest = poolConnection.request();
            updateRequest.input('employee_id', sql.NVarChar(50), data.employee_id);
            updateRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            updateRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            updateRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            updateRequest.input('name', sql.NVarChar(255), data.name);

            const updateQuery = `
                UPDATE employee_photos
                SET photo_id = @photo_id,
                    photo_url = @photo_url,
                    name = @name,
                    update_date = GETDATE()
                WHERE employee_id = @employee_id AND photo_type = @photo_type;
            `;

            await updateRequest.query(updateQuery);

            return {
                status: "00",
                message: "Image record updated successfully"
            };
        } else {
            // Insert new record
            const insertRequest = poolConnection.request();
            insertRequest.input('employee_id', sql.NVarChar(50), data.employee_id);
            insertRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            insertRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            insertRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            insertRequest.input('name', sql.NVarChar(255), data.name);

            const insertQuery = `
                INSERT INTO employee_photos (employee_id, photo_id, photo_type, photo_url, name, insert_date)
                VALUES (@employee_id, @photo_id, @photo_type, @photo_url, @name, GETDATE());
            `;

            await insertRequest.query(insertQuery);

            return {
                status: "00",
                message: "Image uploaded successfully"
            };
        }

    } catch (err) {
        console.error(`[ERROR]: ImageUploadDB Error: ${err.message}`);
        return {
            status: "03",
            message: err.message.includes("Invalid photo type") ? "Invalid photo type" : "SQL Error: " + err.message
        };
    }
};