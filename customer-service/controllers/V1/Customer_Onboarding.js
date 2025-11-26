const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const logger = require('../../log/logger');
const { InsertCustomer_schema, UpdateCustomerDetails_schema, DeleteCustomerDetails_schema, GetCustomerDetails_schema } = require("../../models/V1/Customer_Onboarding/schema");
const { InsertCustomerDB, ImageUploadDB, updateCustomerDetailsDB, deleteCustomerDetailsDB, getCustomerDetailsDB,UpdateImageUploadDB } = require('../../models/V1/Customer_Onboarding/utility');
const { getRandomSixDigitNumber, saveMultipleBase64Images } = require("../../common/common");
// Initialize Ajv
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const fs = require('fs');
const path = require('path');

// InsertCustomer
module.exports.InsertCustomerDetails = async (req, res, next) => {
  logger.log("info", `Insert Customer req_body = ${JSON.stringify(req.body)}`);
   if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}
  const CustomerID = getRandomSixDigitNumber();
  const Customer_ID = `CM${CustomerID}`;


  try {
    // const validate = ajv.compile(InsertCustomer_schema());
    // if (!validate(req.body)) {
    //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    // }

     const result = await InsertCustomerDB(req.body, Customer_ID);
    await InsertCustomerPhoto(Customer_ID, req, res);
    return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc , Customer_Details: JSON.parse(result.CustomerDetails) });
  } catch (error) {
    logger.log("error", `Insert Customer Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const InsertCustomerPhoto = async (Customer_ID, req, res) => {
  try {
    // 1. Collect Base64 fields from the request body
    const imagesMap = {};

    Object.entries(req.body).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.startsWith('data:image')) {
        imagesMap[key] = value;
      }
    });

    console.log('Images Map:', imagesMap);

    // 2. Build your destination folder path
    const destFolder = path.join(__dirname, '../../uploads', 'Customer');

    // 3. Save all images and get back their disk paths
    const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
    console.log('Saved files:', savedPaths);

    // 4. Build the array of objects you want to insert into your DB
    const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => ({
      CustomerID: Customer_ID,  // or generate dynamically
      photo_id: '123',                    // or generate dynamically
      photo_type: key,                      // e.g. “CancelledCheque”
      photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/Customer/${path.basename(fullPath)}`,
      name: path.basename(fullPath),
    }));

    // 5. Insert each record
    for (const img of imagesToInsert) {
      await ImageUploadDB(img);
    }
    logger.log("info", `Customer Images Inserted successfully`);
    return
    //   return res.status(200).json({
    //     status:  "00",
    //     message: "All images saved and recorded successfully.",
    //     data:    imagesToInsert
    //   });

  } catch (error) {
    console.error('Insert Customer Error:', error);
    return res.status(500).json({
      status: "03",
      message: "Internal server error",
      error: error.message
    });
  }
};

// UpdateCustomerDetails
module.exports.updateCustomerDetails = async (req, res) => {
  logger.log("info", `Update Customer Details req_body = ${JSON.stringify(req.body)}`);
   if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

  try {
    // const validate = ajv.compile(UpdateCustomerDetails_schema());
    // if (!validate(req.body)) {
    //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    // }

    const result = await updateCustomerDetailsDB(req.body);

    return res.status(200).json({ status: result.bstatus_code, message: result.bmessage_desc });
  } catch (error) {
    logger.log("error", `Update Customer Details Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// DeleteCustomerDetails
module.exports.deleteCustomerDetails = async (req, res) => {
  logger.log("info", `Delete Customer Details req_body = ${JSON.stringify(req.body)}`);
   if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

  try {
    // const validate = ajv.compile(DeleteCustomerDetails_schema());
    // if (!validate(req.body)) {
    //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    // }

    const result = await deleteCustomerDetailsDB(req.body.CustomerID);

    if (result.errorCode) {
      return res.status(400).json({ status: result.bstatus_code, message: result.bmessage_desc });
    }

    return res.status(200).json({ status: result.status, message: result.message });
  } catch (error) {
    logger.log("error", `Delete Customer Details Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// GetCustomerDetails
module.exports.getCustomerDetails = async (req, res) => {
  logger.log("info", `Get Customer Details req_body = ${JSON.stringify(req.body)}`);
   if (req.headers.vendorid) {
    req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
}

  try {
    // const validate = ajv.compile(GetCustomerDetails_schema());
    // if (!validate(req.body)) {
    //     return res.status(400).json({ message: "Invalid input data", errors: validate.errors });
    // }

    const result = await getCustomerDetailsDB(req.body.CustomerID);

    return res.status(200).json({ status: result.status, message: result.message, data: result.data });
  } catch (error) {
    logger.log("error", `Get Customer Details Error: ${error}`);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateCustomerPhoto = async (CustomerID, req, res) => {
  try {
    // 1. Collect Base64 fields from the request body
    const imagesMap = {};

    Object.entries(req.body).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.startsWith('data:image')) {
        imagesMap[key] = value;
      }
    });

    console.log('Images Map:', imagesMap);

    // 2. Build your destination folder path
    const destFolder = path.join(__dirname, '../../uploads', 'Customer');

    // 3. Save all images and get back their disk paths
    const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
    console.log('Saved files:', savedPaths);

    // 4. Build the array of objects you want to insert into your DB
    const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => ({
      CustomerID: CustomerID,  // or generate dynamically
      photo_id: '123',                    // or generate dynamically
      photo_type: key,                      // e.g. “CancelledCheque”
      photo_url: `https://neotechnet.com/Moto_Help_Microservices/uploads/Customer/${path.basename(fullPath)}`,
      name: path.basename(fullPath),  
    }));
    // 5. Insert each record
    for (const img of imagesToInsert) {
      await UpdateImageUploadDB(img);
    }
    logger.log("info", `Customer Images Updated successfully`);
    return res.status(200).json({
      status: "00",
      message: "All images updated successfully.",
      data: imagesToInsert
    });
  }
  catch (error) {
    console.error('Update Customer Error:', error);
    return res.status(500).json({
      status: "03",
      message: "Internal server error",
      error: error.message
    });
  }
}
