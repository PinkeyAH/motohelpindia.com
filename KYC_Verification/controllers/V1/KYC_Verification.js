const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const logger = require('../../log/logger');
const { get_request, post_request, post_request_DL, get_request_DL, post_request_Aadhaar, get_request_Aadhaar, post_request_Bank_Cheque_OCR } = require('../request');
const { PANCard_schema, Gst_schema, DrivingLicense_schema, Vehicle_schema, Aadhaargenerateotp_schema, Aadhaarverifyotp_schema } = require("../../models/V1/KYC_Verification/schema");

const { pan_verification_url, Gst_verification_url, Vehicle_verification_url, post_DrivingLicense_verification_url, get_DrivingLicense_verification_url,
    post_Aadhaar_verification_url, get_Aadhaar_verification_url, Bank_Cheque_OCR_URL } = require('../../config/config');

exports.Pancard = async (req, res) => {
    logger.log("info", "Pancard request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));
    try {
        // Validate request body against schema
        const validate = ajv.compile(PANCard_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }

        const data = await get_request(pan_verification_url, req.body, req.headers);
        if (data.status == 200) {
            console.log("PAN Data:", data);
            return res.status(200).json({ status: '00', message: 'PAN verification successful', data: data.data.data });
        } else {
            return res.status(400).json({ status: '01', message: "No data found from API" });
        }
    } catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.GST = async (req, res) => {
    logger.log("info", "Gst request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));
    try {
        // Validate request body against schema
        const validate = ajv.compile(Gst_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }
        const data = await get_request(Gst_verification_url, req.body, req.headers);
        console.log("GST Data:", data);
        if (data.status == 200) {
            return res.status(200).json({ status: '00', message: 'GST verification successful', data: data.data.data });
        } else {
            return res.status(400).json({ status: '01', message: "No data found from API" });
        }
    } catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

async function pollDrivingLicense(getUrl, requestId, headers, maxRetries = 5, delay = 3000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Polling Attempt ${attempt}...`);

        const data = await get_request_DL(getUrl, requestId, headers);

        if (Array.isArray(data) && data.length > 0 && data[0].status === "completed") {
            return data[0].result?.source_output || {};
        }

        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    return null; // not completed
}

exports.DrivingLicense = async (req, res) => {
    logger.log("info", "Driving License request body = " + JSON.stringify(req.body), JSON.stringify(req.headers));
    try {
        const request_id = await post_request_DL(post_DrivingLicense_verification_url, req.body, req.headers);
        console.log("Driving License request_id:", request_id);

        if (!request_id) {
            return res.status(400).json({ status: '01', message: "No request_id found from API" });
        }

        // Poll until status = completed
        const source_output = await pollDrivingLicense(get_DrivingLicense_verification_url, request_id, req.headers);

        if (source_output) {
            const final_data = {
                name: source_output.name || null,
                relatives_name: source_output.relatives_name || null,
                dob: source_output.dob || null,
                address: source_output.address || null,
                id_number: source_output.id_number || null,
                issuing_rto_name: source_output.issuing_rto_name || null,
                date_of_issue: source_output.date_of_issue || null,
                nt_validity_from: source_output.nt_validity_from || null,
                nt_validity_to: source_output.nt_validity_to || null,
                t_validity_from: source_output.t_validity_from || null,
                t_validity_to: source_output.t_validity_to || null,
                cov_details: source_output.cov_details || [],
                status: source_output.status || null,
                source: source_output.source || null,
            };

            return res.status(200).json({
                status: '00',
                message: 'Driving License verification successful',
                data: final_data
            });
        } else {
            return res.status(400).json({ status: '01', message: "API did not return completed status within retries" });
        }
    }
    catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.Aadhaargenerateotp = async (req, res) => {
    logger.log("info", "Aadhaar generate OTP request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));
    try {
        // Validate request body against schema 
        const validate = ajv.compile(Aadhaargenerateotp_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }

        const data = await post_request_Aadhaar(post_Aadhaar_verification_url, req.body, req.headers);
        if (data.status == 200) {
            console.log("Aadhaar Generate OTP Data:", data);
            return res.status(200).json({ status: '00', message: 'Aadhaar OTP generation successful', data: data.data });
        } else {
            return res.status(400).json({ status: '01', message: "No data found from API" });
        }
    }
    catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.Aadhaarverifyotp = async (req, res) => {
    logger.log("info", "Aadhaar verify OTP request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));
    try {
        // Validate request body against schema
        const validate = ajv.compile(Aadhaarverifyotp_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }
        const data = await get_request_Aadhaar(get_Aadhaar_verification_url, req.body, req.headers);
        console.log("Aadhaar Verify OTP Data:", data);
        if (data.status == 200) {
            return res.status(200).json({ status: '00', message: 'Aadhaar verification successful', data: data.data });
        }
        else {
            return res.status(400).json({ status: '01', message: "No data found from API" });
        }
    }
    catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// exports.Vehicle = async (req, res) => {
//     logger.log("info", "Vehicle request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));

//     try {
//         // Validate request body against schema
//         const validate = ajv.compile(Vehicle_schema());
//         if (!validate(req.body)) {
//             return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
//         }

//         // Call third-party API
//         const apiResponse = await get_request(Vehicle_verification_url, req.body, req.headers);
//         if (apiResponse.status == 200 &&  apiResponse.data.data) {
//             console.log("Vehicle Data:", apiResponse.data);

//             // 🔹 Manage/Massage API Data into a proper JSON format
//             const jsonData = {
//                 rc_number: apiResponse.data.data.rc_number || "",
//                 registration_date: apiResponse.data.data.registration_date || null,
//                 owner_name: apiResponse.data.data.owner_name || "",
//                 father_name: apiResponse.data.data.father_name || "",
//                 present_address: apiResponse.data.data.present_address || "",
//                 permanent_address: apiResponse.data.data.permanent_address || "",
//                 mobile_number: apiResponse.data.data.mobile_number || "",
//                 vehicle_category: apiResponse.data.data.vehicle_category || "",
//                 vehicle_chasi_number: apiResponse.data.data.vehicle_chasi_number || "",
//                 vehicle_engine_number: apiResponse.data.data.vehicle_engine_number || "",
//                 maker_description: apiResponse.data.data.maker_description || "",
//                 maker_model: apiResponse.data.data.maker_model || "",
//                 body_type: apiResponse.data.data.body_type || "",
//                 fuel_type: apiResponse.data.data.fuel_type || "",
//                 fit_up_to: apiResponse.data.data.fit_up_to || null,
//                 insurance_upto: apiResponse.data.data.insurance_upto || null,
//                 manufacturing_date: apiResponse.data.data.manufacturing_date || "",
//                 registered_at: apiResponse.data.data.registered_at || "",
//                 tax_upto: apiResponse.data.data.tax_upto || null,
//                 tax_paid_upto: apiResponse.data.data.tax_paid_upto || null,
//                 cubic_capacity: apiResponse.data.data.cubic_capacity || "0",
//                 vehicle_gross_weight: apiResponse.data.data.vehicle_gross_weight || "0",
//                 no_cylinders: apiResponse.data.data.no_cylinders || "0",
//                 seat_capacity: apiResponse.data.data.seat_capacity || "0",
//                 unladen_weight: apiResponse.data.data.unladen_weight || "0",
//                 vehicle_category_description: apiResponse.data.data.vehicle_category_description || "",
//                 pucc_number: apiResponse.data.data.pucc_number || "",
//                 pucc_upto: apiResponse.data.data.pucc_upto || null,
//                 permit_number: apiResponse.data.data.permit_number || "",
//                 permit_valid_from: apiResponse.data.data.permit_valid_from || null,
//                 permit_valid_upto: apiResponse.data.data.permit_valid_upto || null,
//                 permit_type: apiResponse.data.data.permit_type || "",
//                 rc_status: apiResponse.data.data.rc_status || "",
//                 // message: apiResponse.data.message
//             };

//             // ✅ Respond with cleaned JSON
//             return res.status(200).json({
//                 status: '00',
//                 message: apiResponse.data.message || 'Vehicle verification successful',
//                 data: jsonData
//             });
//         } else {
//             return res.status(400).json({ status: '01', message: apiResponse.data.message || "No data found from API" });
//         }



//     }
//     catch (error) {
//         logger.log("error", ` Type Error: ${error}`);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


exports.Vehicle = async (req, res) => {
    logger.log("info", "Vehicle request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));

    try {
        // Validate request body against schema
        const validate = ajv.compile(Vehicle_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }

        // Call third-party API
        const apiResponse = await get_request(Vehicle_verification_url, req.body, req.headers);
        if (apiResponse.status == 200 && apiResponse.data.data) {
            console.log("Vehicle Data:", apiResponse.data);

            // 🔹 Manage/Massage API Data into a proper JSON format
            const jsonData = {
                rc_number: apiResponse.data.data.rc_number || "",
                registration_date: apiResponse.data.data.registration_date || null,
                owner_name: apiResponse.data.data.owner_name || "",
                father_name: apiResponse.data.data.father_name || "",
                present_address: apiResponse.data.data.present_address || "",
                permanent_address: apiResponse.data.data.permanent_address || "",
                mobile_number: apiResponse.data.data.mobile_number || "",
                vehicle_category: apiResponse.data.data.vehicle_category || "",
                vehicle_chasi_number: apiResponse.data.data.vehicle_chasi_number || "",
                vehicle_engine_number: apiResponse.data.data.vehicle_engine_number || "",
                maker_description: apiResponse.data.data.maker_description || "",
                maker_model: apiResponse.data.data.maker_model || "",
                body_type: apiResponse.data.data.body_type || "",
                fuel_type: apiResponse.data.data.fuel_type || "",
                fit_up_to: apiResponse.data.data.fit_up_to || null,
                insurance_upto: apiResponse.data.data.insurance_upto || null,
                manufacturing_date: apiResponse.data.data.manufacturing_date || "",
                registered_at: apiResponse.data.data.registered_at || "",
                tax_upto: apiResponse.data.data.tax_upto || null,
                tax_paid_upto: apiResponse.data.data.tax_paid_upto || null,
                cubic_capacity: apiResponse.data.data.cubic_capacity || "0",
                vehicle_gross_weight: apiResponse.data.data.vehicle_gross_weight || "0",
                no_cylinders: apiResponse.data.data.no_cylinders || "0",
                seat_capacity: apiResponse.data.data.seat_capacity || "0",
                unladen_weight: apiResponse.data.data.unladen_weight || "0",
                vehicle_category_description: apiResponse.data.data.vehicle_category_description || "",
                pucc_number: apiResponse.data.data.pucc_number || "",
                pucc_upto: apiResponse.data.data.pucc_upto || null,
                permit_number: apiResponse.data.data.permit_number || "",
                permit_valid_from: apiResponse.data.data.permit_valid_from || null,
                permit_valid_upto: apiResponse.data.data.permit_valid_upto || null,
                permit_type: apiResponse.data.data.permit_type || "",
                rc_status: apiResponse.data.data.rc_status || "",
                // message: apiResponse.data.message
            };

            return res.status(200).json({
                status: "00",
                message: apiResponse.data.message || "Vehicle verification successful",
                data: jsonData
            });
        }

        // 5️⃣ No data found
        return res.status(404).json({
            status: "01",
            message: "Vehicle data not found"
        });

    } catch (error) {
        logger.error("Vehicle API Error", error);

        const errData = error?.response?.data;

        // 🔴 SOURCE FAILURE (Deepvue / RTO down)
        if (errData?.code === "500") {
            return res.status(503).json({
                status: "01",
                message: "Vehicle data source temporarily unavailable. Please try again later.",
                sub_code: errData.sub_code
            });
        }

        if (errData?.sub_code === "SOURCE_FAILURE") {
            return res.status(503).json({
                status: "01",
                message: "Vehicle data source temporarily unavailable. Please try again later.",
                sub_code: errData.sub_code
            });
        }

        // 🔴 Unauthorized / Token issue
        if (error?.response?.status === 401) {
            return res.status(401).json({
                status: "01",
                message: "Unauthorized request to vehicle service"
            });
        }

        // 🔴 Deepvue error but not source failure
        if (error?.response) {
            return res.status(400).json({
                status: "01",
                message: errData?.message || "Vehicle verification failed"
            });
        }

        // 🔴 System / Code error
        return res.status(500).json({
            status: "01",
            message: "Internal server error"
        });
    }
};

exports.Aadhar_send_otp = async (req, res) => {
    logger.log("info", "Aadhaar send OTP request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));

    try {
        // Validate request body against schema
        const validate = ajv.compile(Aadhaargenerateotp_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }
        const data = await post_request_Aadhaar(post_Aadhaar_verification_url, req.body, req.headers);
        if (data.status == 200) {
            console.log("Aadhaar Send OTP Data:", data);
            return res.status(200).json({ status: '00', message: data.data.message, data: data.data });
        }
        else {
            return res.status(400).json({ status: '01', message: data.data.message || "No data found from API" });
        }
    }
    catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.Aadhar_verify_otp = async (req, res) => {
    logger.log("info", "Aadhaar verify OTP request body = " + JSON.stringify(req.body) + JSON.stringify(req.headers));
    try {
        // Validate request body against schema
        const validate = ajv.compile(Aadhaarverifyotp_schema());
        if (!validate(req.body)) {
            return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        }
        const data = await get_request_Aadhaar(get_Aadhaar_verification_url, req.body, req.headers);
        console.log("Aadhaar Verify OTP Data:", data);
        if (data.status == 200) {
            // return res.status(200).json({ status: '00', message: 'Aadhaar verification successful', data: data.data });
            return res.status(200).json({ status: '00', message: data.data.message, data: data.data });

        } else {
            return res.status(400).json({ status: '01', message: data.data.message || "No data found from API" });
        }
    }
    catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: error.message || "Internal server error" });
    }
};

// Bank Cheque OCR
exports.Bank_Cheque_OCR = async (req, res) => {
    logger.log("info", "Bank Cheque OCR request body = " + JSON.stringify(req.body));

    try {
        let { document1 } = req.body;

        // 🧹 Remove Base64 prefix (image/png, image/jpeg, etc.)
        if (document1 && document1.includes("base64,")) {
            document1 = document1.split("base64,")[1];
        }

        // Replace req.body.document1 with cleaned Base64
        req.body.document1 = document1;

        // CALL POST REQUEST
        const data = await post_request_Bank_Cheque_OCR(
            Bank_Cheque_OCR_URL,
            req.body,
            req.headers
        );

        console.log("Bank Cheque OCR Data:", data);

        if (data.status == 200) {
            return res.status(200).json({
                status: '00',
                message: 'Bank Cheque OCR successful',
                data: data.data
            });
        } else {
            return res.status(400).json({
                status: '01',
                message: "No data found from API"
            });
        }

    } catch (error) {
        logger.log("error", ` Type Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};
