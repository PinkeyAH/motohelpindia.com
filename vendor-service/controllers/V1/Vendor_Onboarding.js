const Ajv = require('ajv');
const addFormats = require('ajv-formats');
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const { logger } = require('../../log/logger'); const path = require('path');
const { VendorOnboardingDB, vendorBankkYCDB, VendorOnboardingUpdateDB, getVendoremployeeDB,  getVendorDetailsDB, getVendorKYCDB, getVehicleDB,
        updateVendoremployeeDB, updateVendorDetailsDB, updateVendorKYCDB, updateVehicleDB,
        deleteVendoremployeeDB, deleteVendorDetailsDB, deleteVendorKYCDB, deleteVehicleDB, deleteDriverDB,
        ImageUploadDB, UpdateImageUploadDB, VehicleVerificationDB, checkMobileNoDB } 
      = require('../../models/V1/Vendor_Onboarding/utility');
const { VendorOnboarding_schema } = require("../../models/V1/Vendor_Onboarding/schema");
const { getRandomSixDigitNumber, saveMultipleBase64Images } = require("../../common/common");

exports.VendorOnboarding = async (req, res) => {
    logger.log("info", `VendorOnboarding req_body = ${JSON.stringify(req.body)}`);

    try {
        // const validate = ajv.compile(VendorOnboarding_schema());
        // const isValid = validate(req.body);
        // if (!isValid) {
        //     logger.log("error", `Validation errors: ${JSON.stringify(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Invalid input data", errors: validate.errors });

        // }
        logger.log("info", "Vendor Onboarding data is valid!");

        const vendorMobile = req.body.VendorDetails.mobileNo;
        const employees = req.body.VendorEmployeeDetails; // array

        // --------------------------------------------
        // 1. Vendor mobile check
        // --------------------------------------------
        const vendorCheck = await checkMobileNoDB(vendorMobile);
        if (vendorCheck.exists) {
            return res.status(400).json({
                status: "02",
                message: `Vendor mobile number ${vendorMobile} already exists in system`
            });
        }

        // --------------------------------------------------------
        // 2. Create a list of ALL employee mobile numbers
        // --------------------------------------------------------
        const employeeMobiles = employees
            .filter(e => e.contact_No)      // if contact number exists
            .map(e => e.contact_No.trim()); // clean value

        // --------------------------------------------------------
        // 3. Check if vendor mobile matches any employee mobile
        // --------------------------------------------------------
        if (employeeMobiles.includes(vendorMobile)) {
            return res.status(400).json({
                status: "02",
                message: `Vendor mobile number and employee contact number cannot be same`
            });
        }

        // --------------------------------------------------------
        // 4. Check duplicates inside employees array
        // --------------------------------------------------------
        const duplicates = employeeMobiles.filter(
            (num, i) => employeeMobiles.indexOf(num) !== i
        );

        if (duplicates.length > 0) {
            return res.status(400).json({
                status: "02",
                message: `Duplicate employee contact numbers not allowed: ${duplicates.join(", ")}`
            });
        }

        // --------------------------------------------------------
        // 5. Check each employee mobile number in DB (one by one)
        // --------------------------------------------------------
        for (let mobile of employeeMobiles) {
            const check = await checkMobileNoDB(mobile);
            if (check.exists) {
                return res.status(400).json({
                    status: "02",
                    message: `Employee mobile number ${mobile} already exists in system`
                });
            }
        }


        const vendor_id = await JSON.stringify(getRandomSixDigitNumber());
        const vendorid = `VND${vendor_id}`;
        console.log(vendorid);
        // Call the Vendor OnboardingDB function to save user data
        const result = await VendorOnboardingDB(req.body, vendorid, req.body.VendorEmployeeDetails, req.body.VehicleDetails);
        if (result.bstatus_code == "00") {
            await InsertVendorPhoto(vendorid, req, res);
            console.log("Vendor Photo Inserted Successfully");
        }
        console.log(result);
        logger.log("info", "Vendor Onboarding successful");
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc, userDetails: JSON.parse(result.userDetails) });


    } catch (error) {
        logger.log("error", `Vendor Onboarding Error: ${error}`);
        return res.status(500).json({
            status: 500,
            message: error || "Internal server error"
        });
    }
};

const InsertVendorPhoto = async (Vendorid, req, res) => {
    try {
        const imagesMap = {};
        const kycDetails = req.body.kycDetails;

        // Filter base64 image fields
        Object.entries(kycDetails).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'Vendor');
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
            const dynamicNumberKey = `${key}No`; // auto generate
            const docNumber = kycDetails[dynamicNumberKey] || null;

            return {
                VendorID: Vendorid,
                photo_id: docNumber || key.toUpperCase(),
                photo_type: key,
                photo_url: `https://neotechnet.com/Moto_Help_Microservices/vendor-service/uploads/Vendor/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
                doc_number: docNumber
            };
        });

        for (const img of imagesToInsert) {
            await ImageUploadDB(img);
        }

        logger.log("info", `Vendor Images Inserted successfully`);
        return;
        // res.status(200).json({ status: "00", message: "All images saved successfully.", data: imagesToInsert });

    } catch (error) {
        console.error('Insert Vendor Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};

const vendorBank_Cheque = async (Vendorid, req, res) => {
    try {
        const imagesMap = {};
        const Bank_Cheque = req.body.cheque_img;

        // Filter base64 image fields
        Object.entries(Bank_Cheque).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'Vendor');
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
            const dynamicNumberKey = `${key}No`; // auto generate
            const docNumber = Bank_Cheque[dynamicNumberKey] || null;

            return {
                VendorID: Vendorid,
                photo_id: docNumber || key.toUpperCase(),
                photo_type: key,
                photo_url: `https://motohelpindia.com/vendor-service/uploads/Vendor_Bank_Cheque/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
                doc_number: docNumber
            };
        });

        // for (const img of imagesToInsert) {
        //     await ImageUploadDB(img);
        // }

        logger.log("info", `Vendor Images Inserted successfully`);
        return;
        // res.status(200).json({ status: "00", message: "All images saved successfully.", data: imagesToInsert });

    } catch (error) {
        console.error('Insert Vendor Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.vendorBankkYC = async (req, res) => {
    logger.log("info", ` vendorBankkYC req_body = ${JSON.stringify(req.body)} `);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const Bank_Cheque = vendorBank_Cheque(req.body.vendorid, req, res);
        const result = await vendorBankkYCDB(req.body,Bank_Cheque.photo_url);
        logger.log("info", ` vendorBankkYC result = ${JSON.stringify(result)}`);
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `vendorBankkYC Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.getVendoremployee = async (req, res) => {
    logger.log("info", "Fetching getVendoremployee");
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const { vendorid } = req.body;
        logger.log("info", `Fetching getVendoremployee req_body = ${JSON.stringify(req.body)}`);

        const result = await getVendoremployeeDB(vendorid);
        return res.status(200).json({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Get getVendoremployee Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.getVendorDetails = async (req, res) => {
    logger.log("info", "Fetching getVendorDetails ");
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const { vendorid } = req.body;
        logger.log("info", `Fetching getVendorDetails req_body = ${JSON.stringify(req.body)}`);
        const result = await getVendorDetailsDB(vendorid);
        return res.status(200).json({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Get getVendorDetails: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.getVendorKYC = async (req, res) => {
    logger.log("info", "Fetching getVendorKYC ");
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const { vendorid } = req.body;
        logger.log("info", `Fetching getVendorKYC req_body = ${JSON.stringify(req.body)}`);
        const result = await getVendorKYCDB(vendorid);
        return res.status(200).json({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `Get getVendorKYC Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.getVehicle = async (req, res) => {
    logger.log("info", "Fetching Vehicle detalis ");
     if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

    try {
        logger.log("info", `Fetching Vehicle detalis req_body = ${JSON.stringify(req.body)}`);
        const result = await getVehicleDB(req.body);
        return res.status(200).json({ status: result.status, message: result.message ,data: result.data});
    } catch (error) {
        logger.log("error", `Get Vehicle Type Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.updateVendoremployee = async (req, res) => {
    logger.log("info", `Update Vendor Contact req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        // const validate = ajv.compile(VendoremployeeSchema());
        // if (!validate(req.body)) {
        //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        // }

        const result = await updateVendoremployeeDB(req.body);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }

        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Update Vendor Contact Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.updateVendorDetails = async (req, res) => {
    logger.log("info", `Update VendorDetails req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        // const validate = ajv.compile(VendorDetailsSchema());
        // if (!validate(req.body)) {
        //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        // }

        const result = await updateVendorDetailsDB(req.body);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc  });
        }

        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc , userDetails: JSON.parse(result.userDetails) });
    } catch (error) {
        logger.log("error", `Update VendorDetails Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.updateVendorKYC = async (req, res) => {
    logger.log("info", `Update Vendor KYC req_body = ${JSON.stringify(req.body)}`);

    let vendorId = req.body.vendorid;
    if (req.headers.vendorid) {
        vendorId = req.headers.vendorid;
        req.body.vendorid = vendorId;
    }

    try {
       const result = await updateVendorKYCDB(req.body);
        logger.log("info", `Vendor KYC Updated successfully`);
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });

    } catch (error) {
        console.error('Update Vendor Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.updateVehicle = async (req, res) => {
    logger.log("info", `Update Vehicle req_body = ${JSON.stringify(req.body)}`);
     if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

    try {
        // const validate = ajv.compile(VehicleSchema());
        // if (!validate(req.body)) {
        //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
        // }

        const result = await updateVehicleDB(req.body);
        if (result.bstatus_code !== "00") {
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }
        logger.log("info", `Update Vehicle result = ${JSON.stringify(result)}`);
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Update Vehicle Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.deleteVendoremployee = async (req, res) => {
    const { vendorid } = req.body;
    logger.log("info", `Delete Vendor Contact vendorid = ${vendorid}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const result = await deleteVendoremployeeDB(req.body);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }

        return res.status(200).json({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `Delete Vendor Contact Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.deleteVendorDetails = async (req, res) => {
    const { vendorid } = req.body;
    logger.log("info", `Delete VendorDetails vendorid = ${vendorid}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const result = await deleteVendorDetailsDB(vendorid);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }

        return res.status(200).json({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `Delete VendorDetails Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.deleteVendorKYC = async (req, res) => {

    const { vendorid } = req.body;
    logger.log("info", `Delete Vendor KYC vendorid = ${vendorid}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const result = await deleteVendorKYCDB(vendorid);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }

        return res.status(200).json({ status: result.status, message: result.message });

    }
    catch (error) {
        logger.log("error", `Delete Vendor KYC Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { vehicleid } = req.body;
    logger.log("info", `Delete Vehicle vehicleid = ${vehicleid}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const result = await deleteVehicleDB(req.body);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }

        return res.status(200).json({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `Delete Vehicle Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.deleteDriver = async (req, res) => {
    const { driverid } = req.body;
    logger.log("info", `Delete Driver driverid = ${driverid}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }
    try {
        const result = await deleteDriverDB(req.body);

        if (result.errorCode) {
            return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
        }

        return res.status(200).json({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `Delete Driver Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

exports.VehicleVerification = async (req, res) => {
    try {
        const result = await VehicleVerificationDB(req.body);
        logger.log("info", `VehicleVerification result: ${JSON.stringify(result)}`);
        return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
        logger.log("error", `VehicleVerification Error: ${error.message}`);
        return res.status(500).json({ status: "99", message: "Internal server error" });
    }
}

exports.VendorOnboardingUpdate = async (req, res) => {
    logger.log("info", "Fetching VendorOnboardingUpdate");
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }

    try {
        const vendorMobile = req.body.VendorDetails.mobileNo;
        const employees = req.body.VendorEmployeeDetails; // array

        // --------------------------------------------
        // 1. Vendor mobile check
        // --------------------------------------------
        // const vendorCheck = await checkMobileNoDB(vendorMobile);
        // if (vendorCheck.exists) {
        //     return res.status(400).json({
        //         status: "02",
        //         message: `Vendor mobile number ${vendorMobile} already exists in system`
        //     });
        // }

        // --------------------------------------------------------
        // 2. Create a list of ALL employee mobile numbers
        // --------------------------------------------------------
        const employeeMobiles = employees
            .filter(e => e.contact_No)      // if contact number exists
            .map(e => e.contact_No.trim()); // clean value

        // --------------------------------------------------------
        // 3. Check if vendor mobile matches any employee mobile
        // --------------------------------------------------------
        if (employeeMobiles.includes(vendorMobile)) {
            return res.status(400).json({
                status: "02",
                message: `Vendor mobile number and employee contact number cannot be same`
            });
        }

        // --------------------------------------------------------
        // 4. Check duplicates inside employees array
        // --------------------------------------------------------
        const duplicates = employeeMobiles.filter(
            (num, i) => employeeMobiles.indexOf(num) !== i
        );

        if (duplicates.length > 0) {
            return res.status(400).json({
                status: "02",
                message: `Duplicate employee contact numbers not allowed: ${duplicates.join(", ")}`
            });
        }

        // --------------------------------------------------------
        // 5. Check each employee mobile number in DB (one by one)
        // --------------------------------------------------------
        for (let mobile of employeeMobiles) {
            const check = await checkMobileNoDB(mobile);
            if (check.exists) {
                return res.status(400).json({
                    status: "02",
                    message: `Employee mobile number ${mobile} already exists in system`
                });
            }
        }


        const { vendorid } = req.body;
        logger.log("info", `Fetching VendorOnboardingUpdate req_body = ${JSON.stringify(req.body)}`);
        const result = await VendorOnboardingUpdateDB(req.body, vendorid, req.body.VendorEmployeeDetails, req.body.VehicleDetails);
        console.log(`VendorOnboardingUpdate result: ${JSON.stringify(result)}`);
        
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc, userDetails: JSON.parse(result.userDetails) });
    } catch (error) {
        logger.log("error", `Get VendorOnboardingUpdate Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};











// exports.updateVendorKYC = async (req, res) => {
//     logger.log("info", `Update Vendor KYC req_body = ${JSON.stringify(req.body)}`);

//     let vendorId = req.body.vendorid;
//     if (req.headers.vendorid) {
//         vendorId = req.headers.vendorid;
//         req.body.vendorid = vendorId;
//     }

//     try {
//         const kycDetails = req.body || {};
//         const imagesMap = {};

//         // Collect images from kycDetails
//         Object.entries(kycDetails).forEach(([key, value]) => {
//             if (value && typeof value === 'string' && value.startsWith('data:image')) {
//                 imagesMap[key] = value;
//             }
//         });

//         const destFolder = path.join(__dirname, '../../uploads', 'Vendor');
//         const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
//         console.log('Saved files:', savedPaths);

//         // Prepare array of images to update
//         const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
//             const dynamicNumberKey = `${key}No`;
//             const docNumber = kycDetails[dynamicNumberKey] || null;

//             return {
//                 VendorID: vendorId,
//                 photo_id: docNumber || key.toUpperCase(),
//                 photo_type: key,
//                 photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/Vendor/${path.basename(fullPath)}`,
//                 name: path.basename(fullPath),
//                 doc_number: docNumber
//             };
//         });

//         for (const img of imagesToInsert) {
//             const result = await UpdateImageUploadDB(img);

//         }

//         logger.log("info", `Vendor Images Updated successfully`);
//         return res.status(200).json({ status: "00", message: "Vendor KYC updated successfully.", data: imagesToInsert });

//     } catch (error) {
//         console.error('Update Vendor Error:', error);
//         return res.status(500).json({
//             status: "03",
//             message: "Internal server error",
//             error: error.message
//         });
//     }
// };

// exports.updateVendorKYC = async (req, res) => {
//     logger.log("info", `Update Vendor KYC req_body = ${JSON.stringify(req.body)}`);
//         const vendorId = req.body.vendorid;

//     if (req.headers.vendorid) {
//         req.body.vendorid = req.headers.vendorid;
//     }
//     try {
//         const kycDetails = req.body || {};
//         const imagesMap = {};

//         Object.entries(kycDetails).forEach(([key, value]) => {
//             if (value && typeof value === 'string' && value.startsWith('data:image')) {
//                 imagesMap[key] = value;
//             }
//         });

//         const destFolder = path.join(__dirname, '../../uploads', 'Vendor');
//         const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
//         console.log('Saved files:', savedPaths);

//         const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
//             let photo_id;
//             switch (key) {
//                 case 'gst': photo_id = kycDetails.gstNo || 'GST'; break;
//                 case 'aadhar': photo_id = kycDetails.aadharNo || 'AADHAR'; break;
//                 case 'pan': photo_id = kycDetails.panNo || 'PAN'; break;
//                 case 'cin': photo_id = kycDetails.cinNo || 'CIN'; break;
//                 case 'cancel_cheque': photo_id = kycDetails.cancel_cheque_no || 'CHEQUE'; break;
//                 case 'Vendorphoto': photo_id = 'Vendorphoto'; break;
//                 default: photo_id = 'UNKNOWN';
//             }

//             return {
//                 VendorID: vendorId,
//                 photo_id,
//                 photo_type: key,
//                 photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/Vendor/${path.basename(fullPath)}`,
//                 name: path.basename(fullPath)
//             };
//         });

//         for (const img of imagesToInsert) {
//            const result =  await UpdateImageUploadDB(img);
//                    return res.status(200).json({ status: result.status, message: result.message, data: result.data });

//         }

//         logger.log("info", `Vendor Images Inserted successfully`);

//     } catch (error) {
//         console.error('Insert Vendor Error:', error);
//         throw error;
//     }
// };

