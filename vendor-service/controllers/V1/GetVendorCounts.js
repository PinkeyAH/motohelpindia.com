
const {logger} = require('../../log/logger');
const { getvendorCountsDB ,getvehicleavailableDB, getvehicleprocessDB, getvehicleactiveDB, getvehicleclosedDB } = require('../../models/V1/GetVendorCounts/utility');

exports.getvendorCounts = async (req, res) => {
    logger.log("info", `Get vendor Counts req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }   
    try {
        const result = await getvendorCountsDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message, data : result.data});
    } catch (error) {
        logger.log("error", `Get vendor Counts Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};  


exports.getvehicleavailable = async (req, res) => {
    logger.log("info", `Get vehicle available req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const result = await getvehicleavailableDB(req.body);
        const records = result.data;  // assuming same as your JSON
                      const grouped = {};
                         
                         for (const row of records) {
                           const driverId = row.driver_id;
                         
                           if (!grouped[driverId]) {
                             grouped[driverId] = {
                               driver_id: row.driver_id,
                               Driver_Name: row.Driver_Name,
                               Driver_Latitude: row.Driver_Latitude,
                               Driver_Longitude: row.Driver_Longitude,
                               vehicle_No: row.vehicle_No,
                               vehicleType: row.vehicleType,
                               Trip_Status: row.Trip_Status,
                               loads: []
                             };
                           }
                         
                           grouped[driverId].loads.push({
                             LoadPostID: row.LoadPostID,
                             pickup_Latitude: row.pickup_Latitude,
                             pickup_Longitude: row.pickup_Longitude,
                             dropoff_Latitude: row.dropoff_Latitude,
                             dropoff_Longitude: row.dropoff_Longitude,
                             DriverToOriginKm: row.DriverToOriginKm,
                             OriginToDestinationKm: row.OriginToDestinationKm
                           });
                         }
                         
                         const finalResponse = {
                        
                           data: Object.values(grouped)
                         };
                         
                         console.log(JSON.stringify(finalResponse, null, 2));

        return res.status(200).json({ status: result.status, message: result.message, data : finalResponse.data});
    } catch (error) {
        logger.log("error", `Get vehicle available Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }

};
exports.getvehicleprocess = async (req, res) => {
    logger.log("info", `Get vehicle process req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const result = await getvehicleprocessDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message, data : result.data});
    } catch (error) {
        logger.log("error", `Get vehicle process Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }

};

exports.getvehicleactive = async (req, res) => {
    logger.log("info", `Get vehicle active req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const result = await getvehicleactiveDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message, data : result.data});
    } catch (error) {
        logger.log("error", `Get vehicle active Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }

};

exports.getvehicleclosed = async (req, res) => {
    logger.log("info", `Get vehicle closed req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const result = await getvehicleclosedDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message, data : result.data});
    } catch (error) {
        logger.log("error", `Get vehicle closed Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }

};

