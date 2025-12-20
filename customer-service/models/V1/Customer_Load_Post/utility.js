const sql = require('mssql');
const pool = require('../../../db/db.js');
const logger = require('../../../log/logger');

exports.InsertcustomerloadpostDB = async (data, LoadPost_ID) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('LoadPostID', sql.NVarChar(10), LoadPost_ID);
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID);

                request.input('Origin', sql.NVarChar(sql.MAX), data.origin.address);
                request.input('Origin_1', sql.NVarChar(sql.MAX), data.Origin_1);
                request.input('Origin_2', sql.NVarChar(sql.MAX), data.Origin_2);
                request.input('ContactPerson', sql.NVarChar(sql.MAX), data.ContactPerson);
                request.input('ContactNumber', sql.NVarChar(sql.MAX), data.ContactNumber);

                request.input('Destination', sql.NVarChar(sql.MAX), data.destination.address);
                request.input('Destination_1', sql.NVarChar(sql.MAX), data.Destination_1);
                request.input('Destination_2', sql.NVarChar(sql.MAX), data.Destination_2);
                request.input('ConsigneeName', sql.NVarChar(sql.MAX), data.ConsigneeName);
                request.input('ConsigneeContactNumber', sql.NVarChar(sql.MAX), data.ConsigneeContactNumber);

                request.input('VehicleType', sql.NVarChar(100), data.VehicleType);
                request.input('Weight', sql.NVarChar(100), data.Weight);
                request.input('cost', sql.NVarChar(50), data.cost);
                request.input('BodyType', sql.NVarChar(50), data.BodyType);
                request.input('CargoContent', sql.NVarChar(100), data.CargoContent);
                request.input('CargoPackageType', sql.NVarChar(100), data.CargoPackageType);
                request.input('ExpectedAvailableTime', sql.NVarChar(100), data.ExpectedAvailableTime);
                request.input('Approximate_weight', sql.NVarChar(100), data.Approximate_weight);
                request.input('cargo_type', sql.NVarChar(100), data.cargo_type);
                request.input('PickupType', sql.NVarChar(100), data.PickupType);

                request.input('Origin_Lat', sql.Decimal(9, 6), data.origin.coordinates.lat);
                request.input('Origin_Lng', sql.Decimal(9, 6), data.origin.coordinates.lng);
                request.input('Origin_City', sql.NVarChar(100), data.origin.components.place);
                request.input('Origin_District', sql.NVarChar(100), data.origin.components.dist);
                request.input('Origin_Taluka', sql.NVarChar(100), data.origin.components.tal);
                request.input('Origin_State', sql.NVarChar(100), data.origin.components.state);
                request.input('Origin_Pincode', sql.NVarChar(10), data.origin.components.pincode);

                request.input('Destination_Lat', sql.Decimal(9, 6), data.destination.coordinates.lat);
                request.input('Destination_Lng', sql.Decimal(9, 6), data.destination.coordinates.lng);
                request.input('Destination_City', sql.NVarChar(100), data.destination.components.place);
                request.input('Destination_District', sql.NVarChar(100), data.District ||  data.destination.components.dist);
                request.input('Destination_Taluka', sql.NVarChar(100), data.Taluka || data.destination.components.tal);
                request.input('Destination_State', sql.NVarChar(100), data.state || data.destination.components.state);
                request.input('Destination_Pincode', sql.NVarChar(10), data.Pincode || data.destination.components.pincode);

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('CustomerDetails', sql.NVarChar(sql.MAX)); // Assuming this is a JSON string
                // nearestDriversJson: result.output.NearestDrivers


                // Call the stored procedure
                return request.execute('InsertCustomerLoadPost');
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

exports.updatecustomerloadpostDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID || data);

                request.input('Origin', sql.NVarChar(sql.MAX), data.origin.address);
                request.input('Destination', sql.NVarChar(sql.MAX), data.destination.address);
                request.input('VehicleType', sql.NVarChar(100), data.VehicleType);
                request.input('Weight', sql.NVarChar(100), data.Weight);
                request.input('cost', sql.NVarChar(50), data.cost);
                request.input('BodyType', sql.NVarChar(50), data.BodyType);
                request.input('CargoContent', sql.NVarChar(100), data.CargoContent);
                request.input('CargoPackageType', sql.NVarChar(100), data.CargoPackageType);
                request.input('ExpectedAvailableTime', sql.NVarChar(100), data.ExpectedAvailableTime);
                request.input('Approximate_weight', sql.NVarChar(100), data.Approximate_weight);
                request.input('cargo_type', sql.NVarChar(100), data.cargo_type);
                request.input('PickupType', sql.NVarChar(100), data.PickupType);

                request.input('Origin_Lat', sql.Decimal(9, 6), data.origin.coordinates.lat);
                request.input('Origin_Lng', sql.Decimal(9, 6), data.origin.coordinates.lng);
                request.input('Origin_City', sql.NVarChar(100), data.origin.components.place);
                request.input('Origin_District', sql.NVarChar(100), data.origin.components.dist);
                request.input('Origin_Taluka', sql.NVarChar(100), data.origin.components.tal);
                request.input('Origin_State', sql.NVarChar(100), data.origin.components.state);
                request.input('Origin_Pincode', sql.NVarChar(10), data.origin.components.pincode);

                request.input('Destination_Lat', sql.Decimal(9, 6), data.destination.coordinates.lat);
                request.input('Destination_Lng', sql.Decimal(9, 6), data.destination.coordinates.lng);
                request.input('Destination_City', sql.NVarChar(100), data.destination.components.place);
                request.input('Destination_District', sql.NVarChar(100), data.destination.components.dist);
                request.input('Destination_Taluka', sql.NVarChar(100), data.destination.components.tal);
                request.input('Destination_State', sql.NVarChar(100), data.destination.components.state);
                request.input('Destination_Pincode', sql.NVarChar(10), data.destination.components.pincode);

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));
                request.output('NearestDrivers', sql.NVarChar(sql.MAX)); // Assuming this is a JSON string
                // nearestDriversJson: result.output.NearestDrivers

                // Call the stored procedure
                return request.execute('UpdateCustomerLoadPost');
            })
            .then(result => {
                const output = {
                    bstatus_code: result.output.bstatus_code,
                    bmessage_desc: result.output.bmessage_desc,
                    NearestDriversJson: result.output.NearestDrivers

                };
                resolve(output);
            })
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

exports.getcustomerloadpostDB = async (data) => {
  //  console.log(`[INFO]: Fetching customer load posts : ${JSON.stringify(data)}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('LoadPostID', sql.NVarChar(255), data.LoadPostID);
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID || data);

                console.log(`[INFO]: Executing Query - SELECT * FROM CustomerLoadPost`);
                if (!data.LoadPostID) {
                    return request.query(`SELECT 
                                                clp.LoadPostID,
                                                clp.CustomerID,
                                                clp.Origin,
                                                clp.Destination,
                                                clp.VehicleType,
                                                clp.Weight,
                                                clp.verify_flag,
                                                clp.verification_code,
                                                cps.LP_Status,
                                                clp.BodyType,
                                                clp.CargoContent,
                                                clp.CargoPackageType,
                                                clp.ExpectedAvailableTime,
                                                clp.insert_date AS PostInsertDate,
                                                clp.update_date AS PostUpdateDate,
                                                clp.Approximate_weight,
                                                clp.PickupType,
                                            
                                                cla.Origin_Lat,
                                                cla.Origin_Lng,
                                                cla.Origin_City,
                                                cla.Origin_District,
                                                cla.Origin_Taluka,
                                                cla.Origin_State,
                                                cla.Origin_Pincode,
                                                cla.Destination_Lat,
                                                cla.Destination_Lng,
                                                cla.Destination_City,
                                                cla.Destination_District,
                                                cla.Destination_Taluka,
                                                cla.Destination_State,
                                                cla.Destination_Pincode,
                                                cla.insert_date AS AddressInsertDate,
                                                cla.update_date AS AddressUpdateDate
                                            FROM [MOTO_HELP_DB].[dbo].[CustomerLoadPost] clp
                                            JOIN [MOTO_HELP_DB].[dbo].[CustomerLoadPostAddress] cla
                                                ON clp.LoadPostID = cla.LoadPostID 
                                            JOIN CustomerPostStatus cps
                                                    ON clp.LoadPostID = cps.CustomerPostID
                                            where cps.LP_Status = 'Pending' 
                                            AND clp.CustomerID = @CustomerID
                                     --       AND cps.customerpostid = @LoadPostID
                                            ORDER BY clp.insert_date DESC;
                                                `);

                } else {
                    return request.query(`SELECT
                                                clp.LoadPostID,
                                                clp.CustomerID,
                                                clp.Origin,
                                                clp.Destination,
                                                clp.VehicleType,
                                                clp.Weight,
                                                clp.verify_flag,
                                                clp.verification_code,
                                                cps.LP_Status,
                                                clp.BodyType,
                                                clp.CargoContent,
                                                clp.CargoPackageType,
                                                clp.ExpectedAvailableTime,
                                                clp.insert_date AS PostInsertDate,
                                                clp.update_date AS PostUpdateDate,
                                                clp.Approximate_weight,
                                                clp.PickupType,
                                            
                                                cla.Origin_Lat,
                                                cla.Origin_Lng,
                                                cla.Origin_City,
                                                cla.Origin_District,
                                                cla.Origin_Taluka,
                                                cla.Origin_State,
                                                cla.Origin_Pincode,
                                                cla.Destination_Lat,
                                                cla.Destination_Lng,
                                                cla.Destination_City,
                                                cla.Destination_District,
                                                cla.Destination_Taluka,
                                                cla.Destination_State,
                                                cla.Destination_Pincode,
                                                cla.insert_date AS AddressInsertDate,
                                                cla.update_date AS AddressUpdateDate,
                                                cps.CustomerPostID,
                                                cps.CustomerID As cpsCustomerID,
                                                cps.VendorID,
                                                cps.DriverID,
                                                cps.CustomerStatus,
                                                cps.VendorStatus,
                                                cps.DriverStatus,
                                                cps. LP_Status 

                                                
                                                FROM CustomerLoadPost clp
                                                JOIN CustomerLoadPostAddress cla
                                                    ON clp.LoadPostID = cla.LoadPostID
                                                JOIN CustomerPostStatus cps
                                                    ON clp.LoadPostID = cps.CustomerPostID
                                                
                                                WHERE clp.LoadPostID = @LoadPostID
                                                    AND cps.LP_Status = 'Pending'
                                                    AND clp.CustomerID = @CustomerID

                                                ORDER BY clp.insert_date DESC;
`);
                }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    console.log(`[SUCCESS]: getcustomerloadpost found `);
                    resolve({ status: "00", message: `getcustomerloadpost records found `, data: result.recordset });
                } else {
                    console.log(`[INFO]: No records found for getcustomerloadpost`);
                    resolve({ status: "01", message: `No records found for getcustomerloadpost`, data: result.recordset });
                }
            })
            .catch(error => {
              //  console.error(`[ERROR]: getcustomerloadpost Error: SQL Error: ${error.message}`);
                logger.log("error", `getcustomerloadpostDB Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

};

exports.deletecustomerloadpostDB = async (data) => {
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();
        request.input('LoadPostID', sql.NVarChar(255), data.LoadPostID);
        const query = 'DELETE FROM CustomerLoadPost WHERE LoadPostID = @LoadPostID';
        const result = await request.query(query);
        if (result.rowsAffected[0] > 0) {
            return {
                status: "00",
                message: "Customer load post deleted successfully"
            };
        } else {
            return {
                status: "01",
                message: "No records found to delete"
            };
        }
    } catch (err) {
        logger.log("error", `deletecustomerloadpostDB Error: ${err.message}`);
        throw {
            status: "01",
            message: "SQL Error: " + err.message
        };
    }
};

exports.getVehicle_DetailsDB = async function (vehicleType, weightRange) {
    // exports.getVehicleDetailsAllCases = async function ({ vehicleType, weightRange }) {
    console.log(`[INFO]: Fetching vehicle data based on filters`);
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();

        let result;

        // ✅ Case 1: Only Vehicle Types list
        if (!vehicleType && !weightRange) {
            console.log(`[INFO]: Fetching all Vehicle Types`);
            result = await request.query(`
              --  SELECT DISTINCT VehicleType FROM Vehicle_Type;
              SELECT DISTINCT VehicleType, img ,WeightRange FROM Vehicle_Type

            `);
        }

        // ✅ Case 2: Weight ranges for a specific Vehicle Type
        else if (vehicleType && !weightRange) {
            request.input('VehicleType', sql.NVarChar(100), vehicleType);
            console.log(`[INFO]: Fetching Weight Ranges for VehicleType = ${vehicleType}`);
            result = await request.query(`
                SELECT DISTINCT WeightRange ,img
                FROM VehicleWeightRange 
                WHERE VehicleType = @VehicleType;
            `);
            // result = await request.query(`
                                //     SELECT DISTINCT VWRR.WeightRange, VWR.img
                                //     FROM VehicleWeightRange VWRR
                                //     JOIN Vehicle_Type VWR
                                //         ON VWRR.VehicleType = VWR.VehicleType
                                //     WHERE VWR.VehicleType = @VehicleType;
                                // `);

        }

        else if (vehicleType && weightRange) {
            request.input('VehicleType', sql.NVarChar(100), vehicleType);
            request.input('WeightRange', sql.NVarChar(50), weightRange);
            console.log(`[INFO]: Fetching Vehicle Details for VehicleType = ${vehicleType} and WeightRange = ${weightRange}`);

            let query = `
                                SELECT 
                                    VD.VehicleName,
                                    VD.VehicleType,
                                    VD.BodyType,
                                    VD.img,
                                    VWR.WeightRange
                                FROM 
                                    Vehicle_Details VD
                                JOIN 
                                    VehicleWeightRange VWR 
                                    ON VD.VehicleType = VWR.VehicleType 
                                WHERE 
                                    VD.VehicleType = @VehicleType 
                                    AND VWR.WeightRange = @WeightRange
                            `;

            // ⚡ Special Case: Mini + 20-250kg => Only Auto (3 Wheeler Cargo)
            if (vehicleType === "Mini" && weightRange === "20-250kg") {
                query += ` AND VD.VehicleName = 'Auto (3 Wheeler Cargo)'`;
            } else if (vehicleType === "Mini" && weightRange === "250-400kg") {
                query += ` AND VD.VehicleName = '4 Tyre'`;
            } else if (vehicleType === "Mini" && weightRange === "400-600kg") {
                query += ` AND VD.VehicleName = '4 Tyre'`;
            } else if (vehicleType === "Mini" && weightRange === "600-750kg") {
                query += ` AND VD.VehicleName = '4 Tyre'`;
            }





            result = await request.query(query);
        }

        if (result.recordset.length > 0) {
            console.log(`[SUCCESS]: Records found`);
            return {
                status: "00",
                message: `Records found`,
                data: result.recordset
            };
        } else {
            console.log(`[INFO]: No records found`);
            return {
                status: "01",
                message: `No records found for the provided filters`,
                data: [],
            };
        }
    } catch (error) {
        //   logger.log("error", `getVehicleDetailsAllCases Error: ${error.message}`);
        throw { message: 'SQL Error: ' + error.message, status: "01" };
    }
};

exports.getCargoTypesDB = async function (data) {
    console.log(`[INFO]: Fetching CargoTypes for data: ${data}`);
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();
        request.input('data', sql.NVarChar(255), data);
        console.log(`[INFO]: Executing Query - SELECT * FROM CargoTypes WHERE data = ${JSON.stringify(data)}`);
        let result;
        if (!data) {
            result = await request.query('SELECT  DISTINCT  cargo_type , img FROM CargoTypes');
        } else {
            result = await request.query('SELECT  DISTINCT  cargo_type , img , packaging_type  FROM cargopackag WHERE cargo_type = @data');
        }
        if (result.recordset.length > 0) {
            console.log(`[SUCCESS]: CargoTypes found for data: ${data}`);
            return { status: "00", message: `CargoTypes records found for data: ${data}`, data: result.recordset };
        } else {
            console.log(`[INFO]: No records found for data: ${data}`);
            return { status: "01", message: `No records found for data: ${data}`, data: result.recordset };
        }
    } catch (error) {
        logger.log("error", `getCargoTypesDB Error: ${error.message}`);
        throw { message: 'SQL Error: ' + error.message, status: "01" };
    }
};

exports.getNearestCustomerposttDB = async (data) => {
    console.log(`[INFO]: Fetching nearest customer posts for data: ${JSON.stringify(data)}`);
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();
                          
                   // Inputs
           request.input('lat', sql.Decimal(9, 6), data.Lat);
           request.input('lng', sql.Decimal(9, 6), data.Lng);
           request.input('radius', sql.Int, data.radius || 10000); // ✅ Default 5 km
           request.input('vehicleType', sql.NVarChar(100), data.VehicleType || 'Multi Axle');
           request.input('DriverID', sql.NVarChar(10), data.DriverID );
        // const result = await request.query(`
        //                      SELECT TOP 50
        //                           clp.LoadPostID AS Customer_LoadPostID,
        //                           dll.status AS DriverStatus,
        //                           dll.DriverID,
        //                           cps.CustomerID,
        //                           dll.VendorID,
        //                           cps.LP_Status,
        //                           dll. Driver_LPStatus,
        //                           cps.CustomerStatus ,
        //                           dll.Lat AS DriverLat,
        //                           dll.Lng AS DriverLng,
        //                           dll.MobileNo AS DriverMobile,
        //                           dll.VehicleID AS DriverVehicleNumber,
        //                           dll.LastUpdated AS DriverLastUpdate,
        //                           dll.status AS DriverAvailabilityStatus,
        //                           dlp.vehiclestatus AS DriverVehicleStatus,
		// 						  dlp.loadpostid AS DriverCurrentLoadPostID,
        //                           FORMAT(clp.insert_date, 'yyyy-MM-dd') AS PostDate,
        //                           cla.Origin AS PickupLocation,
        //                           cla.Origin_Lat,
        //                           cla.Origin_Lng, 
        //                           cla.Destination_Lat, 
        //                           cla.Destination_Lng,
        //                           CAST(
        //                               6371 * ACOS(
        //                                   COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
        //                                   COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
        //                                   SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
        //                               ) AS DECIMAL(10,2)
        //                           ) AS PickupDistanceKm,
        //                           cla.Destination AS DestinationLocation,
        //                           CAST(
        //                               6371 * ACOS(
        //                                   COS(RADIANS(cla.Origin_Lat)) * COS(RADIANS(cla.Destination_Lat)) *
        //                                   COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) +
        //                                   SIN(RADIANS(cla.Origin_Lat)) * SIN(RADIANS(cla.Destination_Lat))
        //                               ) AS DECIMAL(10,2)
        //                           ) AS DestinationDistanceKm,
        //                           clp.VehicleType,
        //                           clp.BodyType,
        //                           clp.CargoContent,
        //                           clp.CargoPackageType,
        //                           clp.Weight AS ApproxWeight,
        //                         --  clp.verify_flag,
        //                          -- clp.verification_code,
        //                           clp.ExpectedAvailableTime,
                          
        //                           -- Remaining Minutes
        //                           DATEDIFF(
        //                               MINUTE, 
        //                               GETDATE(), 
        //                               DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))
        //                           ) AS RemainingMinutes,
                          
        //                           -- Remaining Time (formatted)
        //                           CASE 
        //                               WHEN DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) < 0 
        //                               THEN 'Expired'
        //                               ELSE CAST(
        //                                       DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) / 60 
        //                                   AS VARCHAR(3)) + 'h ' +
        //                                   CAST(
        //                                       DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) % 60 
        //                                   AS VARCHAR(2)) + 'm'
        //                           END AS RemainingTimeFormatted,
        //                           ct.img AS CargoTypes_IMG ,
        //                           cp.Img AS Cargopackag_IMG ,
        //                           vwr.Img AS Vehicle_IMG
        //                 FROM CustomerLoadPost clp
        //                                INNER JOIN CustomerLoadPostAddress cla 
        //                                    ON clp.LoadPostID = cla.LoadPostID
        //                                LEFT JOIN CustomerPostStatus cps
        //                                    ON clp.LoadPostID = cps.CustomerPostID
        //                                LEFT JOIN  VehicleWeightRange vwr
		// 							       ON clp.VehicleType = vwr.VehicleType 
		// 								   AND clp.Weight = vwr.WeightRange 
		// 							   LEFT JOIN  CargoTypes ct
		// 								   ON clp.CargoContent = ct.cargo_type
        //                             -- LEFT JOIN  Cargopackag cp
		// 							  --   ON clp.CargoPackageType = cp.packaging_type
        //                                LEFT JOIN (
        //                                    SELECT packaging_type, cargo_type, MIN(Img) AS Img
        //                                    FROM Cargopackag
        //                                    GROUP BY packaging_type, cargo_type
        //                                           ) cp
        //                                   ON clp.CargoPackageType = cp.packaging_type
        //                                   AND clp.CargoContent = cp.cargo_type

        //                                OUTER APPLY (
        //                                    SELECT TOP 1 dlp.*
        //                                    FROM DriverLoadPost dlp
        //                                    WHERE dlp.VehicleType = clp.VehicleType
        //                                      AND dlp.DriverID = @DriverID
        //                                    ORDER BY dlp.insert_date DESC
        //                                ) dlp
        //                                LEFT JOIN DriverLiveLocation dll
        //                                    ON dlp.DriverID = dll.DriverID
        //                                WHERE cla.Origin_Lat IS NOT NULL
        //                                  AND cla.Origin_Lng IS NOT NULL
        //                                  AND clp.VehicleType = @vehicleType
        //                                  AND dll.Status = 'Available'
        //                                  AND cps.LP_Status = 'Pending'
        //                                  AND (cps.DriverStatus IS NULL)
        //                                  AND (
        //                                        6371 * ACOS(
        //                                            COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
        //                                            COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
        //                                            SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
        //                                        )
        //                                      ) <= @radius
                                       
        //                       ORDER BY  PostDate ASC;
        //                   `);

               const result = await request.query(`
                             SELECT TOP 50
    clp.LoadPostID AS Customer_LoadPostID,
    dll.status AS DriverStatus,
    dll.DriverID,
    cps.CustomerID,
    dll.VendorID,
    cps.LP_Status,
    dll.Driver_LPStatus,
    cps.CustomerStatus,
    dll.Lat AS DriverLat,
    dll.Lng AS DriverLng,
    dll.MobileNo AS DriverMobile,
    dll.VehicleID AS DriverVehicleNumber,
    dll.LastUpdated AS DriverLastUpdate,
    dll.status AS DriverAvailabilityStatus,
    dlp.vehiclestatus AS DriverVehicleStatus,
    dlp.loadpostid AS DriverCurrentLoadPostID,
    FORMAT(clp.insert_date, 'yyyy-MM-dd') AS PostDate,
    cla.Origin AS PickupLocation,
    cla.Origin_Lat,
    cla.Origin_Lng, 
    cla.Destination_Lat, 
    cla.Destination_Lng,

    -- ✅ Pickup Distance with clamp
    CAST(
        6371 * ACOS(
            CASE 
                WHEN (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
                    COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
                ) > 1 THEN 1
                WHEN (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
                    COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
                ) < -1 THEN -1
                ELSE (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
                    COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
                )
            END
        ) AS DECIMAL(10,2)
    ) AS PickupDistanceKm,

    cla.Destination AS DestinationLocation,

    -- ✅ Destination Distance with clamp
    CAST(
        6371 * ACOS(
            CASE 
                WHEN (
                    COS(RADIANS(cla.Origin_Lat)) * COS(RADIANS(cla.Destination_Lat)) *
                    COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) +
                    SIN(RADIANS(cla.Origin_Lat)) * SIN(RADIANS(cla.Destination_Lat))
                ) > 1 THEN 1
                WHEN (
                    COS(RADIANS(cla.Origin_Lat)) * COS(RADIANS(cla.Destination_Lat)) *
                    COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) +
                    SIN(RADIANS(cla.Origin_Lat)) * SIN(RADIANS(cla.Destination_Lat))
                ) < -1 THEN -1
                ELSE (
                    COS(RADIANS(cla.Origin_Lat)) * COS(RADIANS(cla.Destination_Lat)) *
                    COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) +
                    SIN(RADIANS(cla.Origin_Lat)) * SIN(RADIANS(cla.Destination_Lat))
                )
            END
        ) AS DECIMAL(10,2)
    ) AS DestinationDistanceKm,

    clp.VehicleType,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.Weight AS ApproxWeight,
    clp.ExpectedAvailableTime,

    -- Remaining Minutes
    DATEDIFF(
        MINUTE, 
        GETDATE(), 
        DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))
    ) AS RemainingMinutes,

    -- Remaining Time (formatted)
    CASE 
        WHEN DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) < 0 
        THEN 'Expired'
        ELSE CAST(
                DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) / 60 
            AS VARCHAR(3)) + 'h ' +
            CAST(
                DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) % 60 
            AS VARCHAR(2)) + 'm'
    END AS RemainingTimeFormatted,

    ct.img AS CargoTypes_IMG,
    cp.Img AS Cargopackag_IMG,
    vwr.Img AS Vehicle_IMG

FROM CustomerLoadPost clp
INNER JOIN CustomerLoadPostAddress cla 
    ON clp.LoadPostID = cla.LoadPostID
LEFT JOIN CustomerPostStatus cps
    ON clp.LoadPostID = cps.CustomerPostID
LEFT JOIN VehicleWeightRange vwr
    ON clp.VehicleType = vwr.VehicleType 
    AND clp.Weight = vwr.WeightRange 
LEFT JOIN CargoTypes ct
    ON clp.CargoContent = ct.cargo_type
LEFT JOIN (
    SELECT packaging_type, cargo_type, MIN(Img) AS Img
    FROM Cargopackag
    GROUP BY packaging_type, cargo_type
) cp
    ON clp.CargoPackageType = cp.packaging_type
    AND clp.CargoContent = cp.cargo_type
OUTER APPLY (
    SELECT TOP 1 dlp.*
    FROM DriverLoadPost dlp
    WHERE dlp.VehicleType = clp.VehicleType
      AND dlp.DriverID = @DriverID
    ORDER BY dlp.insert_date DESC
) dlp
LEFT JOIN DriverLiveLocation dll
    ON dlp.DriverID = dll.DriverID
WHERE cla.Origin_Lat IS NOT NULL
  AND cla.Origin_Lng IS NOT NULL
  AND clp.VehicleType = @vehicleType
  AND dll.Status = 'Available'
  AND cps.LP_Status = 'Pending'
  AND (cps.DriverStatus IS NULL)
  AND (
      6371 * ACOS(
          CASE 
              WHEN (
                  COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
                  COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
                  SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
              ) > 1 THEN 1
              WHEN (
                  COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
                  COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
                  SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
              ) < -1 THEN -1
              ELSE (
                  COS(RADIANS(@lat)) * COS(RADIANS(cla.Origin_Lat)) *
                  COS(RADIANS(cla.Origin_Lng) - RADIANS(@lng)) +
                  SIN(RADIANS(@lat)) * SIN(RADIANS(cla.Origin_Lat))
              )
          END
      )
  ) <= @radius
ORDER BY PostDate ASC
                          `);

        if (result.recordset.length > 0) {
            console.log(`[SUCCESS]: Nearest customer posts found`);
            return { status: "00", message: `Nearest customer posts found`, data: result.recordset };
        } else {
            console.log(`[INFO]: No nearest customer posts found`);
            return { status: "01", message: `No nearest customer posts found`, data: [] };
        }
    } catch (error) {
        console.log("error", `getNearestCustomerposttDB Error: ${error.message}`);
        throw { message: 'SQL Error: ' + error.message, status: "01" };
    }
};

// Note: For CustomerPostStatus, the function is moved to Customer_Load_Post.js controller file to access req, res directly.
exports.CustomerPostStatusDB = async (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // inputs
                request.input('CustomerPostID', sql.NVarChar(10), data.CustomerPostID);
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
                request.input('VendorID', sql.NVarChar(10), data.VendorID);
                request.input('DriverID', sql.NVarChar(10), data.DriverID);
                request.input('CustomerStatus', sql.NVarChar(50), data.CustomerStatus);
                request.input('VendorStatus', sql.NVarChar(50), data.VendorStatus);
                request.input('DriverStatus', sql.NVarChar(50), data.DriverStatus);
                request.input('EnteredVerificationCode', sql.NVarChar(50), data.VerificationCode);

                

                // output
                request.output('bstatus_code', sql.NVarChar(255));
                request.output('bmessage_desc', sql.NVarChar(255));
                // Call the stored procedure
                return request.execute('UpdateCustomerPostStatus');
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

exports.getcustomerprocessDB = async (data) => {
//    console.log(`[INFO]: Fetching customer process : ${data}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID || data);
                request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);

                console.log(`[INFO]: Executing Query - SELECT * FROM CustomerLoadPost WHERE LoadPostID = @LoadPostID`);

                if (!data.LoadPostID) {
                    return request.query(`SELECT        

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
                                                    clp.Origin,             
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.verification_code,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,
                                                    clp.Approximate_weight,
                                                    clp.PickupType,

                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
													dll.Lng AS DriverLng,
                                                 --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
													dll.MobileNo,
                                                    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    where cps.LP_Status = 'Progress' 
                                                    And clp.CustomerID = @CustomerID
                                              --      AND cps.customerpostid = @LoadPostID
                                                    ORDER BY clp.insert_date DESC;
`);
                } else {
                    return request.query(`SELECT        

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
                                                    clp.Origin,             
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.verification_code,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,
                                                    clp.Approximate_weight,
                                                    clp.PickupType,

                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
													dll.Lng AS DriverLng,
                                                 --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
													dll.MobileNo,
                                                    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    WHERE clp.LoadPostID = @LoadPostID
                                                        AND cps.LP_Status = 'Progress'
                                                        AND clp.CustomerID = @CustomerID
                                                    ORDER BY clp.insert_date DESC;
`);
                }

            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    console.log(`[SUCCESS]: getcustomerprocess found `);
                    resolve({ status: "00", message: `getcustomerprocess records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for getcustomerprocess`);
                    resolve({ status: "01", message: `No records found for getcustomerprocess`, data: result.recordset });
                }
            })
            .catch(error => {
              //  console.error(`[ERROR]: getcustomerprocess Error: SQL Error: ${error.message}`);
                logger.log("error", `getcustomerprocessDB Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

};

exports.getcustomeractiveDB = async (data) => {
  //  console.log(`[INFO]: Fetching customer Active : ${data}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID || data);
                request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);

                console.log(`[INFO]: Executing Query - SELECT * FROM CustomerLoadPost WHERE LoadPostID = @LoadPostID `);

                if (!data.LoadPostID) {
                    return request.query(`SELECT        

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
                                                    clp.Origin,             
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,
                                                    clp.Approximate_weight,
                                                    clp.PickupType,

                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
													dll.Lng AS DriverLng,
                                                 --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
													dll.MobileNo,
                                                    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    where cps.LP_Status = 'Active'
                                                    AND clp.CustomerID = @CustomerID
                                                 --   AND cps.customerpostid = @LoadPostID

                                                    ORDER BY clp.insert_date DESC;
`);
                } else {
                    return request.query(`SELECT        

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
                                                    clp.Origin,             
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,
                                                    clp.Approximate_weight,
                                                    clp.PickupType,

                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
													dll.Lng AS DriverLng,
                                                 --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
													dll.MobileNo,
                                                    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    WHERE clp.LoadPostID = @LoadPostID
                                                        AND cps.LP_Status = 'Active'
                                                        AND clp.CustomerID = @CustomerID
                                                    ORDER BY clp.insert_date DESC;
`);
                }

            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    console.log(`[SUCCESS]: getcustomerActive found `);
                    resolve({ status: "00", message: `getcustomerActive records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for getcustomerActive`);
                    resolve({ status: "01", message: `No records found for getcustomerActive`, data: result.recordset });
                }
            })
            .catch(error => {
            //    console.error(`[ERROR]: getcustomerActive Error: SQL Error: ${error.message}`);
                logger.log("error", `getcustomerActive Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

};
// Note: For CustomerPostStatusNotifications, the function is moved to a separate scheduler file to avoid multiple intervals when imported in routes.

exports.getcustomercompletedDB = async (data) => {
    console.log(`[INFO]: Fetching customer Completed : ${data}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID || data);
                request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);
                request.input('FromDate', sql.Date, data.FromDate);
                request.input('ToDate', sql.Date, data.ToDate);
                console.log(`[INFO]: Executing Query - SELECT * FROM CustomerLoadPost WHERE LoadPostID = @LoadPostID `);

                if (!data.LoadPostID) {
                    if (data.FromDate && data.ToDate) {
                        return request.query(`SELECT

                                                    clp.LoadPostID,
                                                    clp.CustomerID,
                                                    clp.Origin,        
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,  
                                                    clp.Approximate_weight, 
                                                    clp.PickupType,

                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
                                                    dll.Lng AS DriverLng,
                                                 --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
                                                    dll.MobileNo,
                                                    cps.LP_Status 
                                                    FROM CustomerLoadPost clp   
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    WHERE cps.LP_Status = 'Completed'
                                                    AND clp.CustomerID = @CustomerID
                                                    AND CAST(cps.update_date AS DATE) BETWEEN @FromDate AND @ToDate
                                                    ORDER BY clp.insert_date DESC;
`);
                    }       
                    else {
                        return request.query(`SELECT

                                                    clp.LoadPostID, 
                                                    clp.CustomerID,
                                                    clp.Origin,        
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,
                                                    clp.Approximate_weight, 
                                                    clp.PickupType,

                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
                                                    dll.Lng AS DriverLng,
                                                    --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
                                                    dll.MobileNo,
                                                    cps.LP_Status 
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    WHERE cps.LP_Status = 'Completed'
                                                    AND clp.CustomerID = @CustomerID
                                                    ORDER BY clp.insert_date DESC;
`);

                    }
                }
                else {
                    if (data.FromDate && data.ToDate) {
                        return request.query(`SELECT
                                                    clp.LoadPostID,
                                                    clp.CustomerID,
                                                    clp.Origin,
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    cla.AddressLine1,
                                                    cla.AddressLine2,
                                                    cla.District,
                                                    cla.Taluka,
                                                    cla.State,
                                                    cla.Pincode,
                                                    cla.Lat,
                                                    cla.Lng,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
                                                    dll.Lng AS DriverLng,
                                                    --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
                                                    dll.MobileNo,
                                                    cps.LP_Status 
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    WHERE cps.LP_Status = 'Completed'
                                                    AND clp.CustomerID = @CustomerID
                                                    ORDER BY clp.insert_date DESC;
`);
                    } else {
                        return request.query(`SELECT
                                                    clp.LoadPostID, 
                                                    clp.CustomerID,
                                                    clp.Origin,        
                                                    clp.Destination,
                                                    clp.VehicleType,
                                                    clp.Weight,
                                                    clp.verify_flag,
                                                    clp.BodyType,
                                                    clp.CargoContent,
                                                    clp.CargoPackageType,
                                                    clp.ExpectedAvailableTime,
                                                    clp.insert_date AS PostInsertDate,
                                                    clp.update_date AS PostUpdateDate,
                                                    clp.Approximate_weight, 
                                                    clp.PickupType,
                                                    
                                                    cla.Origin_Lat,
                                                    cla.Origin_Lng,
                                                    cla.Origin_City,
                                                    cla.Origin_District,
                                                    cla.Origin_Taluka,
                                                    cla.Destination_City,
                                                    cla.Destination_District,
                                                    cla.Destination_Taluka,
                                                    cla.Origin_State,
                                                    cla.Origin_Pincode,
                                                    cla.Destination_Lat,
                                                    cla.Destination_Lng,
                                                    cla.Destination_State,
                                                    cla.Destination_Pincode,
                                                    cla.insert_date AS AddressInsertDate,
                                                    cla.update_date AS AddressUpdateDate,
                                                    cps.CustomerPostID,
                                                    cps.CustomerID As cpsCustomerID,
                                                    cps.VendorID,
                                                    cps.DriverID,
                                                    cps.CustomerStatus,
                                                    cps.insert_date AS PostInsertDate,
                                                    cps.update_date AS PostUpdateDate,
                                                    cps.VendorStatus,
                                                    cps.DriverStatus,
                                                    cps.LP_Status ,
                                                    dll.Lat AS DriverLat,
                                                    dll.Lng AS DriverLng,
                                                    --   dll.UpdateTime AS DriverLocationUpdateTime,
                                                    dll.DriverID AS dllDriverID,
                                                    dll.MobileNo,
                                                    cps.LP_Status 
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    WHERE clp.LoadPostID = @LoadPostID
                                                        AND cps.LP_Status = 'Completed'
                                                        AND clp.CustomerID = @CustomerID    
                                                    ORDER BY clp.insert_date DESC;
`);
                    }   
                }

            }   )
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(result.recordset[0]);
                    console.log(`[SUCCESS]: getcustomerCompleted found `);
                    resolve({ status: "00", message: `getcustomerCompleted records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for getcustomerCompleted`);
                    resolve({ status: "01", message: `No records found for getcustomerCompleted`, data: result.recordset });
                }
            })
            .catch(error => {
              //  console.error(`[ERROR]: getcustomerCompleted Error: SQL Error: ${error.message}`);
              logger.log("error", `getcustomercompletedDB Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

}

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
                                          AND dva.IsActive = 1
                                          -- AND v.VehicleType = @VehicleType   -- ✅ if filtering by type
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

exports.VendorNearestCustomerPostDB = async (data) => {
   console.log(`[INFO]: Fetching nearest customer posts for data: ${JSON.stringify(data)}`);
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();
                          
                   // Inputs
           request.input('vendorLat', sql.Decimal(9, 6), data.vendorLat);
           request.input('vendorLng', sql.Decimal(9, 6), data.vendorLng);
           request.input('radius', sql.Int, data.radius || 10000); // ✅ Default 5 km
           request.input('vehicleType', sql.NVarChar(100), data.VehicleType || null);
           request.input('VendorID', sql.NVarChar(10), data.VendorID );
    

               const result = await request.query(`SELECT TOP 50
                                    clp.LoadPostID AS Customer_LoadPostID,
                                    cps.CustomerID,
                                    clp.VehicleType,
                                    clp.BodyType,
                                    clp.CargoContent,
                                    clp.CargoPackageType,
                                    clp.Weight AS ApproxWeight,
                                    FORMAT(clp.insert_date, 'yyyy-MM-dd') AS PostDate,
                                    cla.Origin AS PickupLocation,
                                    cla.Origin_Lat,
                                    cla.Origin_Lng,
                                    cla.Destination AS DestinationLocation,
                                    cla.Destination_Lat,
                                    cla.Destination_Lng,
                                
                                    -- ✅ Distance (Vendor → Customer Pickup)
                                    CAST(
                                        6371 * ACOS(
                                            CASE 
                                                WHEN (
                                                    COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.Origin_Lat)) *
                                                    COS(RADIANS(cla.Origin_Lng) - RADIANS(@vendorLng)) +
                                                    SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.Origin_Lat))
                                                ) > 1 THEN 1
                                                WHEN (
                                                    COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.Origin_Lat)) *
                                                    COS(RADIANS(cla.Origin_Lng) - RADIANS(@vendorLng)) +
                                                    SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.Origin_Lat))
                                                ) < -1 THEN -1
                                                ELSE (
                                                    COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.Origin_Lat)) *
                                                    COS(RADIANS(cla.Origin_Lng) - RADIANS(@vendorLng)) +
                                                    SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.Origin_Lat))
                                                )
                                            END
                                        ) AS DECIMAL(10,2)
                                    ) AS DistanceKm,
                                
                                    -- ✅ Cargo and Vehicle Images
                                    ct.Img AS CargoTypes_IMG,
                                    cp.Img AS Cargopackag_IMG,
                                    vwr.Img AS Vehicle_IMG,
                                
                                    -- ✅ Remaining Time
                                    CASE 
                                        WHEN DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) < 0 
                                        THEN 'Expired'
                                        ELSE CAST(
                                                DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) / 60 
                                            AS VARCHAR(3)) + 'h ' +
                                            CAST(
                                                DATEDIFF(MINUTE, GETDATE(), DATEADD(SECOND, DATEDIFF(SECOND, '00:00:00', clp.ExpectedAvailableTime), CAST(GETDATE() AS DATETIME))) % 60 
                                            AS VARCHAR(2)) + 'm'
                                    END AS RemainingTimeFormatted
                                
                                FROM CustomerLoadPost clp
                                INNER JOIN CustomerLoadPostAddress cla 
                                    ON clp.LoadPostID = cla.LoadPostID
                                LEFT JOIN CustomerPostStatus cps
                                    ON clp.LoadPostID = cps.CustomerPostID
                                LEFT JOIN VehicleWeightRange vwr
                                    ON clp.VehicleType = vwr.VehicleType AND clp.Weight = vwr.WeightRange 
                                LEFT JOIN CargoTypes ct
                                    ON clp.CargoContent = ct.cargo_type
                                LEFT JOIN (
                                    SELECT packaging_type, cargo_type, MIN(Img) AS Img
                                    FROM Cargopackag
                                    GROUP BY packaging_type, cargo_type
                                ) cp
                                    ON clp.CargoPackageType = cp.packaging_type
                                    AND clp.CargoContent = cp.cargo_type
                                WHERE cla.Origin_Lat IS NOT NULL
                                  AND cla.Origin_Lng IS NOT NULL
                                  AND cps.LP_Status = 'Pending'
                                  AND (
                                      6371 * ACOS(
                                          CASE 
                                              WHEN (
                                                  COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.Origin_Lat)) *
                                                  COS(RADIANS(cla.Origin_Lng) - RADIANS(@vendorLng)) +
                                                  SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.Origin_Lat))
                                              ) > 1 THEN 1
                                              WHEN (
                                                  COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.Origin_Lat)) *
                                                  COS(RADIANS(cla.Origin_Lng) - RADIANS(@vendorLng)) +
                                                  SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.Origin_Lat))
                                              ) < -1 THEN -1
                                              ELSE (
                                                  COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.Origin_Lat)) *
                                                  COS(RADIANS(cla.Origin_Lng) - RADIANS(@vendorLng)) +
                                                  SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.Origin_Lat))
                                              )
                                          END
                                      )
                                  ) <= @radius
                                ORDER BY DistanceKm ASC`);

        if (result.recordset.length > 0) {
            console.log(`[SUCCESS]: Nearest customer posts found`);
            return { status: "00", message: `Nearest customer posts found`, data: result.recordset };
        } else {
            console.log(`[INFO]: No nearest customer posts found`);
            return { status: "01", message: `No nearest customer posts found`, data: [] };
        }
    } catch (error) {
        console.log("error", `getNearestCustomerposttDB Error: ${error.message}`);
        throw { message: 'SQL Error: ' + error.message, status: "01" };
    }
};

exports.CargoTypeBodyTypeHistoryDB = (data) => {
    console.log(`[INFO]: Fetching CargoTypeBodyTypeHistory for CustomerID: ${data.CustomerID}`);
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
                   const query = `
                    SELECT  TOP 10
                        CargoContent,
                        BodyType,
                        CONVERT(VARCHAR(19), insert_date, 120) AS LastUsedDate
                    FROM CustomerLoadPost
                    WHERE CustomerID = @CustomerID
                    ORDER BY insert_date DESC
                `;

                return request.query(query);
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: CargoTypeBodyTypeHistory found for CustomerID: ${data.CustomerID}`);
                    resolve({ status: "00", message: "CargoTypeBodyTypeHistory found", data: result.recordset });
                } else {
                    console.log(`[INFO]: No CargoTypeBodyTypeHistory found for CustomerID: ${data.CustomerID}`);
                    resolve({ status: "01", message: "No CargoTypeBodyTypeHistory found", data: [] });
                }
            })
            .catch(error => {
                console.log("error", `CargoTypeBodyTypeHistoryDB Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });
};
