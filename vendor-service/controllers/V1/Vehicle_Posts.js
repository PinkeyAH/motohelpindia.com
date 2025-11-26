const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../../log/logger');const { getRandomSixDigitNumber } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const { InsertVehiclePostDB, updateVehiclePostDB, deleteVehiclePost, getVehiclePostDB,getVehicleliveBidingDB ,updateVehicleliveBidingDB,getlivePostBidingDB} = require("../../models/V1/Vehicle_Posts/utility");
const { createSchema, updateVehiclePostSchema, VehiclePostSchema } = require("../../models/V1/Vehicle_Posts/schema");
const e = require('express');

exports.InsertVehiclePost = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    const vehiclePosts_id = getRandomSixDigitNumber();
    const VehiclePostsid = `VP${vehiclePosts_id}`;
    console.log(VehiclePostsid);

    // Validate request
    // const validate = ajv.compile(createSchema);
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Insert data into database
        const result = await InsertVehiclePostDB(req.body, VehiclePostsid);
        logger.log("info", `Vehicle created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Vehicle creation failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle creation failed" });
    }
}

exports.updateVehiclePost = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    // const validate = ajv.compile(updateVehiclePostSchema);
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateVehiclePostDB(req.body);
        logger.log("info", `Vehicle updated successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Vehicle update failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle update failed" });
    }
}

exports.deleteVehicle = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    // Validate request
    const validate = ajv.compile(VehiclePostSchema);
    const valid = validate(req.body);
    if (!valid) {
        logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
        return res.status(400).send({ status: "01", message: validate.errors });
    }
    try {
        // Delete data into database
        const result = await deleteVehiclePost(req.body);
        logger.log("info", `Vehicle deleted successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Vehicle deletion failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle deletion failed" });
    }
}

exports.getVehiclePost = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        // Get data from database
        const result = await getVehiclePostDB(req.body);
        logger.log("info", `Vehicle fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data , Post_counts: result.counts });
    } catch (error) {
        logger.log("error", `Vehicle fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle fetch failed" });
    }
}


exports.getVehicleliveBiding = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Get data from database
        const result = await getVehicleliveBidingDB(req.body);
        logger.log("info", `Vehicle fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Vehicle fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle fetch failed" });
    }
}

exports.updateVehicleliveBiding = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Get data from database
        const result = await updateVehicleliveBidingDB(req.body);
        logger.log("info", result);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Vehicle fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle fetch failed" });
    }
}


exports.getlivePostBiding = async (req, res) => {
    logger.log("info", `Vehicle Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Get data from database
        const result = await getlivePostBidingDB(req.body);
        logger.log("info", `Vehicle fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data , Post_counts: result.counts });
    } catch (error) {
        logger.log("error", `Vehicle fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Vehicle fetch failed" });
    }
}


