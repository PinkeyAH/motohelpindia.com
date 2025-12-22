


const { saveMultipleBase64Images } = require("../../common/common");
const path = require('path');
const sql = require('mssql');
const pool = require('../../db/db'); // Ensure your DB config is imported

 exports.loadingImage = async (req, res) => {

      try {
        const imagesMap = {};
        const loadingImage = req.body;

        // Filter base64 image fields
        Object.entries(loadingImage).forEach(([key, value]) => {
            if (value && typeof value === 'string' && value.startsWith('data:image')) {
                imagesMap[key] = value;
            }
        });

        const destFolder = path.join(__dirname, '../../uploads', 'loadingImage');
        const savedPaths = saveMultipleBase64Images(imagesMap, destFolder);
        console.log('Saved files:', savedPaths);

        const imagesToInsert = Object.entries(savedPaths).map(([key, fullPath]) => {

            return {
                CustomerPostID: req.body.CustomerPostID,
                DriverID: req.body.DriverID,
                CustomerID: req.body.CustomerID,
                photo_type: key,
                photo_url: `https://motohelpindia.com/driver/uploads/loadingImage/${path.basename(fullPath)}`,
                name: path.basename(fullPath),
            };
        });

        for (const img of imagesToInsert) {
            await ImageUploadDB(img);
        }

        console.log("info", `Driver Images Inserted successfully`);
  return res.status(200).json({   status: "00", message: "Driver images uploaded successfully"});

    } catch (error) {
        console.error('Insert Driver Error:', error);
        return res.status(500).json({
            status: "03",
            message: "Internal server error",
            error: error.message
        });
    }
};



async function ImageUploadDB(data) {
    try {
        const poolConnection = await sql.connect(pool);
        const request = poolConnection.request();

        const query = `
            INSERT INTO Loading_Images (
                                        CustomerPostID,
                                        CustomerID,
                                        DriverID,
                                        photo_type,
                                        photo_url,
                                        name,
                                        insert_date
                                    ) 
            VALUES (@CustomerPostID, @CustomerID, @DriverID, @photo_type, @photo_url, @name , GETDATE());
        `;
        request.input('CustomerPostID', sql.NVarChar(50), data.CustomerPostID);
        request.input('CustomerID', sql.NVarChar(50), data.CustomerID);
        request.input('DriverID', sql.NVarChar(50), data.DriverID);
        request.input('photo_type', sql.NVarChar(255), data.photo_type);
        request.input('photo_url', sql.NVarChar(500), data.photo_url);
        request.input('name', sql.NVarChar(255), data.name);

        await request.query(query);

        return {
            status: "00",
            message: "Image uploaded successfully"
        };
    } catch (err) {
        console.error(`[ERROR]: ImageUploadDB Error: ${err.message}`);
        return {
            status: "03",
            message: err.message.includes("Invalid photo type") ? "Invalid photo type" : "SQL Error: " + err.message
        };
    }
};