const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../../log/logger');const { getRandomSixDigitNumber } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);


const { InsertcustomerpostDB, updateCustomerPostDB, deleteCustomerPostDB,getCustomerPostDB, CustomerPostAddressDB, getcustomerliveBidingDB,updatecustomerliveBidingDB } = require("../../models/V1/Customer_Posts/utility");
const { createSchema, updateCustomerPostSchema, VehiclePostSchema } = require("../../models/V1/Customer_Posts/schema");


exports.Insertcustomerpost = async (req, res) => {
    logger.log("info", `Customer Details req_body = ${JSON.stringify(req.body)}`);
    const CustomerPostsid = getRandomSixDigitNumber();
    const CustomerPosts_id = `CUST${CustomerPostsid}`;
    console.log(CustomerPosts_id);

    // Validate request
    // const validate = ajv.compile(createSchema);
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Insert data into database
        const result = await InsertcustomerpostDB(req.body, CustomerPosts_id);
        logger.log("info", `Customer created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Customer creation failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer creation failed" });
    }
}

exports.updateCustomerPost = async (req, res) => {
    logger.log("info", `Customer Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(updateVehiclePostSchema);
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateCustomerPostDB(req.body);
        logger.log("info", `Customer updated successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Customer update failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer update failed" });
    }
}

exports.deleteCustomerPost = async (req, res) => {
    logger.log("info", `Customer Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    const validate = ajv.compile(VehiclePostSchema);
    const valid = validate(req.body);
    if (!valid) {
        logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
        return res.status(400).send({ status: "01", message: validate.errors });
    }
    try {
        // Delete data into database
        const result = await deleteCustomerPostDB(req.body);
        logger.log("info", `Customer deleted successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Customer deletion failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer deletion failed" });
    }
}

exports.getCustomerPost = async (req, res) => {
    logger.log("info", `Customer Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(VehiclePostSchema);
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Get data from database
        const result = await getCustomerPostDB(req.body);
        logger.log("info", `Customer fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data , Post_counts: result.counts });
    } catch (error) {
        logger.log("error", `Customer fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer fetch failed" });
    }
}

exports.CustomerPostAddress = async (req, res) => {
    logger.log("info", `Customer Post Address req_body = ${JSON.stringify(req.body)}`);
    try {
        // Validate request
        // const validate = ajv.compile(VehiclePostSchema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
        //     return res.status(400).send({ status: "01", message: validate.errors });
        // }

        // Get data from database
        const result = await CustomerPostAddressDB(req.body);
        logger.log("info", `Customer Post Address fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, Address: result.data  });
    } catch (error) {
        logger.log("error", `Customer Post Address fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer Post Address fetch failed" });
    }
}


exports.getcustomerliveBiding = async (req, res) => {
    logger.log("info", `Customer Details req_body = ${JSON.stringify(req.body)}`);

    try {
        // Get data from database
        const result = await getcustomerliveBidingDB(req.body);
        logger.log("info", `Customer fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data , Post_counts: result.counts });
    } catch (error) {
        logger.log("error", `Customer fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer fetch failed" });
    }
}

exports.updatecustomerliveBiding = async (req, res) => {
    logger.log("info", `Customer Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Update data into database
        const result = await updatecustomerliveBidingDB(req.body);
        logger.log("info", `Customer updated successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    }   
catch (error) {
        logger.log("error", `Customer update failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Customer update failed" });
    }
}
