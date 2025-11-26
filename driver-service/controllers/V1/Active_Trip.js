const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { getRandomSixDigitNumber } = require("../../common/common");
const { InsertActiveTripDB, updateActiveTripDB, getActiveTripDB, deleteActiveTripDB } = require('../../models/V1/Active_Trip/utility.js');
const { activeTripSchema, updateActiveTripSchema } = require('../../models/V1/Active_Trip/schema.js');
const { getcustomerloadpostDB } = require('../../../Customer/models/V1/Customer_Load_Post/utility');

// Insert Active Trip
exports.InsertActiveTrip = async (req, res) => {
    try {
        const tripID = getRandomSixDigitNumber();
        const ActiveTripID = `AT${tripID}`;

        if (req && req.body && req.body.LoadPostID) {
            const data = req?.body || req || {};

            const getcustomerloadpostData = await getcustomerloadpostDB(data);
            const customerloadpostData = getcustomerloadpostData.data[0] || null;

            logger.log("info", `getcustomerloadpostDB result: ${JSON.stringify(getcustomerloadpostData)}`);

            let result;
            if (customerloadpostData) {
                result = await InsertActiveTripDB(customerloadpostData, ActiveTripID);
            } else {
                result = await InsertActiveTripDB(req.body, ActiveTripID);
            }

            logger.log("info", `InsertActiveTrip result: ${JSON.stringify(result)}`);
            return res.status(200).send({
                status: result.bstatus_code,
                message: result.bmessage_desc,
                data: result.data
            });
        } else {
            const data = req?.body || req || {};
            const getcustomerloadpostData = await getcustomerloadpostDB(data);
            const customerloadpostData = getcustomerloadpostData.data[0] || null;

            logger.log("info", `getcustomerloadpostDB result: ${JSON.stringify(getcustomerloadpostData)}`);

            // let result;
            if (customerloadpostData) {
                result = await InsertActiveTripDB(customerloadpostData, ActiveTripID);

                logger.log("info", `InsertActiveTrip result: ${JSON.stringify(result)}`);
                return result;
            } else {
                const result = await InsertActiveTripDB(data, ActiveTripID);

                logger.log("info", `InsertActiveTrip result: ${JSON.stringify(result)}`);

                return result;
            }
        }
    } catch (error) {
        logger.log("error", `Error in processing ActiveTrip: ${error.message}`);
        return res.status(500).send({
            status: 500,
            message: 'Internal Server Error',
            error: error.message
        });
    }
}

//         // const validate = ajv.compile(activeTripSchema);
//         // const valid = validate(req.body);
//         // if (!valid) {
//         //     logger.log("error", `InsertActiveTrip validation failed: ${ajv.errorsText(validate.errors)}`);
//         //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
//         // }
//         //    const data = req.body || req;
//         const getcustomerloadpostData = await getcustomerloadpostDB(req.body);
//         const customerloadpostData = getcustomerloadpostData.data[0] || [];
//         logger.log("info", `getcustomerloadpostDB result: ${JSON.stringify(getcustomerloadpostData)}`);
//         if (customerloadpostData) {
//             const result = await InsertActiveTripDB(customerloadpostData, ActiveTripID);
//             logger.log("info", `InsertActiveTrip result: ${JSON.stringify(result)}`);
//             return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });
//         } else {
//             const result = await InsertActiveTripDB(req.body, ActiveTripID);
//             logger.log("info", `InsertActiveTrip result: ${JSON.stringify(result)}`);
//             return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });
//         }

//     } catch (error) {
//         logger.log("error", `InsertActiveTrip Error: ${error.message}`);
//         return res.status(500).json({ status: "99", message: "Internal server error" });
//     }
// }
// Update Active Trip
exports.updateActiveTrip = async (req, res) => {
    try {
        // const validate = ajv.compile(updateActiveTripSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `updateActiveTrip validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }

        const result = await updateActiveTripDB(req.body);
        logger.log("info", `updateActiveTrip result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

    } catch (error) {
        logger.log("error", `updateActiveTrip Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Get Active Trip
exports.getActiveTrip = async (req, res) => {
    try {
        const result = await getActiveTripDB(req.body);   // DB call
        logger.log("info", `getActiveTrip result: ${JSON.stringify(result)}`);

        // // ✅ Use recordset (actual rows from DB)
        // const rows = result.data || [];

        // const groupedData = rows.reduce((acc, row) => {
        //     // Find if this Trip already exists
        //     let existing = acc.find(item => item.TripID === row.Trip_ID);
        //     if (!existing) {
        //         // If not found, create a new entry
        //         existing = { ...row, Trips: [] };
        //         acc.push(existing);
        //     }
        //     existing.Trips.push(row);
        //     return acc;
        // }, []);

        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });

    } catch (error) {
        logger.log("error", `getActiveTrip Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
// Delete Active Trip
exports.deleteActiveTrip = async (req, res) => {
    try {
        // const validate = ajv.compile(deleteActiveTripSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `deleteActiveTrip validation failed: ${ajv.errorsText(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Validation error", errors: validate.errors });
        // }

        const result = await deleteActiveTripDB(req.body);
        logger.log("info", `deleteActiveTrip result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });

    } catch (error) {
        logger.log("error", `deleteActiveTrip Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}
