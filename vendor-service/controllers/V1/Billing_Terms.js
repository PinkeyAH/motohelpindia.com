const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../../log/logger');const { createBillingTermsDB, updateBillingTermsDB, deleteBillingTermsDB, getBillingTermsDB } = require('../../models/V1/Billing_Terms/utility');
const { createBillingTermsSchema, updateBillingTermsSchema, BillingTermsSchema } = require('../../models/V1/Billing_Terms/schema');
const { getRandomSixDigitNumber } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

exports.createBillingTerms = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    // const BillID = getRandomSixDigitNumber();
    // const Bill_ID = `Billid${BillID}`;
    // console.log(Bill_ID);
    const Bill_ID = req.body.BillID;
    console.log(Bill_ID);
    // Validate request
    const validate = ajv.compile(createBillingTermsSchema());
    const valid = validate(req.body);
    if (!valid) {
        logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
        return res.status(400).send({ status: 400, message: validate.errors });
    }
    try {
        // Insert data into database
        const result = await createBillingTermsDB(req.body, Bill_ID);
        logger.log("info", `Billing Terms  created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Billing Terms  creation failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Billing Terms  creation failed" });
    }
}


exports.updateBillingTerms = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(updateBillingTermsSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateBillingTermsDB(req.body);
        logger.log("info", `Billing Terms  updated successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Billing Terms  update failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Billing Terms  update failed" });
    }
}

exports.deleteBillingTerms = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(BillingTermsSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Delete data from database
        const result = await deleteBillingTermsDB(req.body.BillID);
        logger.log("info", `Billing Terms  deleted successfully`);
        return res.status(200).send({ status: "00", message: "Billing Terms  deleted successfully" });
    } catch (error) {
        logger.log("error", `Billing Terms  delete failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Billing Terms  delete failed" });
    }
}

exports.getBillingTerms = async (req, res) => {
    logger.log("info", `Billing Terms Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(BillingTermsSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Fetch data from database
        const result = await getBillingTermsDB(req.body.BillID);
        logger.log("info", `Billing Terms  fetched successfully`);
        // return res.status(200).send({ status: "00", message: "Billing Terms  fetched successfully", data: result.data[0] });
        return res.status(200).send({ status: "00", message: "Billing Terms  fetched successfully", data: result.data });

    } catch (error) {
        logger.log("error", `Billing Terms  fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Billing Terms  fetch failed" });
    }
}       
