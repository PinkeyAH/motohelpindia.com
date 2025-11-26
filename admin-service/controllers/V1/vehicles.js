
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const path = require('path');

const {logger} = require('../../log/logger');const { getRandomSixDigitNumber,saveMultipleBase64Images } = require("../../common/common");

const { updateImageUploadDB,ImageUploadDB ,getVehicleDB, VehicleOnboardingDB, deleteVehicleDB,updateVehicleDB, } = require("../../models/V1/vehicles/utility");
const{InserVehicle_schema} = require("../../models/V1/vehicles/schema")
    
exports.InsertVehicle = async (req, res) => {
    logger.log("info", `VehicleOnboarding req_body = ${JSON.stringify(req.body)}`);
    // var vendorId = req.headers.vendorid; 
     if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

    //vendorId = "1111"
    try {
        // const validate = ajv.compile(InserVehicle_schema());
        // const isValid = validate(req.body);
        // if (!isValid) {
        //     logger.log("error", `Validation errors: ${JSON.stringify(validate.errors)}`);
        //     return res.status(400).json({ status: "01", message: "Invalid input data", errors: validate.errors });
        // }
        logger.log("info", "Vehicle Onboarding data is valid!");
        const Vehicle_id = await getRandomSixDigitNumber();
        const Vehicleid = `VH${Vehicle_id}`;
        console.log(Vehicleid);
        // Call the Vehicle OnboardingDB function to save user data
        const result = await VehicleOnboardingDB(req.body, Vehicleid,req.body.vendorid);
        if (result.bstatus_code == "00") {
        await InsertVehiclePhoto(Vehicleid, req, res);
        }
        console.log(result);

        logger.log("info", "Vehicle Onboarding successful");
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });


    } catch (error) {
        logger.log("error", `Vehicle Onboarding Error: ${error}`);
        return res.status(500).json({
            status: 500,
            message: "Internal server error"
        });
    }
};

// Function to save multiple base64 images
const InsertVehiclePhoto = async (Vehicleid, req, res) => {    
          try {
        const imagesMap = {};
        const VehicleDetails = req.body;

        // Filter base64 image fields
        Object.entries(VehicleDetails).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'Vehicle');
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
            const dynamicNumberKey = `${key}No`; // auto generate
            const docNumber = VehicleDetails[dynamicNumberKey] || null;

            return {
                VehicleID: Vehicleid,  
                photo_id: docNumber || key.toUpperCase(),
                photo_type: key,
                photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/Vehicle/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
                doc_number: docNumber
            };
        });

        for (const img of imagesToInsert) {
            await ImageUploadDB(img);
        }

        logger.log("info", `Vehicle Images Inserted successfully`);
        return;
        // res.status(200).json({ status: "00", message: "All images saved successfully.", data: imagesToInsert });

    } catch (error) {
        console.error('Insert Vehicle Error:', error);
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
        if (result.bstatus_code == "00") {
            await updateVehiclePhoto(req.body.vehicleid, req, res);
        }
        logger.log("info", `Update Vehicle result = ${JSON.stringify(result)}`);
        return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
    } catch (error) {
        logger.log("error", `Update Vehicle Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};

const updateVehiclePhoto = async (Vehicleid, req, res) => {
          try {
        const imagesMap = {};
        const VehicleDetails = req.body;

        // Filter base64 image fields
        Object.entries(VehicleDetails).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'Vehicle');
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {
            const dynamicNumberKey = `${key}No`; // auto generate
            const docNumber = VehicleDetails[dynamicNumberKey] || null;

            return {
                vehicle_id: Vehicleid,  
                photo_id: docNumber || key.toUpperCase(),
                photo_type: key,
                photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/Vehicle/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
                doc_number: docNumber
            };
        });

        for (const img of imagesToInsert) {
            await ImageUploadDB(img);
        }

        logger.log("info", `Vehicle Images Inserted successfully`);
        return;
        // res.status(200).json({ status: "00", message: "All images saved successfully.", data: imagesToInsert });

    } catch (error) {
        console.error('Insert Vehicle Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { vendorid ,vehicleid} = req.body;
     if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

    logger.log("info", `Delete Vehicle Vehicleid = ${vehicleid}`);

    try {
        const result = await deleteVehicleDB(vendorid, vehicleid);
        return res.status(200).json({ status: result.status, message: result.message });

    } catch (error) {
        logger.log("error", `Delete Vehicle Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
}


// Similar structure for other get functions
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
