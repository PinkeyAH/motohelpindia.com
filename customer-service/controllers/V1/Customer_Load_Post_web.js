const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { getRandomSixDigitNumber, getDistanceFromLatLonInKm } = require("../../common/common");
const { getActiveLoadPostWebAPIDB } = require("../../models/V1/Customer_Load_Post_web/utility.js");

exports.getActiveLoadPostWebAPI = async (req, res) => {
    try {
        const result = await getActiveLoadPostWebAPIDB(req.body);
        logger.log("info", `getActiveLoadPostWebAPI result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `getActiveLoadPostWebAPI Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });

    }
}
