const sql = require('mssql');
const pool = require('../../../../db/db.js');
const logger = require('../../../../log/logger');
const { log } = require('async');
exports.DriverNearestCustomerPostDB = async (data) => {
  console.log("[INFO]: Fetching nearest customer posts", data);

  try {
    const poolConn = await sql.connect(pool);
    const request = poolConn.request();

    const lat = Number(data.lat);
    const lng = Number(data.lng);
    const radius = Number(data.radius || 5000);

    request.input("lat", sql.Float, lat);
    request.input("lng", sql.Float, lng);
    request.input("radius", sql.Int, radius);
    request.input("vehicleType", sql.NVarChar(100), data.vehicleType);
console.log({
  lat: typeof lat,
  lng: typeof lng,
  radius,
  vehicleType: data.vehicleType
});

    const result = await request.query(`
      SELECT TOP 50
        clp.LoadPostID,
        cps.CustomerID,
        cla.PickupAddress,
        cla.PickupLat,
        cla.PickupLng,
        clp.VehicleType,

        CAST(
          6371 * ACOS(
            CASE 
              WHEN (
                COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
              ) > 1 THEN 1
              WHEN (
                COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
              ) < -1 THEN -1
              ELSE (
                COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
              )
            END
          ) AS DECIMAL(10,2)
        ) AS PickupDistanceKm

      FROM CustomerLoadPost clp
      JOIN CustomerLoadPostAddress cla
        ON clp.LoadPostID = cla.LoadPostID
      LEFT JOIN CustomerPostStatus cps
        ON clp.LoadPostID = cps.CustomerPostID

      WHERE LOWER(LTRIM(RTRIM(clp.VehicleType))) =
            LOWER(LTRIM(RTRIM(@vehicleType)))
        AND (
          6371 * ACOS(
            COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
            COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
            SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
          ) <= (@radius / 1000.0)
        )
      ORDER BY clp.insert_date DESC
    `);

    console.log("[INFO] Rows found:", result.recordset.length);

    return {
      status: result.recordset.length ? "00" : "01",
      data: result.recordset
    };

  } catch (err) {
    console.error("❌ ERROR:", err);
    throw err;
  }
};



// exports.DriverNearestCustomerPostDB = async (data) => {
//     console.log(`[INFO]: Fetching nearest customer posts for data: ${JSON.stringify(data)}`);
//     try {
//         const poolConn = await sql.connect(pool);
//         const request = poolConn.request();

//         // Inputs
//         request.input('Lat', sql.Decimal(9, 6), data.lat);
//         request.input('Lng', sql.Decimal(9, 6), data.lng);
//         request.input('radius', sql.Int, 5); // 5 KM only
//         request.input('vehicleType', sql.NVarChar(100), data.vehicleType);

//         console.log("[INFO] SQL Inputs:", {
//             lat: data.lat,
//             lng: data.lng,
//             radius: data.radius || 5,
//             vehicleType: data.vehicleType
//         });


//         const result = await request.query(`
// -- DECLARE @Lat NVARCHAR(50) =  '19.1623701';
// -- DECLARE @Lng NVARCHAR(50) = '72.9376316';
// -- DECLARE @VehicleType NVARCHAR(50) ='Multi Axle';

// SELECT TOP 50
//     clp.LoadPostID,
//     cps.CustomerID,
//     dll.DriverID,
//     dll.VendorID,
//     cla.PickupAddress,
//     cla.PickupLat,
//     cla.PickupLng,
//     cla.PickupContactPerson,
//     cla.PickupContactNumber,
//     cla.PickupPlotBuilding,
//     cla.PickupStreetArea,
//     cla.PickupCity,
//     cla.PickupDistrict,
//     cla.PickupTaluka,
//     cla.PickupState,
//     cla.PickupPincode,
//     cla.DeliveryAddress,
//     cla.DeliveryLat,
//     cla.DeliveryLng,
//     cla.DeliveryContactPerson,
//     cla.DeliveryContactNumber,
//     cla.DeliveryPlotBuilding,
//     cla.DeliveryStreetArea,
//     cla.DeliveryCity,
//     cla.DeliveryDistrict,
//     cla.DeliveryTaluka,
//     cla.DeliveryState,
//     cla.DeliveryPincode,
//     clp.VehicleType,
//     clp.BodyType,
//     clp.Weight AS ApproxWeight,
//     clp.CargoContent,
//     clp.CargoPackageType,
//     vwr.Img AS Vehicle_IMG,
//     ct.img AS CargoType_IMG,
//     cp.Img AS CargoPackage_IMG,
//     dll.MobileNo AS DriverMobile,
//     dll.VehicleID AS VehicleNumber,
//     dll.Lat AS DriverLat,
//     dll.Lng AS DriverLng,
//     dll.Status AS DriverStatus,
//     dll.LastUpdated AS DriverLastUpdate,
//     cps.LP_Status,
//     cps.CustomerStatus,
//     dlp.DriverStatus,
//     dlp.VehicleStatus AS DriverVehicleStatus,
//     clp.ExpectedAvailableTime,
//     FORMAT(clp.insert_date, 'yyyy-MM-dd') AS PostDate,
//     CASE 
//         WHEN @lat IS NOT NULL AND @lng IS NOT NULL THEN
//             CAST(
//                 6371 * ACOS(
//                     CASE 
//                         WHEN (
//                             COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
//                             COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
//                             SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
//                         ) > 1 THEN 1
//                         WHEN (
//                             COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
//                             COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
//                             SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
//                         ) < -1 THEN -1
//                         ELSE (
//                             COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
//                             COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
//                             SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
//                         )
//                     END
//                 ) AS DECIMAL(10,2)
//             )
//         ELSE NULL
//     END AS PickupDistanceKm

// FROM CustomerLoadPost clp
// INNER JOIN CustomerLoadPostAddress cla
//     ON clp.LoadPostID = cla.LoadPostID
// LEFT JOIN CustomerPostStatus cps
//     ON clp.LoadPostID = cps.CustomerPostID
// LEFT JOIN VehicleWeightRange vwr
//     ON clp.VehicleType = vwr.VehicleType AND clp.Weight = vwr.WeightRange
// LEFT JOIN CargoTypes ct
//     ON clp.CargoContent = ct.cargo_type
// LEFT JOIN (
//     SELECT packaging_type, cargo_type, MIN(Img) AS Img
//     FROM Cargopackag
//     GROUP BY packaging_type, cargo_type
// ) cp
//     ON clp.CargoPackageType = cp.packaging_type AND clp.CargoContent = cp.cargo_type
// OUTER APPLY (
//     SELECT TOP 1 *
//     FROM DriverLoadPost
//     WHERE VehicleType = clp.VehicleType
//     ORDER BY insert_date DESC
// ) dlp
// LEFT JOIN DriverLiveLocation dll
//     ON dlp.DriverID = dll.DriverID

// WHERE clp.VehicleType = @vehicleType
//   AND (@lat IS NULL OR (
//         6371 * ACOS(
//             CASE 
//                 WHEN (
//                     COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
//                     COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
//                     SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
//                 ) > 1 THEN 1
//                 WHEN (
//                     COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
//                     COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
//                     SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
//                 ) < -1 THEN -1
//                 ELSE (
//                     COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
//                     COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
//                     SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
//                 )
//             END
//         )
//     ) <= @radius
//   )
// ORDER BY clp.insert_date ASC;`);
// console.log( request.query`...`);

//  if (result.recordset.length > 0) {
//             console.log(`[SUCCESS]: Nearest customer posts found`);
//             return { status: "00", message: `Nearest customer posts found`, data: result.recordset };
//         } else {
//             console.log(`[INFO]: No nearest customer posts found`);
//             return { status: "01", message: `No nearest customer posts found`, data: [] };
//         }
//     } catch (error) {
//         console.log("error", `getNearestCustomerposttDB Error: ${error.message}`);
//         throw { message: 'SQL Error: ' + error.message, status: "01" };
//     }
// };


exports.getNearestCustomerposttDB = async (data) => {
    console.log(`[INFO]: Fetching nearest customer posts for data: ${JSON.stringify(data)}`);
    try {
        const poolConn = await sql.connect(pool);
        const request = poolConn.request();

        // Inputs
        request.input('lat', sql.Decimal(9, 6), data.Lat);
        request.input('lng', sql.Decimal(9, 6), data.Lng);
        request.input('radius', sql.Int, data.radius || 5000); // ✅ Default 5 km
        request.input('vehicleType', sql.NVarChar(100), data.VehicleType || 'Multi Axle');
        request.input('DriverID', sql.NVarChar(10), data.DriverID);

        const result = await request.query(`
                            -- 📌 INPUT PARAMETERS
-- DECLARE @lat          FLOAT        = 19.0760;
-- DECLARE @lng          FLOAT        = 72.8777;
-- DECLARE @radius       FLOAT        = 500000000000000000;
-- DECLARE @DriverID     NVARCHAR(50) = 'DR348884';
-- DECLARE @vehicleType  NVARCHAR(50) = 'Multi Axle';

SELECT TOP 50
    -- 🔑 IDs
    clp.LoadPostID,
    cps.CustomerID,
    dll.DriverID,
    dll.VendorID,

    -- 📍 PICKUP DETAILS
    cla.PickupAddress,
    cla.PickupLat,
    cla.PickupLng,
    cla.PickupContactPerson,
    cla.PickupContactNumber,
    cla.PickupPlotBuilding,
    cla.PickupStreetArea,
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,

    -- 📦 DELIVERY DETAILS
    cla.DeliveryAddress,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.DeliveryContactPerson,
    cla.DeliveryContactNumber,
    cla.DeliveryPlotBuilding,
    cla.DeliveryStreetArea,
    cla.DeliveryAddress,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,

    -- 🚚 VEHICLE & CARGO
    clp.VehicleType,
    clp.BodyType,
    clp.Weight AS ApproxWeight,
    clp.CargoContent,
    clp.CargoPackageType,

    -- 🖼 IMAGES
    vwr.Img AS Vehicle_IMG,
    ct.img AS CargoType_IMG,
    cp.Img AS CargoPackage_IMG,

    -- 🧭 DRIVER LIVE DATA
    dll.MobileNo AS DriverMobile,
    dll.VehicleID AS VehicleNumber,
    dll.Lat AS DriverLat,
    dll.Lng AS DriverLng,
    dll.Status AS DriverStatus,
    dll.LastUpdated AS DriverLastUpdate,

    -- 📌 STATUS
    cps.LP_Status,
    cps.CustomerStatus,
    dlp.DriverStatus,
    dlp.VehicleStatus AS DriverVehicleStatus,

    -- ⏱ TIME
    clp.ExpectedAvailableTime,
    FORMAT(clp.insert_date, 'yyyy-MM-dd') AS PostDate,

    -- 📏 PICKUP DISTANCE (KM)
    CAST(
        6371 * ACOS(
            CASE 
                WHEN (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                    COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
                ) > 1 THEN 1
                WHEN (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                    COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
                ) < -1 THEN -1
                ELSE (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                    COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
                )
            END
        ) AS DECIMAL(10,2)
    ) AS PickupDistanceKm

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
    SELECT TOP 1 *
    FROM DriverLoadPost
    WHERE DriverID = @DriverID
      AND VehicleType = clp.VehicleType
    ORDER BY insert_date DESC
) dlp

LEFT JOIN DriverLiveLocation dll
    ON dlp.DriverID = dll.DriverID

WHERE
   clp.VehicleType = @vehicleType
    AND dll.Status = 'Online'
    AND cps.LP_Status = 'Pending'
   AND cps.DriverStatus IS NULL
    AND cla.PickupLat IS NOT NULL
    AND cla.PickupLng IS NOT NULL
    AND
    (
        6371 * ACOS(
            CASE 
                WHEN (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                    COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
                ) > 1 THEN 1
                WHEN (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                    COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
                ) < -1 THEN -1
                ELSE (
                    COS(RADIANS(@lat)) * COS(RADIANS(cla.PickupLat)) *
                    COS(RADIANS(cla.PickupLng) - RADIANS(@lng)) +
                    SIN(RADIANS(@lat)) * SIN(RADIANS(cla.PickupLat))
                )
            END
        )
    ) <= @radius

ORDER BY clp.insert_date ASC;

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
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    JOIN Customer_Details CD
                                                    ON clp.CustomerID = CD.CustomerID
                                                    where cps.LP_Status = 'Progress' 
                                                    And clp.CustomerID = @CustomerID
                                              --      AND cps.customerpostid = @LoadPostID
                                                    ORDER BY clp.insert_date DESC;
`);
                } else {
                    return request.query(`SELECT
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                    JOIN Customer_Details CD
                                                    ON clp.CustomerID = CD.CustomerID
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
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
    cps.LP_Status
                                                    FROM CustomerLoadPost clp
                                                    JOIN CustomerLoadPostAddress cla
                                                        ON clp.LoadPostID = cla.LoadPostID  
                                                    JOIN CustomerPostStatus cps
                                                        ON clp.LoadPostID = cps.CustomerPostID
                                                    JOIN DriverLiveLocation dll
                                                        ON cps.DriverID = dll.DriverID
                                                  where cps.LP_Status = 'Active'
                                               --  where cps.LP_Status = 'Progress'
                                                    AND clp.CustomerID = @CustomerID
                                                 --   AND cps.customerpostid = @LoadPostID

                                                    ORDER BY clp.insert_date DESC;
`);
                } else {
                    return request.query(`SELECT
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
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
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
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
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
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
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
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
    -- ========= Load Post (clp) =========
    clp.LoadPostID,
    clp.CustomerID,
    clp.PickupContactPerson,
    clp.PickupCompanyName,
    clp.PickupContactNumber,
    clp.PickupPlotBuilding,
    clp.PickupStreetArea,
    clp.PickupAddress,
    clp.DeliveryContactPerson,
    clp.DeliveryCompanyName,
    clp.DeliveryContactNumber,
    clp.DeliveryPlotBuilding,
    clp.DeliveryStreetArea,
    clp.DeliveryAddress,
    clp.VehicleType,
    clp.Weight,
    clp.Approximate_weight,
    clp.cargo_type,
    clp.BodyType,
    clp.CargoContent,
    clp.CargoPackageType,
    clp.ExpectedAvailableTime,
    clp.ScheduleDate,
    clp.ScheduleTime,
    clp.isVolumetric,
    clp.DhalaLength,
    clp.cost,
    clp.master_status,
    clp.verification_code,
    clp.verify_flag,
    clp.insert_date AS LoadPost_InsertDate,
    clp.update_date AS LoadPost_UpdateDate,

    -- ========= Address (cla) =========
    cla.PickupCity,
    cla.PickupDistrict,
    cla.PickupTaluka,
    cla.PickupState,
    cla.PickupPincode,
    cla.PickupLat,
    cla.PickupLng,
    cla.DeliveryCity,
    cla.DeliveryDistrict,
    cla.DeliveryTaluka,
    cla.DeliveryState,
    cla.DeliveryPincode,
    cla.DeliveryLat,
    cla.DeliveryLng,
    cla.insert_date AS Address_InsertDate,
    cla.update_date AS Address_UpdateDate,

    -- ========= Status (cps) =========
    cps.CustomerPostID,
    cps.VendorID,
    cps.DriverID,
    cps.CustomerStatus,
    cps.VendorStatus,
    cps.DriverStatus,
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

            })
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
                const NearestDrivers = `DECLARE @Lat FLOAT;
DECLARE @Lng FLOAT;
DECLARE @VehicleType NVARCHAR(50);
DECLARE @MaxKm INT;

-- 1️⃣ Fetch pickup location & vehicle type
SELECT
    @Lat = cla.PickupLat,
    @Lng = cla.PickupLng,
    @VehicleType = clp.VehicleType
FROM CustomerLoadPost clp
JOIN CustomerLoadPostAddress cla
    ON clp.LoadPostID = cla.LoadPostID
WHERE clp.LoadPostID = @LoadPostID;

-- 2️⃣ Max distance based on vehicle
SET @MaxKm = CASE
    WHEN @VehicleType = 'Mini'       THEN 30
    WHEN @VehicleType = 'Light'      THEN 100
    WHEN @VehicleType = 'Medium'     THEN 500
    WHEN @VehicleType = 'Multi Axle' THEN 2000
    ELSE 800
END;

;WITH DriverDistances AS (
    SELECT
        dva.DriverID,
        dva.VehicleID,
        dva.VendorID,
        dva.MobileNo,
        dll.Status,
        dll.Lat,
        dll.Lng,

        CAST(
            6371 * ACOS(
                CASE
                    WHEN (
                        COS(RADIANS(@Lat)) * COS(RADIANS(dll.Lat)) *
                        COS(RADIANS(dll.Lng) - RADIANS(@Lng)) +
                        SIN(RADIANS(@Lat)) * SIN(RADIANS(dll.Lat))
                    ) > 1 THEN 1
                    WHEN (
                        COS(RADIANS(@Lat)) * COS(RADIANS(dll.Lat)) *
                        COS(RADIANS(dll.Lng) - RADIANS(@Lng)) +
                        SIN(RADIANS(@Lat)) * SIN(RADIANS(dll.Lat))
                    ) < -1 THEN -1
                    ELSE (
                        COS(RADIANS(@Lat)) * COS(RADIANS(dll.Lat)) *
                        COS(RADIANS(dll.Lng) - RADIANS(@Lng)) +
                        SIN(RADIANS(@Lat)) * SIN(RADIANS(dll.Lat))
                    )
                END
            ) AS DECIMAL(10,2)
        ) AS DistanceInKm
    FROM DriverVehicleAssign dva
    JOIN DriverLiveLocation dll
        ON dll.DriverID = dva.DriverID
    WHERE
        dva.IsActive = 1
        AND dll.Status = 'Online'
)

SELECT TOP 10 *
FROM DriverDistances
WHERE DistanceInKm <= @MaxKm
ORDER BY DistanceInKm;
`;

                const CustomerPost = `
                    SELECT 
                        *
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
                        CustomerPostdata: CustomerPostRow

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
        request.input('VendorID', sql.NVarChar(10), data.VendorID);


        const result = await request.query(`SELECT TOP 50
                                    clp.LoadPostID AS Customer_LoadPostID,
                                    cps.CustomerID,
                                
                                    -- ✅ Distance (Vendor → Customer Pickup)
                                    CAST(
                                        6371 * ACOS(
                                            CASE 
                                                WHEN (
                                                    COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.PickupLat)) *
                                                    COS(RADIANS(cla.PickupLng) - RADIANS(@vendorLng)) +
                                                    SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.PickupLat))
                                                ) > 1 THEN 1
                                                WHEN (
                                                    COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.PickupLat)) *
                                                    COS(RADIANS(cla.PickupLng) - RADIANS(@vendorLng)) +
                                                    SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.PickupLat))
                                                ) < -1 THEN -1
                                                ELSE (
                                                    COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.PickupLat)) *
                                                    COS(RADIANS(cla.PickupLng) - RADIANS(@vendorLng)) +
                                                    SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.PickupLat))
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
                                WHERE cla.PickupLat IS NOT NULL
                                  AND cla.PickupLng IS NOT NULL
                                  AND cps.LP_Status = 'Pending'
                                  AND (
                                      6371 * ACOS(
                                          CASE 
                                              WHEN (
                                                  COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.PickupLat)) *
                                                  COS(RADIANS(cla.PickupLng) - RADIANS(@vendorLng)) +
                                                  SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.PickupLat))
                                              ) > 1 THEN 1
                                              WHEN (
                                                  COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.PickupLat)) *
                                                  COS(RADIANS(cla.PickupLng) - RADIANS(@vendorLng)) +
                                                  SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.PickupLat))
                                              ) < -1 THEN -1
                                              ELSE (
                                                  COS(RADIANS(@vendorLat)) * COS(RADIANS(cla.PickupLat)) *
                                                  COS(RADIANS(cla.PickupLng) - RADIANS(@vendorLng)) +
                                                  SIN(RADIANS(@vendorLat)) * SIN(RADIANS(cla.PickupLat))
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

