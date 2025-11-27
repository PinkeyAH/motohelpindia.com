const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { customer_employee_schema } = require('../../models/V1/Customer_Employees/schema.js');
const{ InsertcustomeremployeeDB, updatecustomeremployeeDB, deletecustomeremployeeDB, getcustomeremployeeDB} = require('../../models/V1/Customer_Employees/utility.js');

// Insert Customer Employee
exports.Insertcustomeremployee = async (req, res) => {
    try {
        // const validate = ajv.compile(customer_employee_schema); 
        // const valid = validate(req.body);
        // if (!valid) {
        //     logger.error('Validation errors: ', validate.errors);
        //     return res.status(400).json({ errors: validate.errors });
        // }
        const result = await InsertcustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.error('Error in Insertcustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update Customer Employee
exports.updatecustomeremployee = async (req, res) => {
    try {
        const validate = ajv.compile(customer_employee_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await updatecustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.error('Error in updatecustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete Customer Employee

exports.deletecustomeremployee = async (req, res) => {
    try {
        const validate = ajv.compile(customer_employee_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await deletecustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ status: result.status, message: result.message });
        }   
        return res.status(200).json({ status: result.status, message: result.message });
    } catch (error) {
        logger.error('Error in deletecustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get Customer Employee
   exports.getcustomeremployee = async (req, res) => {
    try {       
        const validate = ajv.compile(customer_employee_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await getcustomeremployeeDB(req.body);
        if (!result) {
        return res.status(500).json({ status: result.status, message: result.message });
        }
        return res.status(200).json({ status: result.status, message: result.message });
    } catch (error) {
        logger.error('Error in getcustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
