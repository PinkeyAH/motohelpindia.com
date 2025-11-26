
const logger = require('../../log/logger');
const { getdriverscountsDB } = require('../../models/V1/GetDriversCounts/utility');

exports.getdriverscounts = async (req, res) => {
    logger.log("info", `Get drivers Counts req_body = ${JSON.stringify(req.body)}`);
    if (req.headers.vendorid) {
        req.body.vendorid = req.headers.vendorid;  // Move vendorid from headers to body
    }   
    try {
        const result = await getdriverscountsDB(req.body);
        return res.status(200).json({ status: result.status, data : result.data});
    } catch (error) {
        logger.log("error", `Get drivers Counts Error: ${error}`);
        return res.status(500).json({ status: "03", message: "Internal server error" });
    }
};  
