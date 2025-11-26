const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../../log/logger');const { createDepartmentDB, updateDepartmentDB, deleteDepartmentDB, getDepartmentDB } = require('../../models/V1/Departments/utility');
const { createDepartmentSchema, updateDepartmentSchema, DepartmentsSchema } = require('../../models/V1/Departments/schema');
const { getRandomSixDigitNumber } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

exports.createDepartment = async (req, res) => {
    logger.log("info", `Department Details req_body = ${JSON.stringify(req.body)}`);
    // const DepartmentID = getRandomSixDigitNumber();
    // const Department_ID = `DepartmentID${DepartmentID}`;
    // console.log(Department_ID);
    const Department_ID = req.body.DepartmentID;
    console.log(Department_ID);
    // Validate request
    const validate = ajv.compile(createDepartmentSchema());
    const valid = validate(req.body);
    if (!valid) {
        logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
        return res.status(400).send({ status: 400, message: validate.errors });
    }
    try {
        // Insert data into database
        const result = await createDepartmentDB(req.body, Department_ID);
        logger.log("info", `Department  created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Department  creation failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Department  creation failed" });
    }
}


exports.updateDepartment = async (req, res) => {
    logger.log("info", `Department Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(updateDepartmentSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateDepartmentDB(req.body);
        logger.log("info", `Department  updated successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Department  update failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Department  update failed" });
    }
}

exports.deleteDepartment = async (req, res) => {
    logger.log("info", `Department Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(DepartmentSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Delete data from database
        const result = await deleteDepartmentDB(req.body.DepartmentID);
        logger.log("info", `Department  deleted successfully`);
        return res.status(200).send({ status: "00", message: "Department  deleted successfully" });
    } catch (error) {
        logger.log("error", `Department  delete failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Department  delete failed" });
    }
}

exports.getDepartment = async (req, res) => {
    logger.log("info", `Department Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(DepartmentSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Fetch data from database
        const result = await getDepartmentDB(req.body.DepartmentID);
        logger.log("info", `Department  fetched successfully`);
        // return res.status(200).send({ status: "00", message: "Department  fetched successfully", data: result.data[0] });
        return res.status(200).send({ status: "00", message: "Department  fetched successfully", data: result.data });

    } catch (error) {
        logger.log("error", `Department  fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Department  fetch failed" });
    }
}       
