const sql = require('mssql');
const pool = require('../../../db/db'); // Ensure your DB config is imported
const e = require('express');

exports.getvendorCountsDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => { 
                const request = pool.request();

                request.input('vendorID', sql.NVarChar(50), data.vendorid);

                // Outputs
                request.output('bstatus_code', sql.NVarChar(50));
                request.output('DriverSummary', sql.NVarChar(sql.MAX));
                request.output('VehicleSummary', sql.NVarChar(sql.MAX));
                request.output('TripSummary', sql.NVarChar(sql.MAX));

                

                // Call the stored procedure
                return request.execute('GetVendorCounts');
            })

            .then(result => {
                const output = {
                    status: result.output.bstatus_code,
                    data: {
                        DriverSummary: result.output.DriverSummary ? JSON.parse(result.output.DriverSummary) : null,
                        VehicleSummary: result.output.VehicleSummary ? JSON.parse(result.output.VehicleSummary) : null,
                        TripSummary: result.output.TripSummary ? JSON.parse(result.output.TripSummary) : null
                    }
                };
                console.log('GetMultiCountsDB Output:', JSON.stringify(output));
                resolve(output);
            }
            )
            .catch(err => {
                reject('SQL Error: ' + err);
            });
    });
};

// exports.getvehicleavailableDB = (data) => {
//     console.log(`[INFO]: Fetching active vehicle details for vendorid: ${data.vendorid}, driverid: ${data.driverid || 'N/A'}`);

//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(async pool => {
//                 const request = pool.request();

//                 // Common inputs
//                 request.input('vendorid', sql.NVarChar(10), data.vendorid || null);
//                 request.input('radiusKm', sql.Float, 500);
//                 if (data.driverid) request.input('driverid', sql.NVarChar(10), data.driverid);

//                 // ================================
//                 // CASE 1: vendorid + driverid
//                 // ================================
//                 if (data.vendorid && !data.driverid) {
//                     const mainQuery = `
//                     SELECT 
//                             d.driver_id,
//                             d.full_name AS Driver_Name,
//                             dll.Lat AS Driver_Latitude,
//                             dll.Lng AS Driver_Longitude,
//                             vdn.registration_no AS vehicle_No,
//                             vdn.vehicleType,
//                             cps.LP_Status,
//                             clp.LoadPostID,
//                             cla.Origin_Lat AS pickup_Latitude,
//                             cla.Origin_Lng AS pickup_Longitude,
//                             cla.Destination_Lat AS dropoff_Latitude,
//                             cla.Destination_Lng AS dropoff_Longitude,
//                             6371 * ACOS(
//                                 COS(RADIANS(dll.Lat)) 
//                                 * COS(RADIANS(cla.Origin_Lat)) 
//                                 * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
//                                 + SIN(RADIANS(dll.Lat)) 
//                                 * SIN(RADIANS(cla.Origin_Lat))
//                             ) AS DriverToOriginKm,
//                             6371 * ACOS(
//                                 COS(RADIANS(cla.Origin_Lat)) 
//                                 * COS(RADIANS(cla.Destination_Lat)) 
//                                 * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
//                                 + SIN(RADIANS(cla.Origin_Lat)) 
//                                 * SIN(RADIANS(cla.Destination_Lat))
//                             ) AS OriginToDestinationKm
//                         FROM 
//                             Driver_Details d
//                         JOIN 
//                             DriverLiveLocation dll ON d.driver_id = dll.DriverID
//                         JOIN 
//                             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
//                         JOIN 
//                             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
//                                                   AND dva.VehicleID = vdn.VehicleID
//                         LEFT JOIN 
//                             CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
//                         LEFT JOIN 
//                             CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
//                         LEFT JOIN 
//                             CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
//                         WHERE 
//                             d.VendorID = @vendorid
//                             AND dva.IsActive = 1
//                             AND cps.LP_Status = 'Pending'
//                             AND (
//                                 6371 * ACOS(
//                                     COS(RADIANS(dll.Lat)) 
//                                     * COS(RADIANS(cla.Origin_Lat)) 
//                                     * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
//                                     + SIN(RADIANS(dll.Lat)) 
//                                     * SIN(RADIANS(cla.Origin_Lat))
//                                 )
//                             ) <= @radiusKm
//                         ORDER BY DriverToOriginKm ASC;
//                     `;
                        
//                     const mainResult = await request.query(mainQuery);

//                     // ✅ Fallback condition
//                     if (mainResult.recordset.length === 0) {
//                         console.log(`[INFO]: No active trips found for driver ${data.driverid}, running fallback query...`);

//                         const fallbackQuery = `
//                             SELECT 
//                                 d.driver_id,
//                                 d.full_name AS Driver_Name,
//                                 dll.Lat AS Driver_Latitude,
//                                 dll.Lng AS Driver_Longitude,
//                                 vdn.registration_no AS vehicle_No,
//                                 vdn.vehicleType
//                             FROM 
//                                 Driver_Details d
//                             JOIN 
//                                 DriverLiveLocation dll ON d.driver_id = dll.DriverID
//                             JOIN 
//                                 DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
//                             JOIN 
//                                 VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
//                                                       AND dva.VehicleID = vdn.VehicleID
//                             WHERE 
//                                 d.VendorID = @vendorid
//                                 AND dva.IsActive = 1
//                         `;
//                         const fallbackResult = await request.query(fallbackQuery);
//                         return fallbackResult;
//                     } else {
//                         return mainResult;
//                     }
//                 }

//                 // ================================
//                 // CASE 2: Only vendorid (Pending trips)
//                 // ================================
//                 else if (data.vendorid && data.driverid) {
//                     const vendorQuery = `
//                     SELECT 
//                             d.driver_id,
//                             d.full_name AS Driver_Name,
//                             dll.Lat AS Driver_Latitude,
//                             dll.Lng AS Driver_Longitude,
//                             vdn.registration_no AS vehicle_No,
//                             vdn.vehicleType,
//                             cps.LP_Status,
//                             clp.LoadPostID,
//                             cla.Origin_Lat AS pickup_Latitude,
//                             cla.Origin_Lng AS pickup_Longitude,
//                             cla.Destination_Lat AS dropoff_Latitude,
//                             cla.Destination_Lng AS dropoff_Longitude,
//                             6371 * ACOS(
//                                 COS(RADIANS(dll.Lat)) 
//                                 * COS(RADIANS(cla.Origin_Lat)) 
//                                 * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
//                                 + SIN(RADIANS(dll.Lat)) 
//                                 * SIN(RADIANS(cla.Origin_Lat))
//                             ) AS DriverToOriginKm,
//                             6371 * ACOS(
//                                 COS(RADIANS(cla.Origin_Lat)) 
//                                 * COS(RADIANS(cla.Destination_Lat)) 
//                                 * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
//                                 + SIN(RADIANS(cla.Origin_Lat)) 
//                                 * SIN(RADIANS(cla.Destination_Lat))
//                             ) AS OriginToDestinationKm
//                         FROM 
//                             Driver_Details d
//                         JOIN 
//                             DriverLiveLocation dll ON d.driver_id = dll.DriverID
//                         JOIN 
//                             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
//                         JOIN 
//                             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
//                                                   AND dva.VehicleID = vdn.VehicleID
//                         LEFT JOIN 
//                             CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
//                         LEFT JOIN 
//                             CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
//                         LEFT JOIN 
//                             CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
//                         WHERE 
//                             d.VendorID = @vendorid
//                             AND dva.IsActive = 1
//                             AND d.driver_id = @driverid
//                             AND cps.LP_Status = 'pending'
//                             AND (
//                                 6371 * ACOS(
//                                     COS(RADIANS(dll.Lat)) 
//                                     * COS(RADIANS(cla.Origin_Lat)) 
//                                     * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
//                                     + SIN(RADIANS(dll.Lat)) 
//                                     * SIN(RADIANS(cla.Origin_Lat))
//                                 )
//                             ) <= @radiusKm
//                         ORDER BY DriverToOriginKm ASC;
//                     `;

                        
//                     return await request.query(vendorQuery);
//                 }

//                 // ================================
//                 // CASE 3: No vendorid (fallback)
//                 // ================================
//                 else {
//                     const fallbackQuery = `
//                         SELECT 
//                             d.driver_id,
//                             d.full_name AS Driver_Name,
//                             dll.Lat AS Driver_Latitude,
//                             dll.Lng AS Driver_Longitude,
//                             vdn.registration_no AS vehicle_No,
//                             vdn.vehicleType
//                         FROM 
//                             Driver_Details d
//                         JOIN 
//                             DriverLiveLocation dll ON d.driver_id = dll.DriverID
//                         JOIN 
//                             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
//                         JOIN 
//                             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
//                                                   AND dva.VehicleID = vdn.VehicleID;
//                     `;
//                     return await request.query(fallbackQuery);
//                 }
//             })
//             .then(result => {
//                 if (result.recordset.length > 0) {
//                     console.log(`[SUCCESS]: ${result.recordset.length} vehicle(s) found`);
//                     resolve({ status: "00", message: "Vehicle records found", data: result.recordset });
//                 } else {
//                     console.log(`[INFO]: No vehicle records found`);
//                     resolve({ status: "01", message: "No records found", data: [] });
//                 }
//             })
//             .catch(error => {
//                 console.error(`[ERROR]: getVehicleActiveDB SQL Error: ${error.message}`);
//                 reject({ status: "99", message: `SQL Error: ${error.message}` });
//             });
//     });
// };

exports.getvehicleavailableDB = (data) => {
    console.log(`[INFO]: Fetching active vehicle details for vendorid: ${data.vendorid}, driverid: ${data.driverid || 'N/A'}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(async pool => {
                const request = pool.request();

                // Common inputs
                request.input('vendorid', sql.NVarChar(10), data.vendorid || null);
                request.input('radiusKm', sql.Float, 500);
                if (data.driverid) request.input('driverid', sql.NVarChar(10), data.driverid);

                // ================================
                // CASE 1: vendorid + driverid
                // ================================
                if (data.vendorid && !data.driverid) {
                    const mainQuery = `
                    SELECT 
                            d.driver_id,
                            d.full_name AS Driver_Name,
                            dll.Lat AS Driver_Latitude,
                            dll.Lng AS Driver_Longitude,
                            vdn.registration_no AS vehicle_No,
                            vdn.vehicleType,
                            cps.LP_Status,
                            clp.LoadPostID,
                            cla.Origin_Lat AS pickup_Latitude,
                            cla.Origin_Lng AS pickup_Longitude,
                            cla.Destination_Lat AS dropoff_Latitude,
                            cla.Destination_Lng AS dropoff_Longitude,
                            6371 * ACOS(
                                COS(RADIANS(dll.Lat)) 
                                * COS(RADIANS(cla.Origin_Lat)) 
                                * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                + SIN(RADIANS(dll.Lat)) 
                                * SIN(RADIANS(cla.Origin_Lat))
                            ) AS DriverToOriginKm,
                            6371 * ACOS(
                                COS(RADIANS(cla.Origin_Lat)) 
                                * COS(RADIANS(cla.Destination_Lat)) 
                                * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                + SIN(RADIANS(cla.Origin_Lat)) 
                                * SIN(RADIANS(cla.Destination_Lat))
                            ) AS OriginToDestinationKm
                        FROM 
                            Driver_Details d
                        JOIN 
                            DriverLiveLocation dll ON d.driver_id = dll.DriverID
                        JOIN 
                            DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                        JOIN 
                            VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                  AND dva.VehicleID = vdn.VehicleID
                        LEFT JOIN 
                            CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
                        LEFT JOIN 
                            CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                        LEFT JOIN 
                            CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                        WHERE 
                            d.VendorID = @vendorid
                            AND dva.IsActive = 1
                            AND cps.LP_Status = 'Pending'
                            AND (
                                6371 * ACOS(
                                    COS(RADIANS(dll.Lat)) 
                                    * COS(RADIANS(cla.Origin_Lat)) 
                                    * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                    + SIN(RADIANS(dll.Lat)) 
                                    * SIN(RADIANS(cla.Origin_Lat))
                                )
                            ) <= @radiusKm
                        ORDER BY DriverToOriginKm ASC;
                    `;
                        
                    const mainResult = await request.query(mainQuery);
                     return mainResult;
                    // // ✅ Fallback condition
                    // if (mainResult.recordset.length === 0) {
                    //     console.log(`[INFO]: No active trips found for driver ${data.driverid}, running fallback query...`);

                    //     const fallbackQuery = `
                    //         SELECT 
                    //             d.driver_id,
                    //             d.full_name AS Driver_Name,
                    //             dll.Lat AS Driver_Latitude,
                    //             dll.Lng AS Driver_Longitude,
                    //             vdn.registration_no AS vehicle_No,
                    //             vdn.vehicleType
                    //         FROM 
                    //             Driver_Details d
                    //         JOIN 
                    //             DriverLiveLocation dll ON d.driver_id = dll.DriverID
                    //         JOIN 
                    //             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                    //         JOIN 
                    //             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                    //                                   AND dva.VehicleID = vdn.VehicleID
                    //         WHERE 
                    //             d.VendorID = @vendorid
                    //             AND dva.IsActive = 1
                    //     `;
                    //     const fallbackResult = await request.query(fallbackQuery);
                    //     return fallbackResult;
                    // } else {
                    //     return mainResult;
                    // }
                }

                // ================================
                // CASE 2: Only vendorid (Pending trips)
                // ================================
                else if (data.vendorid && data.driverid) {
                    const vendorQuery = `
                    SELECT 
                            d.driver_id,
                            d.full_name AS Driver_Name,
                            dll.Lat AS Driver_Latitude,
                            dll.Lng AS Driver_Longitude,
                            vdn.registration_no AS vehicle_No,
                            vdn.vehicleType,
                            cps.LP_Status,
                            clp.LoadPostID,
                            cla.Origin_Lat AS pickup_Latitude,
                            cla.Origin_Lng AS pickup_Longitude,
                            cla.Destination_Lat AS dropoff_Latitude,
                            cla.Destination_Lng AS dropoff_Longitude,
                            6371 * ACOS(
                                COS(RADIANS(dll.Lat)) 
                                * COS(RADIANS(cla.Origin_Lat)) 
                                * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                + SIN(RADIANS(dll.Lat)) 
                                * SIN(RADIANS(cla.Origin_Lat))
                            ) AS DriverToOriginKm,
                            6371 * ACOS(
                                COS(RADIANS(cla.Origin_Lat)) 
                                * COS(RADIANS(cla.Destination_Lat)) 
                                * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                + SIN(RADIANS(cla.Origin_Lat)) 
                                * SIN(RADIANS(cla.Destination_Lat))
                            ) AS OriginToDestinationKm
                        FROM 
                            Driver_Details d
                        JOIN 
                            DriverLiveLocation dll ON d.driver_id = dll.DriverID
                        JOIN 
                            DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                        JOIN 
                            VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                  AND dva.VehicleID = vdn.VehicleID
                        LEFT JOIN 
                            CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
                        LEFT JOIN 
                            CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                        LEFT JOIN 
                            CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                        WHERE 
                            d.VendorID = @vendorid
                            AND dva.IsActive = 1
                            AND d.driver_id = @driverid
                            AND cps.LP_Status = 'pending'
                            AND (
                                6371 * ACOS(
                                    COS(RADIANS(dll.Lat)) 
                                    * COS(RADIANS(cla.Origin_Lat)) 
                                    * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                    + SIN(RADIANS(dll.Lat)) 
                                    * SIN(RADIANS(cla.Origin_Lat))
                                )
                            ) <= @radiusKm
                        ORDER BY DriverToOriginKm ASC;
                    `;

                        
                    return await request.query(vendorQuery);
                }

                // // ================================
                // // CASE 3: No vendorid (fallback)
                // // ================================
                // else {
                //     const fallbackQuery = `
                //         SELECT 
                //             d.driver_id,
                //             d.full_name AS Driver_Name,
                //             dll.Lat AS Driver_Latitude,
                //             dll.Lng AS Driver_Longitude,
                //             vdn.registration_no AS vehicle_No,
                //             vdn.vehicleType
                //         FROM 
                //             Driver_Details d
                //         JOIN 
                //             DriverLiveLocation dll ON d.driver_id = dll.DriverID
                //         JOIN 
                //             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                //         JOIN 
                //             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                //                                   AND dva.VehicleID = vdn.VehicleID;
                //     `;
                //     return await request.query(fallbackQuery);
                // }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: ${result.recordset.length} vehicle(s) found`);
                    resolve({ status: "00", message: "Vehicle records found", data: result.recordset });
                } else {
                    console.log(`[INFO]: No vehicle records found`);
                    resolve({ status: "01", message: "No records found", data: [] });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: getVehicleActiveDB SQL Error: ${error.message}`);
                reject({ status: "99", message: `SQL Error: ${error.message}` });
            });
    });
};

exports.getvehicleprocessDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => { 
                const request = pool.request(); 
                request.input('vendorid', sql.NVarChar(10), data.vendorid);
                request.input('driverid', sql.NVarChar(10), data.driverid);
                request.input('radiusKm', sql.Float, 100000);
                  if (!data.driverid) {
                    return request.query(`
                                           SELECT 
                                               d.driver_id,
                                               d.full_name AS Driver_Name,
                                               dll.Lat AS Driver_Latitude,
                                               dll.Lng AS Driver_Longitude,
                                               vdn.registration_no AS vehicle_No,
                                               vdn.vehicleType,
                                               cps.LP_Status,
                                               clp.LoadPostID,
                                               cla.Origin_Lat AS pickup_Latitude,
                                               cla.Origin_Lng AS pickup_Longitude,
                                               cla.Destination_Lat AS dropoff_Latitude,
                                               cla.Destination_Lng AS dropoff_Longitude,

                                               -- Distance (in km) between driver and load origin
                                               6371 * ACOS(
                                                   COS(RADIANS(dll.Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                   + SIN(RADIANS(dll.Lat)) 
                                                   * SIN(RADIANS(cla.Origin_Lat))
                                               ) AS DriverToOriginKm,
                                           
                                               -- Distance (in km) between load origin and destination
                                               6371 * ACOS(
                                                   COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                                   + SIN(RADIANS(cla.Origin_Lat)) 
                                                   * SIN(RADIANS(cla.Destination_Lat))
                                               ) AS OriginToDestinationKm
                                           
                                           FROM 
                                               Driver_Details d
                                           JOIN 
                                               DriverLiveLocation dll ON d.driver_id = dll.DriverID
                                           JOIN 
                                               DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                                           JOIN 
                                               VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                                     AND dva.VehicleID = vdn.VehicleID
                                           LEFT JOIN 
                                               CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
                                           LEFT JOIN 
                                               CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                                           LEFT JOIN 
                                               CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                                           WHERE 
                                               d.VendorID = @vendorid
                                               AND dva.IsActive = 1
                                               AND cps.LP_Status = 'Progress'
                                               AND (
                                                   6371 * ACOS(
                                                       COS(RADIANS(dll.Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                       + SIN(RADIANS(dll.Lat)) 
                                                       * SIN(RADIANS(cla.Origin_Lat))
                                                   )
                                               ) <= @radiusKm
                                           ORDER BY 
                                               DriverToOriginKm ASC;
                                           `);
                } else {
                    return request.query(`SELECT 
                                               d.driver_id,
                                               d.full_name AS Driver_Name,
                                               dll.Lat AS Driver_Latitude,
                                               dll.Lng AS Driver_Longitude,
                                               vdn.registration_no AS vehicle_No,
                                               vdn.vehicleType,
                                               cps.LP_Status,
                                               clp.LoadPostID,
                                               cla.Origin_Lat AS pickup_Latitude,
                                               cla.Origin_Lng AS pickup_Longitude,
                                               cla.Destination_Lat AS dropoff_Latitude,
                                               cla.Destination_Lng AS dropoff_Longitude,

                                               -- Distance (in km) between driver and load origin
                                               6371 * ACOS(
                                                   COS(RADIANS(dll.Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                   + SIN(RADIANS(dll.Lat)) 
                                                   * SIN(RADIANS(cla.Origin_Lat))
                                               ) AS DriverToOriginKm,
                                           
                                               -- Distance (in km) between load origin and destination
                                               6371 * ACOS(
                                                   COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                                   + SIN(RADIANS(cla.Origin_Lat)) 
                                                   * SIN(RADIANS(cla.Destination_Lat))
                                               ) AS OriginToDestinationKm
                                           
                                           FROM 
                                               Driver_Details d
                                           JOIN 
                                               DriverLiveLocation dll ON d.driver_id = dll.DriverID
                                           JOIN 
                                               DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                                           JOIN 
                                               VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                                     AND dva.VehicleID = vdn.VehicleID
                                           LEFT JOIN 
                                               CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
                                           LEFT JOIN 
                                               CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                                           LEFT JOIN 
                                               CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                                           WHERE 
                                               d.VendorID = @vendorid
                                               AND dva.IsActive = 1
                                               AND d.driver_id = @driverid
                                               AND cps.LP_Status = 'Progress'
                                               AND (
                                                   6371 * ACOS(
                                                       COS(RADIANS(dll.Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                       + SIN(RADIANS(dll.Lat)) 
                                                       * SIN(RADIANS(cla.Origin_Lat))
                                                   )
                                               ) <= @radiusKm
                                           ORDER BY 
                                               DriverToOriginKm ASC;
`);              
      }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: get vehicle process found `);
                    resolve({ status: "00", message: `get vehicle process records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for get vehicle process`);
                    resolve({ status: "01", message: `No records found for get vehicle process`, data: result.recordset });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: get vehicle process Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

};

exports.getvehicleactiveDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(10), data.vendorid);
                request.input('driverid', sql.NVarChar(10), data.driverid);
                request.input('radiusKm', sql.Float, 100000);
                  if (!data.driverid) {
                    return request.query(`
                                           SELECT 
                                               d.driver_id,
                                               d.full_name AS Driver_Name,
                                               dll.Lat AS Driver_Latitude,
                                               dll.Lng AS Driver_Longitude,
                                               vdn.registration_no AS vehicle_No,
                                               vdn.vehicleType,
                                               cps.LP_Status,
                                               clp.LoadPostID,
                                               cla.Origin_Lat AS pickup_Latitude,
                                               cla.Origin_Lng AS pickup_Longitude,
                                               cla.Destination_Lat AS dropoff_Latitude,
                                               cla.Destination_Lng AS dropoff_Longitude,

                                               -- Distance (in km) between driver and load origin
                                               6371 * ACOS(
                                                   COS(RADIANS(dll.Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                   + SIN(RADIANS(dll.Lat)) 
                                                   * SIN(RADIANS(cla.Origin_Lat))
                                               ) AS DriverToOriginKm,
                                           
                                               -- Distance (in km) between load origin and destination
                                               6371 * ACOS(
                                                   COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                                   + SIN(RADIANS(cla.Origin_Lat)) 
                                                   * SIN(RADIANS(cla.Destination_Lat))
                                               ) AS OriginToDestinationKm
                                           
                                           FROM 
                                               Driver_Details d
                                           JOIN 
                                               DriverLiveLocation dll ON d.driver_id = dll.DriverID
                                           JOIN 
                                               DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                                           JOIN 
                                               VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                                     AND dva.VehicleID = vdn.VehicleID
                                           LEFT JOIN 
                                               CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
                                           LEFT JOIN 
                                               CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                                           LEFT JOIN 
                                               CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                                           WHERE 
                                               d.VendorID = @vendorid
                                               AND dva.IsActive = 1
                                               AND cps.LP_Status = 'Active'
                                               AND (
                                                   6371 * ACOS(
                                                       COS(RADIANS(dll.Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                       + SIN(RADIANS(dll.Lat)) 
                                                       * SIN(RADIANS(cla.Origin_Lat))
                                                   )
                                               ) <= @radiusKm
                                           ORDER BY 
                                               DriverToOriginKm ASC;
                                           `);
                } else {
                    return request.query(`SELECT 
                                               d.driver_id,
                                               d.full_name AS Driver_Name,
                                               dll.Lat AS Driver_Latitude,
                                               dll.Lng AS Driver_Longitude,
                                               vdn.registration_no AS vehicle_No,
                                               vdn.vehicleType,
                                               cps.LP_Status,
                                               clp.LoadPostID,
                                               cla.Origin_Lat AS pickup_Latitude,
                                               cla.Origin_Lng AS pickup_Longitude,
                                               cla.Destination_Lat AS dropoff_Latitude,
                                               cla.Destination_Lng AS dropoff_Longitude,

                                               -- Distance (in km) between driver and load origin
                                               6371 * ACOS(
                                                   COS(RADIANS(dll.Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                   + SIN(RADIANS(dll.Lat)) 
                                                   * SIN(RADIANS(cla.Origin_Lat))
                                               ) AS DriverToOriginKm,
                                           
                                               -- Distance (in km) between load origin and destination
                                               6371 * ACOS(
                                                   COS(RADIANS(cla.Origin_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lat)) 
                                                   * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                                   + SIN(RADIANS(cla.Origin_Lat)) 
                                                   * SIN(RADIANS(cla.Destination_Lat))
                                               ) AS OriginToDestinationKm
                                           
                                           FROM 
                                               Driver_Details d
                                           JOIN 
                                               DriverLiveLocation dll ON d.driver_id = dll.DriverID
                                           JOIN 
                                               DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                                           JOIN 
                                               VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                                     AND dva.VehicleID = vdn.VehicleID
                                           LEFT JOIN 
                                               CustomerPostStatus cps ON dll.Driver_LPStatus = cps.LP_Status
                                           LEFT JOIN 
                                               CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                                           LEFT JOIN 
                                               CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                                           WHERE 
                                               d.VendorID = @vendorid
                                               AND dva.IsActive = 1
                                               AND d.driver_id = @driverid
                                               AND cps.LP_Status = 'Active'
                                               AND (
                                                   6371 * ACOS(
                                                       COS(RADIANS(dll.Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lat)) 
                                                       * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                                       + SIN(RADIANS(dll.Lat)) 
                                                       * SIN(RADIANS(cla.Origin_Lat))
                                                   )
                                               ) <= @radiusKm
                                           ORDER BY 
                                               DriverToOriginKm ASC;
`);
        }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: get vehicle active found `);
                    resolve({ status: "00", message: `get vehicle active records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for get vehicle active`);
                    resolve({ status: "01", message: `No records found for get vehicle active`, data: result.recordset });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: get vehicle active Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

};

exports.getvehicleclosedDB = (data) => {
    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();
                request.input('vendorid', sql.NVarChar(10), data.vendorid);
                request.input('driverid', sql.NVarChar(10), data.driverid);
                  if (!data.driverid) {
                    return request.query(` SELECT 
                                             d.driver_id,
                                             d.full_name AS Driver_Name,
                                             dll.Lat AS Driver_Latitude,
                                             dll.Lng AS Driver_Longitude,
                                             vdn.registration_no AS vehicle_No,
                                             vdn.vehicleType,
                                             
                                             -- If Driver_LPStatus is Inactive or Closed, force it to 'Closed'
                                             CASE 
                                                 WHEN LOWER(dll.Driver_LPStatus) IN ('inactive', 'closed') THEN 'Closed'
                                                 ELSE cps.LP_Status
                                             END AS LP_Status ,
											 cla.Origin_District,
											 cla.Destination_District
                                             
                                          --   clp.LoadPostID,
                                          --   cla.Origin_Lat AS pickup_Latitude,
                                          --   cla.Origin_Lng AS pickup_Longitude,
                                          --   cla.Destination_Lat AS dropoff_Latitude,
                                          --   cla.Destination_Lng AS dropoff_Longitude,
                                         --
                                          --   -- Distance between driver and load origin
                                          --   6371 * ACOS(
                                          --       COS(RADIANS(dll.Lat)) 
                                          --       * COS(RADIANS(cla.Origin_Lat)) 
                                          --       * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                          --       + SIN(RADIANS(dll.Lat)) 
                                          --       * SIN(RADIANS(cla.Origin_Lat))
                                          --   ) AS DriverToOriginKm,
                                         --
                                          --   -- Distance between load origin and destination
                                          --   6371 * ACOS(
                                          --       COS(RADIANS(cla.Origin_Lat)) 
                                          --       * COS(RADIANS(cla.Destination_Lat)) 
                                          --       * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                          --       + SIN(RADIANS(cla.Origin_Lat)) 
                                          --       * SIN(RADIANS(cla.Destination_Lat))
                                          --   ) AS OriginToDestinationKm
                                         
                                         FROM 
                                             Driver_Details d
                                         JOIN 
                                             DriverLiveLocation dll ON d.driver_id = dll.DriverID
                                         JOIN 
                                             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                                         JOIN 
                                             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                                   AND dva.VehicleID = vdn.VehicleID
                                         LEFT JOIN 
                                             CustomerPostStatus cps 
                                             ON (
                                                 CASE 
                                                     WHEN LOWER(dll.Driver_LPStatus) IN ('inactive', 'closed') THEN 'Closed'
                                                     ELSE dll.Driver_LPStatus
                                                 END
                                             ) = cps.LP_Status
                                         LEFT JOIN 
                                             CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                                         LEFT JOIN 
                                             CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                                         
                                         WHERE 
                                             d.VendorID = @vendorid
                                             AND dva.IsActive = 1
                                             AND (
                                                 CASE 
                                                     WHEN LOWER(dll.Driver_LPStatus) IN ('inactive', 'closed') THEN 'Closed'
                                                     ELSE cps.LP_Status
                                                 END
                                             ) = 'Closed'
                                         
                                         ORDER BY 
                                             clp.insert_date ASC`);
                     } else {
                         return request.query(`SELECT 
                                             d.driver_id,
                                             d.full_name AS Driver_Name,
                                             dll.Lat AS Driver_Latitude,
                                             dll.Lng AS Driver_Longitude,
                                             vdn.registration_no AS vehicle_No,
                                             vdn.vehicleType,
                                             
                                             -- If Driver_LPStatus is Inactive or Closed, force it to 'Closed'
                                             CASE 
                                                 WHEN LOWER(dll.Driver_LPStatus) IN ('inactive', 'closed') THEN 'Closed'
                                                 ELSE cps.LP_Status
                                             END AS LP_Status ,
											 cla.Origin_District,
											 cla.Destination_District
                                             
                                          --   clp.LoadPostID,
                                          --   cla.Origin_Lat AS pickup_Latitude,
                                          --   cla.Origin_Lng AS pickup_Longitude,
                                          --   cla.Destination_Lat AS dropoff_Latitude,
                                          --   cla.Destination_Lng AS dropoff_Longitude,
                                         --
                                          --   -- Distance between driver and load origin
                                          --   6371 * ACOS(
                                          --       COS(RADIANS(dll.Lat)) 
                                          --       * COS(RADIANS(cla.Origin_Lat)) 
                                          --       * COS(RADIANS(cla.Origin_Lng) - RADIANS(dll.Lng)) 
                                          --       + SIN(RADIANS(dll.Lat)) 
                                          --       * SIN(RADIANS(cla.Origin_Lat))
                                          --   ) AS DriverToOriginKm,
                                         --
                                          --   -- Distance between load origin and destination
                                          --   6371 * ACOS(
                                          --       COS(RADIANS(cla.Origin_Lat)) 
                                          --       * COS(RADIANS(cla.Destination_Lat)) 
                                          --       * COS(RADIANS(cla.Destination_Lng) - RADIANS(cla.Origin_Lng)) 
                                          --       + SIN(RADIANS(cla.Origin_Lat)) 
                                          --       * SIN(RADIANS(cla.Destination_Lat))
                                          --   ) AS OriginToDestinationKm
                                         
                                         FROM 
                                             Driver_Details d
                                         JOIN 
                                             DriverLiveLocation dll ON d.driver_id = dll.DriverID
                                         JOIN 
                                             DriverVehicleAssign dva ON dll.DriverID = dva.DriverID
                                         JOIN 
                                             VehicleDetailsNew vdn ON dva.VendorID = vdn.VendorID 
                                                                   AND dva.VehicleID = vdn.VehicleID
                                         LEFT JOIN 
                                             CustomerPostStatus cps 
                                             ON (
                                                 CASE 
                                                     WHEN LOWER(dll.Driver_LPStatus) IN ('inactive', 'closed') THEN 'Closed'
                                                     ELSE dll.Driver_LPStatus
                                                 END
                                             ) = cps.LP_Status
                                         LEFT JOIN 
                                             CustomerLoadPost clp ON cps.CustomerPostID = clp.LoadPostID
                                         LEFT JOIN 
                                             CustomerLoadPostAddress cla ON clp.LoadPostID = cla.LoadPostID
                                         
                                         WHERE 
                                             d.VendorID = @vendorid
                                             AND dva.IsActive = 1
                                              AND d.driver_id = @driverid
                                             AND (
                                                 CASE 
                                                     WHEN LOWER(dll.Driver_LPStatus) IN ('inactive', 'closed') THEN 'Closed'
                                                     ELSE cps.LP_Status
                                                 END
                                             ) = 'Closed'
                                         
                                         ORDER BY 
                                             clp.insert_date ASC`);
        }
            })
            .then(result => {
                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: get vehicle closed found `);
                    resolve({ status: "00", message: `get vehicle closed records found `, data: result.recordset });
                }
                else {
                    console.log(`[INFO]: No records found for get vehicle closed`);
                    resolve({ status: "01", message: `No records found for get vehicle closed`, data: result.recordset });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: get vehicle closed Error: SQL Error: ${error.message}`);
                reject({ message: 'SQL Error: ' + error.message, status: "01" });
            });
    });

};
     