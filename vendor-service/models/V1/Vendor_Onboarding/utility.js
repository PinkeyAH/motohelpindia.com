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
                tvp.columns.add('customDesignation', sql.NVarChar(100));
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
                        cd.customDesignation,
                        cd.username,
                        cd.password
                    );
                });

                // Vehicle TVP
                const VCL = new sql.Table();
                VCL.columns.add('vehicle_number', sql.NVarChar(20));
                VCL.columns.add('vehicle_weight', sql.NVarChar(50));    

                vehicle_Details.forEach(cd => {
                    VCL.rows.add(cd.vehicle_number, cd.vehicle_weight);
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
                request.input('district', sql.NVarChar(255), data.VendorDetails.district);
                request.input('Tahsil', sql.NVarChar(255), data.VendorDetails.Tahsil);
                request.input('City', sql.NVarChar(255), data.VendorDetails.City);
                request.input('vehicle_count', sql.NVarChar(255), data.VendorDetails.vehicle_count);
                request.input('employee_count', sql.NVarChar(255), data.VendorDetails.employee_count);

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

                // // ✅ Add address fields from GST response
                // request.input('tradeNam', sql.NVarChar(255), data.gstData.tradeNam || data.gstData.lgnm || '');
                // request.input('addr_bnm', sql.NVarChar(255), data.gstData.pradr?.addr?.bnm || '');
                // request.input('addr_bno', sql.NVarChar(255), data.gstData.pradr?.addr?.bno || '');
                // request.input('addr_loc', sql.NVarChar(255), data.gstData.pradr?.addr?.loc || '');
                // request.input('addr_st', sql.NVarChar(255), data.gstData.pradr?.addr?.st || '');
                // request.input('addr_locality', sql.NVarChar(255), data.gstData.pradr?.addr?.locality || '');
                // request.input('addr_district', sql.NVarChar(255), data.gstData.pradr?.addr?.dst || '');
                // request.input('addr_state', sql.NVarChar(255), data.gstData.pradr?.addr?.stcd || '');
                // request.input('addr_pincode', sql.NVarChar(10), data.gstData.pradr?.addr?.pncd || '');
                // request.input('addr_landmark', sql.NVarChar(255), data.gstData.pradr?.addr?.landMark || '');
                // request.input('cinNo_Add', sql.NVarChar(21), data.kycDetails.cinNo);
                // request.input('panFullName', sql.NVarChar(255), panData.data.full_name || '');
                // request.input('aadharNo_Add', sql.NVarChar(12), data.kycDetails.aadharNo);
                // ✅ Add address fields from GST response
                request.input('tradeNam', sql.NVarChar(255),  'laxmi');
                request.input('addr_bnm', sql.NVarChar(255), 'somebnm');
                request.input('addr_bno', sql.NVarChar(255), 'somebno');
                request.input('addr_loc', sql.NVarChar(255), 'someloc');
                request.input('addr_st', sql.NVarChar(255), 'somest');
                request.input('addr_locality', sql.NVarChar(255), 'somelocality');
                request.input('addr_district', sql.NVarChar(255), 'mumbai');
                request.input('addr_state', sql.NVarChar(255), 'mumbai');
                request.input('addr_pincode', sql.NVarChar(10), '400001');
                request.input('addr_landmark', sql.NVarChar(255), 'mumbai');
                request.input('cinNo_Add', sql.NVarChar(21), 'mumbai');
                request.input('panFullName', sql.NVarChar(255), 'pinkeyG');
                request.input('aadharNo_Add', sql.NVarChar(12), 'mumbai');
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

exports.vendorBankkYCDB = (bankdata) => {
    console.log(`[INFO]: Updating bank data record for kycDetails: ${JSON.stringify(bankdata)}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(15), bankdata.vendorid);

                // KYC Details
                request.input('bank_ac_holder_name', sql.NVarChar(255), bankdata.bank_ac_holder_name || null);
                request.input('bank_ac_number', sql.NVarChar(20), bankdata.bank_ac_number || null);
                request.input('bank_ac_number_verify', sql.NVarChar(20), bankdata.bank_ac_number_verify || null);
                request.input('ifsc_code', sql.NVarChar(11), bankdata.ifsc_code || null);
                request.input('bank_name', sql.NVarChar(255), bankdata.bank_name || null);
                request.input('branch_name', sql.NVarChar(255), bankdata.branch_name || null);
                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));
                // Call the stored procedure
                return request.execute('VendorBankKYC');
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
            
exports.getVendoremployeeDB = (vendorid) => {
    console.log(`[INFO]: Fetching Vendor_employeeDetails for vendorid: ${vendorid}`);

     return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid);

                console.log(`[INFO]: Executing multi-query for vendorid: ${vendorid}`);

                const query = `
                    SELECT * FROM Vendor_employeeDetails WHERE vendor_id = @vendorid;
                --    SELECT * FROM Vendor_Legaldocuments WHERE vendorid = @vendorid;
                --    SELECT * FROM Vendor_employeeDetails WHERE vendor_id = @vendorid;
                --    SELECT * FROM VehicleDetailsNew WHERE vendorid = @vendorid;
                --    SELECT * FROM Driver_Details WHERE vendorid = @vendorid;
                `;

                return request.query(query);
            })
            .then(result => {
                console.log(`[SUCCESS]: Data fetched successfully for vendorid: ${vendorid}`);

                // MSSQL returns multiple recordsets for multiple SELECT statements
                const response = {
                    status: "00",
                    message: "Vendor-related data fetched successfully",
                    data: {
                        // Vendor_Details: result.recordsets[0] || [],
                        // Vendor_Legaldocuments: result.recordsets[1] || [],
                        Vendor_employeeDetails: result.recordsets[0] || [],
                        // VehicleDetailsNew: result.recordsets[3] || [],
                        // Driver_Details: result.recordsets[4] || []
                    }
                };

                resolve(response);
            })
            .catch(error => {
                console.error(`[ERROR]: Vendor_employeeDetailse Error: SQL Error: ${error.message}`);
                reject('SQL Error: ' + error.message);
            });
    });
};

exports.getVendorDetailsDB = (vendorid) => {
    console.log(`[INFO]: Fetching all vendor-related data for vendorid: ${vendorid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid);

                console.log(`[INFO]: Executing multi-query for vendorid: ${vendorid}`);

                const query = `
                    SELECT * FROM Vendor_Details WHERE vendorid = @vendorid;
                --    SELECT * FROM Vendor_Legaldocuments WHERE vendorid = @vendorid;
                --    SELECT * FROM Vendor_employeeDetails WHERE vendor_id = @vendorid;
                --    SELECT * FROM VehicleDetailsNew WHERE vendorid = @vendorid;
                --    SELECT * FROM Driver_Details WHERE vendorid = @vendorid;
                `;

                return request.query(query);
            })
            .then(result => {
                console.log(`[SUCCESS]: Data fetched successfully for vendorid: ${vendorid}`);

                // MSSQL returns multiple recordsets for multiple SELECT statements
                const response = {
                    status: "00",
                    message: "Vendor-related data fetched successfully",
                    data: {
                        Vendor_Details: result.recordsets[0] || [],
                        // Vendor_Legaldocuments: result.recordsets[1] || [],
                        // Vendor_employeeDetails: result.recordsets[2] || [],
                        // VehicleDetailsNew: result.recordsets[3] || [],
                        // Driver_Details: result.recordsets[4] || []
                    }
                };

                resolve(response);
            })
            .catch(error => {
                console.error(`[ERROR]: Failed to fetch vendor details. ${error.message}`);
                reject({
                    status: "99",
                    message: "SQL Error: " + error.message
                });
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

                console.log(`[INFO]: Executing Query - SELECT * FROM Vendor_Legaldocuments  WHERE vendorid = ${vendorid}`);

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

exports.getVehicleDB = (data) => {
    console.log(`[INFO]: Fetching VehicleDetails for vendorid: ${data.vendorid}, vehicleid: ${data.vehicleid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const typesRequest = pool.request();
                const detailsRequest = pool.request();
                const photoRequest = pool.request();

                // Input bindings
                if (data.vendorid) {
                    typesRequest.input('vendorid', sql.NVarChar(255), data.vendorid);
                    detailsRequest.input('vendorid', sql.NVarChar(sql.MAX), data.vendorid);
                }
                if (data.vehicleid) {
                    typesRequest.input('vehicleid', sql.NVarChar(255), data.vehicleid);
                    detailsRequest.input('vehicleid', sql.NVarChar(sql.MAX), data.vehicleid);
                    photoRequest.input('vehicleid', sql.NVarChar(255), data.vehicleid);
                }

                 // Queries
                const typesQuery = data.vehicleid
                    ? 'SELECT * FROM VehicleTypesDetails WHERE vendorid=@vendorid AND vehicleid=@vehicleid'
                    : 'SELECT * FROM VehicleTypesDetails WHERE vendorid=@vendorid';
                const detailsQuery = data.vehicleid
                    // ? `SELECT * FROM VehicleDetailsNew WHERE verify_flag = 'Y' AND vendorid=@vendorid AND vehicleid=@vehicleid`
                    // : `SELECT * FROM VehicleDetailsNew WHERE verify_flag = 'Y' AND vendorid=@vendorid`;
                       ? `SELECT VH.*, V.vehicle_count FROM VehicleDetailsNew VH INNER JOIN Vendor_Details V ON VH.vendorid = V.vendorid WHERE
                      -- verify_flag = 'Y' AND 
                        VH.vendorid=@vendorid AND VH.vehicleid=@vehicleid`
                    : `SELECT VH.*, V.vehicle_count FROM VehicleDetailsNew VH INNER JOIN Vendor_Details V ON VH.vendorid = V.vendorid WHERE 
                    -- verify_flag = 'Y' AND 
                    VH.vendorid=@vendorid`;
                

                // 🛠 Fix: alias vehicle_id to vehicleid
                const photoQuery = data.vehicleid
                    ? 'SELECT vehicle_id AS vehicleid, photo_url, photo_type FROM VehiclePhotos WHERE vehicle_id=@vehicleid'
                    : 'SELECT vehicle_id AS vehicleid, photo_url, photo_type FROM VehiclePhotos';

                const photoPromise = photoQuery ? photoRequest.query(photoQuery) : Promise.resolve({ recordset: [] });

                return Promise.all([
                    typesRequest.query(typesQuery),
                    detailsRequest.query(detailsQuery),
                    photoPromise
                ]);
            })
            .then(([typesResult, detailsResult, photoResult]) => {
                const types = typesResult.recordset;
                const details = detailsResult.recordset;
                const photos = photoResult.recordset || [];

                // Merge results into desired format
                const merged = details.map(detail => {
                    const { vendorid, vehicleid, ...vehicleDetails } = detail;

                    const typeRecord = types.find(t => t.vehicleid === detail.vehicleid) || {};
                    const { vendorid: tVid, vehicleid: tVhid, ...VehicleTypesDetails } = typeRecord;

                    const photoMatch = photos.find(p => String(p.vehicleid) === String(detail.vehicleid));
                    const vehiclePhotos = photoMatch
                        ? (({ vehicleid, ...rest }) => rest)(photoMatch)
                        : null;

                    return {
                        vendorid: data.vendorid,
                        vehicleId: detail.vehicleid,
                        vehicleDetails,
                        // VehicleTypesDetails,
                        // vehiclePhotos
                    };
                });

                resolve({
                    status: '00',
                    message: 'Fetched vehicle data',
                    data: merged
                });
            })
            .catch(error => {
                console.error(`[ERROR]: Get Vehicle Error: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
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
                request.input('employeeid', sql.NVarChar(15), VendorEmployeeDetails.employeeid);

                // Contact Details
                request.input('full_name', sql.NVarChar(255), VendorEmployeeDetails.full_name);
                request.input('contact_No', sql.NVarChar(15), VendorEmployeeDetails.contact_no);
                request.input('alternate_No', sql.NVarChar(15), VendorEmployeeDetails.alternate_no || null);
                request.input('email_id', sql.NVarChar(255), VendorEmployeeDetails.email_id || null);
                request.input('website', sql.NVarChar(255), VendorEmployeeDetails.website || null);
                request.input('designation', sql.NVarChar(255), VendorEmployeeDetails.designation || null);
                request.input('customDesignation', sql.NVarChar(255), VendorEmployeeDetails.customDesignation || null);
                request.input('username', sql.NVarChar(255), VendorEmployeeDetails.username || null);
                request.input('password', sql.NVarChar(255), VendorEmployeeDetails.password || null);
                request.input('employee_count', sql.NVarChar(255), VendorEmployeeDetails.employee_count || null);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('VendorEmployeeUpdate');
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
                request.input('vehicle_count', sql.NVarChar(255), VendorDetails.vehicle_count);
                request.input('employee_count', sql.NVarChar(255), VendorDetails.employee_count);
                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output("userDetails", sql.NVarChar(sql.MAX));

                // Call the stored procedure
                return request.execute('VendorDetailsUpdate');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    userDetails: result.output.userDetails
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
                request.input('gstNo', sql.NVarChar(15), kycDetails.gstNo || null);
                request.input('cinNo', sql.NVarChar(21), kycDetails.cinNo || null);
                request.input('panNo', sql.NVarChar(10), kycDetails.panNo || null);
                request.input('aadharNo', sql.NVarChar(12), kycDetails.aadharNo || null);
                // request.input('aadharNo', sql.NVarChar(12), kycDetails.aadharNo);
                // request.input('cancel_cheque_no', sql.NVarChar(200), kycDetails.cancel_cheque_no);
                // request.input('image_url', sql.NVarChar(255), kycDetails.image_url);
                // request.input('image', sql.NVarChar(255), kycDetails.image);
                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('VendorKYCUpdate');
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

exports.updateVehicleDB = (data) => {
    console.log(`[INFO]: Updating Vehicle record for vendorid: ${data.vendorid}`);

    return new Promise((resolve, reject) => {
        
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // IDs
                request.input('vehicleid', sql.NVarChar(50), data.vehicleid);
                request.input('vendorid', sql.NVarChar(50), data.vendorid);

                // Vehicle details
                request.input('vehicle_weight', sql.NVarChar(50), data.vehicleWeight);
                request.input('registration_no', sql.NVarChar(50), data.registrationNo);
                request.input('vehicle_count', sql.NVarChar(255), data.vehicle_count);

                // request.input('registration_date', sql.DateTime, data.vehicleDetails.registrationDate);
                // request.input('registered_at', sql.NVarChar(255), data.vehicleDetails.registeredAt);
                // request.input('rc_status', sql.NVarChar(50), data.vehicleDetails.rcStatus);
                // request.input('owner_name', sql.NVarChar(255), data.vehicleDetails.ownerName);
                // request.input('father_name', sql.NVarChar(255), data.vehicleDetails.fatherName);
                // request.input('present_address', sql.NVarChar(sql.MAX), data.vehicleDetails.presentAddress);
                // request.input('permanent_address', sql.NVarChar(sql.MAX), data.vehicleDetails.permanentAddress);
                // request.input('mobile_number', sql.NVarChar(50), data.vehicleDetails.mobileNumber);
                // request.input('vehiclecategory', sql.NVarChar(50), data.vehicleDetails.vehicleCategory);
                // request.input('vehicle_category_description', sql.NVarChar(255), data.vehicleDetails.vehicleCategoryDescription);
                // request.input('vehicle_manufacturer', sql.NVarChar(255), data.vehicleDetails.vehicleManufacturer);
                // request.input('maker_model', sql.NVarChar(100), data.vehicleDetails.makerModel);
                // request.input('body_type', sql.NVarChar(100), data.vehicleDetails.bodyType);
                // request.input('fuel_type', sql.NVarChar(50), data.vehicleDetails.fuelType);
                // request.input('manufacturing_date', sql.NVarChar(50), data.vehicleDetails.manufacturingDate);
                // request.input('chassis_number', sql.NVarChar(50), data.vehicleDetails.chassisNumber);
                // request.input('engine_number', sql.NVarChar(50), data.vehicleDetails.engineNumber);
                // request.input('cubic_capacity', sql.NVarChar(50), data.vehicleDetails.cubicCapacity);
                // request.input('vehicle_gross_weight', sql.NVarChar(50), data.vehicleDetails.vehicleGrossWeight);
                // request.input('unladen_weight', sql.NVarChar(50), data.vehicleDetails.unladenWeight);
                // request.input('no_cylinders', sql.NVarChar(10), data.vehicleDetails.noCylinders);
                // request.input('seat_capacity', sql.NVarChar(10), data.vehicleDetails.seatCapacity);
                // request.input('fit_upto', sql.Date, data.vehicleDetails.fitUpto);
                // request.input('insurance_upto', sql.Date, data.vehicleDetails.insuranceUpto);
                // request.input('tax_upto', sql.Date, data.vehicleDetails.taxUpto);
                // request.input('tax_paid_upto', sql.Date, data.vehicleDetails.taxPaidUpto);
                // request.input('pucc_number', sql.NVarChar(50), data.vehicleDetails.puccNumber);
                // request.input('pucc_upto', sql.Date, data.vehicleDetails.puccUpto);
                // request.input('permit_number', sql.NVarChar(50), data.vehicleDetails.permitNumber);
                // request.input('permit_type', sql.NVarChar(100), data.vehicleDetails.permitType);
                // request.input('permit_valid_from', sql.Date, data.vehicleDetails.permitValidFrom);
                // request.input('permit_valid_upto', sql.Date, data.vehicleDetails.permitValidUpto);

                // // Vehicle type details
                // request.input('loadingCapacityGVW', sql.Float, data.VehicleTypesDetails.loadingCapacityGVW);
                // request.input('emptyVehicleWeight', sql.Float, data.VehicleTypesDetails.emptyVehicleWeight);
                // request.input('loadingCapacityCubic', sql.Float, data.vehicleDetails.cubicCapacity);
                // request.input('vehicleType', sql.NVarChar(50), data.VehicleTypesDetails.vehicleType);
                // request.input('vehicle_Category', sql.NVarChar(50), data.VehicleTypesDetails.vehicleCategory);
                // request.input('topRemovable', sql.Bit, data.VehicleTypesDetails.topRemovable);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('VehicleUpdate');

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

exports.deleteVendoremployeeDB = (data) => {
    const { vendorid, employeeid } = data;
    console.log(`[INFO]: Deleting Vendor_employeeDetails record for vendorid: ${vendorid} and employeeid: ${employeeid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid
                request.input('employeeid', sql.NVarChar(255), employeeid); // Bind employeeid
                console.log(`[INFO]: Executing Query - DELETE FROM Vendor_employeeDetails WHERE vendor_id = ${vendorid} AND employeeid = ${employeeid}`);
                return request.query('DELETE FROM Vendor_employeeDetails WHERE vendor_id = @vendorid AND employeeid = @employeeid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Vendor_employeeDetails record deleted successfully for vendorid: ${vendorid} and employeeid: ${employeeid}`);
                    resolve({ message: `Vendor Contact deleted successfully for vendorid: ${vendorid} and employeeid: ${employeeid}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found to delete for vendorid: ${vendorid} and employeeid: ${employeeid}`);
                    resolve({ message: `No records found for vendorid: ${vendorid} and employeeid: ${employeeid}`, status: "01" });
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
    console.log(`[INFO]: Deleting Vendor_Legaldocuments for vendorid: ${vendorid}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid); // Bind vendorid
                console.log(`[INFO]: Executing Query - DELETE FROM Vendor_Legaldocuments WHERE vendorid = ${vendorid}`);
                return request.query('DELETE FROM Vendor_Legaldocuments WHERE vendorid = @vendorid');
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Vendor_Legaldocuments deleted successfully for vendorid: ${vendorid}`);
                    resolve({ message: `Vendor Legaldocuments deleted successfully for vendorid: ${vendorid}`, status: "00" });
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

// exports.deleteVehicleDB = (data) => {
//     const { vendorid, vehicleid } = data;
//     console.log(`[INFO]: Deleting Vehicle record for vendorid: ${vendorid}, vehicleid: ${vehicleid}`);

//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 const request = pool.request();
//                 request.input('vendorid', sql.NVarChar(255), vendorid);
//                 request.input('vehicleid', sql.NVarChar(255), vehicleid);

//                 console.log(`[INFO]: Executing Transactional Delete for VehicleID: ${vehicleid}, VendorID: ${vendorid}`);

//                 return request.query(`
//                     BEGIN TRANSACTION;

//                         -- 1️⃣ Try deleting vehicle mapping
//                         DELETE DVA 
//                         FROM DriverVehicleAssign AS DVA
//                         JOIN VehicleDetailsNew AS VDN ON DVA.VehicleID = VDN.VehicleID
//                         WHERE DVA.IsActive = '0' 
//                           AND DVA.VendorID = @vendorid
//                           AND VDN.VehicleID = @vehicleid;

//                         DECLARE @rows INT = @@ROWCOUNT;

//                         -- 2️⃣ Insert log based on result
//                         IF @rows > 0
//                         BEGIN
//                             INSERT INTO VehicleDeleteLog (VehicleID, VendorID, DeletedBy, Remark)
//                             VALUES (@vehicleid, @vendorid, 'system', 'Vehicle deleted successfully');
//                         END
//                         ELSE
//                         BEGIN
//                             INSERT INTO VehicleDeleteLog (VehicleID, VendorID, DeletedBy, Remark)
//                             VALUES (@vehicleid, @vendorid, 'system', 'No record found for deletion');
//                         END

//                     COMMIT TRANSACTION;
//                 `);
//             })
//             .then(result => {
//                 if (result.rowsAffected[0] > 0) {
//                     console.log(`[SUCCESS]: Vehicle deleted successfully for vehicleid: ${vehicleid}`);
//                     resolve({ message: `Vehicle deleted successfully for vehicleid: ${vehicleid}`, status: "00" });
//                 } else {
//                     console.log(`[INFO]: No records found to delete for vehicleid: ${vehicleid}`);
//                     resolve({ message: `No records found for vehicleid: ${vehicleid}`, status: "01" });
//                 }
//             })
//             .catch(async (error) => {
//                 console.error(`[ERROR]: SQL Error during vehicle delete for vehicleid: ${vehicleid} → ${error.message}`);

//                 // 3️⃣ Log SQL Error into VehicleDeleteLog
//                 try {
//                     const pool2 = await sql.connect(pool);
//                     const req = pool2.request();
//                     req.input('vehicleid', sql.NVarChar(255), vehicleid);
//                     req.input('vendorid', sql.NVarChar(255), vendorid);
//                     req.input('errormsg', sql.NVarChar(255), error.message);

//                     await req.query(`
//                         INSERT INTO VehicleDeleteLog (VehicleID, VendorID, DeletedBy, Remark)
//                         VALUES (@vehicleid, @vendorid, 'system', CONCAT('Error during delete: ', @errormsg));
//                     `);
//                 } catch (logError) {
//                     console.error(`[LOG ERROR]: Failed to log vehicle delete error → ${logError.message}`);
//                 }

//                 reject({ message: 'SQL Error: ' + error.message, status: "01" });
//             });
//     });
// };
exports.deleteVehicleDB = (data) => {
    const { vendorid, vehicleid } = data;
    console.log(`[INFO]: Deleting Vehicle record for vendorid: ${vendorid}, vehicleid: ${vehicleid}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(async pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(255), vendorid);
                request.input('vehicleid', sql.NVarChar(255), vehicleid);

                console.log(`[INFO]: Executing Transactional Delete for VehicleID: ${vehicleid}, VendorID: ${vendorid}`);

                return request.query(`

                    BEGIN TRY
                        BEGIN TRANSACTION;

                        /* 1️⃣ DELETE FROM DriverVehicleAssign */
                        DELETE DVA
                        FROM DriverVehicleAssign AS DVA
                        JOIN VehicleDetailsNew AS VDN ON DVA.VehicleID = VDN.VehicleID
                        WHERE DVA.IsActive = '0'
                          AND DVA.VendorID = @vendorid
                          AND VDN.VehicleID = @vehicleid;

                        DECLARE @assignRows INT = @@ROWCOUNT;

                        /* 2️⃣ DELETE FROM VehicleDetailsNew ONLY IF NOT ASSIGNED ANYWHERE */
                        DELETE FROM VehicleDetailsNew
                        WHERE VehicleID = @vehicleid
                          AND VendorID = @vendorid;

                        DECLARE @vehicleRows INT = @@ROWCOUNT;

                        /* 3️⃣ INSERT LOGS */
                        INSERT INTO VehicleDeleteLog (VehicleID, VendorID, DeletedBy, Remark)
                        VALUES (
                            @vehicleid,
                            @vendorid,
                            'system',
                            CONCAT(
                                'DriverAssignmentDeleted=', @assignRows,
                                ', VehicleDeleted=', @vehicleRows
                            )
                        );

                        COMMIT TRANSACTION;

                        SELECT @assignRows AS assignCount, @vehicleRows AS vehicleCount;

                    END TRY

                    BEGIN CATCH
                        ROLLBACK TRANSACTION;

                        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();

                        INSERT INTO VehicleDeleteLog (VehicleID, VendorID, DeletedBy, Remark)
                        VALUES (@vehicleid, @vendorid, 'system', CONCAT('SQL Transaction Error: ', @ErrorMessage));

                        THROW;
                    END CATCH;
                `);
            })
            .then(result => {
                const assignCount = result.recordset[0].assignCount;
                const vehicleCount = result.recordset[0].vehicleCount;

                if (assignCount > 0 || vehicleCount > 0) {
                    resolve({
                        status: "00",
                        message: `Vehicle delete successful. AssignDeleted=${assignCount}, VehicleDeleted=${vehicleCount}`
                    });
                } else {
                    resolve({
                        status: "01",
                        message: `No record found for vehicleid: ${vehicleid}`
                    });
                }
            })
            .catch(async (error) => {
                console.error(`[ERROR]: Delete Failed → ${error.message}`);

                // 🔥 Log error in VehicleDeleteLog
                try {
                    const pool2 = await sql.connect(pool);
                    const req = pool2.request();
                    req.input('vehicleid', sql.NVarChar(255), vehicleid);
                    req.input('vendorid', sql.NVarChar(255), vendorid);
                    req.input('errormsg', sql.NVarChar(255), error.message);

                    await req.query(`
                        INSERT INTO VehicleDeleteLog (VehicleID, VendorID, DeletedBy, Remark)
                        VALUES (@vehicleid, @vendorid, 'system', CONCAT('Catch Error: ', @errormsg));
                    `);
                } catch (logError) {
                    console.error(`[LOG ERROR]: ${logError.message}`);
                }

                reject({ status: "01", message: 'SQL Error: ' + error.message });
            });
    });
};

exports.deleteDriverDB = (data) => {
    console.log(`[INFO]: Deleting Driver_Details record for driver_id: ${data.driver_id}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('driver_id', sql.NVarChar(255), data.driver_id);
                request.input('vendorid', sql.NVarChar(255), data.vendorid);

                console.log(`[INFO]: Executing delete transaction for driver_id: ${data.driver_id}, vendorid: ${data.vendorid}`);

                return request.query(`
                    BEGIN TRANSACTION;
                        -- Try Deleting
                        DELETE DVA
                        FROM DriverVehicleAssign DVA
                        JOIN Driver_Details DD ON DVA.DriverID = DD.driver_id
                        WHERE DVA.IsActive = '0'
                          AND DVA.DriverID = @driver_id
                          AND DVA.VendorID = @vendorid;

                        DECLARE @rows INT = @@ROWCOUNT;

                        IF @rows > 0
                        BEGIN
                            INSERT INTO DriverDeleteLog (DriverID, VendorID, DeletedBy, Remark)
                            VALUES (@driver_id, @vendorid, 'system', 'Driver deleted successfully');
                        END
                        ELSE
                        BEGIN
                            INSERT INTO DriverDeleteLog (DriverID, VendorID, DeletedBy, Remark)
                            VALUES (@driver_id, @vendorid, 'system', 'No record found for deletion');
                        END
                    COMMIT TRANSACTION;
                `);
            })
            .then(result => {
                if (result.rowsAffected[0] > 0) {
                    console.log(`[SUCCESS]: Driver deleted successfully for driver_id: ${data.driver_id}`);
                    resolve({ message: `Driver deleted successfully for driver_id: ${data.driver_id}`, status: "00" });
                } else {
                    console.log(`[INFO]: No records found for driver_id: ${data.driver_id}`);
                    resolve({ message: `No records found for driver_id: ${data.driver_id}`, status: "01" });
                }
            })
            .catch(async error => {
                console.error(`[ERROR]: SQL Error during delete for driver_id: ${data.driver_id} → ${error.message}`);

                // Log error in DriverDeleteLog table
                try {
                    const pool2 = await sql.connect(pool);
                    const req = pool2.request();
                    req.input('driver_id', sql.NVarChar(255), data.driver_id);
                    req.input('vendorid', sql.NVarChar(255), data.vendorid);
                    req.input('errormsg', sql.NVarChar(255), error.message);

                    await req.query(`
                        INSERT INTO DriverDeleteLog (DriverID, VendorID, DeletedBy, Remark)
                        VALUES (@driver_id, @vendorid, 'system', CONCAT('Error during delete: ', @errormsg));
                    `);
                } catch (logError) {
                    console.error(`[LOG ERROR]: Failed to log delete error → ${logError.message}`);
                }

                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
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
                        WHERE VendorID = @vendorId
                        -- AND verify_flag ='N'
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

exports.checkMobileNoDB = (mobileNo) => {
    console.log(`[INFO]: Checking existence of mobileNo in all tables: ${mobileNo}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('mobileNo', sql.NVarChar(20), mobileNo);

                const query = `
                    SELECT 'Vendor_Details' AS SourceTable 
                    FROM Vendor_Details 
                    WHERE mobileNo = @mobileNo

                    UNION ALL

                    SELECT 'Driver_Details' AS SourceTable 
                    FROM Driver_Details 
                    WHERE Phone = @mobileNo

                    UNION ALL

                    SELECT 'Vendor_employeeDetails' AS SourceTable 
                    FROM Vendor_employeeDetails 
                    WHERE contact_no = @mobileNo;
                `;

                console.log(`[INFO]: Executing Multi-Table Mobile Check Query`);

                return request.query(query);
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    // Found in at least one table
                    const tables = result.recordset.map(row => row.SourceTable);

                    console.log(`[INFO]: Mobile number ${mobileNo} found in tables: ${tables.join(", ")}`);

                    resolve({
                        exists: true,
                        tables: tables,
                        message: `Mobile number already exists in: ${tables.join(", ")}`,
                        status: "00"
                    });
                } else {
                    // Not found anywhere
                    console.log(`[INFO]: Mobile number ${mobileNo} does NOT exist in any table`);

                    resolve({
                        exists: false,
                        tables: [],
                        message: `Mobile number ${mobileNo} does not exist in any table`,
                        status: "00"
                    });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: MobileNo Check Error: ${error.message}`);
                reject({ 
                    status: "01",
                    message: "SQL Error: " + error.message 
                });
            });
    });
};

exports.VendorOnboardingUpdateDB = (data, vendorid, VendorEmployeeDetails, vehicle_Details) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                // Create a TVP (table-valued parameter)
                // Employee TVP
                const tvp = new sql.Table();
                // tvp.columns.add('employeeid', sql.NVarChar(100));
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
                        // cd.employeeid,
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
                VCL.columns.add('vehicle_weight', sql.NVarChar(50));    

                vehicle_Details.forEach(cd => {
                    VCL.rows.add(cd.vehicle_number, cd.vehicle_weight);
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
                request.input('employee_count', sql.NVarChar(255), data.VendorDetails.employee_count);

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
                return request.execute('VendorOnboarding_Update');
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

//********************   */

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

