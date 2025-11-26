const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../log/logger');
const sql = require('mssql');
const pool = require('../db/db');
// const generateOTP = require('../common/common'); 
const { sendOTP_Schema, validateOTP_Schema } = require("../models/V1/validate_schema");
const { SendOTPDB, validateOTPDB } = require("../models/V1/validate_utility");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
};



// Function to send OTP
exports.send_OTP = async (req, res) => {
    try {
        const { mobile_number } = req.body;
        logger.log("info", `sendOTP request: ${JSON.stringify(req.body)}`);

        // Validate request data using Ajv
        if (!mobile_number) {
            logger.log("error", "Validation error: mobile_number is required");
            return res.json({ status: 400, message: "mobile_number is required" });
        }

        const validate = ajv.compile(sendOTP_Schema());
        if (!validate(req.body)) {
            logger.log("error", `Validation errors: ${JSON.stringify(validate.errors)}`);
            return res.json({ status: 400, message: "Invalid input data",message: validate.errors });
        }

        logger.log("info", "sendOTP data is valid!");
        // const otp = await generateOTP();
        // const otp =  JSON.stringify(generateOTP());
        otp = '111111'
        logger.log("info", `otp ${otp}`);

        // Fetch user details from DB
        const result = await SendOTPDB(mobile_number, otp);
        if (!result) {
            logger.log("error", `mobile_number not found: ${mobile_number}`);
            return res.json({ status: 404, message: "mobile_number not found" });
        }

        logger.log("info", `sendOTP successful for ${mobile_number}`);
        res.json({status: result.errorCode,message: result.errorDesc});
        return;

    } catch (error) {
        logger.log("error", `sendOTP Error: ${error.message}`);
        return res.json({ status: 500, message: "Internal server error" });
    }
};

// Function to validate OTP
exports.validate_OTP = async (req,res) => {
    logger.log("info", `validateOTP request: ${JSON.stringify(req.body)}`);

    try {
        const { mobile_number, otp } = req.body;
        logger.log("info", `validateOTP request: ${JSON.stringify(req.body)}`);

        // Validate request data using Ajv
        if (!mobile_number) {
            logger.log("error", "Validation error: mobile_number is required");
            return res.json({ status: 400, message: "mobile_number is required" });
        }

        const validate = ajv.compile(validateOTP_Schema());
        if (!validate(req.body)) {
            logger.log("error", `Validationmessage: ${JSON.stringify(validate.errors)}`);

            return res.json({ status: 400, code:"01", message: "Invalid input data", errors: validate.errors });
        }

        logger.log("info", "validateOTP data is valid!");

        // Fetch user details from DB
        const result = await validateOTPDB(mobile_number, otp);
        if (!result) {
            logger.log("error", `mobile_number not found: ${mobile_number}`);
            return res.json({ status: 404, message: "mobile_number not found" });
        }

        // logger.log("info", `validateOTP successful for ${mobile_number}`);
        // return { status: 200, message: "OTP validate successfully" };
        console.log(result);
        logger.log("error", `Validation ${JSON.stringify(result)}`);
        res.json({status: result.errorCode,message: result.errorDesc});
        return;

    } catch (error) {
        logger.log("error", `validateOTP Error: ${error.message}`);
        return res.json({ status: 500, message: "Internal server error" });
    }
};


exports.validation = async (req) => {
    logger.log("info", `VendorOnboarding req_body = ${JSON.stringify(req.body)}`);

    try {
        const { authtokan } = req.body;  // Extract the JWT token from the request body

        if (!authtokan) {
            logger.log("error", "No auth token provided");
            return {
                status: 400,
                message: "Authentication token is required"
            };
        }

        // Validate the token using JWT
        jwt.verify(authtokan, SECRET_KEY, (err, decoded) => {
            if (err) {
                logger.log("error", `Token validation failed: ${err.message}`);
                return {
                    status: 401,
                    message: "Invalid or expired token"
                };
            }

            // If token is valid, decoded contains the payload (user info)
            logger.log("info", `Token validated successfully: ${JSON.stringify(decoded)}`);
            return {
                status: 200,
                message: "Token is valid",
                decoded
            };
        });

    } catch (error) {
        logger.log("error", `Validation Error: ${error.message}`);
        return {
            status: 500,
            message: "Internal server error"
        };
    }
};


// // Function to send OTP
// exports.sendOTP = (mobile_number) => {
//     // const otp = generateOTP();
//     const otp = otpGenerator();
//     console.log(otpGenerator.generateOTP());

//     const expiresAt = new Date(new Date().getTime() + 5 * 60 * 1000); // 5 minutes expiry
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 return pool.request()
//                     .input('mobile_number', sql.NVarChar(15), mobile_number)
//                     .input('otp', sql.Int, otp)
//                     .input('expiresAt', sql.DateTime, expiresAt)
//                     .execute('SendOTP'); // Call the stored procedure
//             })
//             .then(result => {
//                 // OTP stored successfully, you can now send OTP to the user via SMS/Email
//                 console.log(`OTP sent to ${mobile_number}: ${otp}`);
//                 resolve({
//                     status: 200,
//                     message: 'OTP sent successfully',
//                 });
//             })
//             .catch(err => {
//                 console.error('SQL Error:', err);
//                 reject({
//                     status: 500,
//                     message: 'Internal server error',
//                 });
//             });
//     });
// };


// // Function to validate OTP
// exports.validateOTP = (mobile_number, otp) => {
//     return new Promise((resolve, reject) => {
//         sql.connect(pool)
//             .then(pool => {
//                 return pool.request()
//                     .input('mobile_number', sql.NVarChar(15), mobile_number)  // User's phone number
//                     .input('otp', sql.Int, otp)  // OTP provided by the user
//                     .execute('ValidateOTP'); // Call the stored procedure
//             })
//             .then(result => {
//                 const validationMessage = result.recordset[0].message;

//                 if (validationMessage === 'OTP validated successfully') {
//                     resolve({
//                         status: 200,
//                         message: 'OTP validated successfully',
//                     });
//                 } else {
//                     resolve({
//                         status: 400,
//                         message: 'Invalid or expired OTP',
//                     });
//                 }
//             })
//             .catch(err => {
//                 console.error('SQL Error:', err);
//                 reject({
//                     status: 500,
//                     message: 'Internal server error',
//                 });
//             });
//     });
// };


