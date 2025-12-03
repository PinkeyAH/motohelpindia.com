const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { customer_loadpost_master_schema, customer_loadpost_invoice_schema, update_customer_loadpost_master_schema } = require('../../models/V1/Customer_LoadPost_Master/schema.js');
const{ customerloadpostmasterDB, updatecustomerloadpostmasterDB, getcustomermasterDB, customerloadpostinvoiceDB, getcustomerloadpostmasterDB} = require('../../models/V1/Customer_LoadPost_Master/utility.js');

// Customer Load Post Master
exports.customerloadpostmaster = async (req, res) => {
    try {
        logger.info('customerloadpostmaster request body:', req.body);
        // const validate = ajv.compile(customer_loadpost_master_schema);
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.error('Validation errors: ', validate.errors);
        //     return res.status(400).json({ errors: validate.errors });
        // }
        const result = await customerloadpostmasterDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });
    } catch (error) {
        logger.error('Error in customerloadpostmaster:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.updatecustomerloadpostmaster = async (req, res) => {
    try {
        logger.info('updatecustomerloadpostmaster request body:', req.body);
        const validate = ajv.compile(update_customer_loadpost_master_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }   
        const result = await updatecustomerloadpostmasterDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });
    } catch (error) {
        logger.error('Error in updatecustomerloadpostmaster:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.getcustomermaster = async (req, res) => {
    try {
        logger.info('getcustomermaster request body:', req.body);
        // Add validation if needed
        const result = await getcustomermasterDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc, data: result.data });
    }
    catch (error) {
        logger.error('Error in getcustomermaster:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.customerloadpostinvoice = async (req, res) => { 
    try {
        logger.info('customerloadpostinvoice request body:', req.body);
        const validate = ajv.compile(customer_loadpost_invoice_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await customerloadpostinvoiceDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.status_code, message: result.message, data: result.data });
    } catch (error) {
        logger.error('Error in customerloadpostinvoice:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }   
}

exports.getcustomerloadpostmaster = async (req, res) => {
    try {
        logger.info('getcustomerloadpostmaster request body:', req.body);
        // Add validation if needed

        const result = await getcustomerloadpostmasterDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.status_code, message: result.message, data: result.data });
    } catch (error) {
        logger.error('Error in getcustomerloadpostmaster:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}