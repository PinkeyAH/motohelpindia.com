const sql = require('mssql');
const dbconfig = require('../../../db/db.js');
// const pool = require('../../../db/db.js');
const logger = require('../../../log/logger');


exports.getCustomerLPLoadingDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

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
exports.GetCustomerLPpendingDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
        }

        const pool = await sql.connect(dbconfig.config);
        const request = pool.request();

        request.input('CustomerID', sql.NVarChar(10), data.CustomerID);
        request.input('LoadPostID', sql.NVarChar(10), data.LoadPostID || null);

        request.output('ResultStatus', sql.Int);
        request.output('ResultMessage', sql.NVarChar(sql.MAX));

        const result = await request.execute('dbo.GetPending');

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
exports.GetCustomerLPProgressDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
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

exports.GetCustomerLPReachedDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
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

exports.GetCustomerLPLoadedDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

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

exports.GetCustomerLPHoldDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
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

exports.GetCustomerLPCompletedDB = async (data) => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

        if (!data || !data.CustomerID) {
            return { status: 0, message: 'CustomerID is required' };
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