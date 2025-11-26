const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { Vendor_KYC_Check_DB } = require('../../models/V1/KYC_Verification/utility');

exports.Vendor_KYC_Check = async (req, res) => {
    logger.log("info", "KYC request body = " + JSON.stringify(req.body));

    try {
        // Move vendorid from header to body if available
        if (req.headers.vendorid) {
            req.body.vendorid = req.headers.vendorid;
        }

        const data = await Vendor_KYC_Check_DB(req.body);
        const checks = data.checks || {};

        // 🧾 Default variables
        let fieldStatus = "00";
        let fieldMessage = "KYC verification completed successfully";

        // 🔍 Identify which field is being verified
        if (checks.gst && checks.gst.value) {
            fieldName = "GST Number";
            fieldValue = checks.gst.value;
            fieldStatus = checks.gst.status;
            fieldMessage = checks.gst.message;
        } else if (checks.pan && checks.pan.value) {
            fieldName = "PAN Number";
            fieldValue = checks.pan.value;
            fieldStatus = checks.pan.status;
            fieldMessage = checks.pan.message;
        } else if (checks.aadhar && checks.aadhar.value) {
            fieldName = "Aadhaar Number";
            fieldValue = checks.aadhar.value;
            fieldStatus = checks.aadhar.status ;
            fieldMessage = checks.aadhar.message;
        } else if (checks.driving_license && checks.driving_license.value) {
            fieldName = "Driving License Number";
            fieldValue = checks.driving_license.value;
            fieldStatus = checks.driving_license.status;
            fieldMessage = checks.driving_license.message;
        } else if (checks.registration_no && checks.registration_no.value) {
            fieldName = "Vehicle Registration Number";
            fieldValue = checks.registration_no.value;
            fieldStatus = checks.registration_no.status;
            fieldMessage = checks.registration_no.message;
        }

        // 🧩 Create dynamic response JSON
        const response = {
            vendorid: data.vendorid || req.body.vendorid,
            status: fieldStatus,
            message: fieldMessage
        };

        if (fieldName && fieldValue) {
            response[fieldName] = fieldValue; // ✅ Dynamic key name
        }

        return res.status(200).json(response);

    } catch (error) {
        logger.log("error", `Vendor_KYC_Check Error: ${error}`);
        return res.status(500).json({
            status: '01',
            message: 'Internal Server Error',
            error: error.toString()
        });
    }
};
