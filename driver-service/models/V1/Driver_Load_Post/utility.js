const sql = require('mssql');
const pool = require('../../../db/db');
const  logger  = require('../../../log/logger');

exports.InsertdriverloadpostDB = async (data, LoadPost_ID, driverdata) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('LoadPostID', sql.NVarChar(10), LoadPost_ID);
                request.input('DriverID', sql.NVarChar(10), data.driverID);
                request.input('VendorID', sql.NVarChar(10), data.vendorid);

                request.input('driverMobile', sql.NVarChar(100), data.driverMobile);
                request.input('Origin', sql.NVarChar(sql.MAX), data.origin.address);
                request.input('DriverStatus', sql.NVarChar(100), data.DriverStatus || null);
                request.input('VehicleNumber', sql.NVarChar(100), data.vehicleNumber || driverdata.data[0].registration_no);
                request.input('VehicleType', sql.NVarChar(100), data.vehicleType || driverdata.data[0].VehicleType);
                request.input('VehicleStatus', sql.NVarChar(100), data.vehicleStatus || driverdata.data[0].VehicleStatus);
                request.input('reportingTime', sql.DateTime, data.reportingTime);
                request.input('ExpectedAvailableTime', sql.DateTime, data.ExpectedAvailableTime);

                request.input('Origin_Lat', sql.Decimal(9, 6), data.origin.coordinates.lat || driverdata.data[0].Lat);
                request.input('Origin_Lng', sql.Decimal(9, 6), data.origin.coordinates.lng || driverdata.data[0].Lng);
                request.input('Origin_City', sql.NVarChar(100), data?.origin?.components?.place ?? driverdata?.data?.[0]?.City ?? null);
                request.input('Origin_District', sql.NVarChar(100), data?.origin?.components?.dist || driverdata?.data?.[0]?.District || null);
                request.input('Origin_Taluka', sql.NVarChar(100), data?.origin?.components?.tal || driverdata?.data?.[0]?.Taluka || null);
                request.input('Origin_State', sql.NVarChar(100), data?.origin?.components?.state || driverdata?.data?.[0]?.State || null);
                request.input('Origin_Pincode', sql.NVarChar(10), data?.origin?.components?.pincode || driverdata?.data?.[0]?.Pincode || null);
                request.input('cost', sql.NVarChar(50), data.cost);

                // request.input('Destination_Lat', sql.Decimal(9,6), data.destination.coordinates.lat);
                // request.input('Destination_Lng', sql.Decimal(9,6), data.destination.coordinates.lng);
                // request.input('Destination_City', sql.NVarChar(100), data.destination.components.place);
                // request.input('Destination_District', sql.NVarChar(100), data.destination.components.dist);
                // request.input('Destination_Taluka', sql.NVarChar(100), data.destination.components.tal);
                // request.input('Destination_State', sql.NVarChar(100), data.destination.components.state);
                // request.input('Destination_Pincode', sql.NVarChar(10), data.destination.components.pincode);
                request.input("Routes", sql.NVarChar, JSON.stringify(data.routes));

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('DriverLoadPostInsert');
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

exports.updatedriverloadpostDB = async (data, driverdata) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('LoadPostID', sql.VarChar(10), data.LoadPostID);
                request.input('DriverID', sql.VarChar(10), data.driverID);
                request.input('VendorID', sql.VarChar(10), data.vendorid);

                request.input('driverMobile', sql.VarChar(10), data.driverMobile);
                request.input('Origin', sql.VarChar(100), data.origin.address);
                request.input('VehicleNumber', sql.VarChar(50), data.vehicleNumber || driverdata.data[0].registration_no);
                request.input('VehicleType', sql.VarChar(100), data.vehicleType || driverdata.data[0].VehicleType);
                request.input('VehicleStatus', sql.VarChar(50), data.vehicleStatus || driverdata.data[0].VehicleStatus);
                request.input('reportingTime', sql.DateTime, data.reportingTime);
                request.input('ExpectedAvailableTime', sql.DateTime, data.ExpectedAvailableTime);

                request.input('Origin_Lat', sql.Decimal(9, 6), data.origin.coordinates.lat || driverdata.data[0].Lat);
                request.input('Origin_Lng', sql.Decimal(9, 6), data.origin.coordinates.lng || driverdata.data[0].Lng);
                request.input('Origin_City', sql.VarChar(100), data.origin.components.place || driverdata.data[0].City);
                request.input('Origin_District', sql.VarChar(100), data.origin.components.dist || driverdata.data[0].District);
                request.input('Origin_Taluka', sql.VarChar(100), data.origin.components.tal || driverdata.data[0].Taluka);
                request.input('Origin_State', sql.VarChar(100), data.origin.components.state || driverdata.data[0].State);
                request.input('Origin_Pincode', sql.VarChar(10), data.origin.components.pincode || driverdata.data[0].Pincode);
                request.input('cost', sql.NVarChar(50), data.cost);

                request.input('Routes', sql.NVarChar(sql.MAX), JSON.stringify(data.routes));


                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('DriverLoadPostUpdate');
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

exports.getdriverloadpostDB = (data) => {
    console.log(`[INFO]: Fetching driver load posts : ${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(poolConn => {
                const request = poolConn.request();
                request.input('LoadPostID', sql.NVarChar(255), data.LoadPostID);

                let mainQuery = `
                    SELECT 
                        dlp.*,
                        dvr.*,
                        dla.*
                    FROM DriverLoadPost AS dlp
                    JOIN DriverVehicleRoutes AS dvr
                        ON dlp.DriverID = dvr.DriverID
                        AND dlp.VendorID = dvr.VendorID
                        AND dlp.LoadPostID = dvr.LoadPost_ID
                    JOIN DriverLoadPostAddress AS dla
                        ON dlp.LoadPostID = dla.LoadPostID
                `;

                if (data.LoadPostID) {
                    mainQuery += ` WHERE dlp.LoadPostID = @LoadPostID`;
                }

                console.log(`[INFO]: Executing main driver load post query`);
                return request.query(mainQuery)
                    .then(mainResult => {
                        if (mainResult.recordset.length === 0) {
                            console.log(`[INFO]: No records found for getdriverloadpost`);
                            resolve({ status: "01", message: "No records found for getdriverloadpost", data: [] });
                            return;
                        }

                        console.log(`[INFO]: Fetching pincodes for routes...`);

                        // Fetch all pincodes in parallel
                        const promises = mainResult.recordset.map(row => {
                            const pinReq = poolConn.request();
                            pinReq.input('State', sql.NVarChar(255), row.State);
                            pinReq.input('Region', sql.NVarChar(255), row.Region);
                            pinReq.input('District', sql.NVarChar(255), row.District);

                            const pinQuery = `
                                SELECT TOP 1 *
                                FROM pincode
                                WHERE state = @State
                                  AND region = @Region
                                  AND district = @District
                                ORDER BY pincode ASC;
                            `;

                            return pinReq.query(pinQuery).then(pinResult => {
                                row.PincodeInfo = pinResult.recordset.length ? pinResult.recordset[0] : null;
                                return row;
                            });
                        });

                        return Promise.all(promises)
                            .then(finalRows => {
                                console.log(`[SUCCESS]: getdriverloadpost found with pincode info` + JSON.stringify(finalRows));
                                resolve({ status: "00", message: "getdriverloadpost records found", data: finalRows });
                            });
                    });
            })
            .catch(error => {
                console.error(`[ERROR]: getdriverloadpost Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};

exports.deletedriverloadpostDB = async (data) => {
    return new Promise(async (resolve, reject) => {
        let transaction;
        try {
            const poolConn = await sql.connect(pool);
            transaction = new sql.Transaction(poolConn);

            await transaction.begin();

            const request = new sql.Request(transaction);
            request.input('LoadPostID', sql.NVarChar(255), data.LoadPostID);

            // Step 1: Delete from first table
            await request.query('DELETE FROM driverLoadPost WHERE LoadPostID = @LoadPostID');

            // Step 2: Delete from second table
            await request.query('DELETE FROM DriverVehicleRoutes WHERE LoadPost_ID = @LoadPostID');

            // Commit transaction
            await transaction.commit();

            resolve({
                status: "00",
                message: "Driver load post and related records deleted successfully"
            });

        } catch (err) {
            logger.log("error", `deletedriverloadpostDB Error: ${err.message}`);

            // Rollback if error occurs
            if (transaction && transaction.rollback) {
                await transaction.rollback();
            }

            reject({
                status: "01",
                message: "SQL Error: " + err.message
            });
        }
    });
};


exports.getdriverlocationbymobileDB = async (MobileNo ,vendorid) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                    request.input('vendorid', sql.NVarChar(100), vendorid);

                let query = `
                    SELECT 
                        dva.DriverID,
                        dva.VendorID,
                        d.full_name,
                        d.Phone,
                        dva.MobileNo,
                        dva.VehicleID,
                        v.registration_no,
                        v.VehicleType,
                        dva.AssignmentDate,
                        dll.Status,
                        dll.Lat,
                        dll.Lng,
                        dll.City,
                        dll.District,
                        dll.Taluka,
                        dll.State,
                        dll.Pincode,
                        dll.Address,
                        dll.insert_date,
                        dll.update_date
                    FROM DriverVehicleAssign AS dva
                    JOIN Driver_Details AS d ON d.driver_id = dva.DriverID
                    JOIN VehicleDetailsNew AS v ON v.vehicleid = dva.VehicleID
                    JOIN DriverLiveLocation AS dll ON dll.DriverID = d.driver_id
                    WHERE dll.Status = 'Online'  
                      AND dva.VendorID = @vendorid
                      AND dll.Driver_LPStatus = 'Inactive'
                      AND dva.IsActive = 1
                `;

                if (MobileNo && MobileNo.trim() !== "") {
                    request.input('MobileNo', sql.NVarChar(100), MobileNo);
                    query += " AND d.Phone = @MobileNo";
                }

                query += " ORDER BY dva.update_date DESC, dva.insert_date DESC";

                return request.query(query);
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    resolve({ status: "00", message: "Records found", data: result.recordset });
                } else {
                    resolve({ status: "02", message: "No records found", data: [] });
                }
            })
            .catch(err => {
                logger.log("error", `get driver location by mobile DB Error: ${err.message}`);
                reject({ status: "99", message: "Internal server error" });
            });
    });
};

exports.InsertDriverVehicleAssignDB = async (data, AssignID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('AssignID', sql.NVarChar(50), AssignID);
                request.input('DriverID', sql.NVarChar(50), data.DriverID);
                request.input('VendorID', sql.NVarChar(50), data.VendorID);
                request.input('VehicleID', sql.NVarChar(50), data.VehicleID);

                // request.input('MobileNo', sql.NVarChar(500), data.MobileNo);
                // request.input('Lat', sql.Decimal(9, 6), data.Lat);
                // request.input('Lng', sql.Decimal(9, 6), data.Lng);
                // request.input('City', sql.NVarChar(500), data.City);
                // request.input('District', sql.NVarChar(500), data.District);
                // request.input('Taluka', sql.NVarChar(500), data.Taluka);
                // request.input('State', sql.NVarChar(500), data.State);
                // request.input('Pincode', sql.NVarChar(50), data.Pincode);
                // request.input('Address', sql.NVarChar(255), data.Address);

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('DriverVehicleAssignInsert');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    data: result.recordset
                };
                resolve(output);
            })
            .catch(err => {
                logger.log("error", `InsertDriverVehicleAssignDB Error: ${err.message}`);
                reject({ status: "99", message: "Internal server error" });
            });
    });
};

exports.updateDriverVehicleAssignDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('AssignID', sql.NVarChar(50), data.AssignID);
                request.input('DriverID', sql.NVarChar(50), data.DriverID);
                request.input('VendorID', sql.NVarChar(50), data.VendorID);
                // request.input('MobileNo', sql.NVarChar(500), data.MobileNo);
                request.input('VehicleID', sql.NVarChar(50), data.VehicleID);
                // request.input('Lat', sql.Decimal(9, 6), data.Lat);
                // request.input('Lng', sql.Decimal(9, 6), data.Lng);
                // request.input('City', sql.NVarChar(500), data.City);
                // request.input('District', sql.NVarChar(500), data.District);
                // request.input('Taluka', sql.NVarChar(500), data.Taluka);
                // request.input('State', sql.NVarChar(500), data.State);
                // request.input('Pincode', sql.NVarChar(50), data.Pincode);
                // request.input('Address', sql.NVarChar(255), data.Address);

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));

                // Call the stored procedure
                return request.execute('DriverVehicleAssignUpdate');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc
                };
                resolve(output);
            })
            .catch(err => {
                logger.log("error", `updateDriverVehicleAssignDB Error: ${err.message}`);
                reject({ status: "99", message: "Internal server error" });
            });
    });
};

exports.getDriverVehicleAssignDB = async (data) => {
    try {
        console.log("📥 Incoming Payload:", data);

        // ✅ Step 1: Vendor check
        if (!data?.VendorID) {
            console.log("❌ Missing VendorID");
            return { bstatus_code: "01", bmessage_desc: "VendorID is required", data: [] };
        }

        const poolConn = await sql.connect(pool);
        const request = poolConn.request();

        // ✅ Step 2: Inputs
        // Handle verify_flag cleanly (null if not provided or blank)
        let verifyFlag = null;
        if (data.verify_flag && data.verify_flag.trim() !== '') {
            verifyFlag = data.verify_flag.trim();
        }

        console.log("🧾 Using Parameters:", { VendorID: data.VendorID, verifyFlag });

        request.input('VendorID', sql.NVarChar(50), data.VendorID);
        request.input('verify_flag', sql.NVarChar(50), verifyFlag);

        // ✅ Step 3: Query (LEFT JOIN ensures data even if vehicle/driver partially missing)
        const query = `
                                     SELECT 
                             dva.AssignID,
                             dva.DriverID,
                             dva.VendorID,
                             d.full_name AS DriverName,
                             d.Phone AS DriverPhone,
                             dva.MobileNo,
                             dva.VehicleID,
                             v.registration_no AS VehicleNumber,
                             v.VehicleType,
                             dva.AssignmentDate,
                             dva.insert_date,
                             dva.update_date,
                             v.verify_flag,
                             v.rc_status,
                             d.expiry_date,
                             dva.IsActive
                         FROM DriverVehicleAssign AS dva
                         LEFT JOIN Driver_Details AS d 
                             ON d.driver_id = dva.DriverID 
                            AND d.VendorID = dva.VendorID
                         LEFT JOIN VehicleDetailsNew AS v 
                             ON v.VehicleID = dva.VehicleID 
                            AND v.VendorID = dva.VendorID
                         WHERE dva.VendorID = @VendorID
                           AND (
                                 @verify_flag IS NULL
                              OR LTRIM(RTRIM(@verify_flag)) = ''
                              OR (
                                   (@verify_flag = 'Y' AND dva.IsActive = 1)
                                OR (@verify_flag = 'N' AND dva.IsActive = 0)
                              )
                           )
                         ORDER BY dva.update_date ASC, dva.insert_date ASC;
        `;

        console.log("🚀 Running Query...");
        const result = await request.query(query);

        console.log("✅ SQL executed, rows:", result?.recordset?.length);

        if (result.recordset.length > 0) {
            console.log("📦 Data Example:", result.recordset[0]);
            return { bstatus_code: "00", bmessage_desc: "Records found", data: result.recordset };
        } else {
            console.log("⚠️ No records found");
            return { bstatus_code: "01", bmessage_desc: "No records found", data: [] };
        }

    } catch (err) {
        console.error("💥 getDriverVehicleAssignDB Error:", err.message);
        logger.log("error", `getDriverVehicleAssignDB Error: ${err.message}`);
        return { status: "99", message: "Internal server error" };
    }
};

exports.deleteDriverVehicleAssignDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('DriverID', sql.NVarChar(50), data.DriverID);
                request.input('VendorID', sql.NVarChar(50), data.VendorID);
                request.input('VehicleID', sql.NVarChar(50), data.VehicleID);
                return request.query(`DELETE FROM DriverVehicleAssign WHERE DriverID = @DriverID and VendorID = @VendorID and VehicleID = @VehicleID`);
            })
            .then(result => {
                if (result.rowsAffected > 0) {
                    resolve({ bstatus_code: "00", bmessage_desc: "Record deleted successfully" });
                } else {
                    resolve({ bstatus_code: "01", bmessage_desc: "No record found to delete" });
                }
            })
            .catch(err => {
                logger.log("error", `deleteDriverVehicleAssignDB Error: ${err.message}`);
                reject({ status: "99", message: "Internal server error" });
            });
    });
};

// Get Nearest Drivers for Load Post
exports.getNearestDriversDB = (data) => {
    console.log(`[INFO]: Fetching getNearestDrivers for LoadPostID: ${data.LoadPostID}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // ✅ Add input parameter for LoadPostID
                request.input('LoadPostID', sql.NVarChar, data.LoadPostID);

                // Queries
                const NearestDrivers = `DECLARE 
                                        @OriginLat DECIMAL(9,6),
                                        @OriginLng DECIMAL(9,6),
                                        @VehicleType NVARCHAR(100),
                                        @MaxKm INT;
                                    
                                    -- 1. Fetch customer origin & vehicle type
                                    SELECT
                                        @OriginLat = cla.Origin_Lat,
                                        @OriginLng = cla.Origin_Lng,
                                        @VehicleType = clp.VehicleType
                                    FROM CustomerLoadPost clp
                                    JOIN CustomerLoadPostAddress cla
                                        ON clp.LoadPostID = cla.LoadPostID
                                    WHERE clp.LoadPostID = @LoadPostID ; --  'LP499981';
                                    
                                    -- 2. Set MaxKm by Vehicle Type
                                    SET @MaxKm = CASE
                                                    WHEN @VehicleType = 'Mini' THEN 30
                                                    WHEN @VehicleType = 'Light' THEN 1000
                                                    WHEN @VehicleType = 'Medium' THEN 500
                                                    WHEN @VehicleType = 'Multi Axle' THEN 2000
                                                    ELSE 8000
                                                END;
                                    
                                    -- 3. Final Nearest Drivers
                                    ;WITH DriverDistances AS (
                                        SELECT
                                            dva.DriverID,
                                            dva.VehicleID,
                                            dva.VendorID,
                                            dva.MobileNo,
                                            dva.AssignmentDate,
                                            dll.Status,
                                            dll.Lat AS Driver_Origin_Lat,
                                            dll.Lng AS Driver_Origin_Lng,
                                            dll.City,
                                            dll.District,
                                            dll.Taluka,
                                            dll.State,
                                            dll.Pincode,
                                            dll.Address,
                                            CAST(
                                                6371 * ACOS(
                                                    COS(RADIANS(@OriginLat)) * COS(RADIANS(dll.Lat)) *
                                                    COS(RADIANS(dll.Lng) - RADIANS(@OriginLng)) +
                                                    SIN(RADIANS(@OriginLat)) * SIN(RADIANS(dll.Lat))
                                                ) AS DECIMAL(10,2)
                                            ) AS DistanceInKm
                                        FROM DriverVehicleAssign dva
                                        JOIN DriverLiveLocation dll ON dll.DriverID = dva.DriverID
                                       -- JOIN Vehicle v ON dva.VehicleID = v.VehicleID  -- uncomment if you want vehicle type filter
                                        WHERE dll.Lat IS NOT NULL 
                                          AND dll.Lng IS NOT NULL
                                          -- AND v.VehicleType = @VehicleType   -- ✅ if filtering by type
                                          AND dva.IsActive = 1
                                    )
                                    SELECT TOP 10 *
                                    FROM DriverDistances
                                    WHERE DistanceInKm <= @MaxKm
                                    -- ORDER BY DistanceInKm ASC;  -- ASC for nearest first
                                    
                                        ORDER BY DistanceInKm DESC;
`;

                const CustomerPost = `
                    SELECT 
                        clp.LoadPostID AS Customer_LoadPostID,
                        cla.Origin_Lat AS Customer_Origin_Lat ,
                        cla.Origin_Lng AS Customer_Origin_Lng,
                        cla.Destination_Lat  AS Customer_Destination_Lat,
                        cla.Destination_Lng  AS Customer_Destination_Lng
                    FROM CustomerLoadPost clp 
                    JOIN CustomerLoadPostAddress cla
                        ON cla.LoadPostID = clp.LoadPostID
                    WHERE clp.LoadPostID = @LoadPostID;
                `;

                // Run both queries on the same request
                return Promise.all([
                    request.query(NearestDrivers),
                    request.query(CustomerPost)
                ]);
            })
            .then(([NearestDrivers, CustomerPost]) => {
                const NearestDriversdetails = NearestDrivers.recordset || [];
                const CustomerPostdetails = CustomerPost.recordset || [];
                const CustomerPostRow = CustomerPostdetails[0] || {};

                const merged = NearestDriversdetails.map(detail => {
                    return {
                        ...detail,
                        Customer_LoadPostID: CustomerPostRow.Customer_LoadPostID,
                        Customer_Origin_Lat: CustomerPostRow.Customer_Origin_Lat,
                        Customer_Origin_Lng: CustomerPostRow.Customer_Origin_Lng,
                        Customer_Destination_Lat: CustomerPostRow.Customer_Destination_Lat,
                        Customer_Destination_Lng: CustomerPostRow.Customer_Destination_Lng
                    };
                });
       //         console.log(`[SUCCESS]: Fetched NearestDrivers data: ${JSON.stringify(merged)}`);

                resolve({
                    status: '00',
                    message: 'Fetched NearestDrivers data',
                    data: merged
                });
            })
            .catch(error => {
                console.error(`[ERROR]: SQL Error: ${error.message}`);
                reject({ status: '99', message: error.message });
            });
    });
};

// ✅ Get Driver or Vehicle Assignment Data
exports.getDriverAvailableDB = async (data) => {
    return new Promise((resolve, reject) => {
        const { vendorId } = data;

        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";


                request.input("vendorId", sql.VarChar, vendorId);
                query = `
                    SELECT d.vendorid, d.driver_id, d.full_name AS DriverName, d.Phone AS MobileNo ,d.driving_license_no, d.expiry_date
                        FROM Driver_Details d
                        WHERE
                         d.VendorID = @vendorId
                          AND
                           d.driver_id NOT IN (
                             SELECT DriverID FROM DriverVehicleAssign WHERE status = 'Active' AND IsActive = 1
                        --   SELECT DriverID FROM DriverLiveLocation WHERE status = 'Available' and  Driver_LPStatus = 'Inactive'
                          )
                        ORDER BY d.full_name;
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


exports.getVehicleAvailableDB = async (data) => {
    return new Promise((resolve, reject) => {
        const { vendorId } = data;

        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                let query = "";


                request.input("vendorId", sql.VarChar, vendorId);

                query = `
                        SELECT v.VendorID ,v.vehicleid, v.registration_no AS VehicleNumber, v.maker_model AS VehicleType
                        FROM VehicleDetailsNew v
                        WHERE v.VendorID = @vendorId
                          AND v.verify_flag = 'Y'
                          AND v.VehicleID NOT IN (
                              SELECT VehicleID FROM DriverVehicleAssign WHERE status = 'Active' AND IsActive = 1
                          )
                        ORDER BY v.registration_no;
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
