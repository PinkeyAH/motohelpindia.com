const Ajv = require('ajv');
const sql = require('mssql');
const addFormats = require('ajv-formats');
const dbconfig = require('../../db/db.js');
const {logger} = require('../../log/logger.js');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const { customer_lp_loading_schema} = require('../../models/V1/Vendor_services_status/schema.js');
const{ GetCustomerLPpendingDB} = require('../../models/V1/Vendor_services_status/utility.js');



exports.GetCustomerLPpending = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerLPpendingDB(req.body);
        logger.log("info", `GetCustomerLPpending result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         console.log("error", `GetCustomerLPpending Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};

