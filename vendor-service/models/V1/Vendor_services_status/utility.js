const sql = require('mssql');
const dbconfig = require('../../../db/db.js');
// const pool = require('../../../db/db.js');
const {logger} = require('../../../log/logger');


exports.GetCustomerLPpendingDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');


        if (!data.LPStatus) {
            return { status: "02", message: "LPStatus is required", data: [] };
        }

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        // 📥 INPUT PARAMS
        request.input('VendorID', sql.VarChar(50), data.VendorID || null);
        request.input('DriverID', sql.VarChar(50), data.DriverID || null);
        request.input('LP_Status', sql.VarChar(100), data.LPStatus || null);
        request.input('Search', sql.VarChar(100), data.Search || null);
        request.input('pageNumber', sql.Int, data.pageNumber || 10);
        request.input('pageSize', sql.Int, data.pageSize || 10);

        // 📤 OUTPUT PARAMS (from SP)
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.VarChar(200));

        // ▶️ Execute Stored Procedure
        const result = await request.execute('dbo.CustomerLoadPostsStatus');

        const records = result.recordset || [];
        const spStatus = result.output.ResultStatus;
        const spMessage = result.output.ResultMessage;

        // ❌ SP error
        if (spStatus === 0) {
            return {status: "03",message: spMessage, count: "0",data: []
            };
        }

        // ⚠ No data
        if (records.length === 0) {
            return {
                status: "01",
                message: "Data not found",
                count: "0",
                data: []
            };
        }

        // ✅ Success
        return {
            status: "00",
            message: spMessage || "Data fetched successfully",
            count: records.length.toString(),
            data: records
        };

    } catch (err) {
        console.log('[DB ERROR]', err);
        return {
            status: "03",
            message: err.message,
            data: []
        };
    }
};

