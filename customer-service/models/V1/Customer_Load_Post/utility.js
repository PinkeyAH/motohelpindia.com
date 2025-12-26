const sql = require('mssql');
const pool = require('../../../db/db.js');
const logger = require('../../../log/logger');


exports.InsertcustomerloadpostDB = async (data, LoadPost_ID) => {
  return new Promise((resolve, reject) => {
    sql.connect(pool)
      .then(pool => {
        const request = pool.request();

        // ================= COMMON =================
        request.input('LoadPostID', sql.NVarChar(20), LoadPost_ID);
        request.input('CustomerID', sql.NVarChar(20), data.customerId || '');

        // ================= PICKUP (CustomerLoadPost) =================
        request.input('PickupContactPerson', sql.NVarChar(100), data.pickup?.contactName || '');
        request.input('PickupCompanyName', sql.NVarChar(150), data.pickup?.companyName || '');
        request.input('PickupContactNumber', sql.NVarChar(20), data.pickup?.contactNumber || '');
        request.input('PickupPlotBuilding', sql.NVarChar(150), data.pickup?.plotOrBuilding || '');
        request.input('PickupStreetArea', sql.NVarChar(200), data.pickup?.streetArea || '');
        request.input('PickupAddress', sql.NVarChar(sql.MAX), data.pickup?.googleAddress || data.pickup.origin?.address);

        // ================= DELIVERY (CustomerLoadPost) =================
        request.input('DeliveryContactPerson', sql.NVarChar(100), data.delivery?.consigneeName || '');
        request.input('DeliveryCompanyName', sql.NVarChar(150), data.delivery?.companyName || '');
        request.input('DeliveryContactNumber', sql.NVarChar(20), data.delivery?.contactNumber || '');
        request.input('DeliveryPlotBuilding', sql.NVarChar(150), data.delivery?.plotOrBuilding || '');
        request.input('DeliveryStreetArea', sql.NVarChar(200), data.delivery?.streetArea || '');
        request.input('DeliveryAddress', sql.NVarChar(sql.MAX), data.delivery?.googleAddress || data.delivery.destination?.address);

        // ================= LOAD / VEHICLE =================
        request.input('VehicleType', sql.NVarChar(100), data.vehicle?.vehicleType || '');
        request.input('Weight', sql.NVarChar(100), data.vehicle?.weightRange || '');
        request.input('Approximate_weight', sql.Int, data.vehicle?.approximateWeightKg || 0);
        request.input('BodyType', sql.NVarChar(100), data.load?.bodyType || '');
        request.input('cargo_type', sql.NVarChar(50), data.load?.cargoType || '');
        request.input('CargoContent', sql.NVarChar(100), data.load?.cargoContent || '');
        request.input('CargoPackageType', sql.NVarChar(150), data.load?.packageType || '');

        request.input(
          'ExpectedAvailableTime',
          sql.NVarChar(50),
          data.load?.expectedVehicleAvailability || ''
        );

        request.input('cost', sql.Decimal(10, 2), data.cost || 0);

        // ================= PICKUP ADDRESS (CustomerLoadPostAddress) =================
        request.input('PickupCity', sql.NVarChar(100), data.pickup?.city || data.pickup.origin.components.place);
        request.input('PickupDistrict', sql.NVarChar(100), data.pickup?.district || data.pickup.origin.components.dist);
        request.input('PickupTaluka', sql.NVarChar(100), data.pickup?.taluka || data.pickup.origin.components.tal);
        request.input('PickupState', sql.NVarChar(100), data.pickup?.state || data.pickup.origin.components.state);
        request.input('PickupPincode', sql.NVarChar(10), data.pickup?.pincode || data.pickup.origin.components.pincode);
        request.input('PickupLat', sql.Decimal(10, 7), data.pickup?.coordinates?.lat || data.pickup.origin.coordinates.lat);
        request.input('PickupLng', sql.Decimal(10, 7), data.pickup?.coordinates?.lng || data.pickup.origin.coordinates.lng);

        // ================= DELIVERY ADDRESS (CustomerLoadPostAddress) =================
        request.input('DeliveryCity', sql.NVarChar(100), data.delivery?.city || data.delivery.destination.components.place);
        request.input('DeliveryDistrict', sql.NVarChar(100), data.delivery?.district || data.delivery.destination.components.dist);
        request.input('DeliveryTaluka', sql.NVarChar(100), data.delivery?.taluka || data.delivery.destination.components.tal);
        request.input('DeliveryState', sql.NVarChar(100), data.delivery?.state || data.delivery.destination.components.state);
        request.input('DeliveryPincode', sql.NVarChar(10), data.delivery?.pincode || data.delivery.destination.components.pincode);
        request.input('DeliveryLat', sql.Decimal(10, 7), data.delivery?.coordinates?.lat || data.delivery.destination.coordinates.lat);
        request.input('DeliveryLng', sql.Decimal(10, 7), data.delivery?.coordinates?.lng || data.delivery.destination.coordinates.lng);

        // ================= OUTPUT =================
        request.output('bstatus_code', sql.NVarChar(50));
        request.output('bmessage_desc', sql.NVarChar(255));
        request.output('CustomerDetails', sql.NVarChar(sql.MAX)); 
        

        return request.execute('CustomerLoadPostInsert');
      })
      .then(result => {
        resolve({
          bstatus_code: result.output.bstatus_code,
          bmessage_desc: result.output.bmessage_desc,
           CustomerDetails: result.output.CustomerDetails
        });
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

       // ================= COMMON =================
        request.input('LoadPostID', sql.NVarChar(20), LoadPost_ID);
        request.input('CustomerID', sql.NVarChar(20), data.customerId || '');

        // ================= PICKUP (CustomerLoadPost) =================
        request.input('PickupContactPerson', sql.NVarChar(100), data.pickup?.contactName || '');
        request.input('PickupCompanyName', sql.NVarChar(150), data.pickup?.companyName || '');
        request.input('PickupContactNumber', sql.NVarChar(20), data.pickup?.contactNumber || '');
        request.input('PickupPlotBuilding', sql.NVarChar(150), data.pickup?.plotOrBuilding || '');
        request.input('PickupStreetArea', sql.NVarChar(200), data.pickup?.streetArea || '');
        request.input('PickupAddress', sql.NVarChar(sql.MAX), data.pickup?.googleAddress || data.pickup.origin?.address);

        // ================= DELIVERY (CustomerLoadPost) =================
        request.input('DeliveryContactPerson', sql.NVarChar(100), data.delivery?.consigneeName || '');
        request.input('DeliveryCompanyName', sql.NVarChar(150), data.delivery?.companyName || '');
        request.input('DeliveryContactNumber', sql.NVarChar(20), data.delivery?.contactNumber || '');
        request.input('DeliveryPlotBuilding', sql.NVarChar(150), data.delivery?.plotOrBuilding || '');
        request.input('DeliveryStreetArea', sql.NVarChar(200), data.delivery?.streetArea || '');
        request.input('DeliveryAddress', sql.NVarChar(sql.MAX), data.delivery?.googleAddress || data.delivery.destination?.address);

        // ================= LOAD / VEHICLE =================
        request.input('VehicleType', sql.NVarChar(100), data.vehicle?.vehicleType || '');
        request.input('Weight', sql.NVarChar(100), data.vehicle?.weightRange || '');
        request.input('Approximate_weight', sql.Int, data.vehicle?.approximateWeightKg || 0);
        request.input('BodyType', sql.NVarChar(100), data.load?.bodyType || '');
        request.input('cargo_type', sql.NVarChar(50), data.load?.cargoType || '');
        request.input('CargoContent', sql.NVarChar(100), data.load?.cargoContent || '');
        request.input('CargoPackageType', sql.NVarChar(150), data.load?.packageType || '');

        request.input(
          'ExpectedAvailableTime',
          sql.NVarChar(50),
          data.load?.expectedVehicleAvailability || ''
        );

        request.input('cost', sql.Decimal(10, 2), data.cost || 0);

        // ================= PICKUP ADDRESS (CustomerLoadPostAddress) =================
        request.input('PickupCity', sql.NVarChar(100), data.pickup?.city || data.pickup.origin.components.place);
        request.input('PickupDistrict', sql.NVarChar(100), data.pickup?.district || data.pickup.origin.components.dist);
        request.input('PickupTaluka', sql.NVarChar(100), data.pickup?.taluka || data.pickup.origin.components.tal);
        request.input('PickupState', sql.NVarChar(100), data.pickup?.state || data.pickup.origin.components.state);
        request.input('PickupPincode', sql.NVarChar(10), data.pickup?.pincode || data.pickup.origin.components.pincode);
        request.input('PickupLat', sql.Decimal(10, 7), data.pickup?.coordinates?.lat || data.pickup.origin.coordinates.lat);
        request.input('PickupLng', sql.Decimal(10, 7), data.pickup?.coordinates?.lng || data.pickup.origin.coordinates.lng);

        // ================= DELIVERY ADDRESS (CustomerLoadPostAddress) =================
        request.input('DeliveryCity', sql.NVarChar(100), data.delivery?.city || data.delivery.destination.components.place);
        request.input('DeliveryDistrict', sql.NVarChar(100), data.delivery?.district || data.delivery.destination.components.dist);
        request.input('DeliveryTaluka', sql.NVarChar(100), data.delivery?.taluka || data.delivery.destination.components.tal);
        request.input('DeliveryState', sql.NVarChar(100), data.delivery?.state || data.delivery.destination.components.state);
        request.input('DeliveryPincode', sql.NVarChar(10), data.delivery?.pincode || data.delivery.destination.components.pincode);
        request.input('DeliveryLat', sql.Decimal(10, 7), data.delivery?.coordinates?.lat || data.delivery.destination.coordinates.lat);
        request.input('DeliveryLng', sql.Decimal(10, 7), data.delivery?.coordinates?.lng || data.delivery.destination.coordinates.lng);

        // ================= OUTPUT =================
        request.output('bstatus_code', sql.NVarChar(50));
        request.output('bmessage_desc', sql.NVarChar(255));
        request.output('CustomerDetails', sql.NVarChar(sql.MAX)); 
        

                // Call the stored procedure
                return request.execute('CustomerLoadPostUpdate');
           })
      .then(result => {
        resolve({
          bstatus_code: result.output.bstatus_code,
          bmessage_desc: result.output.bmessage_desc,
           CustomerDetails: result.output.CustomerDetails
        });
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

FROM [MOTO_HELP_DB].[dbo].[CustomerLoadPost] clp
INNER JOIN [MOTO_HELP_DB].[dbo].[CustomerLoadPostAddress] cla
    ON clp.LoadPostID = cla.LoadPostID
INNER JOIN [MOTO_HELP_DB].[dbo].[CustomerPostStatus] cps
    ON clp.LoadPostID = cps.CustomerPostID
WHERE cps.LP_Status = 'Pending'
 
                                            AND clp.CustomerID = @CustomerID
                                     --       AND cps.customerpostid = @LoadPostID
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

FROM [MOTO_HELP_DB].[dbo].[CustomerLoadPost] clp
INNER JOIN [MOTO_HELP_DB].[dbo].[CustomerLoadPostAddress] cla
    ON clp.LoadPostID = cla.LoadPostID
INNER JOIN [MOTO_HELP_DB].[dbo].[CustomerPostStatus] cps
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
                const NearestDrivers = `
                -- 📌 INPUT PARAMETERS
DECLARE @lat          FLOAT        = 19.0760;
DECLARE @lng          FLOAT        = 72.8777;
DECLARE @radius       FLOAT        = 500000000000000000;
DECLARE @DriverID     NVARCHAR(50) = 'DR348884';
DECLARE @vehicleType  NVARCHAR(50) = 'Multi Axle';
DECLARE @LoadPostID  NVARCHAR(50) =  'LP326313';
DECLARE @MaxKm NVARCHAR(50) =  '100';
-- 1️⃣ Fetch customer origin & vehicle type
SELECT
    @Lat = cla.PickupLat,
    @Lng = cla.PickupLng,
    @VehicleType = clp.VehicleType
FROM CustomerLoadPost clp
JOIN CustomerLoadPostAddress cla
    ON clp.LoadPostID = cla.LoadPostID
WHERE clp.LoadPostID = @LoadPostID;

-- 2️⃣ Set MaxKm by Vehicle Type
SET @MaxKm = CASE
                WHEN @VehicleType = 'Mini'        THEN 30
                WHEN @VehicleType = 'Light'       THEN 1000
                WHEN @VehicleType = 'Medium'      THEN 500
                WHEN @VehicleType = 'Multi Axle'  THEN 2000
                ELSE 8000
             END;

-- 3️⃣ Nearest Drivers
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

        -- ✅ SAFE DISTANCE CALCULATION
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
        AND dll.Lat IS NOT NULL
        AND dll.Lng IS NOT NULL
        AND dll.Status = 'Online'
)

SELECT TOP 10 *
FROM DriverDistances
WHERE DistanceInKm <= @MaxKm
ORDER BY DistanceInKm ASC;   -- ✅ NEAREST FIRST

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
