const sql = require('mssql');
const pool = require('../../../db/db.js');
const logger = require('../../../log/logger.js');

exports.getActiveLoadPostWebAPIDB = async (data) => {
    console.log(`[INFO]: Fetching customer Completed : ${JSON.stringify(data)}`);

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

                // Validate CustomerID
                if (!data.CustomerID) {
                    console.log('[ERROR]: CustomerID is missing in request');
                    return resolve({
                        status: "01",
                        message: "CustomerID is required",
                        data: []
                    });
                }

                console.log(`[DEBUG]: Setting CustomerID parameter: ${data.CustomerID}`);
                request.input('CustomerID', sql.NVarChar(10), data.CustomerID);

                let whereConditions = ["cps.trip_status = 'Active'", "clp.CustomerID = @CustomerID"];
                if (data.LoadPostID) {
                    console.log(`[DEBUG]: Setting LoadPostID parameter: ${data.LoadPostID}`);
                    request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID);
                    whereConditions.push("clp.LoadPostID = @LoadPostID");
                }

                if (data.FromDate && data.ToDate) {
                    console.log(`[DEBUG]: Setting Date parameters: ${data.FromDate} to ${data.ToDate}`);
                    request.input('FromDate', sql.Date, data.FromDate);
                    request.input('ToDate', sql.Date, data.ToDate);
                    whereConditions.push("CAST(cps.update_date AS DATE) BETWEEN @FromDate AND @ToDate");
                }

                const query = `
                    SELECT
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
                        
                        -- Origin Address
                        cla.Origin_Lat,
                        cla.Origin_Lng,
                        cla.Origin_City,
                        cla.Origin_District,
                        cla.Origin_Taluka,
                        cla.Origin_State,
                        cla.Origin_Pincode,
                        
                        -- Destination Address
                        cla.Destination_Lat,
                        cla.Destination_Lng,
                        cla.Destination_City,
                        cla.Destination_District,
                        cla.Destination_Taluka,
                        cla.Destination_State,
                        cla.Destination_Pincode,
                        cla.insert_date AS AddressInsertDate,
                        cla.update_date AS AddressUpdateDate,
                        
                        -- Customer Post Status
                        cps.CustomerPostID,
                        cps.CustomerID As cpsCustomerID,
                        cps.VendorID,
                        cps.DriverID,
                        cps.CustomerStatus,
                        cps.VendorStatus,
                        cps.DriverStatus,
                        cps.trip_status AS tripStatus,
                        
                        -- Driver Location
                        dll.Lat AS DriverLat,
                        dll.Lng AS DriverLng,
                        dll.DriverID AS dllDriverID,
                        dll.MobileNo,
                        dd.full_name AS DriverName,

                        -- Calculate distances (simplified without subqueries)
                        CAST([dbo].[CalculateDistance](
                            cla.Origin_Lat, cla.Origin_Lng, 
                            cla.Destination_Lat, cla.Destination_Lng
                        ) AS DECIMAL(10,2)) AS total_km,
                        
                        CAST([dbo].[CalculateDistance](
                            cla.Origin_Lat, cla.Origin_Lng, 
                            dll.Lat, dll.Lng
                        ) AS DECIMAL(10,2)) AS covered_km,
                        
                        CAST([dbo].[CalculateDistance](
                            dll.Lat, dll.Lng, 
                            cla.Destination_Lat, cla.Destination_Lng
                        ) AS DECIMAL(10,2)) AS pending_km,
                        
                        -- Progress percentage
                        CASE 
                            WHEN [dbo].[CalculateDistance](
                                cla.Origin_Lat, cla.Origin_Lng, 
                                cla.Destination_Lat, cla.Destination_Lng
                            ) > 0 
                            THEN CAST(
                                ([dbo].[CalculateDistance](
                                    cla.Origin_Lat, cla.Origin_Lng, 
                                    dll.Lat, dll.Lng
                                ) / [dbo].[CalculateDistance](
                                    cla.Origin_Lat, cla.Origin_Lng, 
                                    cla.Destination_Lat, cla.Destination_Lng
                                )) * 100 AS DECIMAL(5,2)
                            )
                            ELSE 0 
                        END AS progress_percentage

                    FROM CustomerLoadPost clp   
                    JOIN CustomerLoadPostAddress cla
                        ON clp.LoadPostID = cla.LoadPostID
                    JOIN CustomerPostStatus cps
                        ON clp.LoadPostID = cps.CustomerPostID
                    JOIN DriverLiveLocation dll
                        ON cps.DriverID = dll.DriverID
                    JOIN Driver_Details dd
                        ON dll.DriverID = dd.driver_id
                    WHERE ${whereConditions.join(' AND ')}
                    ORDER BY clp.insert_date DESC;
                `;

                console.log(`[INFO]: Executing Query with conditions: ${whereConditions.join(', ')}`);
                console.log(`[DEBUG]: Full Query: ${query}`);

                return request.query(query);
            })
            .then(result => {
                console.log(`[DEBUG]: Query executed successfully. Records found: ${result.recordset.length}`);

                if (result.recordset.length > 0) {
                    console.log(`[SUCCESS]: Found ${result.recordset.length} records for CustomerID: ${data.CustomerID}`);
                    console.log(`[DEBUG]: First record:`, result.recordset[0]);
                    resolve({
                        status: "00",
                        message: `Records found successfully`,
                        data: result.recordset
                    });
                } else {
                    console.log(`[INFO]: No records found for CustomerID: ${data.CustomerID}`);
                    console.log(`[DEBUG]: Possible reasons:`);
                    console.log(`[DEBUG]: - No active trips for this customer`);
                    console.log(`[DEBUG]: - CustomerID doesn't exist in database`);
                    console.log(`[DEBUG]: - No matching records in joined tables`);
                    resolve({
                        status: "01",
                        message: `No active load posts found for customer ${data.CustomerID}`,
                        data: []
                    });
                }
            })
            .catch(error => {
                console.error(`[ERROR]: SQL Error: ${error.message}`);
                console.error(`[ERROR]: Stack trace:`, error.stack);
                reject({
                    message: 'SQL Error: ' + error.message,
                    status: "99"
                });
            });
    });
};

