const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { customer_employee_schema } = require('../../models/V1/Customer_Employees/schema.js');
const{ InsertcustomeremployeeDB, updatecustomeremployeeDB, deletecustomeremployeeDB, getcustomeremployeeDB} = require('../../models/V1/Customer_Employees/utility.js');

// Insert Customer Employee
exports.Insertcustomeremployee = async function (req, res) {
    try {
        const validate = ajv.compile(customer_employee_schema); 
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await InsertcustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ error: 'Failed to insert customer employee' });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error in Insertcustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Update Customer Employee
exports.updatecustomeremployee = async function (req, res) {
    try {
        const validate = ajv.compile(customer_employee_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await updatecustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ error: 'Failed to update customer employee' });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error in updatecustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Delete Customer Employee

exports.deletecustomeremployee = async function (req, res) {
    try {
        const validate = ajv.compile(customer_employee_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await deletecustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ error: 'Failed to delete customer employee' });
        }   
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error in deletecustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

// Get Customer Employee
   exports.getcustomeremployee = async function (req, res) {
    try {       
        const validate = ajv.compile(customer_employee_schema);
        const valid = validate(req.body);
        if (!valid) {
            logger.error('Validation errors: ', validate.errors);
            return res.status(400).json({ errors: validate.errors });
        }
        const result = await getcustomeremployeeDB(req.body);
        if (!result) {
            return res.status(500).json({ error: 'Failed to get customer employee' });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error in getcustomeremployee:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
