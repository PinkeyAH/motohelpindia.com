

const Ajv = require('ajv');
const addFormats = require('ajv-formats');
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
const { customer_Set_MpinDB, customer_login_MpinDB , customer_Change_MpinDB,customer_Forgot_MpinDB, customer_logout_MpinDB} = require("../../models/V1/Customer_Mpin/utility");
const { customersetmpinSchema } = require("../../models/V1/Customer_Mpin/schema");
const logger = require('../../log/logger');

exports.customer_Set_Mpin = async function (req, res) {
    try {
        logger.log("info", `Set Merchant Mpin - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;

        // Validation
        // const validate = ajv.compile(customersetmpinSchema());
        // if (!validate(req_json)) {
        //     let err_validate_msg = "Request Field Validation Fail: " + validate.errors[0].instance.replace('instance.', '');
        //     logger.log('error', ' validation Error: ' + JSON.stringify(err_validate_msg) + " REQUEST: " + JSON.stringify(req_json));
        //     let res_json = {
        //         "status_code": "02",
        //         "status_desc": "Validation error occurred. Please check your input and try again."
        //     };
        //     logger.log('info', ' Final Response: ' + JSON.stringify(res_json));
        //     return res.status(200).send(res_json);
        // }
        
        // Check if vendorid is present in headers and move it to body
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
        }

        // Check if mobile number is already associated with an mPIN
        // const is_mobile_no_exists = await checkMerchantMobileNoExists(payload.mobile_number);
        // if (is_mobile_no_exists) {
        //     return res.status(200).json({ status_code: "01", status_desc: "The mobile number you entered is already associated with an mPIN." });
        // }

        // Set Merchant Mpin and respond with success message
        const result = await customer_Set_MpinDB(req_json);
        if (result.errorCode) {
            logger.log('error', `Set Merchant Mpin - Error: ${result.errorCode} - ${result.errorMessage}`);
            let res_json = {
                "status_code": result.errorCode,
                "status_desc": result.errorMessage
            };
            logger.log('info', ' Final Response: ' + JSON.stringify(res_json));
            return res.status(200).send(res_json);
        }
        logger.log("info", `Set Merchant Mpin - res_json = ${JSON.stringify(result)}`);
        let res_json = {
            "status_code": result.bstatus_code,
            "status_desc": result.bmessage_desc
        };
        logger.log('info', ' Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);
        // return res.status(200).json({ status_code: "00", status_desc: "mPIN set successfully! You're all set to authenticate securely." });

    } catch (e) {
        logger.log('error', `Set Merchant Mpin - Exception ${e.error ? e.error : e.toString()}`);
        console.log(e);
        // Consider adding a response in case of an exception to inform the client about the error.
        return res.status(500).json({ status_code: "03", status_desc: "Internal Server Error" });
    }
}

exports.customer_login_Mpin = async function (req, res) {
    try {
        logger.log("info", `Login Customer MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;

        // Validation
        // const schemaValidator = validate(req_json, customersetmpinSchema());
        // if (!schemaValidator.valid) {
        //     const errField = schemaValidator.errors[0].property.replace('instance.', '');
        //     const errMessage = `Validation failed for field: ${errField}`;
        //     logger.log('error', errMessage + " REQUEST: " + JSON.stringify(req_json));

        //     return res.status(200).send({
        //         status_code: "02",
        //         status_desc: "Validation error occurred. Please check your input and try again."
        //     });
        // }

        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to validate MPIN
        const result = await customer_login_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Login Customer MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in customer_login_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
};

exports.customer_Change_Mpin = async function (req, res) {
    try {
        logger.log("info", `Change Customer MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;

        // Validation
        // const schemaValidator = validate(req_json, customerChangeMpinSchema());
        // if (!schemaValidator.valid) {
        //     const errField = schemaValidator.errors[0].property.replace('instance.', '');
        //     const errMessage = `Validation failed for field: ${errField}`;
        //     logger.log('error', errMessage + " REQUEST: " + JSON.stringify(req_json));

        //     return res.status(200).send({
        //         status_code: "02",
        //         status_desc: "Validation error occurred. Please check your input and try again."
        //     });
        // }

        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to change MPIN
        const result = await customer_Change_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Change Customer MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in customer_Change_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
}

exports.customer_Forgot_Mpin = async function (req, res) {
    try {
        logger.log("info", `Forgot Customer MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;

        // Validation
        // const schemaValidator = validate(req_json, customerForgotMpinSchema());
        // if (!schemaValidator.valid) {
        //     const errField = schemaValidator.errors[0].property.replace('instance.', '');
        //     const errMessage = `Validation failed for field: ${errField}`;
        //     logger.log('error', errMessage + " REQUEST: " + JSON.stringify(req_json));

        //     return res.status(200).send({
        //         status_code: "02",
        //         status_desc: "Validation error occurred. Please check your input and try again."
        //     });
        // }

        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to change MPIN
        const result = await customer_Forgot_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Forgot Customer MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in customer_Forgot_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
}

exports.customer_logout_Mpin = async function (req, res) {
    try {
        logger.log("info", `Logout Customer MPIN - req.body = ${JSON.stringify(req.body)}`);
        let req_json = req.body;

        // Validation
        // const schemaValidator = validate(req_json, customerlogoutMpinSchema());
        // if (!schemaValidator.valid) {
        //     const errField = schemaValidator.errors[0].property.replace('instance.', '');
        //     const errMessage = `Validation failed for field: ${errField}`;
        //     logger.log('error', errMessage + " REQUEST: " + JSON.stringify(req_json));

        //     return res.status(200).send({
        //         status_code: "02",
        //         status_desc: "Validation error occurred. Please check your input and try again."
        //     });
        // }

        // Move vendorid from headers to body if it exists
        if (req.headers.vendorid) {
            req_json.vendorid = req.headers.vendorid;
        }

        // Call service function to logout MPIN
        const result = await customer_logout_MpinDB(req_json);

        if (result.errorCode) {
            logger.log('error', `Logout Customer MPIN - Error: ${result.errorCode} - ${result.errorMessage}`);
            return res.status(200).send({
                status_code: result.errorCode,
                status_desc: result.errorMessage
            });
        }

        const res_json = {
            status_code: result.bstatus_code,
            status_desc: result.bmessage_desc
        };
        logger.log('info', 'Final Response: ' + JSON.stringify(res_json));
        return res.status(200).send(res_json);

    } catch (error) {
        logger.log('error', 'Exception in customer_logout_Mpin: ' + error.message);
        return res.status(500).send({
            status_code: "500",
            status_desc: "Internal Server Error"
        });
    }
}