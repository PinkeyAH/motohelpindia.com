const Ajv = require('ajv');
const sql = require('mssql');
const addFormats = require('ajv-formats');
const dbconfig = require('../../db/db.js');
const logger = require('../../log/logger');
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const { customer_lp_loading_schema, customer_lp_loading_schemaLR, customer_lp_loading_schemaCompanyType } = require('../../models/V1/Customer_LP/schema.js');
const{ getCustomerLPLoadingDB, GetCustomerLPProgressDB, GetCustomerLPReachedDB, GetCustomerLPLoadedDB, GetCustomerLPHoldDB, GetCustomerLPpendingDB, GetCustomerLPCompletedDB, GetCustomerLPChargesDB, GetCustomerLoadPostLRDB, GetCustomerAddressDB, getCargoTypeDB, getPackageTypeDB, CustomerReachedLoadPostsDB, CustomerVehicleDetailsDB, GetPackageMaterialTypeDB} = require('../../models/V1/Customer_LP/utility.js');

// exports.GetCustomerLPpending = async (req, res) => {
//     try {
//         const validate = ajv.compile(customer_lp_loading_schema);
//         if (!validate(req.body)) {
//             return res.status(400).json({status: "0", errors: validate.errors});
//         }
//         const result = await GetCustomerLPpendingDB(req.body);
//         logger.log("info", `GetCustomerLPpending result: ${JSON.stringify(result)}`);
//          return res.status(200).send({ status: result.status, message: result.message, data: result.data });
//     } catch (error) {
//          logger.log("error", `GetCustomerLPpending Error: ${error.message}`);
//         return res.status(500).json({status: 0, message: error.message});
//     }
// };
exports.GetCustomerLPProgress = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerLPProgressDB(req.body);
        logger.log("info", `GetCustomerLPProgress result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLPProgress Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};
exports.getCustomerLPLoading = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: 0, errors: validate.errors});
        }
        const result = await getCustomerLPLoadingDB(req.body);
        logger.log("info", `getCustomerLPLoading result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `getCustomerLPLoading Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};
exports.GetCustomerLPReached = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: 0,errors: validate.errors});
        }
        const result = await GetCustomerLPReachedDB(req.body);
        return res.status(200).json(result);
    } catch (error) {
        logger.error('API ERROR:', error);
        return res.status(500).json({status: 0,message: error.message});
    }
};

exports.GetCustomerLPLoaded = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: 0, errors: validate.errors});
        }
        const result = await GetCustomerLPLoadedDB(req.body);
        logger.log("info", `GetCustomerLPLoaded result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLPLoaded Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};
exports.GetCustomerLPHold = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerLPHoldDB(req.body);
        logger.log("info", `GetCustomerLPHold result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLPHold Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};
exports.GetCustomerLPCompleted = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerLPCompletedDB(req.body);
        logger.log("info", `GetCustomerLPCompleted result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLPCompleted Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};
exports.GetCustomerLPCharges = async (req, res) => {
    try {
        const result = await GetCustomerLPChargesDB();
        logger.log("info", `GetCustomerLPCharges result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLPCharges Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};

exports.GetCustomerLoadPostLR = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schemaLR);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerLoadPostLRDB(req.body);
        logger.log("info", `GetCustomerLoadPostLR result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLoadPostLR Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};
exports.GetCustomerAddress = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schemaCompanyType);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerAddressDB(req.body);
        logger.log("info", `GetCustomerAddress result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerAddress Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};

// exports.GetCustomerLPLoaded = async (req, res) => {
//     try {
//         const validate = ajv.compile(customer_lp_loading_schema);

//         if (!validate(req.body)) {
//             return res.status(400).json({status: 0,errors: validate.errors});
//         }
//         const result = await GetCustomerLPLoadedDB(req.body);
//         return res.status(200).json(result);

//     } catch (error) {
//         logger.error('API ERROR:', error);
//         return res.status(500).json({status: 0,message: error.message});
//     }
// };

// exports.GetCustomerLPpending = async (req, res) => {
//     try {
//         const validate = ajv.compile(customer_lp_loading_schema);
//         if (!validate(req.body)) {return res.status(400).json({status: 0,errors: validate.errors});
//         }
//         const result = await GetCustomerLPpendingDB(req.body);
//         return res.status(200).json(result);
//     } catch (error) {
//         logger.error('API ERROR:', error);
//         return res.status(500).json({status: 0,message: error.message
//         });
//     }
// };

exports.GetCustomerLPpending = async (req, res) => {
    try {
        const validate = ajv.compile(customer_lp_loading_schema);
        if (!validate(req.body)) {
            return res.status(400).json({status: "0", errors: validate.errors});
        }
        const result = await GetCustomerLPpendingDB(req.body);
        logger.log("info", `GetCustomerLPpending result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetCustomerLPpending Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};

exports.getCargoType = async (req, res) => {
    try {
        //const validate = ajv.compile(customer_lp_loading_schema);
        // if (!validate(req.body)) {
        //     return res.status(400).json({status: "0", errors: validate.errors});
        // }
        const result = await getCargoTypeDB();
        logger.log("info", `getCargoType result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `getCargoType Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};

exports.getPackageType = async (req, res) => {
    try {
        // const validate = ajv.compile(customer_lp_loading_schema);
        // if (!validate(req.body)) {
        //     return res.status(400).json({status: "0", errors: validate.errors});
        // }
        const result = await getPackageTypeDB();
        logger.log("info", `getPackageType result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `getPackageType Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};

exports.CustomerReachedLoadPosts = async (req, res) => {
    try {
        const { CustomerID, LoadPostID } = req.body;

        const result = await CustomerReachedLoadPostsDB({
            CustomerID,
            LoadPostID
        });

        logger.info(`CustomerReachedLoadPosts result: ${JSON.stringify(result)}`);

        return res.status(200).json({
            status: result.status,
            message: result.message,
            count: result.count,
            data: result.data
        });

    } catch (error) {
        logger.error(`CustomerReachedLoadPosts Error: ${error.message}`);
        return res.status(500).json({
            status: "03",
            message: error.message
        });
    }
};

exports.CustomerVehicleDetails = async (req, res) => {
    try {
        const { Weight } = req.body;

        const result = await CustomerVehicleDetailsDB({
            Weight,
        });

        logger.info(`CustomerVehicleDetails result: ${JSON.stringify(result)}`);

        return res.status(200).json({
            status: result.status,
            message: result.message,
            count: result.count,
            data: result.data
        });

    } catch (error) {
        logger.error(`CustomerVehicleDetails Error: ${error.message}`);
        return res.status(500).json({
            status: "03",
            message: error.message
        });
    }
};


exports.GetPackageMaterialType = async (req, res) => {
    try {
        // const validate = ajv.compile(customer_lp_loading_schema);
        // if (!validate(req.body)) {
        //     return res.status(400).json({status: "0", errors: validate.errors});
        // }
        const result = await GetPackageMaterialTypeDB(req.body.PackageType);
        logger.log("info", `GetPackageMaterialType result: ${JSON.stringify(result)}`);
         return res.status(200).send({ status: result.status, message: result.message, data: result.data });
    } catch (error) {
         logger.log("error", `GetPackageMaterialType Error: ${error.message}`);
        return res.status(500).json({status: 0, message: error.message});
    }
};



