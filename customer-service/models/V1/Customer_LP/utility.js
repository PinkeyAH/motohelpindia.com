const sql = require('mssql');
const dbconfig = require('../../../db/db.js');
const logger = require('../../../log/logger');

exports.getCustomerLPLoadingDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Loading data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetLoading');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found', count: 0 };
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};


exports.GetCustomerLPProgressDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Progress data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetProgress');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found', count: 0 };
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};

exports.GetCustomerLPReachedDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Reached data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetReached');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found'};
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};

exports.GetCustomerLPLoadedDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Loaded data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetLoaded');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found'};
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};

exports.GetCustomerLPHoldDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Hold data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetHold');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found'};
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};

exports.GetCustomerLPpendingDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Pending data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetPending');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found'};
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};

exports.GetCustomerLPCompletedDB = async () => {
    try {
        logger.info('[INFO]: Fetching Customer LP Completed data');

        const pool = await sql.connect(dbconfig.config);

        const findData = await pool.request()
            .output('ResultStatus', sql.Int)
            .output('ResultMessage', sql.NVarChar(100))
            .execute('GetCompleted');

        let status = findData.output.ResultStatus;
        let message = findData.output.ResultMessage;

        let result = findData.recordsets

        let getData = result[0] 
        let getDetails = result[1]

        if (getData.length === 0) {
            return {status: 0, message: 'Data not found'};
        }
            return res.send({status:status, message:message,count:getData[0].Count, Data:getData,getDetails });

    } catch (error) {
        return res.status(500).send({ status: 0, message: error.message });
    }
};