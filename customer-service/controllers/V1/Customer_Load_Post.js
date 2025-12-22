const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { getRandomSixDigitNumber, getDistanceFromLatLonInKm } = require("../../common/common");

const { InsertcustomerloadpostDB, updatecustomerloadpostDB, getcustomerloadpostDB, deletecustomerloadpostDB, getVehicle_DetailsDB, 
    getCargoTypesDB, getCustomerLoadPostViewsDB, getNearestCustomerposttDB, CustomerPostStatusDB, getcustomerprocessDB, getcustomeractiveDB,
    getcustomercompletedDB, getNearestDriversDB, VendorNearestCustomerPostDB, CargoTypeBodyTypeHistoryDB } = require('../../models/V1/Customer_Load_Post/utility');
// const { customerLoadPostSchema, updateCustomerLoadPostSchema } = require('../../models/V1/Customer_Load_Post/schema');

// Insert customer load post
exports.Insertcustomerloadpost = async (req, res) => {
    try {
        const LoadPostID = getRandomSixDigitNumber();
        const LoadPost_ID = `LP${LoadPostID}`;

        // const validate = ajv.compile(customerLoadPostSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `Insertcustomerloadpost validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }

        const result = await InsertcustomerloadpostDB(req.body, LoadPost_ID);
        // if (result.bstatus_code == "00") {
        //     const data = {
        //         ...req.body,
        //         LoadPost_ID
        //     };
        //     const result = await InsertActiveTrip(data);
        //     logger.log("info", `InsertActiveTrip result: ${JSON.stringify(result)}`);

        // }
        logger.log("info", `Insertcustomerloadpost result: ${JSON.stringify(result)}`);
        const nearestDriversArray = JSON.parse(result.NearestDriversJson || "[]");

        const groupedData = nearestDriversArray.reduce((acc, row) => {
            // Check if this LoadPostID already exists in the accumulator
            let existing = acc.find(item => item.LoadPostID === row.LoadPostID);

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

            // Add route info for this LoadPost
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
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: JSON.parse(result.CustomerDetails) });

        // return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: groupedData, NearestDriversJson: JSON.parse(result.NearestDriversJson) });

    } catch (error) {
        logger.log("error", `Insertcustomerloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Update customer load post
exports.updatecustomerloadpost = async (req, res) => {
    try {
        // const validate = ajv.compile(updateCustomerLoadPostSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `updatecustomerloadpost validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }

        const result = await updatecustomerloadpostDB(req.body);
        logger.log("info", `updatecustomerloadpost result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: JSON.parse(result.NearestDriversJson) });

    } catch (error) {
        logger.log("error", `updatecustomerloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get customer load post
exports.getcustomerloadpost = async (req, res) => {
    try {
        const result = await getcustomerloadpostDB(req.body);
        logger.log("info", `getcustomerloadpost result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });

    } catch (error) {
        logger.log("error", `getcustomerloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Delete customer load post
exports.deletecustomerloadpost = async (req, res) => {
    try {
        const result = await deletecustomerloadpostDB(req.body);
        logger.log("info", `deletecustomerloadpost result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `deletecustomerloadpost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get vehicle details
exports.getVehicle_Details = async (req, res) => {
    try {
        const result = await getVehicle_DetailsDB(req.body.vehicleType, req.body.weightRange);
        logger.log("info", `getVehicle_Details result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });

    } catch (error) {
        logger.log("error", `getVehicle_Details Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get cargo types
exports.getCargoTypes = async (req, res) => {
    try {
        const result = await getCargoTypesDB(req.body.cargotype);
        logger.log("info", `getCargoTypes result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });

    } catch (error) {
        logger.log("error", `getCargoTypes Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.getCustomerLoadPostViews = async (req, res) => {
    try {
        const result = await getCustomerLoadPostViewsDB(req.body);
        if (result.status === "00") {
            return res.status(200).send({ status: result.status, message: result.message, data: result.data });
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        logger.log("error", `getCustomerLoadPostViews Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.getNearestCustomerpost = async (req, res) => {
  try {
    logger.log("info", `getNearestCustomerpost req.body: ${JSON.stringify(req.body)}`);

    const io = req.app.get("socketio"); // ✅ Access socket.io
    const result = await getNearestCustomerposttDB(req.body);

    logger.log("info", `getNearestCustomerpost result: ${JSON.stringify(result)}`);

    if (result.status !== "00" || !Array.isArray(result.data)) {
      return res.status(200).json(result);
    }

    // ✅ Emit nearest customer posts
    if (io) {
      console.log("📡 Emitting nearestCustomerPost event to all clients ************************************************");
      io.emit("nearestCustomerPost", {
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
    logger.log("error", `getNearestCustomerpost Error: ${error.message}`);
    return res.status(500).json({ status: "99", message: "Internal server error" });
  }
};

exports.CustomerPostStatus = async (req, res) => {
    try {
        // if (req.body.CustomerPostID && !req.body.LoadPostID) {
        //     req.body.LoadPostID = req.body.CustomerPostID;
        //     const result = await getcustomerloadpostDB(req.body);
        //     if (result.status !== "00" || result.data.length === 0) {
        //         return res.status(404).json({ status: "01", message: "Load post not found for the given CustomerID and LoadPostID" });
        //     }
        //     const loadPost = result.data[0];
        //     // if (loadPost.tripStatus && ["Completed", "Cancelled","Active"].includes(loadPost.tripStatus)) {
        //     if (loadPost.tripStatus && ["Completed", "Cancelled"].includes(loadPost.tripStatus)) {

        //         return res.status(400).json({ status: "01", message: `Load post is already in status '${loadPost.tripStatus}'` });
        //     }
        // }

        const updateResult = await CustomerPostStatusDB(req.body);
        logger.log("info", `CustomerPostStatus update result: ${JSON.stringify(updateResult)}`);
if (updateResult.bstatus_code === "00") {
          
            return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });
        }
        // if (updateResult.bstatus_code === "00") {
        //     req.body.LoadPostID = req.body.CustomerPostID;
        //     const getcustomeractive = await getcustomeractiveDB(req.body);
        //     logger.log("info", `getcustomeractive result: ${JSON.stringify(getcustomeractive)}`);
        //     console.log("getcustomeractive", getcustomeractive)
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc, data: getcustomeractive.data });
        // }

        // if (updateResult.bstatus_code === "01") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // }
        // if (updateResult.bstatus_code === "02") {
        //     req.body.LoadPostID = req.body.CustomerPostID;

        //     const getcustomerprocess = await getcustomerprocessDB(req.body);
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc, data: getcustomerprocess.data });
        // }
        // if (updateResult.bstatus_code === "03") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // }
        // if (updateResult.bstatus_code === "04") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // }
        // if (updateResult.bstatus_code === "05") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // } if (updateResult.bstatus_code === "06") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // }
        // if (updateResult.bstatus_code === "07") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // }
        // if (updateResult.bstatus_code === "08") {
        //     return res.status(200).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

        // }

            return res.status(400).json({ status: updateResult.bstatus_code, message: updateResult.bmessage_desc });

    } catch (error) {
        logger.log("error", `CustomerPostStatus Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.getcustomerprocess = async (req, res) => {
    try {
        const result = await getcustomerprocessDB(req.body);
        logger.log("info", `getcustomerprocess result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `getcustomerprocess Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.getcustomeractive = async (req, res) => {
    try {
        const result = await getcustomeractiveDB(req.body);
        logger.log("info", `getcustomeractive result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `getcustomeractive Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });

    }
}

exports.getcustomercompleted = async (req, res) => {
    try {
        const result = await getcustomercompletedDB(req.body);
        logger.log("info", `getcustomercompleted result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {   
        logger.log("error", `getcustomercompleted Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.getNearestDrivers = async (req, res) => {
    try {
        logger.log("info", `getNearestDrivers req.body: ${JSON.stringify(req.body)}`);

        const result = await getNearestDriversDB(req.body);
        logger.log("info", `getNearestDrivers result: ${JSON.stringify(result)}`);

        const io = req.app.get("socketio");

        
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

exports.VendorNearestCustomerPost = async (req, res) => {
    try {
      logger.log("info", `VendorNearestCustomerPost req.body: ${JSON.stringify(req.body)}`);
        const result = await VendorNearestCustomerPostDB(req.body);
        logger.log("info", `VendorNearestCustomerPost result: ${JSON.stringify(result)}`);
        return res.status(200).json({
            status: result.status,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        logger.log("error", `VendorNearestCustomerPost Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }   
};

exports.CargoTypeBodyTypeHistory = async (req, res) => {
    try {
        const result = await CargoTypeBodyTypeHistoryDB(req.body);
        logger.log("info", `CargoTypeBodyTypeHistory result: ${JSON.stringify(result)}`);
        return res.status(200).json({
            status: result.status,
            message: result.message,
            data: result.data
        });
    } catch (error) {
        logger.log("error", `CargoTypeBodyTypeHistory Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
};
