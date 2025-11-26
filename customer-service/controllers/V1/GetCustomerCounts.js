
const logger = require('../../log/logger');
const { getCustomerCountsDB } = require('../../models/V1/GetCustomerCounts/utility');

exports.getCustomerCounts = async (req, res) => {
    logger.log("info", `Get customer Counts req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.customerid) {
        req.body.customerid = req.headers.customerid;  // Move customerid from headers to body
    }   
    try {
        const result = await getCustomerCountsDB(req.body);
        return res.status(200).json({ status: result.status, data : result.data});
    } catch (error) {
        logger.log("error", `Get customer Counts Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};  
