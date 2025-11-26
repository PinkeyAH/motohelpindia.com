
const sql = require('mssql');
const pool = require('../../../db/db');

exports.Vendor_KYC_Check_DB = async (data) => {
    try {
        const poolConn = await sql.connect(pool);
        const resultJson = {
            vendorid: data.vendorid || null, // include vendorid in response
            checks: {}
        };

        // 🧾 GST Number Check
        if (data.gstNo) {
            const gstQuery = await poolConn.request()
                .input('gstNo', sql.NVarChar(30), data.gstNo)
                .input('vendorid', sql.NVarChar(30), data.vendorid)
                .query(`
                    SELECT gstNo 
                    FROM Vendor_Legaldocuments 
                    WHERE gstNo = @gstNo AND vendorid <> @vendorid
                `);
            resultJson.checks.gst = gstQuery.recordset.length > 0
                ? { value: data.gstNo, status: "01", message: "Duplicate GST Number found for another vendor" }
                : { value: data.gstNo, status: "00", message: "GST Number KYC verification completed successfully for this vendor" };
        }

        // 🧾 PAN Number Check
        if (data.panNo) {
            const panQuery = await poolConn.request()
                .input('panNo', sql.NVarChar(20), data.panNo)
                .input('vendorid', sql.NVarChar(30), data.vendorid)
                .query(`
                    SELECT panNo 
                    FROM Vendor_Legaldocuments 
                    WHERE panNo = @panNo AND vendorid <> @vendorid
                `);
            resultJson.checks.pan = panQuery.recordset.length > 0
                ? { value: data.panNo, status: "01", message: "Duplicate PAN Number found for another vendor" }
                : { value: data.panNo, status: "00", message: "PAN Number KYC verification completed successfully for this vendor" };
        }

        // 🧾 Aadhaar Number Check
        if (data.aadharNo) {
            const aadhaarQuery = await poolConn.request()
                .input('aadharNo', sql.NVarChar(20), data.aadharNo)
                .input('vendorid', sql.NVarChar(30), data.vendorid)
                .query(`
                    SELECT aadharNo 
                    FROM Vendor_Legaldocuments 
                    WHERE aadharNo = @aadharNo AND vendorid <> @vendorid
                `);
            resultJson.checks.aadhar = aadhaarQuery.recordset.length > 0
                ? { value: data.aadharNo, status: "01", message: "Duplicate Aadhaar Number found for another vendor" }
                : { value: data.aadharNo, status: "00", message: "Aadhaar Number KYC verification completed successfully for this vendor" };
        }

        // 🚗 Driving License Check
        if (data.driving_license_no) {
            const dlQuery = await poolConn.request()
                .input('driving_license_no', sql.NVarChar(30), data.driving_license_no)
                .query(`
                    SELECT driving_license_no 
                    FROM Driver_Details 
                    WHERE driving_license_no = @driving_license_no
                `);
            resultJson.checks.driving_license = dlQuery.recordset.length > 0
                ? { value: data.driving_license_no, status: "01", message: "Duplicate Driving License " }
                : { value: data.driving_license_no, status: "00", message: "Driving License KYC verification completed successfully" };
        }

        // 🚙 Vehicle Registration Check
        if (data.registration_no) {
            const regQuery = await poolConn.request()
                .input('registration_no', sql.NVarChar(30), data.registration_no)
                .query(`
                    SELECT registration_no 
                    FROM VehicleDetailsNew 
                    WHERE registration_no = @registration_no
                `);
            resultJson.checks.registration_no = regQuery.recordset.length > 0
                ? { value: data.registration_no, status: "01", message: "Duplicate Vehicle Registration Number " }
                : { value: data.registration_no, status: "00", message: "Vehicle Registration Number KYC verification completed successfully" };
        }

        return resultJson;

    } catch (err) {
        throw new Error('SQL Error: ' + err);
    }
};
