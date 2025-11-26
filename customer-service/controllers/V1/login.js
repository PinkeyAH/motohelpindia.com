
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const logger = require('../../log/logger');const { login_schema, logout_Schema} = require("../../models/V1/login/schema");
const { loginDB, logoutDB } = require("../../models/V1/login/utility");
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

 
// Login function
exports.login = async (req,res) => {
    try {
        const { username , password } = req.body;
        logger.log("info", `Login request: ${JSON.stringify(req.body)}`);

        // Validate request data using Ajv
        const validate = ajv.compile(login_schema());
        const isValid = validate(req.body);
        if (!isValid) {
            logger.log("error", `Validation errors: ${JSON.stringify(validate.errors)}`);
            return res.status(400).json({status: "01", message: "Invalid input data", message: validate.errors});
        }

        logger.log("info", "Login data is valid!");

        // Get user details from DB
        const result = await loginDB(username , password );
        logger.log("info", "Login successful");
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc,userDetails: JSON.parse(result.userDetails)});


    } catch (error) {
        logger.log("error", `Login Error: ${error.message}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};


// logout function
exports.logout = async (req) => {
    try {
        const { username, password } = req.body;
        logger.log("info", `Login request: ${JSON.stringify(req.body)}`);

        // Validate request data using Ajv
        const validate = ajv.compile(logout_Schema());
        const isValid = validate(req.body);
        if (!isValid) {
            logger.log("error", `Validation errors: ${JSON.stringify(validate.errors)}`);
            return { status: 400,code: "01", message: "Invalid input data", errors: validate.errors };
        }

        logger.log("info", "Login data is valid!");

        // Get user details from DB
        const user = await logoutDB(username);
        if (!user) {
            logger.log("error", "User not found");
            return { status: 404,code:"01" ,message: "User not found" };
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.log("error", "Invalid password");
            return { status: 401, message: "Invalid credentials" };
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.userId, username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        logger.log("info", "Login successful");
        return {
            status: 200,
            message: "Login successful",
            token,
            userDetails: { userId: user.userId, username: user.username }
        };

    } catch (error) {
        logger.log("error", `Login Error: ${error.message}`);
        return { status: 500, message: "Internal server error" };
    }
};
