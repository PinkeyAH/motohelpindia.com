const sql = require('mssql');
const pool = require('../../customer-service/db/db'); 
const { log } = require('winston');


exports.apiLogger = (req, res, next) => {

    const startTime = Date.now();
    const oldSend = res.send;

    res.send = function (data) {
        const endTime = Date.now();
        const timeTaken = endTime - startTime;

        const logData = {
            api_name: req.originalUrl,
            method: req.method,
            // request_body: JSON.stringify(req.body || {}),
            // response_body: typeof data === "string" ? data : JSON.stringify(data),
            request_body: JSON.stringify(req.body || {}),
            response_body: data || {},
            status_code: res.statusCode,
            error_message: null,
            time_taken_ms: timeTaken,
            ip_address: req.ip
        };

// if(logData.api_name !== '/v1/logs' && logData.api_name !== '/v1/customer-logs'){
//         saveLog(logData);
//         return oldSend.apply(res, arguments);
//     }


    if (logData.api_name !== '/v1/logs' && logData.api_name !== '/v1/customer-logs' ) {
        saveLog(logData);
        return oldSend.apply(res, arguments);
    } else {
                return oldSend.apply(res, arguments);

    }
};

    next();
};

exports.errorLogger = (err, req, res, next) => {

    const logData = {
        api_name: req.originalUrl,
        method: req.method,
        // request_body: JSON.stringify(req.body || {}),
        request_body: req.body || {},
        response_body: null,
        status_code: 500,
        error_message: err.message || "Unknown Error",
        time_taken_ms: null,
        ip_address: req.ip
    };
if(logData.api_name !== '/v1/logs' && logData.api_name !== '/v1/customer-logs'){

    saveLog(logData);

    res.status(500).json({
        status: "error",
        message: err.message
    });

} else {
    res.status(500).json({
        status: "error",
        message: err.message
    });
}
};


function saveLog(log) {

    return new Promise((resolve, reject) => {
        sql.connect(pool)
            .then(pool => {
                const request = pool.request();

            request.input('api_name', sql.NVarChar, log.api_name);
            request.input('method', sql.NVarChar, log.method);
            request.input('request_body', sql.NVarChar(sql.MAX), log.request_body);
            request.input('response_body', sql.NVarChar(sql.MAX), log.response_body);
            request.input('status_code', sql.Int, log.status_code);
            request.input('error_message', sql.NVarChar(sql.MAX), log.error_message);
            request.input('time_taken_ms', sql.Int, log.time_taken_ms);
            request.input('ip_address', sql.NVarChar(100), log.ip_address);

            return request.query(`
                INSERT INTO CustomerApiLogs
                (api_name, method, request_body, response_body, status_code, error_message, time_taken_ms, ip_address)
                VALUES (@api_name, @method, @request_body, @response_body, @status_code, @error_message, @time_taken_ms, @ip_address)
            `);

        }).then(result => {
                if (result.rowsAffected[0] > 0) {
            resolve("Log saved successfully");
                } else {
                    resolve("No records found to save");
                }
            })
        }).catch(err => {
            console.error("Log Error:", err);
            reject("SQL Error: " + err);
        });

    };



exports.customerLogs = async (_req, res) => {
    try {
        const poolConn = await sql.connect(pool);
        const result = await poolConn.request().query("SELECT * FROM CustomerApiLogs ORDER BY id DESC");
        res.json({
            status: "00",
            data: result.recordset
        });
    } catch (err) {
        res.json({
            status: "01",
            message: err.message
        });
    }   
};


exports.getCustomerLogs = async (req, res) => {
    const { page = 1, limit = 1000, search = "", from, to } = req.query;
    const start = (page - 1) * limit;
    let where = " WHERE 1=1 ";
    try {
        const poolConn = await sql.connect(pool);
        let reqSql = poolConn.request();
        if (search) {
            where += " AND (api_name LIKE @search OR ip_address LIKE @search) ";
            reqSql.input("search", sql.NVarChar, `%${search}%`);
        }
        if (from && to) {
            where += " AND created_at BETWEEN @from AND @to ";
            reqSql.input("from", sql.DateTime, new Date(from + " 00:00:00"));
            reqSql.input("to", sql.DateTime, new Date(to + " 23:59:59"));
        }
        const query = `
            SELECT * FROM CustomerApiLogs
            ${where}
            ORDER BY id DESC        
            OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY
        `;
        const logsResult = await reqSql.query(query);
        let totalReq = poolConn.request();
        if (search) totalReq.input("search", sql.NVarChar, `%${search}%`);
        if (from && to) {
            totalReq.input("from", sql.DateTime, new Date(from + " 00:00:00"));
            totalReq.input("to", sql.DateTime, new Date(to + " 23:59:59"));
        }
        const totalQuery = `
            SELECT COUNT(*) AS total FROM CustomerApiLogs
            ${where}
        `;  
        const totalResult = await totalReq.query(totalQuery);
        res.json({
            success: true,  
            page: Number(page),
            limit: Number(limit),
            total: totalResult.recordset[0].total,
            data: logsResult.recordset
        });
    } catch (err) {
        console.error("GET Logs Error:", err);
        res.status(500).json({ message: "Server Error" });
    } 
};


// exports.customerLogs = async (req, res) => {
//     try {
//         const result = await pool.request().query("SELECT * FROM CustomerApiLogs ORDER BY id DESC");

//         res.json({
//             status: "00",
//             data: result.recordset
//         });

//     } catch (err) {
//         res.json({
//             status: "01",
//             message: err.message
//         });
//     }
// };


// // ---------------------------
// // 1️⃣ GET LOGS WITH PAGINATION
// // ---------------------------
// exports.getCustomerLogs = (req, res) => {
//     const { page = 1, limit = 10, search = "", from, to } = req.query;
//     const start = (page - 1) * limit;

//     let where = " WHERE 1=1 ";

//     pool.then(poolConn => {
//         let reqSql = poolConn.request();

//         // 🔍 Search
//         if (search) {
//             where += " AND (api_name LIKE @search OR ip_address LIKE @search) ";
//             reqSql.input("search", sql.NVarChar, `%${search}%`);
//         }

//         // 📅 Date filter
//         if (from && to) {
//             where += " AND created_at BETWEEN @from AND @to ";
//             reqSql.input("from", sql.DateTime, new Date(from + " 00:00:00"));
//             reqSql.input("to", sql.DateTime, new Date(to + " 23:59:59"));
//         }

//         // Main SQL
//         const query = `
//             SELECT * FROM CustomerApiLogs
//             ${where}
//             ORDER BY id DESC
//             OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY
//         `;

//         return reqSql.query(query)
//             .then(logsResult => {

//                 // Total count request
//                 let totalReq = poolConn.request();

//                 if (search) totalReq.input("search", sql.NVarChar, `%${search}%`);
//                 if (from && to) {
//                     totalReq.input("from", sql.DateTime, new Date(from + " 00:00:00"));
//                     totalReq.input("to", sql.DateTime, new Date(to + " 23:59:59"));
//                 }

//                 const totalQuery = `
//                     SELECT COUNT(*) AS total FROM CustomerApiLogs
//                     ${where}
//                 `;

//                 return totalReq.query(totalQuery)
//                     .then(totalResult => {
//                         res.json({
//                             success: true,
//                             page: Number(page),
//                             limit: Number(limit),
//                             total: totalResult.recordset[0].total,
//                             data: logsResult.recordset
//                         });
//                     });
//             });
//     })
//     .catch(err => {
//         console.error("GET Logs Error:", err);
//         res.status(500).json({ message: "Server Error" });
//     });
// };

// // ---------------------------
// // 2️⃣ EXCEL EXPORT
// // ---------------------------
// exports.exportCustomerLogsExcel = async (req, res) => {
//     try {
//         const poolConn = await pool;
//         const result = await poolConn.request().query(`
//             SELECT * FROM CustomerApiLogs ORDER BY id DESC
//         `);

//         const ExcelJS = require("exceljs");
//         const workbook = new ExcelJS.Workbook();
//         const sheet = workbook.addWorksheet("Customer API Logs");

//         sheet.columns = [
//             { header: "ID", key: "id", width: 10 },
//             { header: "API Name", key: "api_name", width: 30 },
//             { header: "Method", key: "method", width: 10 },
//             { header: "Request Body", key: "request_body", width: 40 },
//             { header: "Response Body", key: "response_body", width: 40 },
//             { header: "Status Code", key: "status_code", width: 15 },
//             { header: "Error Message", key: "error_message", width: 40 },
//             { header: "Time (ms)", key: "time_taken_ms", width: 15 },
//             { header: "IP", key: "ip_address", width: 20 },
//             { header: "Created At", key: "created_at", width: 25 }
//         ];

//         result.recordset.forEach(row => sheet.addRow(row));

//         res.setHeader(
//             "Content-Type",
//             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         );
//         res.setHeader(
//             "Content-Disposition",
//             "attachment; filename=CustomerApiLogs.xlsx"
//         );

//         await workbook.xlsx.write(res);
//         res.end();

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to generate Excel");
//     }
// };

// // ---------------------------
// // 3️⃣ PDF EXPORT
// // ---------------------------
// exports.exportCustomerLogsPDF = async (req, res) => {
//     try {
//         const poolConn = await pool;
//         const result = await poolConn.request().query(`
//             SELECT TOP 200 * FROM CustomerApiLogs ORDER BY id DESC
//         `);

//         const PDFDocument = require("pdfkit");
//         const doc = new PDFDocument({ margin: 30, size: "A4" });

//         res.setHeader("Content-Type", "application/pdf");
//         res.setHeader("Content-Disposition", "attachment; filename=CustomerApiLogs.pdf");

//         doc.pipe(res);

//         doc.fontSize(18).text("Customer API Logs", { align: "center" });
//         doc.moveDown();

//         result.recordset.forEach((row, index) => {
//             doc.fontSize(10)
//                .text(`#${row.id} | API: ${row.api_name} | Status: ${row.status_code}`, { underline: true });

//             doc.fontSize(9).text(`Method: ${row.method}`);
//             doc.text(`IP: ${row.ip_address}`);
//             doc.text(`Time Taken: ${row.time_taken_ms} ms`);
//             doc.text(`Date: ${new Date(row.created_at).toLocaleString()}`);

//             doc.moveDown(0.4);
//             doc.font("Courier").text(`Request: ${row.request_body}`);
//             doc.moveDown(0.4);
//             doc.text(`Response: ${row.response_body}`);
//             doc.moveDown(1);

//             if ((index + 1) % 6 === 0) doc.addPage();
//         });

//         doc.end();

//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Failed to generate PDF");
//     }
// };


