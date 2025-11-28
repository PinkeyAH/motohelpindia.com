const express = require("express");
const customerLogs = express.Router();

const sql = require('mssql');
const pool = require('../../customer-service/db/db'); 


customerLogs.get("/", async (req, res) => {
    try {
        const result = await pool.request().query("SELECT * FROM CustomerApiLogs ORDER BY id DESC");

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
});


// ---------------------------
// 1️⃣ GET LOGS WITH PAGINATION
// ---------------------------
customerLogs.get("/customer-logs", async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", from, to } = req.query;
        const start = (page - 1) * limit;

        let where = " WHERE 1=1 ";
        let reqSql = (await pool).request();

        // 🔍 Search (SAFE way - parameter)
        if (search) {
            where += " AND (api_name LIKE @search OR ip_address LIKE @search) ";
            reqSql.input("search", sql.NVarChar, `%${search}%`);
        }

        // 📅 Date filter (SAFE)
        if (from && to) {
            where += " AND created_at BETWEEN @from AND @to ";
            reqSql.input("from", sql.DateTime, new Date(from + " 00:00:00"));
            reqSql.input("to", sql.DateTime, new Date(to + " 23:59:59"));
        }

        // Main paginated query
        const query = `
            SELECT * FROM CustomerApiLogs
            ${where}
            ORDER BY id DESC
            OFFSET ${start} ROWS FETCH NEXT ${limit} ROWS ONLY
        `;

        // Total count query
        const totalQuery = `
            SELECT COUNT(*) AS total FROM CustomerApiLogs
            ${where}
        `;

        // Execute
        const logs = await reqSql.query(query);

        // Total count
        const totalReq = (await pool).request();

        if (search) totalReq.input("search", sql.NVarChar, `%${search}%`);
        if (from && to) {
            totalReq.input("from", sql.DateTime, new Date(from + " 00:00:00"));
            totalReq.input("to", sql.DateTime, new Date(to + " 23:59:59"));
        }

        const total = await totalReq.query(totalQuery);

        res.json({
            success: true,
            page: Number(page),
            limit: Number(limit),
            total: total.recordset[0].total,
            data: logs.recordset
        });

    } catch (err) {
        console.error("GET Logs Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ---------------------------
// 2️⃣ EXCEL EXPORT
// ---------------------------
customerLogs.get("/excel", async (req, res) => {
    try {
        const poolConn = await pool;
        const result = await poolConn.request().query(`
            SELECT * FROM CustomerApiLogs ORDER BY id DESC
        `);

        const ExcelJS = require("exceljs");
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("Customer API Logs");

        sheet.columns = [
            { header: "ID", key: "id", width: 10 },
            { header: "API Name", key: "api_name", width: 30 },
            { header: "Method", key: "method", width: 10 },
            { header: "Request Body", key: "request_body", width: 40 },
            { header: "Response Body", key: "response_body", width: 40 },
            { header: "Status Code", key: "status_code", width: 15 },
            { header: "Error Message", key: "error_message", width: 40 },
            { header: "Time (ms)", key: "time_taken_ms", width: 15 },
            { header: "IP", key: "ip_address", width: 20 },
            { header: "Created At", key: "created_at", width: 25 }
        ];

        result.recordset.forEach(row => sheet.addRow(row));

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=CustomerApiLogs.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to generate Excel");
    }
});

// ---------------------------
// 3️⃣ PDF EXPORT
// ---------------------------
customerLogs.get("/pdf", async (req, res) => {
    try {
        const poolConn = await pool;
        const result = await poolConn.request().query(`
            SELECT TOP 200 * FROM CustomerApiLogs ORDER BY id DESC
        `);

        const PDFDocument = require("pdfkit");
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "attachment; filename=CustomerApiLogs.pdf");

        doc.pipe(res);

        doc.fontSize(18).text("Customer API Logs", { align: "center" });
        doc.moveDown();

        result.recordset.forEach((row, index) => {
            doc.fontSize(10)
               .text(`#${row.id} | API: ${row.api_name} | Status: ${row.status_code}`, { underline: true });

            doc.fontSize(9).text(`Method: ${row.method}`);
            doc.text(`IP: ${row.ip_address}`);
            doc.text(`Time Taken: ${row.time_taken_ms} ms`);
            doc.text(`Date: ${new Date(row.created_at).toLocaleString()}`);

            doc.moveDown(0.4);
            doc.font("Courier").text(`Request: ${row.request_body}`);
            doc.moveDown(0.4);
            doc.text(`Response: ${row.response_body}`);
            doc.moveDown(1);

            if ((index + 1) % 6 === 0) doc.addPage();
        });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to generate PDF");
    }
});


module.exports = customerLogs;

