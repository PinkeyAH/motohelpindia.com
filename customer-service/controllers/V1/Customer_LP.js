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

        if (!validate(req.query)) {
            return res.status(400).json({status: 0, errors: validate.errors});
        }
        const result = await getCustomerLPLoadingDB(req.query);
        return res.status(200).json(result);

    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0, message: error.message
        });
    }
};

exports.GetCustomerLPpending = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.query)) {return res.status(400).json({status: 0,errors: validate.errors});
        }

        const result = await GetCustomerLPpendingDB(req.query);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0,message: error.message
        });
    }
};

exports.GetCustomerLPProgress = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);

        if (!validate(req.query)) {
            return res.status(400).json({status: 0,errors: validate.errors});
        }
        const result = await GetCustomerLPProgressDB(req.query);
        return res.status(200).json(result);

    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0,message: error.message});
    }
};

exports.GetCustomerLPReached = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);

        if (!validate(req.query)) {
            return res.status(400).json({status: 0,errors: validate.errors});
        }
        const result = await GetCustomerLPReachedDB(req.query);
        return res.status(200).json(result);

    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0,message: error.message});
    }
};

exports.GetCustomerLPLoaded = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);

        if (!validate(req.query)) {
            return res.status(400).json({status: 0,errors: validate.errors});
        }
        const result = await GetCustomerLPLoadedDB(req.query);
        return res.status(200).json(result);

    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0,message: error.message});
    }
};

exports.GetCustomerLPHold = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);

        if (!validate(req.query)) {
            return res.status(400).json({status: 0,errors: validate.errors});
        }
        const result = await GetCustomerLPHoldDB(req.query);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({ status: 0,message: error.message });
    }
};

exports.GetCustomerLPCompleted = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);

        if (!validate(req.query)) {
            return res.status(400).json({status: 0,errors: validate.errors});
        }
        const result = await GetCustomerLPCompletedDB(req.query);
        return res.status(200).json(result);

    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0,message: error.message});
    }
};