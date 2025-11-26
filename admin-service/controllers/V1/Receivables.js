const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../../log/logger');const { createReceivablesDB, updateReceivablesDB, deleteReceivablesDB, getReceivablesDB } = require("../../models/V1/Receivables/utility");
const { createSchema, updateReceivablesSchema, ReceivablesSchema } = require("../../models/V1/Receivables/schema");
const { getRandomSixDigitNumber } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

exports.createReceivables = async (req, res) => {
    logger.log("info", `Receivables Details req_body = ${JSON.stringify(req.body)}`);
    const ReceivableID = getRandomSixDigitNumber();
    const Receivable_ID = `RCV${ReceivableID}`;
    console.log(Receivable_ID);

    // Validate request
    // const validate = ajv.compile(createSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Insert data into database
        const result = await createReceivablesDB(req.body,Receivable_ID);
        logger.log("info", `Receivables created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc});
    } catch (error) {
        logger.log("error", `Receivables creation failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Receivables creation failed" });
    }
}   


exports.updateReceivables = async (req, res) => {
    logger.log("info", `Receivables Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(updateReceivablesSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateReceivablesDB(req.body);
        logger.log("info", `Receivables updated successfully`);
        return res.status(200).send({ status: result.status, message: result.message});
    } catch (error) {
        logger.log("error", `Receivables update failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Receivables update failed" });
    }
}

exports.deleteReceivables = async (req, res) => {
    logger.log("info", `Receivables Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(ReceivablesSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Delete data from database
        const result = await deleteReceivablesDB(req.body.ReceivablesID);
        logger.log("info", `Receivables deleted successfully`);
        return res.status(200).send({ status: "00", message: "Receivables deleted successfully"});
    } catch (error) {
        logger.log("error", `Receivables delete failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Receivables delete failed" });
    }
}

exports.getReceivables = async (req, res) => {
    logger.log("info", `Receivables Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(ReceivablesSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Fetch data from database
        const result = await getReceivablesDB(req.body.ReceivableID);
        logger.log("info", `Receivables fetched successfully`);
        // return res.status(200).send({ status: "00", message: "Receivables fetched successfully", data: result.data[0] });
        return res.status(200).send({ status: "00", message: "Receivables fetched successfully", data: result.data });

    } catch (error) {
        logger.log("error", `Receivables fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Receivables fetch failed" });
    }
}       
