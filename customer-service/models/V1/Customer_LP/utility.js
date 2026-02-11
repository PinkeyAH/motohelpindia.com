const sql = require('mssql');
const dbconfig = require('../../../db/db.js');
// const pool = require('../../../db/db.js');
const logger = require('../../../log/logger');


exports.getCustomerLPLoadingDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Loading data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
        }

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);

        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetLoading');

        const records = result.recordset || [];

      
        if (records.length === 0) {
            return {status: 0, message: 'Data not found', count: 0, data: []};
        }

        return {status: result.output.ResultStatus || 1,
            message: result.output.ResultMessage || '',
            count: records.length,
            data: records
        };

    } catch (err) {
        logger.error('[DB ERROR]', err);
        return { status: 0, message: err.message };
    }
};
// exports.GetCustomerLPpendingDB = async (data) => {
//     try {
//         logger.info('[INFO]: Fetching Customer LP Pending data');

//        if (!data.VendorID) {
//             return { status: "02", message: 'VendorID is required' };
//         }

//         if (!data.LPStatus) {
//             return { status: "02", message: 'LPStatus is required' };
//         }

//         const pool = await sql.connect(dbconfig.config);
//         const request = pool.request();

//         request.input('VendorID', sql.NVarChar(10), data.VendorID  || null);
//         request.input('DriverID', sql.NVarChar(10), data.DriverID || null);
//         request.input('LPStatus', sql.NVarChar(10), data.LPStatus);
//         request.output('ResultStatus', sql.Int);
//         request.output('ResultMessage', sql.NVarChar(sql.MAX));

//         const result = await request.execute('dbo.GetPending');
//         const records = result.recordset || [];     
//         if (records.length === 0) {
//             return {status: "01", message: 'Data not found', count: "0", data: []};
//         }
//          return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};

//     } catch (err) {
//         logger.error('[DB ERROR]', err);
//         return { status: "03", message: err.message };
//     }
// };
exports.GetCustomerLPProgressDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Progress data');

        if (!data || !data.CustomerID) {
            return { status: "02", message: 'CustomerID is required' };
        }
        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();
        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetProgress');
        const records = result.recordset || [];
        if (records.length === 0) {
            return {status: "01", message: 'Data not found', count: "0", data: []};
        }
        return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return { status: "03", message: err.message };
    }
};

exports.GetCustomerLPReachedDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Reached data');

        if (!data || !data.CustomerID) {
            return { status: "02", message: 'CustomerID is required' };
        }
        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();
        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetReached');
        const records = result.recordset || [];    
        if (records.length === 0) {
            return {status: "01", message: 'Data not found', count: "0", data: []};
        }
      return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return { status: "03", message: err.message };
    }
};

exports.GetCustomerLPLoadedDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Loaded data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
        }
        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetLoaded');
        const records = result.recordset || [];  
        if (records.length === 0) {
            return {status: "01", message: 'Data not found', count: "0", data: []};
        }
       return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};

    } catch (err) {
        logger.error('[DB ERROR]', err);
        return { status: "03", message: err.message };
    }
};

exports.GetCustomerLPHoldDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Hold data');

        if (!data || !data.CustomerID) {
            return { status: "02", message: 'CustomerID is required' };
        }
        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();
        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetHold');
        const records = result.recordset || [];      
        if (records.length === 0) {
            return {status: "01", message: 'Data not found', count: 0, data: []};
        }
      return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return { status: "03", message: err.message };
    }
};

exports.GetCustomerLPCompletedDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Completed data');

        if (!data || !data.CustomerID) {
            return { status: "02", message: 'CustomerID is required' };
        }
        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetCompleted');
        const records = result.recordset || [];     
        if (records.length === 0) {
            return {status: "01", message: 'Data not found', count: 0, data: []};
        }
       return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};

    } catch (err) {
        logger.error('[DB ERROR]', err);
        return { status: "03", message: err.message };
    }
};
exports.GetCustomerLPChargesDB = async () => {
    try {
        logger.info('[INFO]: Fetching Charges Data');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(200));
        const result = await request.execute('dbo.CustomerLPMCharge');
        const records = result.recordset || [];

        if (!records.length) {
            return {status: "01",message: 'Data not found', count: "0",data: []};
        }
        return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};

    } catch (err) {
        logger.error('[DB ERROR]', err);
        return {status: "03",message: err.message};
    }
};
exports.GetCustomerLoadPostLRDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LoadPost LR Details');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();
        request.input('CustomerID', sql.Int, data.CustomerID);      
        const result = await request.execute('dbo.CustomerLoadPostLR');

        const records = result.recordset || [];
        if (!records.length) {
            return {status: "01", message: 'Data not found', count: "0",data: []};
        }
        return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return {status: "03",message: err.message
        };
    }
};
exports.GetCustomerAddressDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer Address Details');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        request.input('CustomerID', sql.NVarChar(100), data.CustomerID);
        request.input('CompanyType', sql.NVarChar(100), data.CompanyType);
        
        const result = await request.execute('dbo.CustomerAddress');
        const records = result.recordset || [];
        if (!records.length) {
            return {status: "01", message: 'Data not found', count: 0, data: []};
        }
        return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return {status: "03", message: err.message
        };
    }
};


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
        request.input('LP_Status', sql.VarChar(100), data.LPStatus);
        request.input('Search', sql.VarChar(100), data.Search);
        request.input('pageNumber', sql.Int, data.pageNumber)
        request.input('pageSize', sql.Int, data.pageSize)

        // 📤 OUTPUT PARAMS (from SP)
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.VarChar(200));

        // ▶️ Execute Stored Procedure
        const result = await request.execute('dbo.CustomerLoadPostsStatus');

        const records = result.recordset || [];
        const spStatus = result.output.ResultStatus;
        const spMessage = result.output.ResultMessage;

        // ❌ SP error
        if (spStatus === 0) { return {status: "03", message: spMessage, count: "0", data: []};
        }

        // ⚠ No data
        if (records.length === 0) {
            return {status: "01",message: "Data not found",count: "0", data: []};
        }

        // ✅ Success
        return {status: "00",message: spMessage || "Data fetched successfully",count: records.length.toString(),data: records};

    } catch (err) {logger.error('[DB ERROR]', err);
        return {status: "03",message: err.message,data: []};
    }
};
//CustomerCargoType

// exports.getCargoTypeDB = async (data) => {
//     try {
//         logger.info('[INFO]: Fetching Customer Address Details');

//         const pool = await sql.connect(dbconfig.config);
//         const request = pool.request();

//         request.input('CustomerID', sql.NVarChar(100), data.CustomerID);
//         request.input('CompanyType', sql.NVarChar(100), data.CompanyType);
        
//         const result = await request.execute('dbo.CustomerCargoType');
//         const records = result.recordset || [];
//         if (!records.length) {
//             return {status: "01", message: 'Data not found', count: 0, data: []};
//         }
//         return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
//     } catch (err) {
//         logger.error('[DB ERROR]', err);
//         return {status: "03", message: err.message
//         };
//     }
// };

exports.getCargoTypeDB = async () => {
    try {
        logger.info('[INFO]: Fetching Cargo Type Details');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        // OUTPUT parameters
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));
        
        const result = await request.execute('dbo.CustomerCargoType');
        const records = result.recordset || [];
        if (!records.length) {
            return {status: "01", message: 'Data not found', count: 0, data: []};
        }
        return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return {status: "03", message: err.message
        };
    }
};


exports.getPackageTypeDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer Package Type Details');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        // request.input('CustomerID', sql.NVarChar(100), data.CustomerID);
        // request.input('CompanyType', sql.NVarChar(100), data.CompanyType);
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));
        
        const result = await request.execute('dbo.CustomerPackageType');
        const records = result.recordset || [];
        if (!records.length) {
            return {status: "01", message: 'Data not found', count: 0, data: []};
        }
        return {status: "00", message: 'Data fetched successfully', count: records.length.toString(), data: records};
    } catch (err) {
        logger.error('[DB ERROR]', err);
        return {status: "03", message: err.message
        };
    }
};

exports.CustomerReachedLoadPostsDB = async ({ load_master_id, LoadPostID }) => {
    try {
        logger.info('[INFO]: Fetching Reached Load Posts');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        // INPUT parameters
        request.input('load_master_id', sql.NVarChar(50), load_master_id || null);
        request.input('LoadPostID', sql.NVarChar(50), LoadPostID || null);

        // OUTPUT parameters
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(500));

        const result = await request.execute('CustomerGetReachedLoadPosts');

        const records = result.recordset || [];
        const status = result.output.ResultStatus;
        const message = result.output.ResultMessage;

        if (status !== 1 || !records.length) {
            return {status: "01", message: message || 'Data not found', count: 0, data: []
            };
        }

        return {status: "00", message, count: records.length.toString(),data: records};

    } catch (err) {
        logger.error('[DB ERROR]:', err);
        return {status: "03",message: err.message};
    }
};

exports.CustomerVehicleDetailsDB = async ({ Weight }) => {
    try {
        logger.info('[INFO]: Fetching Reached Load Posts');

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        // INPUT parameters
        request.input('Weight', sql.NVarChar(50), Weight || null);
        // request.input('LoadPostID', sql.NVarChar(50), LoadPostID || null);

        // OUTPUT parameters
        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(500));

        const result = await request.execute('CustomerVehicleDetails');

        const records = result.recordset || [];
        const status = result.output.ResultStatus;
        const message = result.output.ResultMessage;

        if (status !== 1 || !records.length) {
            return {status: "01", message: message || 'Data not found', count: 0, data: []
            };
        }

        return {status: "00", message, count: records.length.toString(),data: records};

    } catch (err) {
        logger.error('[DB ERROR]:', err);
        return {status: "03",message: err.message};
    }
};