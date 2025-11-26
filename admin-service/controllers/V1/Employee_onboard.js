const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const {logger} = require('../../log/logger');const path = require('path');
const { employeeInsertDB, employeeUpdateDB, deleteemployeeDB, getEmployeeDB, ImageUploadDB, UpdateImageUploadDB } = require('../../models/V1/Employee_onboard/utility');
const { employeeInsertSchema } = require("../../models/V1/Employee_onboard/schema");
const { getRandomSixDigitNumber, saveMultipleBase64Images } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

exports.Insertemployee = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    // const vendorid = "VND12345"; // Hardcoded for now
    const employeeid = getRandomSixDigitNumber();
    const employee_id = `EMP${employeeid}`;
    try {
        // const validate = ajv.compile(employeeInsertSchema());
        // if (!validate(req.body)) {
        //     return res.status(400).json({status: "01", message: "Invalid input data", errors: validate.errors });
        // }
        const result = await employeeInsertDB(req.body, employee_id);
        if (result.status === "00") {

            await InsertemployeePhoto(employee_id, req, res);
        }
        return res.status(200).json({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Insert employees Error: ${error}`);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Function to save multiple base64 images
const InsertemployeePhoto = async (employee_id, req, res) => {
    try {
        // 1. Collect Base64 fields from the request body
        const imagesMap = {};

        Object.entries(req.body).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });


        // 2. Build your destination folder path
        const destFolder = path.join(__dirname, '../../uploads', 'employees');

        // 3. Save all images and get back their disk paths
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        // 4. Build the array of objects you want to insert into your DB
        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => ({
            employeesID: employee_id,  // or generate dynamically
            photo_id: '123',                    // or generate dynamically
            photo_type: key,                      // e.g. “CancelledCheque”
            photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/employees/${path.basename(fullPath)}`,
            name: path.basename(fullPath),
        }));

        // 5. Insert each record
        for (const img of imagesToInsert) {
            await ImageUploadDB(img);
        }
        logger.log("info", `employees Images Inserted successfully`);
        return
        //   return res.status(200).json({
        //     status:  "00",
        //     message: "All images saved and recorded successfully.",
        //     data:    imagesToInsert
        //   });

    } catch (error) {
        console.error('Insert employees Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.updateEmployeeDetails = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        // const validate = ajv.compile(employeeInsertSchema());
        // if (!validate(req.body)) {
        //     return res.status(400).json({status: "01", message: "Invalid input data", errors: validate.errors });
        // }
        const result = await employeeUpdateDB(req.body);
        if (result.status === "00") {
            await UpdateImageUpload(req.body.employee_id, req, res);
        }
        return res.status(200).json({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Employee Details Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.deleteEmployeeDetails = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const result = await deleteemployeeDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message });
    } catch (error) {
        logger.log("error", `Employee Details Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
}

exports.getEmployeeDetails = async (req, res) => {
    logger.log("info", `Employee Details req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const result = await getEmployeeDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Employee Details Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
}


const UpdateImageUpload = async (employee_id, req, res) => {
    try {
        // 1. Collect Base64 fields from the request body
        const imagesMap = {};

        Object.entries(req.body).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        // 2. Build your destination folder path
        const destFolder = path.join(__dirname, '../../uploads', 'employees');

        // 3. Save all images and get back their disk paths
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        // 4. Build the array of objects you want to insert into your DB
        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => ({
            employee_id: employee_id,  // or generate dynamically
            photo_id: '123',                    // or generate dynamically
            photo_type: key,                      // e.g. “CancelledCheque”
            photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/employees/${path.basename(fullPath)}`,
            name: path.basename(fullPath),
        }));

        // 5. Insert each record
        for (const img of imagesToInsert) {
            await UpdateImageUploadDB(img);
        }
        logger.log("info", `employees Images Updated successfully`);
        return
    } catch (error) {
        console.error('Update employees Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
}
