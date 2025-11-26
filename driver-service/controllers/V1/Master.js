const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const logger = require('../../log/logger');const { createexpenseTypeSchema } = require('../../models/V1/Master/schema');
const { createRouteMasterDB, updateRouteMasterDB, deleteRouteMasterDB, getRouteMasterDB, createExpenseMasterDB, updateExpenseMasterDB, deleteExpenseMasterDB, getExpenseMasterDB, createExpenseTypeDB, updateExpenseTypeDB, deleteExpenseTypeDB, getExpenseTypeDB
    , getDestinationDB ,getPincodeDB ,get_state_region_districtDB, get_state_district_blockDB} = require('../../models/V1/Master/utility');
const { getRandomSixDigitNumber } = require("../../common/common");
const e = require('express');
const { log } = require('winston');
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const axios = require('axios');


exports.createRouteMaster = async (req, res) => {
    logger.log("info", `Route Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    const RouteID = getRandomSixDigitNumber();
    const Route_ID = `R${RouteID}`;
    console.log(Route_ID);

    // Validate request
    // const validate = ajv.compile(createRouteMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Insert data into database
        const result = await createRouteMasterDB(req.body, Route_ID);
        logger.log("info", `Route Master created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Route Master creation failed = ${JSON.stringify(error)}`);
        if (error.bstatus_code == "01") {
            logger.log("error", `Route Master creation failed = ${JSON.stringify(error)}`);
            return res.status(200).send({ status: error.bstatus_code, message: error.bmessage_desc });
        }
        // Check if error is a database error
        return res.status(500).send({ status: error.bstatus_code, message: error.bmessage_desc });;
    }
}

exports.updateRouteMaster = async (req, res) => {
    logger.log("info", `Route Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(updateRouteMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: "01", message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateRouteMasterDB(req.body);
        logger.log("info", `Route Master update  = ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Route Master update failed = ${JSON.stringify(error)}`);
        if (error.bstatus_code == "01") {
            logger.log("error", `Route Master update failed = ${JSON.stringify(error)}`);
            return res.status(200).send({ status: error.bstatus_code, message: error.bmessage_desc });
        }
        // Check if error is a database error
        return res.status(500).send({ status: error.bstatus_code, message: error.bmessage_desc });;
    }
}

exports.deleteRouteMaster = async (req, res) => {
    logger.log("info", `Route Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(routeMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Delete data from database
        const result = await deleteRouteMasterDB(req.body);
        logger.log("info", `Route Master deleted successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Route Master delete failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Route Master delete failed" });
    }
}

exports.getRouteMaster = async (req, res) => {
    logger.log("info", `Route Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(routeMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Fetch data from database
        const result = await getRouteMasterDB(req.body);
        logger.log("info", `Route Master fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Route Master fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Route Master fetch failed", data: [] });
    }
}

exports.createExpenseMaster = async (req, res) => {
    logger.log("info", `Expense Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    const ExpenseID = getRandomSixDigitNumber();
    const Expense_ID = `EXP${ExpenseID}`;
    console.log(Expense_ID);
    // Validate request
    // const validate = ajv.compile(expenseMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Insert data into database
        const result = await createExpenseMasterDB(req.body, Expense_ID);
        logger.log("info", `Expense Master created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Expense Master creation failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Expense Master creation failed" });
    }
}

exports.updateExpenseMaster = async (req, res) => {
    logger.log("info", `Expense Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(expenseMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateExpenseMasterDB(req.body);
        logger.log("info", `Expense Master updated successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Expense Master update failed = ${error}`);
        return res.status(500).send({ status: "01", message: `Expense Master update failed` });
    }
}

exports.deleteExpenseMaster = async (req, res) => {
    logger.log("info", `Expense Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(expenseMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Delete data from database
        const result = await deleteExpenseMasterDB(req.body);
        logger.log("info", `Expense Master deleted successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Expense Master delete failed = ${error}`);
        return res.status(500).send({ status: '01', message: "Expense Master delete failed" });
    }
}

exports.getExpenseMaster = async (req, res) => {
    logger.log("info", `Expense Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(expenseMasterSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Fetch data from database
        const result = await getExpenseMasterDB(req.body);
        logger.log("info", `Expense Master fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Expense Master fetch failed = ${error}`);
        return res.status(500).send({ status: '01', message: "Expense Master fetch failed" });
    }
}

exports.createExpenseType = async (req, res) => {
    logger.log("info", `Expense Type Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    const ExpenseType = getRandomSixDigitNumber();
    const ExpenseTID = `EXPT${ExpenseType}`;
    console.log(ExpenseTID);
    // Validate request
    // const validate = ajv.compile(createexpenseTypeSchema());
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Insert data into database
        const result = await createExpenseTypeDB(req.body, ExpenseTID);
        logger.log("info", `Expense Type created successfully`);
        return res.status(200).send({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Expense Type creation failed = ${error}`);
        return res.status(500).send({ status: '01', message: "Expense Type creation failed" });
    }
}

exports.updateExpenseType = async (req, res) => {
    logger.log("info", `Expense Type Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(updateexpenseTypeSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Update data into database
        const result = await updateExpenseTypeDB(req.body);
        logger.log("info", `Expense Type updated successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Expense Type update failed = ${error}`);
        return res.status(500).send({ status: "01", message: `Expense Type update failed ` });
    }
}

exports.deleteExpenseType = async (req, res) => {
    logger.log("info", `Expense Type Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // Validate request
    // const validate = ajv.compile(expenseTypeSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Delete data from database
        const result = await deleteExpenseTypeDB(req.body);
        logger.log("info", `Expense Type deleted successfully`);
        return res.status(200).send({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Expense Type delete failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Expense Type delete failed" });
    }
}

exports.getExpenseType = async (req, res) => {
    logger.log("info", `Expense Type Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // // Validate request
    // const validate = ajv.compile(expenseTypeSchema);    
    // const valid = validate(req.body);
    // if (!valid) {
    //     logger.log("error", `Validation Error = ${JSON.stringify(validate.errors)}`);
    //     return res.status(400).send({ status: 400, message: validate.errors });
    // }
    try {
        // Fetch data from database
        const result = await getExpenseTypeDB(req.body);
        logger.log("info", `Expense Type fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Expense Type fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Expense Type fetch failed" });
    }
}

exports.getDestination = async (req, res) => {
    const searchText = req.body.city || ''; // or req.query.searchText
    logger.log("info", `Destination Details req_body = ${JSON.stringify(req.body)}`);

    try {
        // Fetch data from database with search text
        const result = await getDestinationDB(searchText);
        logger.log("info", `Destination fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Destination fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Destination fetch failed" });
    }
}

exports.getPincode = async (req, res) => {
    const pincode = req.body.pincode || ''; // or req.query.searchText
    logger.log("info", `Pincode Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Fetch data from database with search text
        const result = await getPincodeDB(pincode);
        const onlinePincode =await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        if (onlinePincode.data[0].Status === "Success") {
            console.log(onlinePincode.data[0].PostOffice[0]);
            
            result.data.push({  
                pincode: onlinePincode.data[0].PostOffice[0].Pincode,
                city: onlinePincode.data[0].PostOffice[0].District,
                state: onlinePincode.data[0].PostOffice[0].State,
                country: onlinePincode.data[0].PostOffice[0].Country
            });
        }
        var livedata = onlinePincode.data[0].PostOffice[0];
        console.log(result.data);
        logger.log("info", `Pincode fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: livedata });
    } catch (error) {
        logger.log("error", `Pincode fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "Pincode fetch failed" });
    }

}   

exports.get_state_region_district = async (req, res) => {
    const data = req.body || ''; 
    logger.log("info", `get_state_region_district Details req_body = ${JSON.stringify(req.body)}`);

    try {
        // Fetch data from database with search text
        const result = await get_state_region_districtDB(data);
        logger.log("info", `get_state_region_district fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `get_state_region_district fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "get_state_region_district fetch failed" });
    }
}


exports.get_state_district_block = async (req, res) => {
    const data = req.body || ''; 
    logger.log("info", `get_state_district_block Details req_body = ${JSON.stringify(req.body)}`);
    try {
        // Fetch data from database with search text
        const result = await get_state_district_blockDB(data);
        logger.log("info", `get_state_district_block fetched successfully`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `get_state_district_block fetch failed = ${error}`);
        return res.status(500).send({ status: "01", message: "get_state_district_block fetch failed" });
    }   
}