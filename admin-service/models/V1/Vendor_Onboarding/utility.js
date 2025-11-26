const sql = require('mssql');
const pool = require('../../../db/db');

exports.VendorOnboardingDB = (data, vendorid, VendorEmployeeDetails, vehicle_Details) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Create a TVP (table-valued parameter)
                // Employee TVP
                const tvp = new sql.Table();
                tvp.columns.add('full_name', sql.NVarChar(100));
                tvp.columns.add('contact_No', sql.NVarChar(15));
                tvp.columns.add('alternate_No', sql.NVarChar(15));
                tvp.columns.add('emailid', sql.NVarChar(255));
                tvp.columns.add('website', sql.NVarChar(255));
                tvp.columns.add('designation', sql.NVarChar(100));
                tvp.columns.add('username', sql.NVarChar(100));
                tvp.columns.add('password', sql.NVarChar(100));

                VendorEmployeeDetails.forEach(cd => {
                    tvp.rows.add(
                        cd.full_name,
                        cd.contact_No,
                        cd.alternate_No,
                        cd.emailid,
                        cd.website,
                        cd.designation,
                        cd.username,
                        cd.password
                    );
                });

                // Vehicle TVP
                const VCL = new sql.Table();
                VCL.columns.add('vehicle_number', sql.NVarChar(20));

                vehicle_Details.forEach(cd => {
                    VCL.rows.add(cd.vehicle_number);
                });

                request.input('VendorEmployeeDetailsType', tvp);
                request.input('VehicleDetails', VCL);


                request.input('vendorid', sql.NVarChar(255), vendorid);

                // Company Details
                request.input('companyType', sql.NVarChar(255), data.VendorDetails.companyType);
                request.input('companyName', sql.NVarChar(255), data.VendorDetails.companyName);
                request.input('owner_name', sql.NVarChar(255), data.VendorDetails.owner_name);
                request.input('mobileNo', sql.NVarChar(255), data.VendorDetails.mobileNo);
                request.input('address1', sql.NVarChar(255), data.VendorDetails.address1);
                request.input('address2', sql.NVarChar(255), data.VendorDetails.address2);
                request.input('landMark', sql.NVarChar(255), data.VendorDetails.landMark);
                request.input('pincode', sql.NVarChar(10), data.VendorDetails.pincode);
                // request.input('destination', sql.NVarChar(255), data.VendorDetails.destination);
                // request.input('region', sql.NVarChar(255), data.VendorDetails.region);
                request.input('state', sql.NVarChar(255), data.VendorDetails.state);
                request.input('Tahsil', sql.NVarChar(255), data.VendorDetails.Tahsil);
                request.input('City', sql.NVarChar(255), data.VendorDetails.City);
                request.input('vehicle_count', sql.NVarChar(255), data.VendorDetails.vehicle_count);

                // request.input('VehicleDetails', VCL)

                // Contact Details
                // request.input('firstName', sql.NVarChar(255), data.VendorEmployeeDetails.firstName);
                // request.input('lastName', sql.NVarChar(255), data.VendorEmployeeDetails.lastName);
                // request.input('VendorEmployeeDetailsType', tvp)
                // request.input('full_name', sql.NVarChar(255), data.VendorEmployeeDetails.full_name);
                // request.input('contact_No', sql.NVarChar(15), data.VendorEmployeeDetails.registerCellNo); 
                // request.input('alternate_No', sql.NVarChar(15), data.VendorEmployeeDetails.alternateNo);
                // request.input('emailid', sql.NVarChar(255), data.VendorEmployeeDetails.emailAddress);
                // request.input('website', sql.NVarChar(255), data.VendorEmployeeDetails.website);
                // request.input('username', sql.NVarChar(255), data.VendorEmployeeDetails.username || data.VendorDetails.companyName);
                // request.input('password', sql.NVarChar(255), data.VendorEmployeeDetails.password || "1234");
                // request.input('designation', sql.NVarChar(255), data.VendorEmployeeDetails.designation);

                // Legal KYC documents  
                request.input('gstNo', sql.NVarChar(15), data.kycDetails.gstNo);
                request.input('cinNo', sql.NVarChar(21), data.kycDetails.cinNo);
                request.input('panNo', sql.NVarChar(10), data.kycDetails.panNo);
                request.input('aadharNo', sql.NVarChar(12), data.kycDetails.aadharNo);
                // request.input('cancel_cheque_no', sql.NVarChar(200), data.kycDetails.cancel_cheque_no);
                // request.input('image_url', sql.NVarChar(255), data.kycDetails.image_url);
                // request.input('image', sql.NVarChar(255), data.kycDetails.image);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output("userDetails", sql.NVarChar(sql.MAX));


                // Call the stored procedure
                return request.execute('VendorOnboarding');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    userDetails: result.output.userDetails
                    // userDetailsRaw: Array.isArray(result.output.userDetails),

                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.getVendoremployeeDB = (vendorid) => {
    console.log(`[INFO]: Fetching Vendor_employeeDetails for vendorid: ${vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - SELECT * FROM Vendor_employeeDetails WHERE vendor_id = ${vendorid}`);

                return request.query('SELECT * FROM Vendor_employeeDetails WHERE vendor_id = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Query executed successfully. Rows returned: ${JSON.stringify(result.recordset)}`);
                    resolve({ message: "Fetching Vendor_employeeDetails", status: "00", data: result.recordset });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vendor_employeeDetailse Error: SQL Error: ${error.message}`);
                reject('SQL Error: ' + error.message);
            });
    });
};

exports.getVendorDetailsDB = (vendorid) => {
    console.log(`[INFO]: Fetching Vendor_Details for vendorid: ${vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - SELECT * FROM Vendor_Details WHERE vendorid = ${vendorid}`);

                return request.query('SELECT * FROM Vendor_Details WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Query executed successfully. Rows returned: ${JSON.stringify(result.recordset)}`);
                    resolve({ message: "Fetching VendorDetails Details", status: "00", data: result.recordset });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vendor_Details Error: SQL Error: ${error.message}`);
                reject('SQL Error: ' + error.message);
            });
    });
};

exports.getVendorKYCDB = (vendorid) => {
    console.log(`[INFO]: Fetching Vendor_KYCDetails for vendorid: ${vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - SELECT * FROM Vendor_KYCDetails WHERE vendorid = ${vendorid}`);

                return request.query('SELECT * FROM Vendor_Legaldocuments WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Query executed successfully. Rows returned: ${JSON.stringify(result.recordset)}`);
                    resolve({ message: "Fetching Vendor_KYCDetails", status: "00", data: result.recordset });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vendor_KYCDetails Error: SQL Error: ${error.message}`);
                reject('SQL Error: ' + error.message);
            });
    });
};

exports.deleteVehicleTypeDB = (vendorid) => {
    console.log(`[INFO]: Deleting Vehicle_Type record for vendorid: ${vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - DELETE FROM VehicleTypesDetails WHERE vendorid = ${vendorid}`);

                return request.query('DELETE FROM VehicleTypesDetails WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Vehicle_Type record deleted successfully for vendorid: ${vendorid}`);
                    resolve({ message: `Vehicle type deleted successfully for vendorid: ${vendorid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vehicle_Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.deleteVehicleDB = (vendorid) => {
    console.log(`[INFO]: Deleting Vehicle record for vendorid: ${vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid

                console.log(`[INFO]: Executing Query - DELETE FROM VehicleDetails WHERE vendorid = ${vendorid}`);

                return request.query('DELETE FROM VehicleDetails WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Vehicle record deleted successfully for vendorid: ${vendorid}`);
                    resolve({ message: `Vehicle deleted successfully for vendorid: ${vendorid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vehicle Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, statusCode: 2550, status: "01" });
            });
    });
};

exports.deleteVendoremployeeDB = (vendorid) => {
    console.log(`[INFO]: Deleting Vendor_employeeDetails record for vendorid: ${vendorid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Vendor_employeeDetails WHERE vendor_id = ${vendorid}`);
                return request.query('DELETE FROM Vendor_employeeDetails WHERE vendor_id = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Vendor_employeeDetails record deleted successfully for vendorid: ${vendorid}`);
                    resolve({ message: `Vendor Contact deleted successfully for vendorid: ${vendorid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vendor_employeeDetails Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            }
            );
    });


};

exports.deleteVendorDetailsDB = (vendorid) => {
    console.log(`[INFO]: Deleting VendorDetails record for vendorid: ${vendorid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Vendor_Details WHERE vendorid = ${vendorid}`);
                return request.query('DELETE FROM Vendor_Details WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: VendorDetails record deleted successfully for vendorid: ${vendorid}`);
                    resolve({ message: `VendorDetails deleted successfully for vendorid: ${vendorid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: VendorDetails Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    }

    );
};

exports.deleteVendorKYCDB = (vendorid) => {
    console.log(`[INFO]: Deleting Vendor_KYCDetails for vendorid: ${vendorid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Vendor_KYCDetails WHERE vendorid = ${vendorid}`);
                return request.query('DELETE FROM Vendor_KYCDetails WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Vendor_KYCDetails deleted successfully for vendorid: ${vendorid}`);
                    resolve({ message: `Vendor KYC details deleted successfully for vendorid: ${vendorid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Vendor_KYCDetails Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.updateVendoremployeeDB = (VendorEmployeeDetails) => {
    console.log(`[INFO]: Updating Vendor_employeeDetails record for vendorid: ${VendorEmployeeDetails.vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(15), VendorEmployeeDetails.vendorid);
                // Contact Details
                request.input('FullName', sql.NVarChar(255), data.VendorEmployeeDetails.FullName);
                request.input('contact_No', sql.NVarChar(15), VendorEmployeeDetails.registerCellNo);
                request.input('alternate_No', sql.NVarChar(15), VendorEmployeeDetails.alternateNo);
                request.input('emailid', sql.NVarChar(255), VendorEmployeeDetails.emailAddress);
                request.input('website', sql.NVarChar(255), VendorEmployeeDetails.website);
                // request.input('username', sql.NVarChar(255), VendorEmployeeDetails.username);
                // request.input('password', sql.NVarChar(255), VendorEmployeeDetails.password);
                // request.input('region', sql.NVarChar(255), VendorEmployeeDetails.region);
                // request.input('designation', sql.NVarChar(255), VendorEmployeeDetails.designation);



                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdateVendorEmployeeDetails');
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

exports.updateVendorDetailsDB = (VendorDetails) => {
    console.log(`[INFO]: Updating VendorDetails record for vendorid: ${JSON.stringify(VendorDetails)}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(15), VendorDetails.vendorid);
                // Company Details
                request.input('companyType', sql.NVarChar(255), VendorDetails.companyType);
                request.input('companyName', sql.NVarChar(255), VendorDetails.companyName);
                request.input('owner_name', sql.NVarChar(255), VendorDetails.owner_name);
                request.input('mobileNo', sql.NVarChar(255), VendorDetails.mobileNo);
                request.input('address1', sql.NVarChar(255), VendorDetails.address1);
                request.input('address2', sql.NVarChar(255), VendorDetails.address2);
                request.input('landMark', sql.NVarChar(255), VendorDetails.landMark);
                request.input('pincode', sql.NVarChar(10), VendorDetails.pincode);
                request.input('state', sql.NVarChar(255), VendorDetails.state);
                request.input('Tahsil', sql.NVarChar(255), VendorDetails.Tahsil);
                request.input('City', sql.NVarChar(255), VendorDetails.City);
                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdateVendorDetails');
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

exports.updateVendorKYCDB = (kycDetails) => {
    console.log(`[INFO]: Updating Vendor_KYC record for kycDetails: ${JSON.stringify(kycDetails)}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(15), kycDetails.vendorid);

                // KYC Details
                request.input('gstNo', sql.NVarChar(15), kycDetails.gstNo);
                request.input('cinNo', sql.NVarChar(21), kycDetails.cinNo);
                request.input('panNo', sql.NVarChar(10), kycDetails.panNo);
                request.input('aadharNo', sql.NVarChar(12), kycDetails.aadharNo);
                request.input('cancel_cheque_no', sql.NVarChar(200), kycDetails.cancel_cheque_no);
                request.input('image_url', sql.NVarChar(255), kycDetails.image_url);
                request.input('image', sql.NVarChar(255), kycDetails.image);
                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('UpdateVendorKYC');
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

exports.ImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        const query = `
            INSERT INTO Vendor_KYCDetails (vendorid,photo_id, photo_type, photo_url,name, insert_date) 
            VALUES (@vendorid, @photo_id, @photo_type, @photo_url,@name, GETDATE());
        `;
        request.input('vendorid', sql.NVarChar(50), data.VendorID);
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
            FROM Vendor_KYCDetails 
            WHERE vendorid = @vendorid AND photo_type = @photo_type;
        `;

        request.input('vendorid', sql.NVarChar(50), data.VendorID);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);

        const checkResult = await request.query(checkQuery);
        const recordExists = checkResult.recordset[0].count > 0;

        if (recordExists) {
            // Update existing record
            const updateRequest = poolConnection.request();
            updateRequest.input('vendorid', sql.NVarChar(50), data.VendorID);
            updateRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            updateRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            updateRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            updateRequest.input('name', sql.NVarChar(255), data.name);

            const updateQuery = `
                UPDATE Vendor_KYCDetails
                SET photo_id = @photo_id,
                    photo_url = @photo_url,
                    name = @name,
                    update_date = GETDATE()
                WHERE vendorid = @vendorid AND photo_type = @photo_type;
            `;

            await updateRequest.query(updateQuery);

            return {
                status: "00",
                message: "Image record updated successfully"
            };
        } else {
            // Insert new record
            const insertRequest = poolConnection.request();
            insertRequest.input('vendorid', sql.NVarChar(50), data.VendorID);
            insertRequest.input('photo_id', sql.NVarChar(50), data.photo_id);
            insertRequest.input('photo_type', sql.NVarChar(255), data.photo_type);
            insertRequest.input('photo_url', sql.NVarChar(500), data.photo_url);
            insertRequest.input('name', sql.NVarChar(255), data.name);

            const insertQuery = `
                INSERT INTO Vendor_KYCDetails (vendorid, photo_id, photo_type, photo_url, name, insert_date)
                VALUES (@vendorid, @photo_id, @photo_type, @photo_url, @name, GETDATE());
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

exports.VehicleVerificationDB = async (data) => {
    return new Promise((resolve, reject) => {

        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";


                request.input("vendorId", sql.VarChar, data.vendorid);
                request.input("VehicleNumber", sql.VarChar, data.VehicleNumber);

                query = `
                        SELECT VendorID , registration_no AS VehicleNumber, verify_flag 
                        FROM VehicleDetailsNew 
                        WHERE verify_flag ='N'
						AND VendorID = @vendorId
                     --   AND registration_no = @VehicleNumber
                        ORDER BY insert_date ASC;
                    `;

                return request.query(query);
            })
            .then(result => {
                resolve({
                    status: "00",
                    message: "Data fetched successfully",
                    data: result.recordset
                });
            })
            .catch(err => {
                console.error("SQL Error:", err);
                reject({
                    status: "01",
                    message: "SQL Error: " + err
                });
            });
    });
};
