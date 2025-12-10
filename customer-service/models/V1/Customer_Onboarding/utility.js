const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const logger = require('../../../log/logger');


exports.InsertCustomerDB = async (data, CustomerID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('CustomerID', sql.NVarChar(255), CustomerID);
                request.input('CompanyType', sql.NVarChar(255), data.CompanyType);
                request.input('CompanyName', sql.NVarChar(255), data.CompanyName);
                request.input('ContactPerson', sql.NVarChar(255), data.ContactPerson);
                request.input('ContactNo', sql.NVarChar(50), data.ContactNo);
                request.input('EmailID', sql.NVarChar(255), data.EmailID);
                                request.input('Address_Type', sql.NVarChar(255), data.Address_Type);
                request.input('Address', sql.NVarChar(500), data.Address || data.RegisteredAddress.fullAddress);
                request.input('Address1', sql.NVarChar(255), data.Address1);
                request.input('Address2', sql.NVarChar(255), data.Address2);
                request.input('Pincode', sql.NVarChar(255), data.Pincode || data.RegisteredAddress.addressComponents.pincode);
                request.input('City', sql.NVarChar(255), data.City || data.RegisteredAddress.addressComponents.place);
                request.input('State', sql.NVarChar(255), data.State || data.RegisteredAddress.addressComponents.state);
                request.input('Tahsil', sql.NVarChar(255), data.Tahsil ?? data?.RegisteredAddress?.addressComponents?.Tahsil ?? '');

                const toStringSafe = (value) => {
                    if (value === null || value === undefined) return "";
                    return String(value);  // ✔ number → string conversion
                };

                request.input('Latitude', sql.NVarChar(255), toStringSafe(data.Latitude) || toStringSafe(data.RegisteredAddress?.latitude));
                request.input('Longitude', sql.NVarChar(255), toStringSafe(data.Longitude) || toStringSafe(data.RegisteredAddress?.longitude));

                request.input('AadharNo', sql.NVarChar(20), data.AadharNo);
                request.input('PancardNo', sql.NVarChar(20), data.PancardNo);
                request.input('GstNo', sql.NVarChar(20), data.GstNo);

                // request.input('Industry', sql.NVarChar(255), data.Industry);
                // request.input('IndustryDetails', sql.NVarChar(255), data.IndustryDetails);
                // request.input('ProductDetails', sql.NVarChar(255), data.ProductDetails);
                // request.input('ProductDescription', sql.NVarChar(255), data.ProductDescription);
                // request.input('RxLogisticsServices', sql.NVarChar(255), data.RxLogisticsServices);
                // request.input('Designation', sql.NVarChar(255), data.Designation);


                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('CustomerDetails', sql.NVarChar(sql.MAX));

                // Call the stored procedure
                return request.execute('CustomerDetailsInsert');
            })

            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    CustomerDetails: result.output.CustomerDetails
                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};


exports.updateCustomerDetailsDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Input Parameters
                request.input('CustomerID', sql.NVarChar(255), data.CustomerID);
                request.input('CompanyType', sql.NVarChar(255), data.CompanyType);
                request.input('CompanyName', sql.NVarChar(255), data.CompanyName);
                request.input('ContactPerson', sql.NVarChar(255), data.ContactPerson);
                request.input('ContactNo', sql.NVarChar(50), data.ContactNo);
                request.input('EmailID', sql.NVarChar(255), data.EmailID);
                                                request.input('Address_Type', sql.NVarChar(255), data.Address_Type);
                request.input('Address', sql.NVarChar(500), data.Address || data.RegisteredAddress.fullAddress);
                request.input('Address1', sql.NVarChar(255), data.Address1);
                request.input('Address2', sql.NVarChar(255), data.Address2);
                request.input('Pincode', sql.NVarChar(255), data.Pincode || data.RegisteredAddress.addressComponents.Pincode);
                request.input('City', sql.NVarChar(255), data.City || data.RegisteredAddress.addressComponents.City);
                request.input('State', sql.NVarChar(255), data.State || data.RegisteredAddress.addressComponents.State);
                request.input('Tahsil', sql.NVarChar(255), data.Tahsil ?? data?.RegisteredAddress?.addressComponents?.Tahsil ?? '');
                const toStringSafe = (value) => {
                    if (value === null || value === undefined) return "";
                    return String(value);  // ✔ number → string conversion
                };

                request.input('Latitude', sql.NVarChar(255), toStringSafe(data.Latitude) || toStringSafe(data.RegisteredAddress?.latitude));
                request.input('Longitude', sql.NVarChar(255), toStringSafe(data.Longitude) || toStringSafe(data.RegisteredAddress?.longitude));

                request.input('AadharNo', sql.NVarChar(20), data.AadharNo);
                request.input('PancardNo', sql.NVarChar(20), data.PancardNo);
                request.input('GstNo', sql.NVarChar(20), data.GstNo);

                // request.input('Industry', sql.NVarChar(255), data.Industry);
                // request.input('IndustryDetails', sql.NVarChar(255), data.IndustryDetails);
                // request.input('ProductDetails', sql.NVarChar(255), data.ProductDetails);
                // request.input('ProductDescription', sql.NVarChar(255), data.ProductDescription);
                // request.input('RxLogisticsServices', sql.NVarChar(255), data.RxLogisticsServices);
                // request.input('Designation', sql.NVarChar(255), data.Designation);


                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('CustomerDetailsUpdate');
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


exports.deleteCustomerDetailsDB = (CustomerID) => {
    console.log(`[INFO]: Deleting Customer Master for CustomerID: ${CustomerID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(255), CustomerID); // Bind CustomerID
                console.log(`[INFO]: Executing Query - DELETE FROM Customer_Details  WHERE CustomerID = ${CustomerID}`);
                return request.query('DELETE FROM Customer_Details WHERE CustomerID = @CustomerID');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Customer deleted successfully for CustomerID: ${CustomerID}`);
                    resolve({ message: `Customer deleted successfully for CustomerID: ${CustomerID}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for CustomerID: ${CustomerID}`);
                    resolve({ message: `No records found for CustomerID: ${CustomerID}`, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Expense Type Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.getCustomerDetailsDB = (CustomerID) => {
    console.log(`[INFO]: Fetching Customer for CustomerID: ${CustomerID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(255), CustomerID); // Bind CustomerID
                console.log(`[INFO]: Executing Query - SELECT * FROM Customer_Details  WHERE CustomerID = ${JSON.stringify(CustomerID)}`);
                return request.query('SELECT * FROM Customer_Details WHERE CustomerID = @CustomerID');
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: Customer found for CustomerID: ${CustomerID}`);
                    resolve({ message: `Customer records found for CustomerID: ${CustomerID}`, data: result.recordset, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for CustomerID: ${CustomerID}`);
                    resolve({ message: `No records found for CustomerID: ${CustomerID}`, data: result.recordset, status: "01" });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: Customer Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.ImageUploadDB = async (data) => {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        const query = `
            INSERT INTO Customer_KYCDetails (CustomerID, photo_id , photo_type ,photo_url , name, insert_date	) 
            VALUES (@CustomerID, @photo_id ,@photo_type, @photo_url, @name, GETDATE());
        `;
        request.input('CustomerID', sql.NVarChar(50), data.CustomerID);
        request.input('photo_id', sql.NVarChar(255), data.photo_id);
        request.input('photo_type', sql.NVarChar(500), data.photo_type);
        request.input('photo_url', sql.NVarChar(500), data.photo_url);
        request.input('name', sql.NVarChar(50), data.name);


        // request.input('insert_date', sql.DateTime, new Date());

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
            FROM Customer_KYCDetails 
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
                UPDATE Customer_KYCDetails
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
                INSERT INTO Customer_KYCDetails (vendorid, photo_id, photo_type, photo_url, name, insert_date)
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