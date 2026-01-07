const Ajv = require('ajv');
const sql = require('mssql');
const addFormats = require('ajv-formats');
const dbconfig = require('../../db/db.js');
const logger = require('../../log/logger');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const { customer_lp_loading_schema } = require('../../models/V1/Customer_LP/schema.js');
const{ getCustomerLPLoadingDB, GetCustomerLPProgressDB, GetCustomerLPReachedDB, GetCustomerLPLoadedDB, GetCustomerLPHoldDB, GetCustomerLPpendingDB, GetCustomerLPCompletedDB} = require('../../models/V1/Customer_LP/utility.js');


exports.getCustomerLPLoading = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await getCustomerLPLoadingDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in getCustomerLPLoading:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};

exports.GetCustomerLPProgress = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPProgressDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in GetCustomerLPProgress:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};

exports.GetCustomerLPReached = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPReachedDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in GetCustomerLPReached:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};

exports.GetCustomerLPLoaded = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPLoadedDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in GetCustomerLPLoaded:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};

exports.GetCustomerLPHold = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPHoldDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in GetCustomerLPHold:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};

exports.GetCustomerLPpending = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPpendingDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in GetCustomerLPpending:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};

exports.GetCustomerLPCompleted = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        const valid = validate(req.query);

        if (!valid) {return res.status(400).json({ status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPCompletedDB();

        return res.status(200).json({ status: result.status, message: result.message, count: result.count,
            data: result.data});

    } catch (error) {
        logger.error('Error in GetCustomerLPCompleted:', error);
        return res.status(500).json({
            status: 0,
            message: error.message 
        });
    }
};
