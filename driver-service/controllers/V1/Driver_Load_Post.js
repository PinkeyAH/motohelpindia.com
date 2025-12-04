const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { getRandomSixDigitNumber, getDistanceFromLatLonInKm } = require("../../common/common");

const { InsertdriverloadpostDB, updatedriverloadpostDB, getdriverloadpostDB, deletedriverloadpostDB, getdriverlocationbymobileDB, getDriverAvailableDB, getVehicleAvailableDB,
    InsertDriverVehicleAssignDB, updateDriverVehicleAssignDB, getDriverVehicleAssignDB, deleteDriverVehicleAssignDB, getNearestDriversDB
} = require('../../models/V1/Driver_Load_Post/utility');
const e = require('express');
// const { driverLoadPostSchema, updatedriverLoadPostSchema } = require('../../models/V1/driver_Load_Post/schema');

// Insert driver load post
exports.Insertdriverloadpost = async (req, res) => {
    try {
        logger.log("info", `Insertdriverloadpost request body: ${JSON.stringify(req.body)}`);
        const LoadPostID = getRandomSixDigitNumber();
        const LoadPost_ID = `LP${LoadPostID}`;

        // const validate = ajv.compile(driverLoadPostSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `Insertdriverloadpost validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }
        const driverdata = await getdriverlocationbymobileDB(req.body.driverMobile);

        const result = await InsertdriverloadpostDB(req.body, LoadPost_ID, driverdata);
        logger.log("info", `Insertdriverloadpost result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

    } catch (error) {
        logger.log("error", `Insertdriverloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Update driver load post
exports.updatedriverloadpost = async (req, res) => {
    try {
        // const validate = ajv.compile(updatedriverLoadPostSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `updatedriverloadpost validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }
        const driverdata = await getdriverlocationbymobileDB(req.body.driverMobile);

        const result = await updatedriverloadpostDB(req.body, driverdata);
        logger.log("info", `updatedriverloadpost result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });

    } catch (error) {
        logger.log("error", `updatedriverloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get driver load post
exports.getdriverloadpost = async (req, res) => {
    try {
        const result = await getdriverloadpostDB(req.body);   // DB call
        logger.log("info", `getdriverloadpost result: ${JSON.stringify(result)}`);

        // ✅ Use recordset (actual rows from DB)
        const rows = result.data || [];

        const groupedData = rows.reduce((acc, row) => {
            // Find if this LoadPost already exists
            let existing = acc.find(item => item.LoadPostID === row.LoadPost_ID);

            if (!existing) {
                // If not found, create a new entry
                existing = {
                    "LoadPostID": Array.isArray(row.LoadPostID) ? row.LoadPostID[0] : row.LoadPostID,
                    "DriverID": Array.isArray(row.DriverID) ? row.DriverID[0] : row.DriverID,
                    "VendorID": Array.isArray(row.VendorID) ? row.VendorID[0] : row.VendorID,
                    "driverMobile": row.driverMobile,
                    "Origin": Array.isArray(row.Origin) ? row.Origin[0] : row.Origin,
                    "Destination": Array.isArray(row.Destination) ? row.Destination[0] : row.Destination,
                    "VehicleNumber": row.VehicleNumber,
                    "VehicleType": row.VehicleType,
                    "VehicleStatus": row.VehicleStatus,
                    "reportingTime": row.reportingTime,
                    "ExpectedAvailableTime": row.ExpectedAvailableTime,
                    "RouteLabel": []
                };
                acc.push(existing);
            }

            // Add route info to the same LoadPost
            existing.RouteLabel.push({
                "RouteLabel": row.RouteLabel,
                "State": row.State,
                "Region": row.Region,
                "District": row.District,
                "DistanceKm": getDistanceFromLatLonInKm(
                    row.Origin_Lat,
                    row.Origin_Lng,
                    row.PincodeInfo?.latitude,
                    row.PincodeInfo?.longitude
                ) + ' km'
            });

            return acc;
        }, []);

        return res.status(200).send({
            status: "00",
            message: "getdriverloadpost records found",
            data: groupedData
        });

    } catch (error) {
        logger.log("error", `getdriverloadpost Error: ${error}`);
        res.status(500).json({ error: error.message });
    }
};

// Delete driver load post
exports.deletedriverloadpost = async (req, res) => {
    try {
        const result = await deletedriverloadpostDB(req.body);
        logger.log("info", `deletedriverloadpost result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `deletedriverloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get vehicle details
exports.getdriverlocationbymobile = async (req, res) => {
      if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

    console.log("req.body.MobileNo", req.body.MobileNo);
    try {
        const result = await getdriverlocationbymobileDB(req.body.MobileNo, req_json.vendorid);
        logger.log("info", `get driver location by mobile result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });

    } catch (error) {
        logger.log("error", `get driver location by mobile Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

// Insert Driver Vehicle Assign
exports.InsertDriverVehicleAssign = async (req, res) => {
    try {
        const ASSIGN = getRandomSixDigitNumber();
        const AssignID = `ASSIGN${ASSIGN}`;
        const result = await InsertDriverVehicleAssignDB(req.body, AssignID);
        logger.log("info", `InsertDriverVehicleAssign result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

    } catch (error) {
        logger.log("error", `InsertDriverVehicleAssign Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Update Driver Vehicle Assign
exports.updateDriverVehicleAssign = async (req, res) => {
    try {
        const result = await updateDriverVehicleAssignDB(req.body);
        logger.log("info", `updateDriverVehicleAssign result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

    } catch (error) {
        logger.log("error", `updateDriverVehicleAssign Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get Driver Vehicle Assign
exports.getDriverVehicleAssign = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const result = await getDriverVehicleAssignDB(req.body);
        logger.log("info", `getDriverVehicleAssign result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

    } catch (error) {
        logger.log("error", `getDriverVehicleAssign Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

// Delete Driver Vehicle Assign
exports.deleteDriverVehicleAssign = async (req, res) => {
    try {
        const result = await deleteDriverVehicleAssignDB(req.body);
        logger.log("info", `deleteDriverVehicleAssign result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });

    } catch (error) {
        logger.log("error", `deleteDriverVehicleAssign Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

// Get Nearest Drivers
// exports.getNearestDrivers = async (req, res) => {
//     try {
//         const result = await getNearestDriversDB(req.body);
//         logger.log("info", `getNearestDrivers result: ${JSON.stringify(result)}`);
//         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
//     } catch (error) {
//         logger.log("error", `getNearestDrivers Error: ${error.message}`);
//         return res.status(500).json({ status: "99", message: "Internal server error" });
//     }
// }

exports.insertOrUpdateDriverLiveLocation = async (req, res) => {
    try {
        console.log(req.body);

        const result = await insertOrUpdate_DriverLiveLocationDB(req.body);
        logger.log("info", `insertOrUpdate_DriverLiveLocation result: ${JSON.stringify(result)}`);
        console.log("✅ Driver Live Location updated successfully for DriverID:", req.body.DriverID);

        // ✅ Emit socket event after DB update
        const io = req.app.get("socketio");
        if (io) {
            io.emit("driverLocationUpdate", {
                status: result.bstatus_code,
                message: result.bmessage_desc
            });
            logger.log("info", `📡 driverLocationUpdate event emitted for DriverID: ${req.body.DriverID}`);
        }

        return res.status(200).send({
            status: result.bstatus_code,
            message: result.bmessage_desc
        });

    } catch (error) {
        logger.log("error", `insertOrUpdate_DriverLiveLocation Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
};


exports.getNearestDrivers = async (req, res) => {
    try {
        logger.log("info", `getNearestDrivers req.body: ${JSON.stringify(req.body)}`);

        const result = await getNearestDriversDB(req.body);
        logger.log("info", `getNearestDrivers result: ${JSON.stringify(result)}`);

        const io = req.app.get("socketio");

        if (io) {
            console.log("📡 Emitting nearestDrivers event to all clients ************************************************");
            io.emit("nearestDrivers", {
                status: result.status,
                message: result.message,
                data: result.data
            });
        }

        return res.status(200).json({
            status: result.status,
            message: result.message,
            data: result.data
        });

    } catch (error) {
        logger.log("error", `getNearestDrivers Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
};

exports.getDriverAvailable = async (req, res) => {
    try {
        const result = await getDriverAvailableDB(req.body);
        logger.log("info", `getDriverAvailable result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `getDriverAvailable Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.getVehicleAvailable = async (req, res) => {
    try {
        const result = await getVehicleAvailableDB(req.body);
        logger.log("info", `getVehicleAvailable result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `getVehicleAvailable Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}