const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported

exports.InsertDriverDB = (data, driver_id) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Input
                request.input('driver_id', sql.NVarChar(50), driver_id);
                request.input('full_name', sql.NVarChar(50), data.full_name);
                request.input('Phone', sql.NVarChar(15), data.Phone);
                request.input('emergency_phone', sql.NVarChar(100), data.emergency_phone);
                request.input('Email', sql.NVarChar(100), data.Email);
                request.input('address1', sql.NVarChar(255), data.address1);
                request.input('address2', sql.NVarChar(255), data.address2);
                request.input('pincode', sql.NVarChar(10), data.pincode);
                request.input('state', sql.NVarChar(255), data.state);
                request.input('Tahsil', sql.NVarChar(255), data.Tahsil);
                request.input('City', sql.NVarChar(255), data.City);
                request.input('username', sql.NVarChar(50), data.username);
                request.input('password', sql.NVarChar(50), data.password);
                request.input('driving_license_no', sql.NVarChar(100), data.driving_license_no);
                request.input('expiry_date', sql.NVarChar(100), data.expiry_date);
                request.input('driving_license_address', sql.NVarChar(255), data.driving_license_address);
                request.input('vendorid', sql.NVarChar(50), data.vendorid);

                // request.input('aadhar_No', sql.NVarChar(100), data.aadhar_No);
                // request.input('police_verification', sql.Bit, data.police_verification);
                // request.input('police_verification_No', sql.NVarChar(100), data.police_verification_No);
                // request.input('verification_date', sql.NVarChar(100), data.verification_date);
                // request.input('current_address', sql.NVarChar(255), data.current_address);
                // request.input('permanent_address', sql.NVarChar(255), data.permanent_address);
                // request.input('referred_person_name', sql.NVarChar(100), data.referred_person_name);
                // request.input('referred_person_no', sql.NVarChar(15), data.referred_person_no);



                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('InsertDriver');
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

exports.updateDriverDetailsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input
                request.input('driver_id', sql.NVarChar(50), data.driver_id);
                request.input('full_name', sql.NVarChar(50), data.full_name);
                request.input('Phone', sql.NVarChar(15), data.Phone);
                request.input('emergency_phone', sql.NVarChar(100), data.emergency_phone);
                request.input('Email', sql.NVarChar(100), data.Email);
                request.input('address1', sql.NVarChar(255), data.address1);
                request.input('address2', sql.NVarChar(255), data.address2);
                request.input('pincode', sql.NVarChar(10), data.pincode);
                request.input('state', sql.NVarChar(255), data.state);
                request.input('Tahsil', sql.NVarChar(255), data.Tahsil);
                request.input('City', sql.NVarChar(255), data.City);
                request.input('username', sql.NVarChar(50), data.username);
                request.input('password', sql.NVarChar(50), data.password);
                request.input('driving_license_no', sql.NVarChar(100), data.driving_license_no);
                request.input('expiry_date', sql.NVarChar(100), data.expiry_date);
                request.input('driving_license_address', sql.NVarChar(255), data.driving_license_address);
                request.input('vendorid', sql.NVarChar(50), data.vendorid);

                // request.input('aadhar_No', sql.NVarChar(100), data.aadhar_No);
                // request.input('police_verification', sql.Bit, data.police_verification);
                // request.input('police_verification_No', sql.NVarChar(100), data.police_verification_No);
                // request.input('verification_date', sql.NVarChar(100), data.verification_date);
                // request.input('current_address', sql.NVarChar(255), data.current_address);
                // request.input('permanent_address', sql.NVarChar(255), data.permanent_address);
                // request.input('referred_person_name', sql.NVarChar(100), data.referred_person_name);
                // request.input('referred_person_no', sql.NVarChar(15), data.referred_person_no);



                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));


                // Call the stored procedure

                return request.execute('UpdateDriver');
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

exports.deleteDriverDetailsDB = (data) => {
    console.log(`[INFO]: Deleting Driver_Detailss record for driver_id: ${data.driver_id}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('driver_id', sql.NVarChar(255), data.driver_id); // Bind driver_id
                request.input('vendorid', sql.NVarChar(255), data.vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - DELETE FROM Driver_Details WHERE driver_id = ${data.driver_id}`);

                return request.query('DELETE FROM Driver_Details WHERE driver_id = @driver_id AND vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Driver_Details record deleted successfully for driver_id: ${data.driver_id}`);
                    resolve({ message: `Vehicle type deleted successfully for driver_id: ${data.driver_id}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for driver_id: ${data.driver_id}`);
                    resolve({ message: `No records found for driver_id: ${data.driver_id}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Driver_Details Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getDriverDetailsDB = (data) => {
    console.log(`[INFO]: Fetching DriverDetails for vendorid: ${data.vendorid}, driver_id: ${data.driver_id}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const countRequest = pool.request();
                const detailsRequest = pool.request();
                const photoRequest = pool.request();

                // Input bindings
                if (data.vendorid) {
                    countRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
                    detailsRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
                }
                if (data.driver_id) {
                    detailsRequest.input('driver_id', sql.NVarChar(255), data.driver_id);
                    photoRequest.input('driver_id', sql.NVarChar(255), data.driver_id);
                }

                // Queries
                const detailsQuery = data.driver_id
                    ? 'SELECT * FROM Driver_Details WHERE driver_id = @driver_id AND vendorid = @vendorid'
                    : 'SELECT * FROM Driver_Details WHERE vendorid = @vendorid';

                const photoQuery = data.driver_id
                    ? 'SELECT driver_id, photo_url, photo_type FROM Driver_Photos WHERE driver_id = @driver_id'
                    : 'SELECT driver_id, photo_url, photo_type FROM Driver_Photos';

                const statusCountsQuery = data.vendorid
                    ? `SELECT 
                            COUNT(*) AS total,
                            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_count,
                            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_count
                        FROM Driver_Details
                        WHERE vendorid = @vendorid`
                    : `SELECT 
                            COUNT(*) AS total,
                            SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active_count,
                            SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) AS inactive_count
                        FROM Driver_Details`;

                const photoPromise = photoRequest.query(photoQuery);
                const detailsPromise = detailsRequest.query(detailsQuery);
                const countPromise = countRequest.query(statusCountsQuery);

                return Promise.all([countPromise, detailsPromise, photoPromise]);
            })
            .then(([countResult, detailsResult, photoResult]) => {
                const counts = countResult.recordset[0]; // ✅ Use the first record directly
                const details = detailsResult.recordset;
                const photos = photoResult.recordset || [];

                // Merge results
                const merged = details.map(detail => {
                    const { vendorid, driver_id, ...DriverDetails } = detail;

                    // const photoMatch = photos.find(p => String(p.driver_id) === String(driver_id));
                    // const Driver_Photos = photoMatch
                    //     ? (({ driver_id, ...rest }) => rest)(photoMatch)
                    //     : null;

                    return {
                        vendorid,
                        driver_id,
                        DriverDetails,
                        photos
                    };
                });

                resolve({
                    status: '00',
                    message: 'Fetched driver data',
                    counts,
                    data: merged
                });
            })
            .catch(error => {
                console.error(`[ERROR]: Get Driver Error: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
            });
    });
};

exports.ImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        const query = `
            INSERT INTO Driver_Photos (driver_id,	photo_id,	photo_type,	photo_url,name,	insert_date	) 
            VALUES (@driver_id,	@photo_id, @photo_type, @photo_url, @name , GETDATE());
        `;
        request.input('driver_id', sql.NVarChar(50), data.DriverID);
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
            FROM Driver_Photos 
            WHERE driver_id = @driver_id AND photo_type = @photo_type;
        `;

        request.input('driver_id', sql.NVarChar(50), data.driver_id);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);

        const checkResult = await request.query(checkQuery);
        const recordExists = checkResult.recordset[0].count > 0;

        if (recordExists) {
            // Update existing record
            const updateRequest = poolConnection.request();
            updateRequest.input('driver_id', sql.NVarChar(50), data.driver_id);
            updateRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            updateRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            updateRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            updateRequest.input('name', sql.NVarChar(255), data.name);

            const updateQuery = `
                UPDATE Driver_Photos
                SET photo_id = @photo_id,
                    photo_url = @photo_url,
                    name = @name,
                    update_date = GETDATE()
                WHERE driver_id = @driver_id AND photo_type = @photo_type;
            `;

            await updateRequest.query(updateQuery);

            return {
                status: "00",
                message: "Image record updated successfully"
            };
        } else {
            // Insert new record
            const insertRequest = poolConnection.request();
            insertRequest.input('driver_id', sql.NVarChar(50), data.driver_id);
            insertRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            insertRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            insertRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            insertRequest.input('name', sql.NVarChar(255), data.name);

            const insertQuery = `
                INSERT INTO Driver_Photos (driver_id, photo_id, photo_type, photo_url, name, insert_date)
                VALUES (@driver_id, @photo_id, @photo_type, @photo_url, @name, GETDATE());
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